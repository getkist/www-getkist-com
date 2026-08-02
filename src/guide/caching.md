# Caching

kist skips steps whose inputs have not changed. A skipped step restores the
files it produced last time and replays the output it printed, so a cached run
reads the same as a real one — only faster.

## Turning it on

Caching is off by default. Enable it globally, then declare inputs on the steps
that should participate:

```yaml
options:
    cache:
        enabled: true

stages:
    - name: build
      steps:
          - name: compile
            action: TypeScriptCompilerAction
            inputs:
                - "src/**/*.ts"
                - "tsconfig.json"
            outputs:
                - "dist/**"
            options:
                tsConfigPath: "./tsconfig.json"
                outputDir: "./dist"
```

Run it twice. The second run prints:

```
[INFO] [Step] Step "compile" is up to date (cache hit), replaying output.
[INFO] [Pipeline] All 1 cacheable step(s) were up to date.
```

## A step with no `inputs` always runs

This is deliberate. kist will not guess what a step reads, because guessing
wrong means silently skipping work that should have happened. Declaring
`inputs` is how you opt a step in.

## What the cache key covers

A step is skipped only when every one of these is unchanged since the recorded
run:

| Part of the key | Why it is included |
| --- | --- |
| The action name | A different action is different work |
| The step's `options` | Key order is ignored; values are not |
| The contents of every file matched by `inputs` | Content, not timestamps — touching a file does not invalidate it |
| The values of the variables named in `env` | See below |
| The Node major version | Output can legitimately differ across runtimes |

Note what is *not* in the key: anything you did not declare. A step that reads a
file it never listed in `inputs` will be skipped when that file changes. If a
step's result depends on something, declare it.

### Environment variables

Only the variables a step names are part of its key:

```yaml
- name: compile
  action: TypeScriptCompilerAction
  inputs: ["src/**/*.ts"]
  env: ["NODE_ENV"]
```

Without `env`, changing `NODE_ENV` will not re-run the step. With it, it will.

## Outputs

`outputs` are archived on a miss and restored on a hit:

```yaml
outputs:
    - "dist/**"
```

Outputs are stored under `.kist-cache/steps/<hash>/`, as paths relative to the
project root. A step may declare no outputs — it will still be skipped on a hit,
there is simply nothing to restore. Files outside the project root are never
archived, because restoring them later would write outside your workspace.

Add `.kist-cache/` to `.gitignore`.

## Turning it off

| Scope | How |
| --- | --- |
| One run | `kist --no-cache` |
| One stage | `cacheEnabled: false` on the stage |
| Everything | `options.cache.enabled: false`, or omit the block |
| Discard what is stored | `kist clear-cache` |

## Sharing the cache in CI

kist's cache is a plain directory, so any CI cache action can carry it between
runs. On GitHub Actions:

```yaml
- name: Restore the kist cache
  uses: actions/cache@v4
  with:
      path: .kist-cache
      # Any change to a source file or to the pipeline itself produces a new
      # key; the restore-keys line then falls back to the most recent cache so
      # unchanged steps still hit.
      key: kist-${{ runner.os }}-${{ hashFiles('src/**', 'kist.yml') }}
      restore-keys: |
          kist-${{ runner.os }}-

- name: Build
  run: npx kist
```

The same pattern works with GitLab's `cache:paths`, CircleCI's `save_cache`, and
anything else that persists a directory.

Two things to keep in mind:

- **The Node major version is part of every key.** A matrix that builds on more
  than one Node version will not share entries between them. That is correct —
  the outputs may genuinely differ — but it does mean one cache per version.
- **Restoring a cache is not free.** For a pipeline of fast steps, downloading
  and unpacking the archive can cost more than re-running the work. Measure
  before assuming it helps.

## Inspecting what is cacheable

`--dry-run` marks every step that would participate:

```bash
kist --dry-run
```

```
  build
    - compile → TypeScriptCompilerAction  [cacheable]
    - copy-readme → FileCopyAction
```

A step you expected to see marked `cacheable` but is not is missing its
`inputs`, sits in a stage with `cacheEnabled: false`, or the cache is off
globally. `kist --dry=json` gives the same information as JSON.
