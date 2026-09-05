# @getkist/action-sass

SCSS/Sass compilation with built-in PostCSS processing and source maps.

## Installation

```bash
npm install --save-dev @getkist/action-sass
```

Installed plugins are discovered automatically - no configuration needed. The action below becomes available to your pipeline steps by name.

## Actions

### StyleProcessingAction

Compiles an SCSS/Sass file to CSS and runs the result through PostCSS (autoprefixing and, for compressed output, minification).

#### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `inputFile` | `string` | Required | Path to the input SCSS/CSS file |
| `outputFile` | `string` | Required* | Path to the output CSS file (single-output mode) |
| `styleOption` | `string` | Required* | Output style: `"expanded"` or `"compressed"` (single-output mode) |
| `outputs` | `array` | - | Multiple outputs from one input (see below); mutually exclusive with `outputFile`/`styleOption` |
| `sourceMap` | `boolean` | `false` | Generate a source map (single-output mode) |
| `sourceMapIncludeSources` | `boolean` | `true` | Include original source content in the source map |

\* Required in single-output mode. Use either `outputFile` + `styleOption`, or `outputs`.

#### Basic Usage

```yaml
stages:
    - name: Styles
      steps:
          - name: MainStyles
            action: StyleProcessingAction
            options:
                inputFile: ./src/styles/main.scss
                outputFile: ./dist/css/main.css
                styleOption: expanded
```

#### Compressed Output with Source Maps

```yaml
stages:
    - name: Styles
      steps:
          - name: MinifiedStyles
            action: StyleProcessingAction
            options:
                inputFile: ./src/styles/main.scss
                outputFile: ./dist/css/main.min.css
                styleOption: compressed
                sourceMap: true
```

#### Multiple Outputs from One Input

Generate both expanded and compressed CSS from the same source in a single step. Each entry takes `file`, `style`, and an optional `sourceMap`:

```yaml
stages:
    - name: Styles
      steps:
          - name: AllStyles
            action: StyleProcessingAction
            options:
                inputFile: ./src/styles/app.scss
                outputs:
                    - file: ./dist/css/app.css
                      style: expanded
                      sourceMap: true
                    - file: ./dist/css/app.min.css
                      style: compressed
```

## Built-in PostCSS Processing

Compiled CSS is automatically post-processed with PostCSS: expanded output is autoprefixed, and compressed output is additionally minified. For custom PostCSS pipelines (own plugin list, cssnano presets), chain with [@getkist/action-postcss](/plugins/action-postcss):

```yaml
stages:
    - name: Styles
      steps:
          - name: CompileScss
            action: StyleProcessingAction
            options:
                inputFile: ./src/styles/main.scss
                outputFile: ./tmp/main.css
                styleOption: expanded

          - name: PostProcess
            action: PostCssAction
            options:
                inputPath: ./tmp/main.css
                outputPath: ./dist/css/main.css
                autoprefixer: true
                minify: true
```

## Imports from node_modules

The compiler uses Sass's Node package importer, so `pkg:` imports resolve packages from `node_modules`.

## Source Maps

When `sourceMap: true`, a `.map` file is created alongside the output:

```text
dist/css/
├── main.css
└── main.css.map
```

## Error Handling

A compilation or processing error fails the step (and, by default, the build). Sass reports errors with file location:

```text
Error in src/styles/main.scss (line 42, col 5):
  Undefined variable: $primary-color
```

## Links

- [npm](https://npmjs.com/package/@getkist/action-sass)
- [GitHub](https://github.com/getkist/kist-action-sass)
