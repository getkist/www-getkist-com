# @getkist/action-terser

JavaScript minification with Terser.

## Installation

```bash
npm install --save-dev @getkist/action-terser
```

Installed plugins are discovered automatically - no configuration needed. The action below becomes available to your pipeline steps by name.

## Actions

### JavaScriptMinifyAction

Minifies a single JavaScript file using Terser.

#### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `inputPath` | `string` | Required | Path to the input JS file |
| `outputPath` | `string` | Required | Path to the minified output file (parent directories are created) |
| `customConfig` | `object` | `{}` | Terser configuration overrides, shallow-merged over the package defaults |

`customConfig` accepts the keys from the [Terser API reference](https://terser.org/docs/api-reference/), such as `compress`, `mangle`, `format`, and `sourceMap`. Each top-level key you provide fully replaces that section of the defaults (shallow merge).

#### Basic Usage

```yaml
stages:
    - name: Minify
      steps:
          - name: MinifyBundle
            action: JavaScriptMinifyAction
            options:
                inputPath: ./dist/js/bundle.js
                outputPath: ./dist/js/bundle.min.js
```

#### Custom Compression

```yaml
stages:
    - name: Minify
      steps:
          - name: MinifyBundle
            action: JavaScriptMinifyAction
            options:
                inputPath: ./dist/js/bundle.js
                outputPath: ./dist/js/bundle.min.js
                customConfig:
                    compress:
                        drop_console: true
                        drop_debugger: true
                        passes: 2
```

#### With Source Map

```yaml
stages:
    - name: Minify
      steps:
          - name: MinifyBundle
            action: JavaScriptMinifyAction
            options:
                inputPath: ./dist/js/bundle.js
                outputPath: ./dist/js/bundle.min.js
                customConfig:
                    sourceMap:
                        filename: "bundle.min.js.map"
```

## After TypeScript Compilation

Common workflow: compile then minify:

```yaml
stages:
    - name: Compile
      steps:
          - name: CompileTypeScript
            action: TypeScriptCompilerAction
            options:
                tsconfigPath: ./tsconfig.json
                outputDir: ./dist/js

    - name: Minify
      dependsOn: [Compile]
      steps:
          - name: MinifyIndex
            action: JavaScriptMinifyAction
            options:
                inputPath: ./dist/js/index.js
                outputPath: ./dist/js/index.min.js
```

## Common customConfig Keys

```yaml
customConfig:
    # Compression behavior
    compress:
        drop_console: true      # Remove console statements
        drop_debugger: true     # Remove debugger statements
        dead_code: true         # Remove dead code
        passes: 2               # Compression passes

    # Output formatting
    format:
        comments: "some"        # Preserve some comments
        semicolons: true        # Use semicolons
```

## Size Reduction

Typical size reduction with default settings:

| Input | Output | Reduction |
| --- | --- | --- |
| 100 KB | ~40 KB | 60% |
| 500 KB | ~180 KB | 64% |
| 1 MB | ~350 KB | 65% |

::: tip
Enable gzip compression on your server for an additional 70-80% reduction when served.
:::

## Links

- [npm](https://npmjs.com/package/@getkist/action-terser)
- [GitHub](https://github.com/getkist/kist-action-terser)
