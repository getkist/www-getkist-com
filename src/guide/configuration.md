# Configuration

Complete guide to configuring kist for your project.

## Configuration File

kist uses YAML configuration files. By default, kist looks for `kist.yaml`, then `kist.yml`, in your project root.

```bash
# Use the default config (kist.yaml or kist.yml)
kist

# Specify a config file
kist --config kist.production.yml
```

## Basic Structure

A configuration file has up to four top-level keys — `extends`, `metadata`, `options`, and `stages`:

```yaml
metadata:
    name: my-project
    version: 1.0.0

options:
    logLevel: info
    haltOnFailure: true

stages:
    - name: StageName
      steps:
          - name: StepName
            action: ActionName
            options:
                key: value
```

Plugins are **not** declared in the configuration. Install a plugin package (for example `npm install --save-dev @getkist/action-sass`) and kist discovers it automatically from `node_modules`; its actions become available to steps by name. See [Using Plugins](/plugins/using-plugins).

## Configuration Options

### Metadata

Optional, purely informational — useful for documentation and tooling:

```yaml
metadata:
    name: my-project # Project name
    version: 1.0.0 # Project version (semver)
    description: My project # Optional description
    author: Jane Doe # Optional author
    tags: # Optional key-value pairs
        category: web
```

### Global Options

All options are optional and have sensible defaults:

```yaml
options:
    # Free-form mode string, e.g. development or production
    mode: development

    # Log verbosity: debug | info | warn | error (default: info)
    logLevel: info

    # Stop the pipeline and exit 1 on the first failure (default: true).
    # Set to false to log failures and continue.
    haltOnFailure: true

    # Build caching
    cache:
        enabled: true
        cacheDir: ".kist-cache"
        maxCacheSize: 1073741824 # bytes (1 GB)
        ttl: 604800000 # milliseconds (7 days)

    # Performance tuning
    performance:
        maxConcurrentStages: 4 # Cap on stages running at once
        maxConcurrentSteps: 8 # Cap on parallel steps per stage
        showProgress: true # Progress bar (default: true)

    # Live reload (see also the --live CLI flag)
    live:
        enabled: false
        port: 3000
        root: public # Static root served by the live server
        watchPaths:
            - src/**
            - config/**
        ignoredPaths:
            - node_modules/**
```

### Stages

`stages` is the pipeline definition — a list of stages, each with a list of steps:

```yaml
stages:
    - name: Prepare # Required, must be unique
      steps:
          - name: CleanDist # Required, unique within the stage
            action: DirectoryCleanAction
            options:
                dirPath: ./dist

    - name: Compile
      dependsOn: # Optional: run only after these stages complete
          - Prepare
      parallel: false # Optional: true runs the steps concurrently
      timeout: 60000 # Optional: stage timeout in milliseconds
      enabled: true # Optional: false skips the stage
      steps:
          - name: CompileTypeScript
            action: TypeScriptCompilerAction
            options:
                tsconfigPath: ./tsconfig.json
```

Stage fields:

| Field                | Type     | Description                                                               |
| -------------------- | -------- | ------------------------------------------------------------------------- |
| `name`               | string   | **Required.** Unique stage identifier.                                    |
| `steps`              | array    | **Required.** At least one step (`name`, `action`, `options`).            |
| `dependsOn`          | string[] | Stage names that must complete first. Validated at startup.               |
| `parallel`           | boolean  | Run this stage's steps concurrently (default: `false`).                   |
| `maxConcurrentSteps` | number   | Concurrency cap when `parallel` is `true`.                                |
| `timeout`            | number   | Milliseconds before the stage is aborted with an error.                   |
| `enabled`            | boolean  | `false` skips the stage but still satisfies dependants (default: `true`). |

Stages without dependencies may run concurrently (bounded by `performance.maxConcurrentStages`); `dependsOn` enforces ordering where it matters. Dependencies may reference stages declared **later** in the file — order of declaration doesn't restrict you.

### Validation

The configuration is validated at startup, after plugins are discovered. kist fails fast with a clear error when it finds:

- an action name that isn't registered (core or plugin),
- duplicate stage names, duplicate step names within a stage, or a stage with no steps,
- a `dependsOn` entry that references an unknown stage,
- circular `dependsOn` dependencies.

## Environment-Specific Configs

There is one pipeline per configuration file. For dev/prod variants, create separate files and select one with `--config`:

```bash
kist --config kist.yml            # default/dev
kist --config kist.production.yml # production
```

Use [config inheritance](#config-inheritance) to share the common parts.

## Config Inheritance

kist supports configuration inheritance through the `extends` keyword, allowing you to create reusable base configurations.

### Basic Usage

Create a base config and extend it:

```yaml
# kist.base.yml
options:
    logLevel: info
    cache:
        enabled: true

stages:
    - name: Compile
      steps:
          - name: CompileTypeScript
            action: TypeScriptCompilerAction
            options:
                tsconfigPath: ./tsconfig.json
```

```yaml
# kist.production.yml
extends: ./kist.base.yml

options:
    logLevel: warn

stages:
    - name: Minify
      steps:
          - name: MinifyBundle
            action: JavaScriptMinifyAction
            options:
                inputPath: ./dist/js/main.js
                outputPath: ./dist/js/main.min.js
```

Running `kist --config kist.production.yml` executes the inherited `Compile` stage followed by the added `Minify` stage, with `logLevel` overridden to `warn`.

### How Merging Works

When extending a configuration:

1. **`metadata` and `options` are deep-merged** — child values override parent values key by key.
2. **Stages are merged by name** — a child stage with the same `name` as a parent stage **replaces it entirely**; parent stages without a match are kept, and new child stages are appended after them.
3. Parent paths are resolved relative to the child file, and circular inheritance is detected and rejected.

```yaml
# base.yml
options:
    logLevel: info
    cache:
        enabled: true

stages:
    - name: Build
      steps:
          - name: CompileTypeScript
            action: TypeScriptCompilerAction
            options:
                tsconfigPath: ./tsconfig.json
```

```yaml
# child.yml
extends: ./base.yml

options:
    logLevel: debug # Overrides logLevel; cache.enabled inherited

stages:
    - name: Build # Same name -> REPLACES the parent's Build stage
      steps:
          - name: CompileTypeScript
            action: TypeScriptCompilerAction
            options:
                tsconfigPath: ./tsconfig.prod.json
```

### Multiple Inheritance

Extend from multiple configs (merged in order, later parents win, then the child on top):

```yaml
extends:
    - ./configs/base.yml
    - ./configs/typescript.yml
    - ./configs/testing.yml
# Your overrides here
```

## CLI Options

The CLI is deliberately small — behavior lives in the config file:

```bash
# Specify a config file
kist --config kist.production.yml

# Enable live reload
kist --live

# Force debug logging (equivalent to options.logLevel: debug)
kist --verbose
```

## Best Practices

1. **Use separate config files** (with `extends`) for dev/prod environments
2. **Keep secrets out of the config** — read them from the environment in your scripts
3. **Use meaningful stage and step names** — they appear in logs and validation errors
4. **Model ordering with `dependsOn`** instead of relying on declaration order
5. **Leave `haltOnFailure` on** — a build that fails loudly is a feature

## Next Steps

- [Pipeline Architecture](/guide/architecture) - Deep dive into pipelines
- [Core Actions](/guide/core-actions) - Actions built into kist
- [Available Plugins](/plugins/) - Browse all plugins
- [API Reference](/api/) - Full API documentation
