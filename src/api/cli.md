# CLI Reference

Complete command-line interface documentation for kist.

## Installation

```bash
# Global installation
npm install -g @getkist/kist

# Or use npx
npx @getkist/kist [command]
```

## Commands

### kist run

Run a pipeline defined in `kist.yml`.

```bash
kist run <pipeline> [options]
```

#### Arguments

| Argument | Description |
|----------|-------------|
| `pipeline` | Name of the pipeline to run |

#### Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--config` | `-c` | Path to config file (default: `kist.yml`) |
| `--watch` | `-w` | Watch mode - rebuild on changes |
| `--verbose` | `-v` | Verbose output |
| `--quiet` | `-q` | Suppress output |
| `--stage` | `-s` | Run only a specific stage |
| `--dry-run` | | Show what would run without executing |

#### Examples

```bash
# Run the build pipeline
kist run build

# Run with watch mode
kist run build --watch

# Run a specific stage
kist run build --stage compile

# Use a custom config file
kist run build --config custom.kist.yml

# Dry run to preview
kist run build --dry-run
```

### kist init

Initialize a new kist project.

```bash
kist init [options]
```

#### Options

| Option | Description |
|--------|-------------|
| `--template` | Project template to use |
| `--yes` | Skip prompts and use defaults |

#### Examples

```bash
# Interactive initialization
kist init

# Quick setup with defaults
kist init --yes

# Use a template
kist init --template typescript
```

This creates a `kist.yml` file with a basic configuration.

### kist list

List available pipelines and actions.

```bash
kist list [type]
```

#### Arguments

| Argument | Description |
|----------|-------------|
| `type` | What to list: `pipelines`, `actions`, or `plugins` |

#### Examples

```bash
# List all pipelines
kist list pipelines

# List available actions
kist list actions

# List loaded plugins
kist list plugins
```

### kist validate

Validate the configuration file.

```bash
kist validate [options]
```

#### Options

| Option | Description |
|--------|-------------|
| `--config` | Path to config file |
| `--strict` | Fail on warnings |

#### Examples

```bash
# Validate kist.yml
kist validate

# Validate with strict mode
kist validate --strict

# Validate a specific file
kist validate --config production.kist.yml
```

### kist version

Show version information.

```bash
kist version
kist --version
kist -V
```

### kist help

Show help information.

```bash
kist help
kist --help
kist -h

# Help for a specific command
kist help run
kist run --help
```

## Environment Variables

Environment variables can be used in `kist.yml`:

```yaml
pipeline:
  build:
    stages:
      - name: deploy
        steps:
          - action: ShellAction
            options:
              command: deploy --env $&#123;&#123; env.NODE_ENV &#125;&#125;
```

### Setting Environment Variables

```bash
# Single variable
NODE_ENV=production kist run build

# Multiple variables
API_KEY=xxx NODE_ENV=production kist run build

# From .env file (using dotenv)
npx dotenv -- kist run build
```

### Built-in Variables

| Variable | Description |
|----------|-------------|
| `KIST_CONFIG` | Path to config file |
| `KIST_CWD` | Current working directory |
| `KIST_VERBOSE` | Enable verbose mode |

## Exit Codes

| Code | Description |
|------|-------------|
| `0` | Success |
| `1` | General error |
| `2` | Configuration error |
| `3` | Action error |
| `130` | Interrupted (Ctrl+C) |

## Configuration Files

kist looks for configuration in this order:

1. `--config` option
2. `kist.yml` in current directory
3. `kist.yaml` in current directory
4. `.kist/config.yml`

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
          node-version: 20
      - run: npm ci
      - run: npx kist run build
```

### GitLab CI

```yaml
build:
  image: node:20
  script:
    - npm ci
    - npx kist run build
```

### Jenkins

```groovy
pipeline {
    agent { docker { image 'node:20' } }
    stages {
        stage('Build') {
            steps {
                sh 'npm ci'
                sh 'npx kist run build'
            }
        }
    }
}
```

## Troubleshooting

### Common Issues

**Command not found**
```bash
# Use npx if not installed globally
npx @getkist/kist run build
```

**Config not found**
```bash
# Specify config path explicitly
kist run build --config ./config/kist.yml
```

**Plugin not loading**
```bash
# Ensure plugin is installed
npm ls @getkist/action-sass

# Check verbose output
kist run build --verbose
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=kist:* kist run build

# Or use verbose flag
kist run build --verbose
```

## Next Steps

- [API Reference](/api/) - Programmatic usage
- [Configuration](/guide/configuration) - YAML reference
- [Plugins](/plugins/) - Available plugins
