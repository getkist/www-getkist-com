# @getkist/action-postcss

PostCSS processing with autoprefixer and cssnano.

## Installation

```bash
npm install --save-dev @getkist/action-postcss
```

Installed plugins are discovered automatically - no configuration needed. The action below becomes available to your pipeline steps by name.

## Actions

### PostCssAction

Processes a CSS file with PostCSS: optional autoprefixing, optional cssnano minification, and optional source maps.

#### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `inputPath` | `string` | Required | Path to the input CSS file |
| `outputPath` | `string` | Required | Path to the output CSS file (parent directories are created) |
| `autoprefixer` | `boolean` | `true` | Add vendor prefixes with autoprefixer |
| `browsers` | `string[]` | `["> 1%", "last 2 versions", "not dead"]` | Browserslist queries used by autoprefixer |
| `minify` | `boolean` | `false` | Minify with cssnano |
| `cssnanoPreset` | `string` | `"default"` | cssnano preset: `"default"`, `"lite"`, or `"advanced"` |
| `sourcemap` | `boolean` | `false` | Generate a source map |
| `inlineSourcemap` | `boolean` | `false` | Embed the map inline instead of writing a separate `.map` file |

Additional PostCSS plugins can be supplied via the `plugins` option when the action is used programmatically (it takes plugin instances, so it is not configurable from YAML).

#### Basic Usage

```yaml
stages:
    - name: Styles
      steps:
          - name: PrefixStyles
            action: PostCssAction
            options:
                inputPath: ./src/css/main.css
                outputPath: ./dist/css/main.css
```

#### Minified Output with Source Maps

```yaml
stages:
    - name: Styles
      steps:
          - name: MinifyStyles
            action: PostCssAction
            options:
                inputPath: ./src/css/main.css
                outputPath: ./dist/css/main.min.css
                minify: true
                cssnanoPreset: default
                sourcemap: true
```

#### Custom Browser Targets

```yaml
stages:
    - name: Styles
      steps:
          - name: PrefixStyles
            action: PostCssAction
            options:
                inputPath: ./src/css/main.css
                outputPath: ./dist/css/main.css
                autoprefixer: true
                browsers:
                    - "> 0.5%"
                    - "last 3 versions"
                    - "not dead"
```

## After SCSS Compilation

Chain with [@getkist/action-sass](/plugins/action-sass):

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

## Bundled Transformations

The action ships with its own PostCSS pipeline:

| Transform | Option | Description |
| --- | --- | --- |
| autoprefixer | `autoprefixer` | Add vendor prefixes per `browsers` |
| cssnano | `minify` | Minify CSS, tuned by `cssnanoPreset` |

Plugin warnings (for example from a misconfigured transform) are logged individually rather than failing the step.

## Links

- [npm](https://npmjs.com/package/@getkist/action-postcss)
- [GitHub](https://github.com/getkist/kist-action-postcss)
