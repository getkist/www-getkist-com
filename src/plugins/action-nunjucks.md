# @getkist/action-nunjucks

Nunjucks template rendering with data support.

## Installation

```bash
npm install --save-dev @getkist/action-nunjucks
```

## Actions

### TemplateRenderAction

Renders Nunjucks templates to HTML or other formats.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `inputFile` | `string` | Required | Path to template file |
| `outputFile` | `string` | Required | Path to output file |
| `data` | `object` | `{}` | Data to pass to template |
| `dataFile` | `string` | - | JSON/YAML file with data |
| `templatesDir` | `string` | - | Directory for includes |
| `autoescape` | `boolean` | `true` | HTML auto-escaping |

#### Basic Usage

```yaml
plugins:
  - @getkist/action-nunjucks

pipeline:
  build:
    stages:
      - name: html
        steps:
          - action: TemplateRenderAction
            options:
              inputFile: src/templates/index.njk
              outputFile: dist/index.html
```

#### With Inline Data

```yaml
- action: TemplateRenderAction
  options:
    inputFile: src/templates/index.njk
    outputFile: dist/index.html
    data:
      title: "My Website"
      version: "1.0.0"
      features:
        - Fast
        - Modern
        - Simple
```

#### With Data File

Create `data.json`:

```json
{
  "title": "My Website",
  "navigation": [
    { "name": "Home", "url": "/" },
    { "name": "About", "url": "/about" }
  ]
}
```

Use it:

```yaml
- action: TemplateRenderAction
  options:
    inputFile: src/templates/index.njk
    outputFile: dist/index.html
    dataFile: src/data/site.json
```

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

```yaml
plugins:
  - @getkist/action-nunjucks

pipeline:
  build:
    stages:
      - name: pages
        steps:
          - action: TemplateRenderAction
            options:
              inputFile: src/templates/index.njk
              outputFile: dist/index.html
              dataFile: src/data/home.json
              
          - action: TemplateRenderAction
            options:
              inputFile: src/templates/about.njk
              outputFile: dist/about.html
              dataFile: src/data/about.json
              
          - action: TemplateRenderAction
            options:
              inputFile: src/templates/contact.njk
              outputFile: dist/contact.html
              dataFile: src/data/contact.json
```

## With Environment Variables

```yaml
- action: TemplateRenderAction
  options:
    inputFile: src/templates/index.njk
    outputFile: dist/index.html
    data:
      apiUrl: $&#123;&#123; env.API_URL &#125;&#125;
      version: $&#123;&#123; env.VERSION &#125;&#125;
```

## Project Structure

Recommended structure:

```
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
{{ date | date("YYYY-MM-DD") }}
{{ items | join(", ") }}
{{ content | safe }}
```
:::

## Links

- [npm](https://npmjs.com/package/@getkist/action-nunjucks)
- [GitHub](https://github.com/getkist/action-nunjucks)
- [Changelog](https://github.com/getkist/action-nunjucks/blob/main/CHANGELOG.md)
- [Nunjucks documentation](https://mozilla.github.io/nunjucks/)
