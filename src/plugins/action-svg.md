# @getkist/action-svg

SVG processing, sprite generation, and PNG conversion.

## Installation

```bash
npm install --save-dev @getkist/action-svg
```

Installed plugins are discovered automatically - no configuration needed. The actions below become available to your pipeline steps by name.

## Actions

This plugin provides four actions for different SVG workflows.

### SvgSpriteAction

Creates SVG sprite sheets from individual SVG files using [svg-sprite](https://github.com/svg-sprite/svg-sprite).

#### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `sourceDir` | `string` | Required | Directory containing SVG files |
| `outputDir` | `string` | Required | Output directory for the generated sprite |
| `config` | `object` | - | Custom svg-sprite configuration |

#### Usage

```yaml
stages:
    - name: Icons
      steps:
          - name: BuildSprite
            action: SvgSpriteAction
            options:
                sourceDir: ./src/icons
                outputDir: ./dist/sprites
```

#### Output

Creates a sprite file with one `<symbol>` per source SVG:

```xml
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="arrow" viewBox="0 0 24 24">
    <path d="..."/>
  </symbol>
  <symbol id="close" viewBox="0 0 24 24">
    <path d="..."/>
  </symbol>
</svg>
```

Use in HTML:

```html
<svg class="icon">
  <use href="/sprites/sprite.svg#arrow"></use>
</svg>
```

---

### SvgReaderAction

Reads an SVG file (useful for verifying it exists and parses).

#### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `filePath` | `string` | Required | Path to the SVG file to read |

#### Usage

```yaml
stages:
    - name: Icons
      steps:
          - name: ReadLogo
            action: SvgReaderAction
            options:
                filePath: ./src/logo.svg
```

---

### SvgPackagerAction

Optimizes SVGs with SVGO and packages them as optimized SVG files, TypeScript modules, and a JSON index.

#### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `inputDirectory` | `string` | `"src/icons"` | Directory containing SVG files |
| `outputDirectory` | `string` | `"dist/icons"` | Output directory for optimized SVG files |
| `tsOutputDirectory` | `string` | `"dist/ts"` | Output directory for TypeScript files |
| `jsonOutputDirectory` | `string` | `"dist"` | Output directory for the JSON index |
| `svgoConfigPath` | `string` | `"./config/svgo.config.js"` | Path to an SVGO configuration file |

#### Usage

```yaml
stages:
    - name: Icons
      steps:
          - name: PackageIcons
            action: SvgPackagerAction
            options:
                inputDirectory: ./src/icons
                outputDirectory: ./dist/icons
                tsOutputDirectory: ./dist/ts
                jsonOutputDirectory: ./dist
```

---

### SvgToPngAction

Converts SVG content to a PNG file.

#### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `svgContent` | `string` | Required | SVG markup to convert (the SVG content itself, not a file path) |
| `outputPath` | `string` | Required | Path to the output PNG |
| `width` | `number` | - | Output width in pixels |
| `height` | `number` | - | Output height in pixels |

#### Usage

```yaml
stages:
    - name: Favicons
      steps:
          - name: RenderIcon
            action: SvgToPngAction
            options:
                svgContent: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="..."/></svg>'
                outputPath: ./dist/favicon-32.png
                width: 32
                height: 32
```

#### Multiple Sizes

Generate multiple favicon sizes:

```yaml
stages:
    - name: Favicons
      steps:
          - name: Favicon16
            action: SvgToPngAction
            options:
                svgContent: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="..."/></svg>'
                outputPath: ./dist/favicon-16.png
                width: 16
                height: 16

          - name: Favicon32
            action: SvgToPngAction
            options:
                svgContent: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="..."/></svg>'
                outputPath: ./dist/favicon-32.png
                width: 32
                height: 32
```

## Complete Icon Workflow

```yaml
stages:
    - name: Icons
      steps:
          # Create sprite for the web
          - name: BuildSprite
            action: SvgSpriteAction
            options:
                sourceDir: ./src/icons
                outputDir: ./dist/sprites

          # Optimize and export as TS/JSON
          - name: PackageIcons
            action: SvgPackagerAction
            options:
                inputDirectory: ./src/icons
                outputDirectory: ./dist/icons
                jsonOutputDirectory: ./dist
```

## Links

- [npm](https://npmjs.com/package/@getkist/action-svg)
- [GitHub](https://github.com/getkist/kist-action-svg)
