# @getkist/action-nunjucks

Nunjucks template rendering with data support.

## Installation

```bash
npm install --save-dev @getkist/action-nunjucks
```

Installed plugins are discovered automatically - no configuration needed. The action below becomes available to your pipeline steps by name.

## Actions

### TemplateRenderAction

Renders Nunjucks/Jinja2 templates to HTML or other formats. Two mutually exclusive modes are supported:

- **Single-file mode**: `templatePath` + `outputPath`
- **Directory mode**: `inputDir` + `outputDir` (batch-renders every matching template, mirroring the folder structure)

#### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `templatePath` | `string` | Required* | Single template file to render (single-file mode) |
| `outputPath` | `string` | Required* | Output file path (single-file mode) |
| `inputDir` | `string` | Required* | Directory containing templates (directory mode) |
| `outputDir` | `string` | Required* | Output directory (directory mode) |
| `pattern` | `string` | `"**/*.html.jinja"` | Glob pattern for matching templates (directory mode) |
| `excludePatterns` | `string[]` | `[]` | Patterns to exclude, e.g. `["_*", "includes/**"]` (directory mode) |
| `stripExtension` | `string` | `".jinja"` | Extension stripped from output filenames (directory mode) |
| `context` | `object` | `{}` | Inline data merged into the template context (wins over `contextFiles`) |
| `contextFiles` | `string[]` | - | JSON/YAML files merged into the context, in order |
| `searchPaths` | `string[]` | Template dir / `inputDir` | Directories searched for included and extended templates |
| `autoescape` | `boolean` | `false` | Enable Nunjucks autoescaping of variable output |
| `trimBlocks` | `boolean` | `false` | Strip the first newline after a block tag |
| `lstripBlocks` | `boolean` | `false` | Strip leading whitespace up to a block tag |
| `outputEncoding` | `string` | `"utf8"` | Encoding used when writing output files |

\* Use either `templatePath` + `outputPath` (single-file mode) or `inputDir` + `outputDir` (directory mode).

#### Basic Usage

```yaml
stages:
    - name: Html
      steps:
          - name: RenderIndex
            action: TemplateRenderAction
            options:
                templatePath: ./src/templates/index.njk
                outputPath: ./dist/index.html
```

#### With Inline Data

```yaml
stages:
    - name: Html
      steps:
          - name: RenderIndex
            action: TemplateRenderAction
            options:
                templatePath: ./src/templates/index.njk
                outputPath: ./dist/index.html
                context:
                    title: "My Website"
                    version: "1.0.0"
                    features:
                        - Fast
                        - Modern
                        - Simple
```

#### With Data Files

Create `src/data/site.json`:

```json
{
  "title": "My Website",
  "navigation": [
    { "name": "Home", "url": "/" },
    { "name": "About", "url": "/about" }
  ]
}
```

Use it (files are merged in order; inline `context` values win):

```yaml
stages:
    - name: Html
      steps:
          - name: RenderIndex
            action: TemplateRenderAction
            options:
                templatePath: ./src/templates/index.njk
                outputPath: ./dist/index.html
                contextFiles:
                    - ./src/data/site.json
```

#### Directory Mode

Render an entire template tree in one step:

```yaml
stages:
    - name: Html
      steps:
          - name: RenderSite
            action: TemplateRenderAction
            options:
                inputDir: ./src/templates
                outputDir: ./dist
                pattern: "**/*.html.jinja"
                excludePatterns: ["_*", "includes/**"]
                contextFiles: ["./src/data/site.yaml"]
                autoescape: true
```

With the default `stripExtension: ".jinja"`, `pages/about.html.jinja` renders to `pages/about.html`.

## Template Syntax

### Variables

::: raw

```html
<title>{{ title }}</title>
<p>Welcome to {{ site.name }}</p>
```

:::

### Loops

::: raw

```html
<nav>
  {% for item in navigation %}
    <a href="{{ item.url }}">{{ item.name }}</a>
  {% endfor %}
</nav>
```

:::

### Conditionals

::: raw

```html
{% if user.isLoggedIn %}
  <p>Welcome, {{ user.name }}!</p>
{% else %}
  <a href="/login">Log in</a>
{% endif %}
```

:::

### Includes

::: raw

```html
{% include "partials/header.njk" %}
<main>{{ content }}</main>
{% include "partials/footer.njk" %}
```

:::

### Template Inheritance

Base template (`base.njk`):

::: raw

```html
<!DOCTYPE html>
<html>
<head>
  <title>{% block title %}Default{% endblock %}</title>
</head>
<body>
  {% block content %}{% endblock %}
</body>
</html>
```

:::

Child template:

::: raw

```html
{% extends "base.njk" %}

{% block title %}Home{% endblock %}

{% block content %}
  <h1>Welcome</h1>
{% endblock %}
```

:::

## Multiple Pages

Render several single files, or prefer directory mode for larger sites:

```yaml
stages:
    - name: Pages
      steps:
          - name: RenderHome
            action: TemplateRenderAction
            options:
                templatePath: ./src/templates/index.njk
                outputPath: ./dist/index.html
                contextFiles: ["./src/data/home.json"]

          - name: RenderAbout
            action: TemplateRenderAction
            options:
                templatePath: ./src/templates/about.njk
                outputPath: ./dist/about.html
                contextFiles: ["./src/data/about.json"]
```

## Project Structure

Recommended structure:

```text
src/
├── templates/
│   ├── base.njk
│   ├── index.njk
│   ├── about.njk
│   └── partials/
│       ├── header.njk
│       ├── footer.njk
│       └── nav.njk
└── data/
    ├── site.json
    ├── home.json
    └── about.json
```

## Filters

Nunjucks includes built-in filters:

::: raw

```html
{{ title | upper }}
{{ description | truncate(100) }}
{{ items | join(", ") }}
{{ content | safe }}
```

:::

## Links

- [npm](https://npmjs.com/package/@getkist/action-nunjucks)
- [GitHub](https://github.com/getkist/kist-action-nunjucks)
- [Nunjucks documentation](https://mozilla.github.io/nunjucks/)
