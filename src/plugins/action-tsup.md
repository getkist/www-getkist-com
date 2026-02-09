# @getkist/action-tsup

Fast bundling with tsup (powered by esbuild).

## Installation

```bash
npm install --save-dev @getkist/action-tsup
```

## Actions

### BundleAction

Bundles JavaScript/TypeScript using tsup.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entry` | `string\|string[]` | Required | Entry point(s) |
| `outDir` | `string` | `"dist"` | Output directory |
| `format` | `string[]` | `["esm"]` | Output formats: `esm`, `cjs`, `iife` |
| `dts` | `boolean` | `false` | Generate declaration files |
| `sourcemap` | `boolean` | `false` | Generate source maps |
| `minify` | `boolean` | `false` | Minify output |
| `clean` | `boolean` | `true` | Clean outDir before build |
| `external` | `string[]` | `[]` | External dependencies |
| `splitting` | `boolean` | `false` | Code splitting |
| `config` | `string` | - | Path to tsup.config.ts |

#### Basic Usage

```yaml
plugins:
  - @getkist/action-tsup

pipeline:
  build:
    stages:
      - name: bundle
        steps:
          - action: BundleAction
            options:
              entry: src/index.ts
              outDir: dist
              format:
                - esm
                - cjs
```

#### Library Build

Full library build with types:

```yaml
- action: BundleAction
  options:
    entry: src/index.ts
    outDir: dist
    format:
      - esm
      - cjs
    dts: true
    sourcemap: true
    clean: true
```

#### Multiple Entry Points

```yaml
- action: BundleAction
  options:
    entry:
      - src/index.ts
      - src/cli.ts
    outDir: dist
    format:
      - esm
```

#### Browser Bundle

```yaml
- action: BundleAction
  options:
    entry: src/browser.ts
    outDir: dist
    format:
      - iife
    minify: true
    sourcemap: true
```

## Output Formats

| Format | Extension | Use Case |
|--------|-----------|----------|
| `esm` | `.mjs` | Modern bundlers, Node.js 14+ |
| `cjs` | `.cjs` | Node.js CommonJS |
| `iife` | `.global.js` | Browser script tags |

## tsup.config.ts

For complex configurations:

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  esbuildOptions(options) {
    options.banner = {
      js: '/* My Library v1.0.0 */'
    };
  }
});
```

Then reference it:

```yaml
- action: BundleAction
  options:
    config: tsup.config.ts
```

## With Watch Mode

```yaml
- action: BundleAction
  options:
    entry: src/index.ts
    outDir: dist
    watch: true
```

## Output Structure

```
dist/
├── index.mjs      # ESM
├── index.cjs      # CommonJS
├── index.d.ts     # TypeScript declarations
└── index.mjs.map  # Source map
```

## External Dependencies

Don't bundle dependencies:

```yaml
- action: BundleAction
  options:
    entry: src/index.ts
    outDir: dist
    external:
      - react
      - react-dom
      - lodash
```

::: tip
By default, `peerDependencies` and `dependencies` from `package.json` are treated as external.
:::

## Links

- [npm](https://npmjs.com/package/@getkist/action-tsup)
- [GitHub](https://github.com/getkist/action-tsup)
- [Changelog](https://github.com/getkist/action-tsup/blob/main/CHANGELOG.md)
- [tsup documentation](https://tsup.egoist.dev/)
