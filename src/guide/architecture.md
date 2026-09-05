# Pipeline Architecture

Understanding how kist's pipeline engine works.

## Overview

kist is built around a pipeline architecture that processes build tasks through stages and steps. This design provides:

- **Modularity** - Break complex builds into manageable pieces
- **Reusability** - Share configurations across projects with `extends`
- **Extensibility** - Add custom functionality via auto-discovered plugins
- **Predictability** - Dependency-aware execution order, validated at startup

## Core Components

```text
┌─────────────────────────────────────────────────────────────┐
│                          Kist                               │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐     │
│  │PluginManager │  │ActionRegistry│  │PipelineManager│     │
│  └──────────────┘  └──────────────┘  └───────────────┘     │
│         │                 │                 │               │
│         ▼                 ▼                 ▼               │
│  ┌──────────────────────────────────────────────────┐      │
│  │                    Pipeline                      │      │
│  │  ┌─────────┐   ┌─────────┐   ┌─────────┐         │      │
│  │  │ Stage A │──▶│ Stage B │──▶│ Stage C │         │      │
│  │  │┌───────┐│   │┌───────┐│   │┌───────┐│         │      │
│  │  ││ Step  ││   ││ Step  ││   ││ Step  ││         │      │
│  │  ││Action ││   ││Action ││   ││Action ││         │      │
│  │  │└───────┘│   │└───────┘│   │└───────┘│         │      │
│  │  └─────────┘   └─────────┘   └─────────┘         │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

One config file describes one pipeline. A pipeline contains **stages**, each stage contains **steps**, and each step invokes exactly one **action** with its options:

```yaml
stages:
    - name: Build
      steps:
          - name: CompileTypeScript
            action: TypeScriptCompilerAction
            options:
                tsconfigPath: "./tsconfig.json"
```

### PluginManager

Before the pipeline is built, the PluginManager scans the project's `node_modules` for packages whose names match the plugin prefixes:

- `@getkist/action-*` (official scoped plugins)
- `kist-action-*` (community, unscoped)
- `kist-plugin-*` (community, unscoped)

```text
node_modules/
├── @getkist/
│   ├── action-sass/       ✓ Discovered
│   ├── action-terser/     ✓ Discovered
│   └── action-eslint/     ✓ Discovered
└── kist-plugin-custom/    ✓ Discovered
```

Discovery is fully automatic — plugins are not (and cannot be) declared in the config file. Installing a plugin as a devDependency is all it takes; the actions it provides become usable in steps by name.

### ActionRegistry

The ActionRegistry holds every available action under its name: the ten core actions are registered first, then every action returned by each discovered plugin's `registerActions()`. When a step declares `action: FileCopyAction`, the registry resolves that string to the action class that will be instantiated and executed. A step that references an unregistered action name fails validation before anything runs.

### PipelineManager and Pipeline

The PipelineManager builds a Pipeline from the loaded config: one Stage object per entry in `stages`, one Step object per entry in `steps`, each step bound to an action instance from the registry. The Pipeline then schedules and executes the stages.

## Execution Flow

```text
1. Load configuration
   ├── Find kist.yaml / kist.yml (or use --config)
   └── Resolve extends chain (deep-merge metadata/options,
       merge stages by name)

2. Discover plugins
   ├── Scan node_modules for @getkist/action-*, kist-action-*,
   │   kist-plugin-*
   └── Register core + plugin actions in the ActionRegistry

3. Validate configuration (fail fast, exit 1 on error)
   ├── Duplicate stage or step names
   ├── Stages with empty step lists
   ├── Unregistered action names
   └── Unknown or circular dependsOn references

4. Execute pipeline
   ├── Dependency-aware stage scheduling
   ├── Steps run sequentially, or concurrently with parallel: true
   ├── Each step: validate options → execute action → report
   └── Report results and exit
```

### Stage scheduling

Stages do not simply run top-to-bottom. Each stage may declare `dependsOn`, and the scheduler starts a stage as soon as all of its dependencies have completed. Independent stages run concurrently, capped by `performance.maxConcurrentStages`:

```yaml
options:
    performance:
        maxConcurrentStages: 4
        maxConcurrentSteps: 8

stages:
    - name: Clean
      steps:
          - name: CleanDist
            action: DirectoryCleanAction
            options:
                dirPath: "./dist"

    - name: Compile
      dependsOn:
          - Clean
      steps:
          - name: CompileTypeScript
            action: TypeScriptCompilerAction
            options:
                tsconfigPath: "./tsconfig.json"

    - name: Assets
      dependsOn:
          - Clean
      steps:
          - name: CopyAssets
            action: DirectoryCopyAction
            options:
                srcDir: "./src/assets"
                destDir: "./dist/assets"
```

Here `Compile` and `Assets` both wait for `Clean`, then run concurrently. Forward references are allowed (a stage may depend on a stage declared later in the file), but unknown and circular dependencies are rejected at startup.

Within a stage, steps run sequentially by default; `parallel: true` runs them concurrently, capped by the stage's `maxConcurrentSteps`.

## Action Interface

All actions implement a common interface — most easily by extending the `Action` base class exported from `kist`:

```typescript
import { Action } from "kist";

export class MyCustomAction extends Action {
    // Optional: reject bad options before execute runs
    validateOptions(options: Record<string, unknown>): boolean {
        return typeof options.input === "string";
    }

    async execute(options: Record<string, unknown>): Promise<void> {
        this.logInfo(`Processing ${options.input}`);
        // Throwing an error fails the step (and, by default, the build)
    }

    describe(): string {
        return "Describe what the action does.";
    }
}
```

Before a step executes, kist calls the action's `validateOptions` (when defined) with the step's `options`; a `false` result fails the step without running `execute`.

## Plugin System

Plugins package actions for reuse. A plugin is an npm package whose default export implements the `ActionPlugin` interface:

```typescript
import { MyCustomAction } from "./MyCustomAction.js";

const plugin = {
    name: "kist-plugin-custom",
    version: "1.0.0",
    description: "Custom actions for my project",

    registerActions() {
        return {
            MyCustomAction,
        };
    },
};

export default plugin;
```

Because discovery is name-based, publishing the package under one of the recognized prefixes and installing it as a devDependency is the entire integration story. See [Plugin Development](/guide/plugin-development) for the full guide.

## Error Handling

Failures propagate upward: a failing action (a thrown error or failed option validation) fails its **step**, which fails its **stage**, which fails the **pipeline** — and kist exits with code `1`. Configuration errors and unknown action names are caught during startup validation, before any stage runs.

To log failures and keep going instead, disable halting:

```yaml
options:
    haltOnFailure: false # default: true
```

With `haltOnFailure: false`, failures are logged, remaining work continues, and kist exits with code `0`.

## Caching

kist includes a build cache, configured under `options.cache`:

```yaml
options:
    cache:
        enabled: true
        cacheDir: ".kist-cache"
        persistent: true
```

Two layers are involved:

- **FileCache** tracks file fingerprints so actions can skip unchanged inputs — for example `FileCopyAction` with `useCache: true` only copies files that changed since the last run.
- **BuildCache** persists cache state in `cacheDir` between runs when `persistent` is enabled.

## Live Reload

With `--live` on the CLI (or `options.live.enabled: true`), kist starts a development loop built from two components:

- **LiveServer** serves the configured `root` directory on `port` and pushes reload events to the browser over a websocket.
- **LiveWatcher** watches `watchPaths` (plus the config file itself), ignoring `ignoredPaths`, and re-runs the pipeline on change; connected browsers then reload.

```yaml
options:
    live:
        enabled: false # or pass --live on the CLI
        port: 3000
        root: public
        watchPaths:
            - src/**
            - config/**
        ignoredPaths:
            - node_modules/**
```

## Logging

Built-in logging with `debug`, `info`, `warn` and `error` levels, configured via `options.logLevel` (default `info`) or forced to debug with the `--verbose` flag:

```text
[INFO]  [Kist] Starting pipeline...
[INFO]  [PluginManager] Loaded 3 plugins
[INFO]  [Pipeline] Stage: Build (2 steps)
[INFO]  [TypeScriptCompilerAction] Compiling TypeScript...
[WARN]  [DirectoryCleanAction] Directory does not exist, skipping: ./tmp
[ERROR] [FileCopyAction] Error copying file: ENOENT
```

Actions log through the base-class helpers (`logInfo`, `logWarn`, `logError`), so output is consistently prefixed with the action name. A progress bar is shown while stages run; disable it with `options.performance.showProgress: false`.

## Next Steps

- [Configuration](/guide/configuration) - Full configuration reference
- [Core Actions](/guide/core-actions) - The built-in actions
- [Plugin Development](/guide/plugin-development) - Create your own plugins
- [API Reference](/api/) - Full API documentation
