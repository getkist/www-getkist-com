# @getkist/action-fantasticon

Icon font generation from SVG files, using [Fantasticon](https://github.com/tancredi/fantasticon).

## Installation

```bash
npm install --save-dev @getkist/action-fantasticon
```

Installed plugins are discovered automatically - no configuration needed. The action below becomes available to your pipeline steps by name.

## Actions

### FantasticonAction

Generates web fonts (WOFF2, WOFF, TTF, EOT, SVG) from a directory of SVG icons,
along with the stylesheets and type definitions that go with them.

#### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `inputDir` | `string` | Required | Directory of SVG icons. Searched recursively. |
| `outputDir` | `string` | Required | Where the generated fonts are written. Created if missing. |
| `fontName` | `string` | `"icon-font"` | Name of the generated font |
| `classPrefix` | `string` | `"icon"` | Prefix for the generated CSS classes |
| `formats` | `string[]` | `["woff2", "woff"]` | Formats to emit: `woff2`, `woff`, `ttf`, `eot`, `svg` |
| `typescript` | `boolean` | `true` | Emit TypeScript types for the icon names |
| `scss` | `boolean` | `true` | Emit an SCSS stylesheet |
| `css` | `boolean` | `true` | Emit a CSS stylesheet |
| `html` | `boolean` | `false` | Emit an HTML preview of the icon set |
| `normalize` | `boolean` | `true` | Normalise icon dimensions before generating |
| `config` | `object` | `{}` | Raw Fantasticon options, merged in last (they override the options above) |

#### Basic Usage

```yaml
stages:
    - name: Icons
      steps:
          - name: GenerateIconFont
            action: FantasticonAction
            options:
                inputDir: ./src/icons
                outputDir: ./dist/fonts
```

#### Full Icon Set

A complete set with types, styles, and a preview page:

```yaml
stages:
    - name: Icons
      steps:
          - name: GenerateIconFont
            action: FantasticonAction
            inputs:
                - "src/icons/**/*.svg"
            outputs:
                - "dist/fonts/**"
            options:
                inputDir: ./src/icons
                outputDir: ./dist/fonts
                fontName: brand-icons
                classPrefix: bi
                formats:
                    - woff2
                    - woff
                    - ttf
                typescript: true
                scss: true
                html: true
```

Declaring `inputs` and `outputs` lets kist skip the step when no icon has
changed - see [Caching](/guide/caching). Font generation is slow enough that
this is usually worth doing.

## Notes

- An empty `inputDir` is not an error. The step logs a warning and does
  nothing, so an icon set that has not been populated yet does not fail the
  build.
- A missing `inputDir` **is** an error, since that usually means a
  misconfigured path.
- Icons are found recursively, so they can be organised into subdirectories.

## Links

- [Source](https://github.com/getkist/kist-action-fantasticon)
- [npm](https://www.npmjs.com/package/@getkist/action-fantasticon)
- [Fantasticon documentation](https://github.com/tancredi/fantasticon)
