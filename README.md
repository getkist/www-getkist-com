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
- 🔄 **Auto-sync** - Automatically pulls documentation from getkist repositories
- 🎨 **Modern Design** - Clean, responsive interface built with VitePress
- 🔍 **Full-text Search** - Find what you need quickly
- ⚡️ **Fast & Static** - Optimized for performance and SEO

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

# Sync documentation from getkist repos
npm run sync:docs

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

# Sync documentation from getkist repositories
npm run sync:docs
```

## Documentation Structure

```
docs/
├── .vitepress/          # VitePress configuration
│   └── config.js        # Site configuration
├── guide/               # User guides
│   ├── getting-started.md
│   ├── installation.md
│   ├── configuration.md
│   ├── architecture.md
│   └── best-practices.md
├── projects/            # Project-specific docs (auto-generated)
│   └── index.md
├── api/                 # API reference docs
│   └── index.md
├── contributing.md      # Contributing guide
└── index.md            # Homepage
```

## Adding Documentation

### Automatic Sync

Run `npm run sync:docs` to automatically fetch and generate documentation pages for all getkist repositories. The script:

1. Fetches all repos from the getkist organization
2. Retrieves README files and metadata
3. Generates individual project pages
4. Updates the projects index
5. Updates the sidebar navigation

### Manual Documentation

To add custom documentation:

1. Create markdown files in the appropriate directory
2. Update `.vitepress/config.js` to add navigation links
3. Use frontmatter for page metadata

Example:
```markdown
---
layout: doc
title: Your Page Title
---

# Your Content Here
```

## Deployment

### GitHub Pages

```bash
# Build the site
npm run docs:build

# Deploy to GitHub Pages
# (Configure your deployment workflow)
```

### Other Platforms

The built site (in `docs/.vitepress/dist`) can be deployed to any static hosting service:
- Vercel
- Netlify
- Cloudflare Pages
- AWS S3
- etc.

## Environment Variables

Optional environment variables for enhanced functionality:

```bash
# GitHub token for higher API rate limits
GITHUB_TOKEN=your_github_token
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](docs/contributing.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm run docs:dev`
5. Submit a pull request

## Project Structure

```
.
├── docs/                # Documentation source files
├── scripts/            # Build and sync scripts
│   └── sync-docs.js   # Documentation sync script
├── .vitepress/        # VitePress config
├── package.json       # Dependencies and scripts
└── README.md         # This file
```

## Technology Stack

- [VitePress](https://vitepress.dev/) - Static site generator
- [Vue 3](https://vuejs.org/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [GitHub API](https://docs.github.com/en/rest) - Repository data

## Support

- 📖 [Documentation](https://getkist.com)
- 💬 [Discussions](https://github.com/getkist/www-getkist-com/discussions)
- 🐛 [Issues](https://github.com/getkist/www-getkist-com/issues)
- 🔗 [GitHub Organization](https://github.com/getkist)

## License

MIT License - see LICENSE file for details

---

<p align="center">
    <b>Made with ❤️ by <a href="https://www.scape.agency" target="_blank">Scape Agency</a></b>
</p>
