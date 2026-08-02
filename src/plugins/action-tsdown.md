# @getkist/action-tsdown

Bundling with [tsdown](https://tsdown.dev), the Rolldown-powered bundler.

## Installation

```bash
npm install --save-dev @getkist/action-tsdown
```

Installed plugins are discovered automatically - no configuration needed. The action below becomes available to your pipeline steps by name.

## Actions

### TsdownAction

Bundles JavaScript/TypeScript using tsdown.

#### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `entry` | `string \| string[]` | Required | Entry point(s) |
| `outDir` | `string` | `"dist"` | Output directory |
| `format` | `string \| string[]` | `"esm"` | Output format(s): `esm`, `cjs`, `iife`, `umd` |
| `dts` | `boolean` | `false` | Generate declaration files |
| `minify` | `boolean` | `false` | Minify output |
| `sourcemap` | `boolean \| "inline"` | `false` | Generate source maps |
| `clean` | `boolean` | `false` | Remove `outDir` before building |
| `external` | `string[]` | `[]` | Package names to leave unbundled |
| `noExternal` | `string[]` | `[]` | Package names to force into the bundle |
| `target` | `string` | tsdown's default | Target environment, e.g. `node22`, `es2022` |
| `platform` | `"node" \| "browser" \| "neutral"` | `"node"` | Target platform |
| `treeshake` | `boolean` | `true` | Eliminate unused exports |
| `tsconfig` | `string` | auto-detected | Path to a specific `tsconfig.json` |
| `globalName` | `string` | — | Global variable name for `iife`/`umd` output |
| `define` | `object` | `{}` | Compile-time constant replacements |
| `env` | `object` | `{}` | Values injected as `process.env.*` |
| `bundle` | `boolean` | `true` | Set `false` to transpile without bundling |
| `watch` | `boolean` | `false` | Rebuild on change instead of exiting |
| `cwd` | `string` | project root | Directory to run tsdown from |
| `silent` | `boolean` | `false` | Suppress tsdown's own output |

#### Basic Usage

```yaml
stages:
    - name: Bundle
      steps:
          - name: BundleLibrary
            action: TsdownAction
            options:
                entry: src/index.ts
                outDir: dist
                format:
                    - esm
                    - cjs
```

#### Library Build

A full library build with declarations and source maps:

```yaml
stages:
    - name: Bundle
      steps:
          - name: BundleLibrary
            action: TsdownAction
            inputs:
                - "src/**/*.ts"
                - "tsconfig.json"
            outputs:
                - "dist/**"
            options:
                entry: src/index.ts
                outDir: dist
                format:
                    - esm
                    - cjs
                dts: true
                sourcemap: true
                clean: true
                external:
                    - kist
```

Declaring `inputs` and `outputs` lets kist skip the step when nothing has
changed - see [Caching](/guide/caching).

## tsdown or tsup?

Both bundle TypeScript and both are available as kist actions. tsdown is built
on Rolldown, tsup on esbuild. If you have no preference, either is a reasonable
default; if you already use one in the project, use its action.

- [@getkist/action-tsup](/plugins/action-tsup)

## Links

- [Source](https://github.com/getkist/kist-action-tsdown)
- [npm](https://www.npmjs.com/package/@getkist/action-tsdown)
- [tsdown documentation](https://tsdown.dev)
