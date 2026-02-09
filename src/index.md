---
layout: home

hero:
  name: "kist"
  text: "Package Pipeline Processor"
  tagline: "A lightweight build tool with plugin architecture for TypeScript and web projects"
  image:
    src: https://raw.githubusercontent.com/getkist/brand/master/src/logo/kist.png
    alt: kist
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View Plugins
      link: /plugins/
    - theme: alt
      text: GitHub
      link: https://github.com/getkist/kist

features:
  - icon: 🔌
    title: Plugin Architecture
    details: Extend functionality with official and community plugins. Install only what you need.
  - icon: 🔄
    title: Pipeline System
    details: Modular stages and steps for complex build workflows with dependency management.
  - icon: ⚡
    title: Live Reload
    details: Enhanced developer experience with hot reloading and watch mode support.
  - icon: 📦
    title: TypeScript First
    details: Native TypeScript support with full type definitions out of the box.
  - icon: 🛠️
    title: Highly Configurable
    details: YAML-based configuration with sensible defaults and extensive customization.
  - icon: 🚀
    title: Zero Config Start
    details: Get started quickly with automatic detection and intelligent defaults.
---

<div class="vp-doc" style="padding: 2rem;">

## Quick Install

```bash
# Install globally
npm install -g kist

# Or as a dev dependency
npm install --save-dev kist
```

## Quick Start

```bash
# Initialize a new kist project
kist init

# Run your build pipeline
kist --config kist.yml
```

## Official Plugins

| Plugin | Description |
|--------|-------------|
| [@getkist/action-sass](https://npmjs.com/package/@getkist/action-sass) | SCSS/Sass compilation with source maps |
| [@getkist/action-postcss](https://npmjs.com/package/@getkist/action-postcss) | PostCSS processing with autoprefixer |
| [@getkist/action-typescript](https://npmjs.com/package/@getkist/action-typescript) | TypeScript compilation |
| [@getkist/action-eslint](https://npmjs.com/package/@getkist/action-eslint) | ESLint code linting |
| [@getkist/action-prettier](https://npmjs.com/package/@getkist/action-prettier) | Prettier code formatting |
| [@getkist/action-jest](https://npmjs.com/package/@getkist/action-jest) | Jest test runner |
| [@getkist/action-terser](https://npmjs.com/package/@getkist/action-terser) | JavaScript minification |
| [@getkist/action-tsup](https://npmjs.com/package/@getkist/action-tsup) | Bundle with tsup (esbuild) |
| [@getkist/action-svg](https://npmjs.com/package/@getkist/action-svg) | SVG sprite generation |
| [@getkist/action-nunjucks](https://npmjs.com/package/@getkist/action-nunjucks) | Nunjucks template rendering |

[View all plugins →](/plugins/)

## Example Configuration

```yaml
name: my-project
version: 1.0.0

plugins:
  - @getkist/action-sass
  - @getkist/action-typescript

pipeline:
  build:
    stages:
      - name: styles
        steps:
          - action: StyleProcessingAction
            options:
              inputFile: src/styles/main.scss
              outputFile: dist/css/main.css
              
      - name: scripts
        steps:
          - action: TypeScriptCompilerAction
            options:
              tsconfig: tsconfig.json
```

[Learn more about configuration →](/guide/configuration)

</div>

<p align="center">
  <b>Made with ❤️ by <a href="https://www.scape.agency" target="_blank">Scape Agency</a></b>
</p>
