# @getkist/action-typescript

TypeScript compilation with full tsconfig.json support.

## Installation

```bash
npm install --save-dev @getkist/action-typescript
```

## Actions

### TypeScriptCompilerAction

Compiles TypeScript files to JavaScript.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tsconfig` | `string` | `"tsconfig.json"` | Path to tsconfig.json |
| `project` | `string` | - | Alternative to tsconfig |
| `outDir` | `string` | - | Override output directory |
| `declaration` | `boolean` | - | Generate .d.ts files |
| `sourceMap` | `boolean` | - | Generate source maps |
| `watch` | `boolean` | `false` | Watch mode |

#### Basic Usage

```yaml
plugins:
  - @getkist/action-typescript

pipeline:
  build:
    stages:
      - name: compile
        steps:
          - action: TypeScriptCompilerAction
            options:
              tsconfig: tsconfig.json
```

#### With Options Override

```yaml
- action: TypeScriptCompilerAction
  options:
    tsconfig: tsconfig.json
    outDir: dist/js
    declaration: true
    sourceMap: true
```

#### Multiple Configurations

```yaml
pipeline:
  build:
    stages:
      - name: compile
        steps:
          # Build main library
          - action: TypeScriptCompilerAction
            options:
              tsconfig: tsconfig.lib.json
              outDir: dist/lib
              
          # Build CLI
          - action: TypeScriptCompilerAction
            options:
              tsconfig: tsconfig.cli.json
              outDir: dist/cli
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
plugins:
  - @getkist/action-eslint
  - @getkist/action-typescript

pipeline:
  build:
    stages:
      - name: lint
        steps:
          - action: LintAction
            options:
              files: ["src/**/*.ts"]
              
      - name: compile
        steps:
          - action: TypeScriptCompilerAction
            options:
              tsconfig: tsconfig.json
```

## Output Structure

With default settings:

```
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

```
src/index.ts(15,3): error TS2339: Property 'foo' does not exist on type 'Bar'.
```

The action fails if there are any compilation errors.

## Links

- [npm](https://npmjs.com/package/@getkist/action-typescript)
- [GitHub](https://github.com/getkist/action-typescript)
- [Changelog](https://github.com/getkist/action-typescript/blob/main/CHANGELOG.md)
