# @getkist/action-eslint

ESLint code linting with optional auto-fixing.

## Installation

```bash
npm install --save-dev @getkist/action-eslint
```

Installed plugins are discovered automatically - no configuration needed. The action below becomes available to your pipeline steps by name.

## Actions

### LintAction

Lints JavaScript and TypeScript files using ESLint.

#### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `targetFiles` | `string[]` | `["src/**/*.ts"]` | Files or glob patterns to lint |
| `fix` | `boolean` | `false` | Automatically apply ESLint's suggested fixes |
| `configPath` | `string` | `"eslint.config.js"` | Path to the ESLint flat config file |

#### Basic Usage

```yaml
stages:
    - name: Lint
      steps:
          - name: LintSources
            action: LintAction
            options:
                targetFiles:
                    - "src/**/*.ts"
                    - "src/**/*.js"
```

#### With Auto-Fix

```yaml
stages:
    - name: Lint
      steps:
          - name: LintAndFix
            action: LintAction
            options:
                targetFiles: ["src/**/*.ts"]
                fix: true
```

#### Custom Config

```yaml
stages:
    - name: Lint
      steps:
          - name: LintSources
            action: LintAction
            options:
                targetFiles: ["src/**/*.ts"]
                configPath: eslint.config.mjs
```

::: warning Lint findings do not fail the build
`LintAction` reports errors and warnings in the log but resolves successfully even when problems are found. Only unexpected failures (for example an unreadable config file or an invalid glob) fail the step.
:::

## ESLint Configuration

The action uses ESLint's flat config format (ESLint 9+). Create `eslint.config.js`:

```javascript
import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';

export default [
  eslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      'no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  }
];
```

## With Prettier

Combine linting with formatting:

```yaml
stages:
    - name: Quality
      steps:
          # Lint first
          - name: LintSources
            action: LintAction
            options:
                targetFiles: ["src/**/*.ts"]
                fix: true

          # Then format
          - name: FormatSources
            action: PrettierAction
            options:
                targetFiles:
                    - "src/index.ts"
                write: true
```

## CI/CD Usage

For CI, don't auto-fix - just report:

```yaml
stages:
    - name: Lint
      steps:
          - name: LintSources
            action: LintAction
            options:
                targetFiles: ["src/**/*.ts"]
                fix: false
```

## Error Output

ESLint results are printed with the standard "stylish" formatter:

```text
src/index.ts
  15:3  error  'foo' is not defined  no-undef
  23:1  warning  Unexpected console statement  no-console

✖ 2 problems (1 error, 1 warning)
```

## Links

- [npm](https://npmjs.com/package/@getkist/action-eslint)
- [GitHub](https://github.com/getkist/kist-action-eslint)
