# @getkist/action-sass

SCSS/Sass compilation with source maps and modern features.

## Installation

```bash
npm install --save-dev @getkist/action-sass
```

## Actions

### StyleProcessingAction

Compiles SCSS/Sass files to CSS.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `inputFile` | `string` | Required | Path to input SCSS file |
| `outputFile` | `string` | Required | Path to output CSS file |
| `style` | `string` | `"expanded"` | Output style: `"expanded"` or `"compressed"` |
| `sourceMap` | `boolean` | `false` | Generate source maps |
| `includePaths` | `string[]` | `[]` | Additional import paths |

#### Basic Usage

```yaml
plugins:
  - @getkist/action-sass

pipeline:
  build:
    stages:
      - name: styles
        steps:
          - action: StyleProcessingAction
            options:
              inputFile: src/styles/main.scss
              outputFile: dist/css/main.css
```

#### Compressed Output with Source Maps

```yaml
- action: StyleProcessingAction
  options:
    inputFile: src/styles/main.scss
    outputFile: dist/css/main.min.css
    style: compressed
    sourceMap: true
```

#### With Include Paths

```yaml
- action: StyleProcessingAction
  options:
    inputFile: src/styles/main.scss
    outputFile: dist/css/main.css
    includePaths:
      - node_modules
      - src/vendor/styles
```

## Chaining with PostCSS

For autoprefixing and additional optimizations:

```yaml
plugins:
  - @getkist/action-sass
  - @getkist/action-postcss

pipeline:
  build:
    stages:
      - name: styles
        steps:
          - action: StyleProcessingAction
            options:
              inputFile: src/styles/main.scss
              outputFile: tmp/main.css
              
          - action: PostCssAction
            options:
              inputFile: tmp/main.css
              outputFile: dist/css/main.css
              plugins:
                - autoprefixer
                - cssnano
```

## Source Maps

When `sourceMap: true`, a `.map` file is created alongside the output:

```
dist/css/
├── main.css
└── main.css.map
```

## Error Handling

Compilation errors are reported with file location:

```
Error in src/styles/main.scss (line 42, col 5):
  Undefined variable: $primary-color
```

## Links

- [npm](https://npmjs.com/package/@getkist/action-sass)
- [GitHub](https://github.com/getkist/action-sass)
- [Changelog](https://github.com/getkist/action-sass/blob/main/CHANGELOG.md)
