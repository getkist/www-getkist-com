# @getkist/action-prettier

Prettier code formatting with check and write modes.

## Installation

```bash
npm install --save-dev @getkist/action-prettier
```

## Actions

### PrettierAction

Formats code using Prettier.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `files` | `string[]` | Required | Glob patterns for files to format |
| `config` | `string` | Auto-detected | Path to Prettier config |
| `check` | `boolean` | `false` | Check formatting without writing |
| `write` | `boolean` | `false` | Write formatted files |
| `ignorePath` | `string` | `.prettierignore` | Path to ignore file |

#### Basic Usage

```yaml
plugins:
  - @getkist/action-prettier

pipeline:
  format:
    stages:
      - name: format
        steps:
          - action: PrettierAction
            options:
              files:
                - "src/**/*.ts"
                - "src/**/*.js"
              write: true
```

#### Check Mode (CI)

Fail if files aren't formatted:

```yaml
- action: PrettierAction
  options:
    files: ["src/**/*.ts"]
    check: true
```

#### Custom Config

```yaml
- action: PrettierAction
  options:
    files: ["src/**/*.ts"]
    config: .prettierrc
    write: true
```

## Prettier Configuration

### JSON Config (.prettierrc)

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

### JavaScript Config (prettier.config.js)

```javascript
export default {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 80,
  plugins: ['prettier-plugin-organize-imports']
};
```

## Ignore Files

Create `.prettierignore`:

```
dist/
node_modules/
coverage/
*.min.js
```

## With ESLint

Run ESLint first, then Prettier:

```yaml
plugins:
  - @getkist/action-eslint
  - @getkist/action-prettier

pipeline:
  format:
    stages:
      - name: quality
        steps:
          - action: LintAction
            options:
              files: ["src/**/*.ts"]
              fix: true
              
          - action: PrettierAction
            options:
              files: ["src/**/*.ts"]
              write: true
```

## CI/CD Pipeline

Check formatting in CI:

```yaml
pipeline:
  ci:
    stages:
      - name: format-check
        steps:
          - action: PrettierAction
            options:
              files:
                - "src/**/*.ts"
                - "src/**/*.js"
                - "**/*.json"
                - "**/*.md"
              check: true
```

## Development Workflow

Format on save in `package.json`:

```json
{
  "scripts": {
    "format": "kist run format",
    "format:check": "kist run format:check"
  }
}
```

## Supported File Types

Prettier supports many file types out of the box:

- JavaScript/TypeScript (`.js`, `.ts`, `.jsx`, `.tsx`)
- CSS/SCSS/Less (`.css`, `.scss`, `.less`)
- HTML (`.html`)
- JSON (`.json`)
- Markdown (`.md`)
- YAML (`.yml`, `.yaml`)
- GraphQL (`.graphql`)

## Links

- [npm](https://npmjs.com/package/@getkist/action-prettier)
- [GitHub](https://github.com/getkist/action-prettier)
- [Changelog](https://github.com/getkist/action-prettier/blob/main/CHANGELOG.md)
