# @getkist/action-typescript

TypeScript compilation with full tsconfig.json support.

## Installation

```bash
npm install --save-dev @getkist/action-typescript
```

Installed plugins are discovered automatically - no configuration needed. The action below becomes available to your pipeline steps by name.

## Actions

### TypeScriptCompilerAction

Compiles TypeScript files to JavaScript using the TypeScript compiler.

#### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `tsconfigPath` | `string` | `"tsconfig.json"` | Path to the tsconfig.json file |
| `filePaths` | `string[]` | Files from tsconfig | Specific files to compile, overriding the tsconfig file list |
| `outputDir` | `string` | `outDir` from tsconfig | Override the output directory |
| `compilerOptions` | `object` | `{}` | Additional compiler options merged over those from tsconfig |

#### Basic Usage

```yaml
stages:
    - name: Compile
      steps:
          - name: CompileTypeScript
            action: TypeScriptCompilerAction
            options:
                tsconfigPath: ./tsconfig.json
```

#### With Options Override

```yaml
stages:
    - name: Compile
      steps:
          - name: CompileTypeScript
            action: TypeScriptCompilerAction
            options:
                tsconfigPath: ./tsconfig.json
                outputDir: ./dist/js
                compilerOptions:
                    declaration: true
                    sourceMap: true
```

#### Multiple Configurations

```yaml
stages:
    - name: Compile
      steps:
          # Build ESM output
          - name: CompileEsm
            action: TypeScriptCompilerAction
            options:
                tsconfigPath: ./tsconfig.json
                outputDir: ./dist/esm
                compilerOptions:
                    module: ESNext
                    declaration: true

          # Build CommonJS output
          - name: CompileCjs
            action: TypeScriptCompilerAction
            options:
                tsconfigPath: ./tsconfig.json
                outputDir: ./dist/cjs
                compilerOptions:
                    module: CommonJS
                    declaration: false
```

## tsconfig.json Example

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## With Linting

Lint before compiling:

```yaml
stages:
    - name: Lint
      steps:
          - name: LintSources
            action: LintAction
            options:
                targetFiles:
                    - "src/**/*.ts"

    - name: Compile
      dependsOn: [Lint]
      steps:
          - name: CompileTypeScript
            action: TypeScriptCompilerAction
            options:
                tsconfigPath: ./tsconfig.json
```

## Output Structure

With default settings:

```text
src/
├── index.ts
├── lib/
│   └── utils.ts

# Compiles to:
dist/
├── index.js
├── index.js.map
├── index.d.ts
├── lib/
│   ├── utils.js
│   ├── utils.js.map
│   └── utils.d.ts
```

## Error Handling

TypeScript errors are reported with full diagnostic information:

```text
src/index.ts(15,3): error TS2339: Property 'foo' does not exist on type 'Bar'.
```

The action fails (and, by default, the build halts) if there are any compilation errors.

## Links

- [npm](https://npmjs.com/package/@getkist/action-typescript)
- [GitHub](https://github.com/getkist/kist-action-typescript)
