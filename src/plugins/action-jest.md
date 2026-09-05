# @getkist/action-jest

Jest test runner with coverage support.

## Installation

```bash
npm install --save-dev @getkist/action-jest
```

Installed plugins are discovered automatically - no configuration needed. The action below becomes available to your pipeline steps by name.

## Actions

### JestAction

Runs tests by spawning the Jest CLI. Options map directly to Jest's own CLI flags; anything left unset falls back to Jest's defaults.

#### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `configPath` | `string` | Jest's own discovery | Path to a Jest config file (`--config`) |
| `testPathPattern` | `string` | - | Regex matched against test file paths (`--testPathPattern`) |
| `testNamePattern` | `string` | - | Regex matched against full test names (`--testNamePattern`) |
| `coverage` | `boolean` | `false` | Collect and report coverage |
| `coverageReporters` | `string[]` | Jest defaults | Coverage reporters (e.g. `text`, `lcov`, `html`) |
| `coverageThresholdBranches` | `number` | - | Minimum branch coverage % (0-100) |
| `coverageThresholdFunctions` | `number` | - | Minimum function coverage % (0-100) |
| `coverageThresholdLines` | `number` | - | Minimum line coverage % (0-100) |
| `coverageThresholdStatements` | `number` | - | Minimum statement coverage % (0-100) |
| `runInBand` | `boolean` | `false` | Run tests serially in the current process |
| `maxWorkers` | `number \| string` | Jest default | Worker count or percentage string (e.g. `"50%"`) |
| `onlyChanged` | `boolean` | `false` | Only run tests related to changed files |
| `bail` | `boolean \| number` | `false` | Stop after the first (or N) failing suites |
| `updateSnapshot` | `boolean` | `false` | Rewrite failing snapshots |
| `clearMocks` | `boolean` | `false` | Clear mocks before every test |
| `resetMocks` | `boolean` | `false` | Reset mock state before every test |
| `verbose` | `boolean` | `false` | Report individual test results |
| `silent` | `boolean` | `false` | Suppress console output from tests |
| `passWithNoTests` | `boolean` | `false` | Don't fail when no test files are found |
| `detectOpenHandles` | `boolean` | `false` | Print open handles preventing a clean exit |
| `forceExit` | `boolean` | `false` | Force the Jest process to exit after the run |
| `watch` | `boolean` | `false` | Jest watch mode (interactive; blocks a pipeline run) |
| `watchAll` | `boolean` | `false` | Watch mode re-running the entire suite |
| `cwd` | `string` | `process.cwd()` | Working directory Jest is spawned from |
| `nodeOptions` | `string` | - | `NODE_OPTIONS` for the spawned Jest process |
| `env` | `object` | - | Extra environment variables for the spawned process |

#### Basic Usage

```yaml
stages:
    - name: Test
      steps:
          - name: UnitTests
            action: JestAction
            options: {}
```

#### With Coverage

```yaml
stages:
    - name: Test
      steps:
          - name: UnitTests
            action: JestAction
            options:
                coverage: true
                verbose: true
```

#### With Coverage Thresholds

```yaml
stages:
    - name: Test
      steps:
          - name: UnitTests
            action: JestAction
            options:
                configPath: ./jest.config.js
                coverage: true
                coverageReporters:
                    - text
                    - lcov
                coverageThresholdLines: 80
                coverageThresholdBranches: 70
```

#### CI Configuration

```yaml
stages:
    - name: Test
      steps:
          - name: UnitTests
            action: JestAction
            options:
                coverage: true
                maxWorkers: 2
                bail: 1
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
  ]
};
```

### ESM Projects

For ESM test setups, pass Node flags to the spawned Jest process:

```yaml
stages:
    - name: Test
      steps:
          - name: UnitTests
            action: JestAction
            options:
                nodeOptions: "--experimental-vm-modules"
```

## Complete Build Pipeline

```yaml
stages:
    - name: Lint
      steps:
          - name: LintSources
            action: LintAction
            options:
                targetFiles: ["src/**/*.ts"]

    - name: Build
      dependsOn: [Lint]
      steps:
          - name: CompileTypeScript
            action: TypeScriptCompilerAction
            options:
                tsconfigPath: ./tsconfig.json

    - name: Test
      dependsOn: [Build]
      steps:
          - name: UnitTests
            action: JestAction
            options:
                coverage: true
```

## Coverage Reports

When `coverage: true`, Jest generates reports in the `coverage/` directory:

```text
coverage/
├── clover.xml
├── coverage-final.json
├── lcov-report/
│   └── index.html    # HTML report
└── lcov.info
```

## Error Output

Jest's output streams directly to the console. A non-zero Jest exit code fails the step (and, by default, the build):

```text
FAIL  src/__tests__/utils.test.ts
  ● Utils › should format date correctly

    expect(received).toBe(expected)

    Expected: "2024-01-15"
    Received: "2024-1-15"

Test Suites: 1 failed, 1 total
Tests:       1 failed, 5 passed, 6 total
```

::: warning Watch mode blocks pipelines
`watch` and `watchAll` are intended for local, interactive use. Jest never exits in watch mode, so an automated pipeline run will block indefinitely.
:::

## Links

- [npm](https://npmjs.com/package/@getkist/action-jest)
- [GitHub](https://github.com/getkist/kist-action-jest)
