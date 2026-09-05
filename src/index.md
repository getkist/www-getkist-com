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
      details: Extend functionality with official and community plugins. Installed plugins are discovered automatically — no wiring needed.
    - icon: 🔄
      title: Pipeline System
      details: Modular stages and steps with dependency-aware scheduling, concurrency limits, and per-stage timeouts.
    - icon: ⚡
      title: Live Reload
      details: Built-in dev server with file watching and automatic pipeline restarts via the --live flag.
    - icon: 📦
      title: TypeScript First
      details: Native TypeScript support with full type definitions out of the box.
    - icon: 🛠️
      title: Highly Configurable
      details: YAML-based configuration with config inheritance, caching, and per-environment overrides.
    - icon: 🛡️
      title: Fail-fast Validation
      details: Configuration is validated at startup — typos in actions, stages, and dependencies are caught before anything runs.
---

<div class="vp-doc" style="padding: 2rem;">

## Quick Install

```bash
# Install globally
npm install -g kist

# Or as a dev dependency
npm install --save-dev kist
```

Requires Node.js 22 or later.

## Quick Start

Create a `kist.yml` in your project root, then run:

```bash
# Uses kist.yaml or kist.yml from the current directory
kist

# Or point at a specific config file
kist --config kist.production.yml
```

## Official Plugins

Install a plugin as a dev dependency and its actions are available in your pipeline immediately — no configuration required.

| Plugin                                                                             | Description                            |
| ---------------------------------------------------------------------------------- | -------------------------------------- |
| [@getkist/action-sass](https://npmjs.com/package/@getkist/action-sass)             | SCSS/Sass compilation with source maps |
| [@getkist/action-postcss](https://npmjs.com/package/@getkist/action-postcss)       | PostCSS processing with autoprefixer   |
| [@getkist/action-typescript](https://npmjs.com/package/@getkist/action-typescript) | TypeScript compilation                 |
| [@getkist/action-eslint](https://npmjs.com/package/@getkist/action-eslint)         | ESLint code linting                    |
| [@getkist/action-prettier](https://npmjs.com/package/@getkist/action-prettier)     | Prettier code formatting               |
| [@getkist/action-jest](https://npmjs.com/package/@getkist/action-jest)             | Jest test runner                       |
| [@getkist/action-terser](https://npmjs.com/package/@getkist/action-terser)         | JavaScript minification                |
| [@getkist/action-tsup](https://npmjs.com/package/@getkist/action-tsup)             | Bundle with tsup (esbuild)             |
| [@getkist/action-svg](https://npmjs.com/package/@getkist/action-svg)               | SVG sprite generation                  |
| [@getkist/action-nunjucks](https://npmjs.com/package/@getkist/action-nunjucks)     | Nunjucks template rendering            |

[View all plugins →](/plugins/)

## Example Configuration

```yaml
options:
    logLevel: info
    haltOnFailure: true

stages:
    - name: Styles
      steps:
          - name: CompileScss
            action: StyleProcessingAction
            options:
                inputFile: ./src/styles/main.scss
                outputFile: ./dist/css/main.css
                styleOption: compressed

    - name: Scripts
      steps:
          - name: CompileTypeScript
            action: TypeScriptCompilerAction
            options:
                tsconfigPath: ./tsconfig.json
```

[Learn more about configuration →](/guide/configuration)

</div>

<p align="center">
  <b>Made with ❤️ by <a href="https://www.scape.press" target="_blank">Scape Press</a></b>
</p>
