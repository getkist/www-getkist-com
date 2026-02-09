# @getkist/action-svg

SVG processing, sprite generation, and PNG conversion.

## Installation

```bash
npm install --save-dev @getkist/action-svg
```

## Actions

This plugin provides four actions for different SVG workflows.

### SvgSpriteAction

Creates SVG sprite sheets from individual SVG files.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `inputDir` | `string` | Required | Directory containing SVGs |
| `outputDir` | `string` | Required | Output directory |
| `spriteFilename` | `string` | `"sprite.svg"` | Output filename |
| `prefix` | `string` | `"icon-"` | ID prefix for symbols |
| `optimize` | `boolean` | `true` | Optimize SVGs |

#### Usage

```yaml
plugins:
  - @getkist/action-svg

pipeline:
  build:
    stages:
      - name: icons
        steps:
          - action: SvgSpriteAction
            options:
              inputDir: src/icons
              outputDir: dist/sprites
              spriteFilename: icons.sprite.svg
              prefix: "icon-"
```

#### Output

Creates a sprite file:

```xml
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="icon-arrow" viewBox="0 0 24 24">
    <path d="..."/>
  </symbol>
  <symbol id="icon-close" viewBox="0 0 24 24">
    <path d="..."/>
  </symbol>
</svg>
```

Use in HTML:

```html
<svg class="icon">
  <use href="/sprites/icons.sprite.svg#icon-arrow"></use>
</svg>
```

---

### SvgReaderAction

Reads and parses SVG files.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `inputFile` | `string` | Required | Path to SVG file |
| `outputKey` | `string` | `"svgContent"` | Context key for output |

#### Usage

```yaml
- action: SvgReaderAction
  options:
    inputFile: src/logo.svg
    outputKey: logoSvg
```

---

### SvgPackagerAction

Packages multiple SVGs into different formats.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `inputDir` | `string` | Required | Directory containing SVGs |
| `outputDir` | `string` | Required | Output directory |
| `formats` | `string[]` | `["json"]` | Output formats |

#### Usage

```yaml
- action: SvgPackagerAction
  options:
    inputDir: src/icons
    outputDir: dist/icons
    formats:
      - json
      - esm
```

---

### SvgToPngAction

Converts SVG files to PNG.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `inputFile` | `string` | Required | Path to SVG file |
| `outputFile` | `string` | Required | Path to output PNG |
| `width` | `number` | - | Output width |
| `height` | `number` | - | Output height |
| `scale` | `number` | `1` | Scale factor |
| `background` | `string` | `"transparent"` | Background color |

#### Usage

```yaml
- action: SvgToPngAction
  options:
    inputFile: src/logo.svg
    outputFile: dist/logo.png
    width: 512
    height: 512
```

#### Multiple Sizes

Generate multiple favicon sizes:

```yaml
pipeline:
  build:
    stages:
      - name: favicons
        steps:
          - action: SvgToPngAction
            options:
              inputFile: src/icon.svg
              outputFile: dist/favicon-16.png
              width: 16
              height: 16
              
          - action: SvgToPngAction
            options:
              inputFile: src/icon.svg
              outputFile: dist/favicon-32.png
              width: 32
              height: 32
              
          - action: SvgToPngAction
            options:
              inputFile: src/icon.svg
              outputFile: dist/favicon-192.png
              width: 192
              height: 192
```

## Complete Icon Workflow

```yaml
plugins:
  - @getkist/action-svg

pipeline:
  icons:
    stages:
      - name: process
        steps:
          # Create sprite for web
          - action: SvgSpriteAction
            options:
              inputDir: src/icons
              outputDir: dist/sprites
              spriteFilename: icons.svg
              optimize: true
              
          # Export as JSON for JS frameworks
          - action: SvgPackagerAction
            options:
              inputDir: src/icons
              outputDir: dist/icons
              formats:
                - json
                - esm
                
      - name: favicons
        steps:
          - action: SvgToPngAction
            options:
              inputFile: src/logo.svg
              outputFile: dist/favicon.png
              width: 32
              height: 32
```

## Links

- [npm](https://npmjs.com/package/@getkist/action-svg)
- [GitHub](https://github.com/getkist/action-svg)
- [Changelog](https://github.com/getkist/action-svg/blob/main/CHANGELOG.md)
