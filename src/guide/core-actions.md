# Core Actions

kist ships with ten built-in actions that handle common build tasks. These core actions are always available without installing any plugins, and are referenced from steps by their class name.

## Overview

| Action                     | Description                                                           |
| -------------------------- | --------------------------------------------------------------------- |
| `DirectoryCleanAction`     | Delete the contents of a directory, optionally keeping matching files |
| `DirectoryCopyAction`      | Recursively copy a directory and its contents                         |
| `DirectoryCreateAction`    | Create a directory structure under a base path                        |
| `DocumentationAction`      | Generate documentation with an external tool (e.g. JSDoc)             |
| `FileCopyAction`           | Copy one or more files into a destination directory                   |
| `FileRenameAction`         | Rename or move a file                                                 |
| `PackageManagerAction`     | Read a `package.json` and write a filtered/customized copy            |
| `RunScriptAction`          | Run an external JavaScript file with Node.js                          |
| `TypeScriptCompilerAction` | Compile TypeScript using a `tsconfig.json`                            |
| `VersionWriteAction`       | Replace version strings in one or more files                          |

Every step needs a `name`, an `action`, and (usually) `options`:

```yaml
stages:
    - name: Build
      steps:
          - name: CopyLicense
            action: FileCopyAction
            options:
                srcFile: "./LICENSE"
                destDir: "./dist"
```

## DirectoryCleanAction

Deletes all contents of a directory. Files and directories matching the `keep` glob patterns are retained. If the directory does not exist, the action skips gracefully with a warning.

### Options

| Option    | Type     | Required | Description                                               |
| --------- | -------- | -------- | --------------------------------------------------------- |
| `dirPath` | string   | Yes      | Path of the directory to clean                            |
| `keep`    | string[] | No       | Glob patterns (relative to `dirPath`) for entries to keep |

### Examples

**Clean the build directory:**

```yaml
stages:
    - name: Clean
      steps:
          - name: CleanBuildDir
            action: DirectoryCleanAction
            options:
                dirPath: "./build"
```

**Clean but keep certain entries:**

```yaml
stages:
    - name: Clean
      steps:
          - name: CleanBuildDir
            action: DirectoryCleanAction
            options:
                dirPath: "./build"
                keep:
                    - "static-assets/**"
                    - "important-config.json"
                    - "*.log"
```

---

## DirectoryCopyAction

Recursively copies all files and subdirectories from a source directory to a destination directory. The destination is created if it does not exist.

### Options

| Option    | Type   | Required | Description                |
| --------- | ------ | -------- | -------------------------- |
| `srcDir`  | string | Yes      | Source directory path      |
| `destDir` | string | Yes      | Destination directory path |

### Example

```yaml
stages:
    - name: CopyBuildArtifacts
      steps:
          - name: CopyArtifacts
            action: DirectoryCopyAction
            options:
                srcDir: "./build"
                destDir: "./deploy"
```

---

## DirectoryCreateAction

Ensures a set of directories exists under a base path, creating missing directories recursively.

### Options

| Option        | Type     | Required | Description                                        |
| ------------- | -------- | -------- | -------------------------------------------------- |
| `basePath`    | string   | Yes      | Base directory under which directories are created |
| `directories` | string[] | Yes      | Relative paths of the directories to create        |

### Example

```yaml
stages:
    - name: SetupDirectories
      steps:
          - name: EnsureProjectStructure
            action: DirectoryCreateAction
            options:
                basePath: "./project"
                directories:
                    - "src"
                    - "src/assets"
                    - "src/components"
                    - "docs"
                    - "build"
```

---

## DocumentationAction

Generates project documentation by invoking an external command-line generator (such as JSDoc or another tool with a compatible CLI). The tool must be available on the PATH.

### Options

| Option             | Type   | Required | Description                                                           |
| ------------------ | ------ | -------- | --------------------------------------------------------------------- |
| `generatorCommand` | string | No       | Generator executable to run (default: `jsdoc`)                        |
| `sourcePath`       | string | No       | Source path passed to the generator (default: `./src`)                |
| `outputPath`       | string | No       | Output directory for generated docs (default: `./docs`)               |
| `configPath`       | string | No       | Generator config file; when set, it is passed instead of `sourcePath` |

### Example

```yaml
stages:
    - name: GenerateDocumentation
      steps:
          - name: BuildDocumentation
            action: DocumentationAction
            options:
                generatorCommand: "jsdoc"
                sourcePath: "./src"
                outputPath: "./docs"
                configPath: "./jsdoc.json"
```

---

## FileCopyAction

Copies a single file (`srcFile`) or a batch of files (`srcFiles`) into a destination directory. The destination directory is created if needed. Large files are copied with streams, and with `useCache: true` unchanged files are skipped based on kist's file cache.

### Options

| Option     | Type     | Required                | Description                                                 |
| ---------- | -------- | ----------------------- | ----------------------------------------------------------- |
| `srcFile`  | string   | One of the two required | Path of a single source file                                |
| `srcFiles` | string[] | One of the two required | Paths of multiple source files to copy                      |
| `destDir`  | string   | Yes                     | Destination directory                                       |
| `useCache` | boolean  | No                      | Skip files that have not changed since the last cached copy |
| `parallel` | boolean  | No                      | Copy `srcFiles` concurrently instead of sequentially        |

### Examples

**Copy a single file:**

```yaml
stages:
    - name: CopyFiles
      steps:
          - name: CopyMainFile
            action: FileCopyAction
            options:
                srcFile: "./src/files/main.txt"
                destDir: "./dist/files"
```

**Copy multiple files with caching and parallelism:**

```yaml
stages:
    - name: CopyFiles
      steps:
          - name: CopyStaticFiles
            action: FileCopyAction
            options:
                srcFiles:
                    - "./LICENSE"
                    - "./README.md"
                    - "./CHANGELOG.md"
                destDir: "./dist"
                useCache: true
                parallel: true
```

---

## FileRenameAction

Renames (or moves) a file from a source path to a target path.

### Options

| Option       | Type   | Required | Description       |
| ------------ | ------ | -------- | ----------------- |
| `srcPath`    | string | Yes      | Current file path |
| `targetPath` | string | Yes      | New file path     |

### Example

```yaml
stages:
    - name: FileOperations
      steps:
          - name: RenameReadme
            action: FileRenameAction
            options:
                srcPath: "./README_old.md"
                targetPath: "./README.md"
```

---

## PackageManagerAction

Reads an existing `package.json`, optionally extracts only selected fields, merges custom overrides, and writes a new `package.json` into an output directory. Useful for generating a publish-ready `package.json` in `dist/`.

### Options

| Option            | Type     | Required | Description                                                     |
| ----------------- | -------- | -------- | --------------------------------------------------------------- |
| `packageJsonPath` | string   | Yes      | Path to the existing `package.json` to read                     |
| `outputDir`       | string   | Yes      | Directory where the new `package.json` is written               |
| `fields`          | string[] | No       | Fields to copy from the source file (all fields when omitted)   |
| `customConfig`    | object   | No       | Extra fields merged on top of the copied fields (overrides win) |

### Example

```yaml
stages:
    - name: PackageManagement
      steps:
          - name: GeneratePackageJson
            action: PackageManagerAction
            options:
                packageJsonPath: "./package.json"
                outputDir: "./dist"
                fields:
                    - name
                    - version
                    - dependencies
                    - scripts
                customConfig:
                    private: true
                    scripts:
                        start: "node index.js"
```

---

## RunScriptAction

Executes an external JavaScript file with Node.js in a separate process. A non-zero exit or any stderr output fails the step. Use it as an escape hatch for project-specific build logic.

### Options

| Option       | Type     | Required | Description                            |
| ------------ | -------- | -------- | -------------------------------------- |
| `scriptPath` | string   | Yes      | Path to the JavaScript file to execute |
| `args`       | string[] | No       | Arguments passed to the script         |

### Example

```yaml
stages:
    - name: Scripts
      steps:
          - name: RunGenerateScript
            action: RunScriptAction
            options:
                scriptPath: "./scripts/generate.js"
                args:
                    - "--mode=production"
                    - "--verbose"
```

---

## TypeScriptCompilerAction

Compiles TypeScript using the TypeScript compiler API. It loads and parses a `tsconfig.json`, optionally overrides compiler options and the file list, and fails the step when there are compile errors.

### Options

| Option            | Type     | Required | Description                                                         |
| ----------------- | -------- | -------- | ------------------------------------------------------------------- |
| `tsconfigPath`    | string   | No       | Path to `tsconfig.json` (default: `tsconfig.json`)                  |
| `filePaths`       | string[] | No       | Explicit files to compile (defaults to the files from the tsconfig) |
| `outputDir`       | string   | No       | Overrides the compiler's `outDir`                                   |
| `compilerOptions` | object   | No       | Additional compiler options merged over the tsconfig options        |

### Example

```yaml
stages:
    - name: CompileTypeScript
      steps:
          - name: CompileTsToJs
            action: TypeScriptCompilerAction
            options:
                tsconfigPath: "./tsconfig.json"
                outputDir: "./dist"
                compilerOptions:
                    target: "ES2020"
```

---

## VersionWriteAction

Replaces semantic version strings (`x.y.z`) in one or more files. Each file entry may specify a `key` so that only lines starting with that key (for example `version:`) are updated. When `version` is omitted, the version is read from the project's `package.json`.

### Options

| Option    | Type   | Required | Description                                                               |
| --------- | ------ | -------- | ------------------------------------------------------------------------- |
| `files`   | array  | Yes      | List of `{ path, key? }` entries; `key` restricts which lines are updated |
| `version` | string | No       | Version to write (default: `version` from `package.json`)                 |

### Example

```yaml
stages:
    - name: WriteVersion
      steps:
          - name: ReplaceVersionInFiles
            action: VersionWriteAction
            options:
                # Omit `version` to use the version from package.json
                version: "2.0.0"
                files:
                    - path: "./CITATION.cff"
                      key: "version:"
                    - path: "./VERSION"
```

---

## Combining Core Actions

Core actions combine into complete pipelines. Stages declare their ordering with `dependsOn`:

```yaml
metadata:
    name: my-app

stages:
    - name: Clean
      steps:
          - name: CleanDist
            action: DirectoryCleanAction
            options:
                dirPath: "./dist"

    - name: Build
      dependsOn:
          - Clean
      steps:
          - name: CompileTypeScript
            action: TypeScriptCompilerAction
            options:
                tsconfigPath: "./tsconfig.json"

    - name: Finalize
      dependsOn:
          - Build
      parallel: true
      steps:
          - name: CopyAssets
            action: DirectoryCopyAction
            options:
                srcDir: "./src/assets"
                destDir: "./dist/assets"

          - name: CopyLicense
            action: FileCopyAction
            options:
                srcFile: "./LICENSE"
                destDir: "./dist"

          - name: WriteVersion
            action: VersionWriteAction
            options:
                files:
                    - path: "./VERSION"
```

## Next Steps

- Learn about [plugin actions](/plugins/) for Sass, ESLint, Nunjucks, Terser, SVG tooling and more
- See the [configuration reference](/guide/configuration) for stages, options and `extends`
- Read the [architecture guide](/guide/architecture) to understand how stages and steps execute
