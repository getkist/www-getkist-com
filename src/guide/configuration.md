# Configuration

Complete guide to configuring kist for your project.

## Configuration File

kist uses YAML configuration files. By default, kist looks for `kist.yml` in your project root.

```bash
# Use default config
kist

# Specify a config file
kist --config kist.production.yml
```

## Basic Structure

```yaml
# Project metadata
name: my-project
version: 1.0.0

# Plugins to load
plugins:
  - @getkist/action-sass
  - @getkist/action-typescript

# Build pipeline definition
pipeline:
  build:
    stages:
      - name: stage-name
        steps:
          - action: ActionName
            options:
              key: value
```

## Configuration Options

### Project Metadata

```yaml
name: my-project          # Project name
version: 1.0.0            # Project version (semver)
description: My project   # Optional description
```

### Plugins

Declare plugins to load:

```yaml
plugins:
  # Official plugins (scoped)
  - @getkist/action-sass
  - @getkist/action-typescript
  
  # Community plugins
  - kist-plugin-custom
  
  # Local plugins
  - ./plugins/my-plugin
```

### Pipeline Definition

Define your build pipeline with stages and steps:

```yaml
pipeline:
  # Pipeline name
  build:
    # Optional pipeline settings
    parallel: false        # Run stages in parallel
    continueOnError: false # Stop on first error
    
    stages:
      - name: prepare
        steps:
          - action: DirectoryCleanAction
            options:
              directory: dist
              
          - action: DirectoryCreateAction
            options:
              directory: dist
              
      - name: compile
        steps:
          - action: TypeScriptCompilerAction
            options:
              tsconfig: tsconfig.json
```

### Multiple Pipelines

Define multiple pipelines for different tasks:

```yaml
pipeline:
  dev:
    stages:
      - name: build
        steps:
          - action: TypeScriptCompilerAction
            options:
              tsconfig: tsconfig.json
              
  prod:
    stages:
      - name: build
        steps:
          - action: TypeScriptCompilerAction
            options:
              tsconfig: tsconfig.prod.json
              
      - name: minify
        steps:
          - action: JavaScriptMinifyAction
            options:
              inputFile: dist/index.js
              outputFile: dist/index.min.js
```

## Core Actions

These actions are built into kist:

| Action | Description |
|--------|-------------|
| `DirectoryCleanAction` | Remove directory contents |
| `DirectoryCopyAction` | Copy directories |
| `DirectoryCreateAction` | Create directories |
| `FileCopyAction` | Copy files |
| `FileRenameAction` | Rename files |
| `VersionWriteAction` | Write version files |
| `RunScriptAction` | Run npm scripts |
| `PackageManagerAction` | npm operations |
| `DocumentationAction` | Generate docs |

## Action Options

Each action has its own options. Example:

```yaml
- action: StyleProcessingAction
  options:
    inputFile: src/styles/main.scss
    outputFile: dist/css/main.css
    style: compressed              # compressed | expanded
    sourceMap: true
    
- action: TypeScriptCompilerAction
  options:
    tsconfig: tsconfig.json
    outDir: dist/js
    declaration: true
```

## Environment Variables

Use environment variables in your config:

```yaml
pipeline:
  build:
    stages:
      - name: deploy
        steps:
          - action: RunScriptAction
            options:
              script: deploy
              env:
                API_KEY: ${API_KEY}
                NODE_ENV: production
```

## Config Inheritance

Create a base config and extend it:

```yaml
# kist.base.yml
name: my-project
plugins:
  - @getkist/action-typescript

# kist.dev.yml
extends: ./kist.base.yml
pipeline:
  dev:
    stages:
      - name: build
        steps:
          - action: TypeScriptCompilerAction
```

## CLI Options

Override config options via CLI:

```bash
# Specify config file
kist --config kist.yml

# Set log level
kist --log-level debug

# Run specific pipeline
kist --pipeline prod

# Watch mode
kist --watch
```

## Best Practices

1. **Use separate configs** for dev/prod environments
2. **Keep secrets** in environment variables
3. **Use meaningful stage names** for clarity
4. **Order stages** by dependency (clean → build → test → deploy)
5. **Document custom options** in your README

## Next Steps

- [Pipeline Architecture](/guide/architecture) - Deep dive into pipelines
- [Available Plugins](/plugins/) - Browse all plugins
- [API Reference](/api/) - Full API documentation
