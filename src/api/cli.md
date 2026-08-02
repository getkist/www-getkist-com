# CLI Reference

Command-line interface documentation for kist.

The kist CLI runs the pipeline described by your config file. It also has a
handful of commands for creating, inspecting, and checking a pipeline without
running it.

## Installation

```bash
# As a dev dependency (recommended)
npm install --save-dev kist

# Global installation
npm install -g kist

# Or use npx
npx kist
```

Requires Node.js >= 22.0.0 and npm >= 9.0.0.

## Usage

```bash
kist [options] [command]
```

Running `kist` with no command runs the pipeline. It looks for a config file in
the current working directory — first `kist.yaml`, then `kist.yml` — then
discovers plugins, validates the configuration, and executes the stages.

### Commands

| Command | Description |
| ------- | ----------- |
| `run` | Run the pipeline. This is the default; you can omit it. |
| `init [directory]` | Write a starter `kist.yml`, including the schema reference your editor uses. |
| `validate` | Check the configuration and that every action it names is registered. Runs nothing. |
| `schema` | Print the JSON Schema for `kist.yml`. |
| `clear-cache` | Delete cached step results. |

### Options

| Option | Description |
| ------ | ----------- |
| `-c, --config <path>` | Use an explicit config file instead of searching the current directory. Errors if the file is not found. |
| `-l, --log-level <level>` | Lowest severity to print: `debug`, `info`, `warn`, or `error`. Overrides `options.logLevel`. |
| `-v, --verbose` | Shorthand for `--log-level debug`. |
| `--live` | Enable live reload (equivalent to `options.live.enabled: true`). |
| `--no-cache` | Ignore cached results and run every step. |
| `--dry-run` | Print the execution plan instead of running it. |
| `--dry <format>` | Print the plan as `text` or `json`. |
| `--graph [format]` | Print the stage dependency graph as `dot` or `mermaid`. |
| `-V, --version` | Print the kist version. |
| `-h, --help` | Show help. Works for any command, e.g. `kist init --help`. |

Options for `init`:

| Option | Description |
| ------ | ----------- |
| `-t, --template <name>` | `minimal` (default) or `package`, a fuller pipeline for publishing an npm package. |
| `-f, --force` | Overwrite an existing file. |

### Examples

```bash
# Create a starter configuration
kist init
kist init -t package

# Run the pipeline from ./kist.yaml or ./kist.yml
kist

# Use a specific config file
kist --config ./config/kist.production.yml

# See what would run, without running it
kist --dry-run

# The same plan as JSON, for CI or tooling
kist --dry json

# The stage graph, ready to paste into a Markdown file
kist --graph mermaid

# Check the file and that every action it names exists
kist validate

# Run with live reload (serves options.live.root and rebuilds on change)
kist --live

# Debug a run
kist --verbose
```

## Inspecting before running

`--dry-run` answers what would run, in what order, and whether every action it
names actually exists:

```
Plan for /project/kist.yml
  concurrency: 4 stage(s)   caching: on   halt on failure: yes

  build
    - compile → TypeScriptCompilerAction  [cacheable]
    - copy-readme → FileCopyAction
  publish  [after: build]
    - pack → PackageManagerAction
```

An action that is not registered is reported as `UNKNOWN ACTION` and the command
exits `1`, so a missing plugin surfaces before the build starts rather than
midway through it.

## Configuration File

The config file drives everything. Minimal example:

```yaml
options:
    mode: development
    logLevel: info

stages:
    - name: Build
      steps:
          - name: CopyLicense
            action: FileCopyAction
            options:
                srcFile: "./LICENSE"
                destDir: "./dist"
```

See the [Configuration guide](/guide/configuration) for the full schema (`extends`, `metadata`, `options`, `stages`).

### Multiple Configurations

There are no named pipelines — one config file describes one pipeline. For variants (development vs. production, subprojects), create separate config files, share common parts with `extends`, and select one with `--config`:

```yaml
# kist.production.yml
extends: ./kist.yml

options:
    mode: production
```

```bash
kist --config ./kist.production.yml
```

## Startup Validation

Before anything runs, kist validates the merged configuration (after plugin discovery, so plugin-provided actions count as registered). Validation fails fast with a clear error for:

- Duplicate stage or step names
- Stages with empty step lists
- Steps referencing unregistered action names
- Unknown or circular `dependsOn` references

## Controlling Log Output

Set the level in the config:

```yaml
options:
    logLevel: debug   # debug | info | warn | error (default: info)
```

`--log-level` overrides it for a single run, and `--verbose` is shorthand for
`--log-level debug`.

Command output — the plan, the graph, the schema — goes to stdout regardless of
the log level, so `kist --dry=json > plan.json` produces a clean file.

## Exit Codes

| Code | Description |
| ---- | ----------- |
| `0` | Pipeline completed successfully |
| `1` | Any failure: config not found or invalid, unknown action, or a failing action |

With `options.haltOnFailure: false`, step failures are logged, the pipeline continues, and kist exits `0`.

## CI/CD Usage

### GitHub Actions

```yaml
name: Build
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      # Carry the step cache between runs so unchanged steps are skipped.
      - uses: actions/cache@v4
        with:
          path: .kist-cache
          key: kist-${{ runner.os }}-${{ hashFiles('src/**', 'kist.yml') }}
          restore-keys: |
            kist-${{ runner.os }}-
      - run: npx kist
```

See [Caching](/guide/caching) for what the cache key covers and when sharing it
is worth the download.

### GitLab CI

```yaml
build:
  image: node:22
  script:
    - npm ci
    - npx kist
```

## Troubleshooting

### Command not found

```bash
# Use npx if not installed globally
npx kist
```

### Config not found

```bash
# kist searches only for kist.yaml / kist.yml in the current directory;
# point it at other files explicitly
kist --config ./config/kist.yml
```

### Plugin not loading

```bash
# Plugins are auto-discovered from node_modules; ensure the package is installed
npm ls @getkist/action-sass

# Check verbose output for the plugin discovery log
kist --verbose
```

If a step names an action that moved out of the core package, the error says
which package to install. If the name is close to a registered one, it suggests
the correction.

### Checking a configuration without running it

```bash
kist validate
```

## Next Steps

- [API Reference](/api/) - Programmatic usage
- [Configuration](/guide/configuration) - YAML reference
- [Editor setup](/guide/editor-setup) - Completion and validation in your editor
- [Caching](/guide/caching) - Skipping work that has not changed
- [Plugins](/plugins/) - Available plugins
