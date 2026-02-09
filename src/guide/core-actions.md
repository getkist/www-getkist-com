# Core Actions

Kist includes several built-in actions that handle common file and directory operations. These core actions are always available without installing any plugins.

## Overview

| Action | Description |
|--------|-------------|
| `directory_clean` | Remove contents of a directory |
| `directory_copy` | Copy a directory recursively |
| `directory_create` | Create a new directory |
| `file_copy` | Copy a file |
| `file_rename` | Rename or move a file |
| `template_render` | Render a template file |
| `version_write` | Write version information to a file |

## directory_clean

Removes all contents from a specified directory, optionally preserving certain files or directories.

### Configuration

```yaml
actions:
  - name: directory_clean
    path: dist
    preserve:
      - .gitkeep
      - README.md
```

### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `path` | string | Yes | Directory path to clean |
| `preserve` | string[] | No | Files/directories to preserve |

### Examples

**Clean build directory:**
```yaml
- name: directory_clean
  path: dist
```

**Clean but preserve certain files:**
```yaml
- name: directory_clean
  path: build
  preserve:
    - .gitkeep
    - config.json
```

---

## directory_copy

Recursively copies a directory and its contents to a new location.

### Configuration

```yaml
actions:
  - name: directory_copy
    source: src/assets
    destination: dist/assets
```

### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `source` | string | Yes | Source directory path |
| `destination` | string | Yes | Destination directory path |
| `overwrite` | boolean | No | Overwrite existing files (default: true) |
| `filter` | string | No | Glob pattern to filter files |

### Examples

**Copy assets directory:**
```yaml
- name: directory_copy
  source: src/assets
  destination: dist/assets
```

**Copy with filter:**
```yaml
- name: directory_copy
  source: resources
  destination: dist/resources
  filter: "**/*.{png,jpg,svg}"
```

---

## directory_create

Creates a new directory, including any necessary parent directories.

### Configuration

```yaml
actions:
  - name: directory_create
    path: dist/js/modules
```

### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `path` | string | Yes | Directory path to create |

### Examples

**Create single directory:**
```yaml
- name: directory_create
  path: output
```

**Create nested directories:**
```yaml
- name: directory_create
  path: dist/assets/images/icons
```

---

## file_copy

Copies a single file to a new location.

### Configuration

```yaml
actions:
  - name: file_copy
    source: config/default.json
    destination: dist/config.json
```

### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `source` | string | Yes | Source file path |
| `destination` | string | Yes | Destination file path |
| `overwrite` | boolean | No | Overwrite if exists (default: true) |

### Examples

**Copy configuration file:**
```yaml
- name: file_copy
  source: src/config.example.json
  destination: dist/config.json
```

**Copy without overwriting:**
```yaml
- name: file_copy
  source: defaults/settings.json
  destination: user/settings.json
  overwrite: false
```

---

## file_rename

Renames or moves a file to a new location.

### Configuration

```yaml
actions:
  - name: file_rename
    source: temp/output.tmp
    destination: dist/bundle.js
```

### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `source` | string | Yes | Current file path |
| `destination` | string | Yes | New file path |
| `overwrite` | boolean | No | Overwrite if exists (default: false) |

### Examples

**Simple rename:**
```yaml
- name: file_rename
  source: output.tmp
  destination: output.js
```

**Move to different directory:**
```yaml
- name: file_rename
  source: build/app.js
  destination: dist/app.min.js
  overwrite: true
```

---

## template_render

Renders a template file using variable substitution. Supports multiple template formats.

### Configuration

```yaml
actions:
  - name: template_render
    source: templates/index.html.tpl
    destination: dist/index.html
    variables:
      title: My Application
      version: 1.0.0
```

### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `source` | string | Yes | Template file path |
| `destination` | string | Yes | Output file path |
| `variables` | object | No | Variables for substitution |
| `engine` | string | No | Template engine (default: auto-detect) |

### Template Syntax

**Basic variable substitution:**
```html
<!-- Template: index.html.tpl -->
<!DOCTYPE html>
<html>
<head>
  <title>{{ title }}</title>
</head>
<body>
  <h1>Version {{ version }}</h1>
</body>
</html>
```

### Examples

**HTML template:**
```yaml
- name: template_render
  source: src/index.html.tpl
  destination: dist/index.html
  variables:
    title: My App
    description: A sample application
    version: "{{ project.version }}"
```

**Configuration template:**
```yaml
- name: template_render
  source: config.json.tpl
  destination: dist/config.json
  variables:
    apiUrl: https://api.example.com
    debug: false
```

**Using project variables:**
```yaml
project:
  name: my-project
  version: 2.0.0

actions:
  - name: template_render
    source: version.txt.tpl
    destination: dist/version.txt
    variables:
      name: "{{ project.name }}"
      version: "{{ project.version }}"
      buildDate: "{{ now | date('YYYY-MM-DD') }}"
```

---

## version_write

Writes version information to a file in various formats.

### Configuration

```yaml
actions:
  - name: version_write
    destination: dist/version.json
    format: json
```

### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `destination` | string | Yes | Output file path |
| `format` | string | No | Output format: `json`, `text`, `js` (default: `json`) |
| `version` | string | No | Version to write (default: project.version) |
| `include` | string[] | No | Additional fields to include |

### Output Formats

**JSON (default):**
```json
{
  "version": "1.2.3",
  "buildTime": "2024-01-15T10:30:00Z"
}
```

**Text:**
```
1.2.3
```

**JavaScript:**
```javascript
export const VERSION = '1.2.3';
export const BUILD_TIME = '2024-01-15T10:30:00Z';
```

### Examples

**JSON version file:**
```yaml
- name: version_write
  destination: dist/version.json
  format: json
```

**Text version file:**
```yaml
- name: version_write
  destination: VERSION.txt
  format: text
```

**JavaScript constants:**
```yaml
- name: version_write
  destination: src/version.ts
  format: js
  include:
    - buildTime
    - gitCommit
```

**Custom version:**
```yaml
- name: version_write
  destination: dist/version.json
  version: "2.0.0-beta.1"
  format: json
```

---

## Combining Core Actions

Core actions can be combined to create powerful build pipelines:

```yaml
project:
  name: my-app
  version: 1.0.0

actions:
  # Clean output directory
  - name: directory_clean
    path: dist

  # Create directory structure
  - name: directory_create
    path: dist/assets

  # Copy static assets
  - name: directory_copy
    source: src/assets
    destination: dist/assets

  # Copy configuration
  - name: file_copy
    source: config/production.json
    destination: dist/config.json

  # Render HTML template
  - name: template_render
    source: src/index.html.tpl
    destination: dist/index.html
    variables:
      title: "{{ project.name }}"
      version: "{{ project.version }}"

  # Write version file
  - name: version_write
    destination: dist/version.json
    format: json
```

## Next Steps

- Learn about [plugin actions](/plugins/) for more advanced functionality
- Configure [action groups](/guide/configuration#action-groups) for organized workflows
- See [configuration inheritance](/guide/configuration#config-inheritance) for reusable configs
