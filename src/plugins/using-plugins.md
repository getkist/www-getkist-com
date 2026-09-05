# Using Plugins

Learn how to discover, install, and use kist plugins.

## Installing Plugins

### From npm

Most kist plugins are published to npm with the `@getkist/` scope:

```bash
# Install a single plugin
npm install --save-dev @getkist/action-sass

# Install multiple plugins at once
npm install --save-dev @getkist/action-sass @getkist/action-typescript @getkist/action-eslint
```

## Automatic Discovery

Plugins are **not** declared in `kist.yml`. On startup, kist scans your project's `node_modules` for packages whose names match one of these prefixes:

- `@getkist/action-*` - official plugins
- `kist-action-*` - unscoped community plugins
- `kist-plugin-*` - unscoped community plugins (legacy prefix)

Every matching package is loaded, and the actions it registers become available to your pipeline steps by name:

```yaml
stages:
    - name: Styles
      steps:
          - name: CompileStyles
            action: StyleProcessingAction   # provided by @getkist/action-sass
            options:
                inputFile: ./src/styles/main.scss
                outputFile: ./dist/css/main.css
                styleOption: compressed
```

Plugins can also be loaded from a local directory or registered programmatically via `PluginManager.registerPlugin()` - see the [Plugin Development Guide](/guide/plugin-development).

## Core Actions

Some actions are built into kist and don't require plugins:

| Action | Description |
| --- | --- |
| `DirectoryCleanAction` | Clean a directory |
| `DirectoryCopyAction` | Copy a directory |
| `DirectoryCreateAction` | Create a directory |
| `DocumentationAction` | Generate documentation |
| `FileCopyAction` | Copy a file |
| `FileRenameAction` | Rename a file |
| `PackageManagerAction` | Run package manager commands |
| `RunScriptAction` | Run a script |
| `TypeScriptCompilerAction` | Compile TypeScript |
| `VersionWriteAction` | Write version information |

## Plugin Options

Each plugin's actions accept specific options, passed via the step's `options` key. See the individual plugin docs for details.

### Common Patterns

Most plugin actions follow one of these conventions:

```yaml
stages:
    - name: Build
      steps:
          # File-based actions: single input, single output
          - name: CompileStyles
            action: StyleProcessingAction
            options:
                inputFile: ./src/styles/main.scss
                outputFile: ./dist/css/main.css
                styleOption: compressed

          # Directory-based actions: input and output directories
          - name: RenderTemplates
            action: TemplateRenderAction
            options:
                inputDir: ./src/templates
                outputDir: ./dist
                pattern: "**/*.html.jinja"

          # Multi-file actions: an array of files or glob patterns
          - name: LintSources
            action: LintAction
            options:
                targetFiles:
                    - "src/**/*.ts"
```

## Plugin Discovery

### Finding Plugins

1. **Official plugins**: Check the [Plugins List](/plugins/)
2. **npm search**: Search for `@getkist/action-` packages
3. **GitHub**: Search for `kist-action-*` repositories

### Verifying Compatibility

Check the plugin's `package.json` for peer dependencies:

```json
{
  "peerDependencies": {
    "kist": ">=0.1.0"
  }
}
```

## Troubleshooting

### Action Not Found

```text
Error: Action 'SomeAction' not found
```

kist validates the config at startup (after plugin discovery), so a step referencing an unregistered action fails fast.

**Solutions:**

1. Verify the plugin is installed in the project: `npm ls @getkist/action-example`
2. Check the package name matches a discovery prefix (`@getkist/action-*`, `kist-action-*`, `kist-plugin-*`)
3. Verify the action name in your step (case-sensitive)
4. Run `npm install` to ensure dependencies are installed
5. Run `kist --verbose` to see which plugins were discovered

### Version Conflicts

If you see peer dependency warnings:

```bash
# Check the installed kist version
npm ls kist

# Update plugins to compatible versions
npm update @getkist/action-sass
```

## Best Practices

### Organize Large Projects

Use stages with `dependsOn` to order work, and `parallel` steps where order doesn't matter:

```yaml
options:
    logLevel: info

stages:
    # Quality checks run first
    - name: Lint
      steps:
          - name: LintSources
            action: LintAction
            options:
                targetFiles:
                    - "src/**/*.ts"

    # Build stages
    - name: Styles
      dependsOn: [Lint]
      steps:
          - name: CompileStyles
            action: StyleProcessingAction
            options:
                inputFile: ./src/styles/main.scss
                outputFile: ./dist/css/main.css
                styleOption: compressed

    - name: Scripts
      dependsOn: [Lint]
      steps:
          - name: CompileTypeScript
            action: TypeScriptCompilerAction
            options:
                tsconfigPath: ./tsconfig.json
          - name: MinifyBundle
            action: JavaScriptMinifyAction
            options:
                inputPath: ./dist/js/index.js
                outputPath: ./dist/js/index.min.js

    # Tests run last
    - name: Test
      dependsOn: [Styles, Scripts]
      steps:
          - name: UnitTests
            action: JestAction
            options:
                coverage: true
```

### Live Reload

Use the `--live` flag during development to serve your output directory and re-run the pipeline on changes:

```bash
npx kist --live
```

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
          node-version: 22
      - run: npm ci
      - run: npx kist
```

## Next Steps

- [Plugin Development](/guide/plugin-development) - Create your own plugin
- [Configuration Reference](/guide/configuration) - Full YAML reference
- Browse [Individual Plugins](/plugins/) for specific documentation
