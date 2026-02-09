# Using Plugins

Learn how to discover, install, and configure kist plugins.

## Installing Plugins

### From npm

Most kist plugins are published to npm with the `@getkist/` scope:

```bash
# Install a single plugin
npm install --save-dev @getkist/action-sass

# Install multiple plugins at once
npm install --save-dev @getkist/action-sass @getkist/action-typescript @getkist/action-eslint
```

### From Source

You can also reference local plugins:

```yaml
plugins:
  # npm package
  - @getkist/action-sass
  
  # Local plugin (relative path)
  - ./my-plugins/custom-action
```

## Registering Plugins

Declare plugins in your `kist.yml`:

```yaml
plugins:
  - @getkist/action-sass
  - @getkist/action-typescript
  - @getkist/action-eslint

pipeline:
  # Your pipeline uses actions from these plugins
```

Plugins are loaded in order. If two plugins provide the same action name, the later plugin wins.

## Default Actions

Some actions are built into kist and don't require plugins:

| Action | Description |
|--------|-------------|
| `CopyAction` | Copy files |
| `DeleteAction` | Delete files |
| `LogAction` | Log messages |
| `ShellAction` | Run shell commands |

## Plugin Options

Each plugin's actions accept specific options. See individual plugin docs for details.

### Common Patterns

Most plugins follow these conventions:

```yaml
# File-based actions
- action: SomeAction
  options:
    inputFile: src/input.ext      # Single input file
    outputFile: dist/output.ext   # Single output file

# Directory-based actions
- action: SomeAction
  options:
    inputDir: src/                # Input directory
    outputDir: dist/              # Output directory
    pattern: "**/*.ext"           # Glob pattern

# Multi-file actions
- action: SomeAction
  options:
    files:                        # Array of files
      - src/file1.ext
      - src/file2.ext
    outDir: dist/
```

### Environment Variables

Use environment variables with the `$&#123;&#123; env.VAR &#125;&#125;` syntax:

```yaml
- action: TypeScriptCompilerAction
  options:
    tsconfig: $&#123;&#123; env.TSCONFIG_PATH &#125;&#125;
```

## Plugin Discovery

### Finding Plugins

1. **Official plugins**: Check the [Plugins List](/plugins/)
2. **npm search**: Search for `@getkist/action-` packages
3. **GitHub**: Search for `kist-plugin-*` repositories

### Verifying Compatibility

Check the plugin's `package.json` for peer dependencies:

```json
{
  "peerDependencies": {
    "@getkist/kist": "^0.1.0"
  }
}
```

## Troubleshooting

### Plugin Not Found

```
Error: Plugin '@getkist/action-example' not found
```

**Solutions:**
1. Verify the plugin is installed: `npm ls @getkist/action-example`
2. Check the package name is correct
3. Run `npm install` to ensure dependencies are installed

### Action Not Found

```
Error: Action 'SomeAction' not found
```

**Solutions:**
1. Check the plugin is listed in `kist.yml` plugins section
2. Verify the action name (case-sensitive)
3. Check the plugin documentation for correct action names

### Version Conflicts

If you see peer dependency warnings:

```bash
# Check kist version
npx kist --version

# Update plugins to compatible versions
npm update @getkist/action-sass
```

## Best Practices

### Organize Large Projects

```yaml
# For large projects, group related stages
plugins:
  - @getkist/action-sass
  - @getkist/action-postcss
  - @getkist/action-typescript
  - @getkist/action-terser
  - @getkist/action-eslint
  - @getkist/action-prettier
  - @getkist/action-jest

pipeline:
  build:
    stages:
      # Lint stage runs first
      - name: lint
        steps:
          - action: LintAction
          - action: PrettierAction
            options:
              check: true
              
      # Build stages
      - name: styles
        steps:
          - action: StyleProcessingAction
          - action: PostCssAction
          
      - name: scripts
        steps:
          - action: TypeScriptCompilerAction
          - action: JavaScriptMinifyAction
          
      # Test stage runs last
      - name: test
        steps:
          - action: JestAction
```

### Watch Mode

Use the `--watch` flag for development:

```bash
npx kist run build --watch
```

Many plugins support incremental builds in watch mode.

### CI/CD Integration

```yaml
# .github/workflows/build.yml
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

## Next Steps

- [Plugin Development](/guide/plugin-development) - Create your own plugin
- [Configuration Reference](/guide/configuration) - Full YAML reference
- Browse [Individual Plugins](/plugins/) for specific documentation
