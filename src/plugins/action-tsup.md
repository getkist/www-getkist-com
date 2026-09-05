# @getkist/action-tsup

Fast bundling with tsup (powered by esbuild).

## Installation

```bash
npm install --save-dev @getkist/action-tsup
```

Installed plugins are discovered automatically - no configuration needed. The action below becomes available to your pipeline steps by name.

## Actions

### BundleAction

Bundles JavaScript/TypeScript using tsup.

#### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `entry` | `string \| string[] \| object` | Required | Entry point(s) |
| `outDir` | `string` | `"dist"` | Output directory |
| `format` | `string \| string[]` | `"esm"` | Output format(s): `esm`, `cjs`, `iife` |
| `dts` | `boolean` | `true` | Generate declaration files |
| `sourcemap` | `boolean` | `false` | Generate source maps |
| `minify` | `boolean` | `false` | Minify output |
| `clean` | `boolean` | `true` | Clean outDir before build |
| `splitting` | `boolean` | `false` | Code splitting |
| `target` | `string` | `"node20"` | Target environment |
| `external` | `string[]` | `[]` | External packages excluded from the bundle |
| `tsupOptions` | `object` | `{}` | Additional raw tsup options, merged in last (they override the options above) |

#### Basic Usage

```yaml
stages:
    - name: Bundle
      steps:
          - name: BundleLibrary
            action: BundleAction
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
stages:
    - name: Bundle
      steps:
          - name: BundleLibrary
            action: BundleAction
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
stages:
    - name: Bundle
      steps:
          - name: BundleAll
            action: BundleAction
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
stages:
    - name: Bundle
      steps:
          - name: BundleBrowser
            action: BundleAction
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
| --- | --- | --- |
| `esm` | `.mjs` | Modern bundlers, Node.js 14+ |
| `cjs` | `.cjs` | Node.js CommonJS |
| `iife` | `.global.js` | Browser script tags |

## Advanced tsup Options

Options not exposed directly can be passed through `tsupOptions`:

```yaml
stages:
    - name: Bundle
      steps:
          - name: BundleLibrary
            action: BundleAction
            options:
                entry: src/index.ts
                outDir: dist
                tsupOptions:
                    shims: true
                    treeshake: true
```

## Output Structure

```text
dist/
├── index.mjs      # ESM
├── index.cjs      # CommonJS
├── index.d.ts     # TypeScript declarations
└── index.mjs.map  # Source map
```

## External Dependencies

Don't bundle dependencies:

```yaml
stages:
    - name: Bundle
      steps:
          - name: BundleLibrary
            action: BundleAction
            options:
                entry: src/index.ts
                outDir: dist
                external:
                    - react
                    - react-dom
                    - lodash
```

## Links

- [npm](https://npmjs.com/package/@getkist/action-tsup)
- [GitHub](https://github.com/getkist/kist-action-tsup)
- [tsup documentation](https://tsup.egoist.dev/)
