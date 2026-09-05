# Best Practices

Guidelines and best practices for using kist effectively.

## General Guidelines

### Keep Dependencies Updated

Regularly update kist and its plugins to get the latest features, improvements, and security fixes:

```bash
npm update kist
npm update @getkist/action-sass @getkist/action-eslint
```

kist is a 0.x tool under active development, so review the changelog when updating.

### Start Small

Begin with a minimal `kist.yml` — a single stage with a few steps — and grow it as your build does:

```yaml
stages:
    - name: Build
      steps:
          - name: CompileTypeScript
            action: TypeScriptCompilerAction
            options:
                tsconfigPath: "./tsconfig.json"
```

### Read the Action Documentation

Each action has its own options. Check the [core actions reference](/guide/core-actions) and each plugin's documentation before use — kist validates action names at startup, but option values are checked by the action itself.

## Configuration

### Name Everything Clearly

Stage and step names must be unique (kist rejects duplicates at startup), and they appear in logs — use descriptive names like `CompileTypeScript` or `CopyStaticAssets` rather than `step1`.

### Model Ordering with dependsOn

Don't rely on the order of stages in the file — declare dependencies explicitly so kist can schedule correctly and run independent stages concurrently:

```yaml
stages:
    - name: Clean
      steps:
          - name: CleanDist
            action: DirectoryCleanAction
            options:
                dirPath: "./dist"

    - name: Compile
      dependsOn:
          - Clean
      steps:
          - name: CompileTypeScript
            action: TypeScriptCompilerAction
            options:
                tsconfigPath: "./tsconfig.json"
```

### Share Configuration with extends

For build variants (development vs. production, multiple packages), keep a base config and extend it instead of duplicating stages:

```yaml
# kist.production.yml
extends: ./kist.yml

options:
    mode: production
    logLevel: warn
```

Run a variant with `kist --config kist.production.yml`. Remember how merging works: `metadata` and `options` are deep-merged (child wins), and stages are merged **by name** — a child stage with the same name replaces the parent stage entirely.

### Use metadata for Documentation

The optional `metadata` block (name, version, description, author, tags) is informational — use it to make configs self-describing for teammates.

## Performance

### Enable Caching

Turn on the build cache so actions that support it can skip unchanged inputs:

```yaml
options:
    cache:
        enabled: true
        cacheDir: ".kist-cache"
        persistent: true
```

Actions like `FileCopyAction` opt in per step with `useCache: true`. Add the cache directory to `.gitignore`.

### Parallelize Where Safe

Independent stages already run concurrently (capped by `performance.maxConcurrentStages`). Within a stage, set `parallel: true` when steps don't depend on each other's output:

```yaml
options:
    performance:
        maxConcurrentStages: 4
        maxConcurrentSteps: 8

stages:
    - name: CopyAssets
      parallel: true
      steps:
          - name: CopyImages
            action: DirectoryCopyAction
            options:
                srcDir: "./src/images"
                destDir: "./dist/images"

          - name: CopyFonts
            action: DirectoryCopyAction
            options:
                srcDir: "./src/fonts"
                destDir: "./dist/fonts"
```

Keep steps sequential (the default) when one step consumes what a previous step produced.

## Error Handling

### Keep haltOnFailure On

The default `haltOnFailure: true` stops the pipeline and exits with code 1 on the first failure — that's what you want in CI. Only set `haltOnFailure: false` for exploratory runs where you want every failure logged in one pass; note that kist then exits 0 even when steps failed.

### Debug with --verbose

When a step misbehaves, re-run with debug logging:

```bash
kist --verbose
```

Or set it in config with `options.logLevel: debug`.

## Development Workflow

### Use Live Reload for Front-End Work

For iterative development, enable live reload instead of re-running builds by hand:

```bash
kist --live
```

Configure the served root, port, and watched paths under `options.live`. Keep `node_modules/**` in `ignoredPaths` to avoid rebuild storms.

### Wire kist into npm Scripts

Give the team one entry point:

```json
{
    "scripts": {
        "build": "kist",
        "build:prod": "kist --config kist.production.yml"
    }
}
```

## Security

### Keep Dependencies Secure

- Regularly audit dependencies with `npm audit`
- Update packages with security fixes
- Install only plugins you trust — discovered plugins run with your build's permissions

### Protect Sensitive Data

- Never commit secrets to `kist.yml` or scripts it runs
- Use environment variables for credentials
- Rotate credentials regularly

## Collaboration

### Version Control

- Commit `kist.yml` (and any `extends` parents) with the project
- Ignore generated output and `.kist-cache/`
- Write clear commit messages and keep commits atomic

### Documentation

- Comment non-obvious steps in your config
- Document required plugins in the project README
- Keep `metadata` up to date

## Getting Help

If you encounter issues:

1. Re-run with `--verbose` and read the failing step's log output
2. Check the [configuration reference](/guide/configuration) and [core actions](/guide/core-actions)
3. Search existing [GitHub issues](https://github.com/getkist/kist/issues)
4. Create a new issue with your `kist.yml` and environment details

## Contributing

Help improve kist! See our [contributing guide](/contributing) for details.
