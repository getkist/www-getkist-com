# @getkist/action-eslint

ESLint code linting with automatic configuration detection.

## Installation

```bash
npm install --save-dev @getkist/action-eslint
```

## Actions

### LintAction

Lints JavaScript and TypeScript files using ESLint.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `files` | `string[]` | Required | Glob patterns for files to lint |
| `config` | `string` | Auto-detected | Path to ESLint config |
| `fix` | `boolean` | `false` | Auto-fix problems |
| `cache` | `boolean` | `true` | Use caching for speed |
| `maxWarnings` | `number` | `-1` | Max warnings before failure (-1 = unlimited) |

#### Basic Usage

```yaml
plugins:
  - @getkist/action-eslint

pipeline:
  build:
    stages:
      - name: lint
        steps:
          - action: LintAction
            options:
              files:
                - "src/**/*.ts"
                - "src/**/*.js"
```

#### With Auto-Fix

```yaml
- action: LintAction
  options:
    files: ["src/**/*.ts"]
    fix: true
```

#### Strict Mode

Fail on any warnings:

```yaml
- action: LintAction
  options:
    files: ["src/**/*.ts"]
    maxWarnings: 0
```

#### Custom Config

```yaml
- action: LintAction
  options:
    files: ["src/**/*.ts"]
    config: eslint.config.js
```

## ESLint Configuration

### Flat Config (ESLint 9+)

Create `eslint.config.js`:

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

### Legacy Config (.eslintrc)

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "root": true
}
```

## With Prettier

Combine linting with formatting:

```yaml
plugins:
  - @getkist/action-eslint
  - @getkist/action-prettier

pipeline:
  lint:
    stages:
      - name: quality
        steps:
          # Lint first
          - action: LintAction
            options:
              files: ["src/**/*.ts"]
              fix: true
              
          # Then format
          - action: PrettierAction
            options:
              files: ["src/**/*.ts"]
              write: true
```

## CI/CD Usage

For CI, don't auto-fix - just report:

```yaml
pipeline:
  ci:
    stages:
      - name: lint
        steps:
          - action: LintAction
            options:
              files: ["src/**/*.ts"]
              fix: false
              maxWarnings: 0
```

## Error Output

ESLint errors are reported in standard format:

```
src/index.ts
  15:3  error  'foo' is not defined  no-undef
  23:1  warning  Unexpected console statement  no-console

✖ 2 problems (1 error, 1 warning)
```

## Links

- [npm](https://npmjs.com/package/@getkist/action-eslint)
- [GitHub](https://github.com/getkist/action-eslint)
- [Changelog](https://github.com/getkist/action-eslint/blob/main/CHANGELOG.md)
