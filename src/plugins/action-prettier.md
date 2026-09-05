# @getkist/action-prettier

Prettier code formatting with write and check modes.

## Installation

```bash
npm install --save-dev @getkist/action-prettier
```

Installed plugins are discovered automatically - no configuration needed. The action below becomes available to your pipeline steps by name.

## Actions

### PrettierAction

Formats code using Prettier, or checks that it is already formatted.

#### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `targetFiles` | `string[]` | Required | Files to format (direct file paths; see note below) |
| `write` | `boolean` | `true` | Write formatted files to disk; `false` = check mode, which fails if any file needs formatting |
| `configPath` | `string` | - | Path to a Prettier config file to resolve options from |
| `tabWidth` | `number` | Prettier default (`2`) | Tab width for indentation |
| `useTabs` | `boolean` | Prettier default (`false`) | Use tabs instead of spaces |
| `semi` | `boolean` | Prettier default (`true`) | Print semicolons |
| `singleQuote` | `boolean` | Prettier default (`false`) | Use single quotes |
| `trailingComma` | `string` | Prettier default (`"all"`) | `"all"`, `"es5"`, or `"none"` |
| `bracketSpacing` | `boolean` | Prettier default (`true`) | Spaces between brackets in object literals |
| `bracketSameLine` | `boolean` | Prettier default (`false`) | Closing bracket on the same line as the last attribute |
| `arrowParens` | `string` | Prettier default (`"always"`) | `"always"` or `"avoid"` |
| `printWidth` | `number` | Prettier default (`80`) | Line width to wrap on |
| `htmlWhitespaceSensitivity` | `string` | Prettier default (`"css"`) | `"css"`, `"strict"`, or `"ignore"` |
| `endOfLine` | `string` | Prettier default (`"lf"`) | `"lf"`, `"crlf"`, `"cr"`, or `"auto"` |
| `parser` | `string` | Auto-detected per file | Force a specific parser |
| `ignoreUnknown` | `boolean` | `false` | Skip files whose parser cannot be inferred instead of erroring |

Style options set here override values resolved from `configPath`.

::: warning Direct file paths only
`targetFiles` entries are resolved as direct file paths. Glob patterns and directories are currently not expanded - they are skipped with a warning.
:::

#### Basic Usage

```yaml
stages:
    - name: Format
      steps:
          - name: FormatSources
            action: PrettierAction
            options:
                targetFiles:
                    - "src/index.ts"
                    - "src/utils/helpers.ts"
                write: true
```

#### Check Mode (CI)

Fail if files aren't formatted, without modifying them:

```yaml
stages:
    - name: FormatCheck
      steps:
          - name: CheckFormatting
            action: PrettierAction
            options:
                targetFiles:
                    - "src/index.ts"
                write: false
```

#### Custom Config

```yaml
stages:
    - name: Format
      steps:
          - name: FormatSources
            action: PrettierAction
            options:
                targetFiles:
                    - "src/index.ts"
                configPath: .prettierrc
                write: true
```

#### Inline Style Options

```yaml
stages:
    - name: Format
      steps:
          - name: FormatSources
            action: PrettierAction
            options:
                targetFiles:
                    - "src/index.ts"
                write: true
                singleQuote: true
                semi: false
                trailingComma: all
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

## Ignore Files

Files matched by `.prettierignore` are skipped:

```text
dist/
node_modules/
coverage/
*.min.js
```

## With ESLint

Run ESLint first, then Prettier:

```yaml
stages:
    - name: Quality
      steps:
          - name: LintSources
            action: LintAction
            options:
                targetFiles: ["src/**/*.ts"]
                fix: true

          - name: FormatSources
            action: PrettierAction
            options:
                targetFiles:
                    - "src/index.ts"
                write: true
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
- [GitHub](https://github.com/getkist/kist-action-prettier)
