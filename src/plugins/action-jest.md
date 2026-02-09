# @getkist/action-jest

Jest test runner with coverage and watch mode support.

## Installation

```bash
npm install --save-dev @getkist/action-jest
```

## Actions

### JestAction

Runs tests using Jest.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `config` | `string` | Auto-detected | Path to Jest config |
| `testMatch` | `string[]` | - | Glob patterns for test files |
| `coverage` | `boolean` | `false` | Collect coverage |
| `watch` | `boolean` | `false` | Watch mode |
| `watchAll` | `boolean` | `false` | Watch all files |
| `verbose` | `boolean` | `false` | Verbose output |
| `passWithNoTests` | `boolean` | `false` | Pass if no tests found |
| `maxWorkers` | `number` | - | Number of workers |

#### Basic Usage

```yaml
plugins:
  - @getkist/action-jest

pipeline:
  test:
    stages:
      - name: test
        steps:
          - action: JestAction
```

#### With Coverage

```yaml
- action: JestAction
  options:
    coverage: true
    verbose: true
```

#### Custom Config

```yaml
- action: JestAction
  options:
    config: jest.config.js
    testMatch:
      - "**/__tests__/**/*.test.ts"
```

#### CI Configuration

```yaml
pipeline:
  ci:
    stages:
      - name: test
        steps:
          - action: JestAction
            options:
              coverage: true
              maxWorkers: 2
              verbose: true
```

## Jest Configuration

### jest.config.js

```javascript
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### jest.config.cjs (CommonJS)

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts']
};
```

## Complete Build Pipeline

```yaml
plugins:
  - @getkist/action-eslint
  - @getkist/action-typescript
  - @getkist/action-jest

pipeline:
  test:
    stages:
      - name: lint
        steps:
          - action: LintAction
            options:
              files: ["src/**/*.ts"]
              
      - name: build
        steps:
          - action: TypeScriptCompilerAction
            options:
              tsconfig: tsconfig.json
              
      - name: test
        steps:
          - action: JestAction
            options:
              coverage: true
```

## Coverage Reports

When `coverage: true`, Jest generates reports in the `coverage/` directory:

```
coverage/
├── clover.xml
├── coverage-final.json
├── lcov-report/
│   └── index.html    # HTML report
└── lcov.info
```

## Watch Mode

For development, use watch mode:

```yaml
pipeline:
  dev:
    stages:
      - name: test
        steps:
          - action: JestAction
            options:
              watch: true
```

Run with:

```bash
npx kist run dev
```

## Error Output

Test failures are reported with details:

```
FAIL  src/__tests__/utils.test.ts
  ● Utils › should format date correctly

    expect(received).toBe(expected)

    Expected: "2024-01-15"
    Received: "2024-1-15"

      15 |   it('should format date correctly', () => {
    > 16 |     expect(formatDate(date)).toBe('2024-01-15');
         |                              ^
      17 |   });

Test Suites: 1 failed, 1 total
Tests:       1 failed, 5 passed, 6 total
```

## Links

- [npm](https://npmjs.com/package/@getkist/action-jest)
- [GitHub](https://github.com/getkist/action-jest)
- [Changelog](https://github.com/getkist/action-jest/blob/main/CHANGELOG.md)
