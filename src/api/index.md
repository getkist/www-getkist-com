# API Reference

Programmatic API of the `kist` npm package.

kist is primarily a command-line tool. The package root exports a small, focused surface aimed mostly at plugin authors: the `Kist` class, the plugin system (interfaces, base class, managers), a few configuration constants, and the error classes.

## Installation

```bash
npm install --save-dev kist
```

Requires Node.js >= 22.0.0 and npm >= 9.0.0.

## CLI vs. Library

The CLI entry point is intentionally **not** exported from the package root — `import ... from "kist"` never starts the CLI. To run pipelines, use the `kist` bin (see the [CLI Reference](/api/cli)); the CLI parses the flags, loads and merges the config file, and then drives the `Kist` class.

## Exports Overview

```typescript
import {
    // Main class
    Kist,

    // Plugin system
    ActionInterface,
    ActionPlugin,
    PluginMetadata,
    PluginManager,
    Action,
    ActionRegistry,

    // Configuration constants for plugin developers
    CORE_ACTIONS,
    MIGRATED_ACTIONS,
    MIGRATED_PACKAGES,

    // Errors (KistError base + specific classes, see below)
    KistError,
    ErrorCodes,
} from "kist";

import type {
    ActionOptionsType,
    CoreActionName,
    MigratedActionName,
    ErrorCode,
} from "kist";
```

## Kist

The class the CLI drives. It initializes the action registry (core actions plus auto-discovered plugins), validates the already-loaded configuration, runs the pipeline, and optionally sets up live reload.

```typescript
import { Kist } from "kist";

const kist = new Kist();      // no constructor arguments
await kist.run();             // Promise<void>
```

Note that `run()` executes against configuration that has already been loaded into kist's internal config store — argument parsing and config-file loading are the CLI's job. For normal use, run the `kist` bin rather than instantiating `Kist` yourself.

## Plugin System

This is the main reason to import from `kist`. Plugins are npm packages named `@getkist/action-*`, `kist-action-*`, or `kist-plugin-*`; kist auto-discovers them in `node_modules` — no registration in the config file is needed (or possible).

### Writing an Action

Extend the `Action` base class (it implements `ActionInterface` and provides logging helpers):

```typescript
import { Action } from "kist";
import type { ActionOptionsType } from "kist";

export class MyAction extends Action {
    validateOptions(options: ActionOptionsType): boolean {
        return typeof options.srcFile === "string";
    }

    async execute(options: ActionOptionsType): Promise<void> {
        this.logInfo(`Processing ${options.srcFile}...`);
        // Your action logic here.
        // Throw an Error to fail the step (and, by default, the build).
    }
}
```

### Exposing Actions as a Plugin

A plugin's default export implements `ActionPlugin`:

```typescript
import type { ActionInterface, ActionPlugin } from "kist";
import { MyAction } from "./MyAction.js";

const plugin: ActionPlugin = {
    registerActions(): Record<string, new () => ActionInterface> {
        return { MyAction };
    },
    version: "1.0.0",
    description: "My custom kist action",
};

export default plugin;
```

Once the package is installed, steps can reference the action by name:

```yaml
stages:
    - name: Build
      steps:
          - name: RunMyAction
            action: MyAction
            options:
                srcFile: "./input.txt"
```

See the [Plugin Development guide](/guide/plugin-development) for the full workflow (peer dependencies, publishing, best practices).

### Interfaces

```typescript
interface ActionInterface {
    name: string;
    execute(options: ActionOptionsType): Promise<void>;
    validateOptions?(options: ActionOptionsType): boolean;
    describe?(): string;
    cleanup?(): Promise<void>;
}

interface ActionPlugin {
    registerActions(): Record<string, new () => ActionInterface>;
    version?: string;
    description?: string;
    author?: string;
    repository?: string;
    keywords?: string[];
}

interface PluginMetadata {
    name: string;
    version: string;
    description?: string;
    actions: string[];
    author?: string;
    repository?: string;
    keywords?: string[];
}
```

`ActionOptionsType` is an open key-value record (`[key: string]: any`) — each action defines and validates its own options.

### PluginManager and ActionRegistry

Singletons used internally by kist; exported for advanced use and testing:

- `PluginManager.getInstance()` — `discoverPlugins()`, `registerPlugin(plugin, name)`, `getLoadedPlugins()`, `listPluginActions()`
- `ActionRegistry.initialize()` / `ActionRegistry.getInstance()` — `registerAction(actionClass)`, `getAction(name)`, `listRegisteredActions()`

## Configuration Constants

Exported from the package root for plugin developers and tooling:

- `CORE_ACTIONS` — names of the actions built into kist (e.g. `FileCopyAction`, `RunScriptAction`, `TypeScriptCompilerAction`)
- `MIGRATED_ACTIONS` — action names that moved out of core into plugin packages
- `MIGRATED_PACKAGES` — the plugin package that now provides each migrated action (e.g. `StyleProcessingAction` → `@getkist/action-sass`)
- Types: `CoreActionName`, `MigratedActionName`

## Error Classes

All errors extend `KistError`. Exported classes:

| Group | Classes |
| ----- | ------- |
| Base | `KistError` |
| Config | `ConfigError`, `ConfigNotFoundError`, `ConfigParseError`, `ConfigValidationError` |
| Build | `BuildError`, `ActionError`, `StepError`, `StageError` |
| Plugin | `PluginError`, `PluginNotFoundError`, `PluginInitError` |
| File system | `FileSystemError`, `FileNotFoundError`, `DirectoryNotFoundError`, `PermissionError`, `PathTraversalError` |
| CLI | `CLIError`, `InvalidArgumentError`, `MissingArgumentError` |
| Resource | `TimeoutError`, `ResourceLimitError` |

Plus `ErrorCodes` and the `ErrorCode` type.

```typescript
import { ConfigValidationError, KistError } from "kist";

try {
    // ...
} catch (error) {
    if (error instanceof ConfigValidationError) {
        // invalid kist.yaml / kist.yml
    } else if (error instanceof KistError) {
        // any other kist error
    }
}
```

## Next Steps

- [CLI Reference](/api/cli) - Command-line interface
- [Plugin Development](/guide/plugin-development) - Create plugins
- [Configuration](/guide/configuration) - YAML reference
