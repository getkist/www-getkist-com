# Kist Documentation Website

<p align="center">
    <img src="https://raw.githubusercontent.com/getkist/brand/master/src/logo/kist.png" width="20%" alt="kist logo">
</p>

<h1 align='center'>getkist.com</h1>
<h3 align='center'>Documentation Hub for Kist Projects</h3>

---

## Overview

This repository contains the documentation website for all projects under the [getkist organization](https://github.com/getkist). It's built with [VitePress](https://vitepress.dev/), a fast static site generator optimized for documentation.

## Features

- 📚 **Centralized Documentation** - All getkist projects in one place
- 🎨 **Modern Design** - Clean, responsive interface built with VitePress
- 🔍 **Full-text Search** - Find what you need quickly
- ⚡️ **Fast & Static** - Optimized for performance and SEO

## API reference

`src/api/reference/` is generated from the TypeScript sources of the `kist`
package by TypeDoc, and is committed — the deploy workflow checks out only this
repository, so it cannot regenerate the pages itself.

Regenerate after a change to kist's public API or its doc comments:

```bash
# with a kist checkout beside this one, or KIST_REPO pointing at it
npm run sync:api
```

That runs TypeDoc in the kist repository and copies its Markdown here, rewriting
internal links to extensionless site paths and marking every page generated.
Do not edit anything under `src/api/reference/` — change the doc comment in kist
and re-run.

## Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/getkist/www-getkist-com.git
cd www-getkist-com

# Install dependencies
npm install

# Start development server
npm run docs:dev
```

Visit `http://localhost:5173` to view the site.

## Available Scripts

```bash
# Start development server
npm run docs:dev

# Build for production
npm run docs:build

# Preview production build
npm run docs:preview

# Format / lint TypeScript sources
npm run format
npm run lint
```

> **Note:** `package.json` also defines `npm run sync:docs`, which points to
> `scripts/sync-docs.js`. That script is not currently present in the
> repository, so the command fails; project documentation under
> `src/projects/` is maintained manually for now.

## Documentation Structure

```text
src/
├── .vitepress/          # VitePress configuration
│   └── config.js        # Site configuration
├── guide/               # User guides
│   ├── getting-started.md
│   ├── installation.md
│   ├── configuration.md
│   ├── architecture.md
│   ├── core-actions.md
│   ├── plugin-development.md
│   ├── best-practices.md
│   └── contributing.md
├── api/                 # API reference
│   ├── index.md         # Programmatic API
│   └── cli.md           # CLI reference
├── plugins/             # Plugin docs (index, using-plugins, action-*.md)
├── projects/            # Per-project doc trees (maintained manually)
├── media/               # Media assets
├── public/              # Static files served as-is (CNAME, ...)
├── contributing.md      # Contributing guide
└── index.md             # Homepage
```

## Adding Documentation

1. Create markdown files in the appropriate directory under `src/`
2. Update `src/.vitepress/config.js` to add navigation links
3. Use frontmatter for page metadata

Example:

```markdown
---
layout: doc
title: Your Page Title
---

# Your Content Here
```

See [SETUP.md](SETUP.md) for the full workflow and [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for a terse command crib.

## Deployment

A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the site and deploys it to GitHub Pages on pushes to `main`/`dev`. The built site (in `src/.vitepress/dist`) can also be deployed to any static hosting service (Vercel, Netlify, Cloudflare Pages, AWS S3, etc.). Details in [SETUP.md](SETUP.md).

## Contributing

We welcome contributions! Please see our [Contributing Guide](src/contributing.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm run docs:dev`
5. Submit a pull request

## Technology Stack

- [VitePress](https://vitepress.dev/) - Static site generator
- [Vue 3](https://vuejs.org/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool

## Support

- 📖 [Documentation](https://www.getkist.com/)
- 💬 [Discussions](https://github.com/getkist/www-getkist-com/discussions)
- 🐛 [Issues](https://github.com/getkist/www-getkist-com/issues)
- 🔗 [GitHub Organization](https://github.com/getkist)

## License

MIT License - see LICENSE file for details

---

<p align="center">
    <b>Made with ❤️ by <a href="https://www.scape.press" target="_blank">Scape Press</a></b>
</p>
