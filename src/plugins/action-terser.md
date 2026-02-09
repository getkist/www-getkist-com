# @getkist/action-terser

JavaScript minification with Terser.

## Installation

```bash
npm install --save-dev @getkist/action-terser
```

## Actions

### JavaScriptMinifyAction

Minifies JavaScript files using Terser.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `inputFile` | `string` | Required | Path to input JS file |
| `outputFile` | `string` | Required | Path to output file |
| `sourceMap` | `boolean` | `false` | Generate source maps |
| `mangle` | `boolean` | `true` | Mangle variable names |
| `compress` | `boolean\|object` | `true` | Compression options |
| `format` | `object` | - | Output format options |

#### Basic Usage

```yaml
plugins:
  - @getkist/action-terser

pipeline:
  build:
    stages:
      - name: minify
        steps:
          - action: JavaScriptMinifyAction
            options:
              inputFile: dist/js/bundle.js
              outputFile: dist/js/bundle.min.js
```

#### With Source Maps

```yaml
- action: JavaScriptMinifyAction
  options:
    inputFile: dist/js/bundle.js
    outputFile: dist/js/bundle.min.js
    sourceMap: true
```

#### Custom Compression

```yaml
- action: JavaScriptMinifyAction
  options:
    inputFile: dist/js/bundle.js
    outputFile: dist/js/bundle.min.js
    compress:
      drop_console: true
      drop_debugger: true
      pure_funcs:
        - console.log
        - console.debug
```

## After TypeScript Compilation

Common workflow: compile then minify:

```yaml
plugins:
  - @getkist/action-typescript
  - @getkist/action-terser

pipeline:
  build:
    stages:
      - name: compile
        steps:
          - action: TypeScriptCompilerAction
            options:
              tsconfig: tsconfig.json
              outDir: dist/js
              
      - name: minify
        steps:
          - action: JavaScriptMinifyAction
            options:
              inputFile: dist/js/index.js
              outputFile: dist/js/index.min.js
              sourceMap: true
```

## Compression Options

Common compression options:

```yaml
compress:
  # Remove console statements
  drop_console: true
  
  # Remove debugger statements
  drop_debugger: true
  
  # Inline simple functions
  inline: true
  
  # Remove dead code
  dead_code: true
  
  # Pass count for compression
  passes: 2
```

## Output Format Options

Control output formatting:

```yaml
format:
  # Preserve some comments
  comments: "some"
  
  # Use semicolons
  semicolons: true
  
  # Quote style
  quote_style: 3
```

## Size Reduction

Typical size reduction with default settings:

| Input | Output | Reduction |
|-------|--------|-----------|
| 100 KB | ~40 KB | 60% |
| 500 KB | ~180 KB | 64% |
| 1 MB | ~350 KB | 65% |

::: tip
Enable gzip compression on your server for an additional 70-80% reduction when served.
:::

## Links

- [npm](https://npmjs.com/package/@getkist/action-terser)
- [GitHub](https://github.com/getkist/action-terser)
- [Changelog](https://github.com/getkist/action-terser/blob/main/CHANGELOG.md)
