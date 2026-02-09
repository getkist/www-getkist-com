# @getkist/action-postcss

PostCSS processing with autoprefixer, cssnano, and custom plugins.

## Installation

```bash
npm install --save-dev @getkist/action-postcss
```

## Actions

### PostCssAction

Processes CSS files with PostCSS.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `inputFile` | `string` | Required | Path to input CSS file |
| `outputFile` | `string` | Required | Path to output CSS file |
| `plugins` | `array` | `[]` | PostCSS plugins to use |
| `sourceMap` | `boolean` | `false` | Generate source maps |
| `config` | `string` | - | Path to postcss.config.js |

#### Basic Usage

```yaml
plugins:
  - @getkist/action-postcss

pipeline:
  build:
    stages:
      - name: styles
        steps:
          - action: PostCssAction
            options:
              inputFile: src/css/main.css
              outputFile: dist/css/main.css
              plugins:
                - autoprefixer
```

#### With Multiple Plugins

```yaml
- action: PostCssAction
  options:
    inputFile: src/css/main.css
    outputFile: dist/css/main.min.css
    sourceMap: true
    plugins:
      - autoprefixer
      - cssnano
```

#### Using postcss.config.js

Create a `postcss.config.js` in your project:

```javascript
module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss': {},
    'autoprefixer': {},
    'cssnano': {
      preset: ['default', { discardComments: { removeAll: true } }]
    }
  }
}
```

Then reference it:

```yaml
- action: PostCssAction
  options:
    inputFile: src/css/main.css
    outputFile: dist/css/main.css
    config: postcss.config.js
```

## After SCSS Compilation

Chain with `@getkist/action-sass`:

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

## Supported Plugins

Any PostCSS plugin can be used. Common ones:

| Plugin | Description |
|--------|-------------|
| `autoprefixer` | Add vendor prefixes |
| `cssnano` | Minify CSS |
| `postcss-import` | Inline @import rules |
| `tailwindcss` | Tailwind CSS |
| `postcss-preset-env` | Modern CSS features |

::: tip Installing PostCSS Plugins
PostCSS plugins must be installed separately:
```bash
npm install --save-dev autoprefixer cssnano
```
:::

## Links

- [npm](https://npmjs.com/package/@getkist/action-postcss)
- [GitHub](https://github.com/getkist/action-postcss)
- [Changelog](https://github.com/getkist/action-postcss/blob/main/CHANGELOG.md)
