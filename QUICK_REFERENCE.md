# Quick Reference Guide

## Common Commands

```bash
# Development
npm run docs:dev          # Start dev server at http://localhost:5173
npm run docs:build        # Build for production
npm run docs:preview      # Preview production build

# Code quality
npm run format            # Prettier over src/**/*.ts
npm run lint              # ESLint over src/**/*.ts
```

> `npm run sync:docs` is defined in `package.json` but its target
> (`scripts/sync-docs.js`) is not in the repo, so it fails. Project docs
> under `src/projects/` are edited manually.

## File Structure Quick Reference

```text
www-getkist-com/
├── src/                 # All documentation content (VitePress site)
│   ├── .vitepress/      # Configuration
│   │   └── config.js    # Main config file
│   ├── guide/           # User guides
│   ├── api/             # API + CLI reference
│   ├── plugins/         # Plugin docs
│   ├── projects/        # Per-project docs (maintained manually)
│   ├── media/           # Media assets
│   ├── public/          # Static files (CNAME, ...)
│   └── index.md         # Homepage
│
├── .github/workflows/
│   └── deploy.yml       # Auto-deploy to GitHub Pages
│
├── doc/index.md         # Minimal repo reference
├── package.json         # Dependencies and scripts
├── README.md            # Project overview
└── SETUP.md             # Detailed setup guide
```

## Key URLs

- **Local Dev**: `http://localhost:5173`
- **Live Site**: [https://www.getkist.com/](https://www.getkist.com/)
- **GitHub Org**: [https://github.com/getkist](https://github.com/getkist)
- **VitePress Docs**: [https://vitepress.dev](https://vitepress.dev)

## Adding New Content

1. Create file, e.g. `src/guide/your-page.md`
2. Add to sidebar in `src/.vitepress/config.js`

## Configuration

Main config: [src/.vitepress/config.js](src/.vitepress/config.js)

```javascript
export default defineConfig({
  title: "Kist",              // Site title
  description: "...",         // Meta description
  base: "/",                  // Base URL

  themeConfig: {
    nav: [...],               // Top navigation
    sidebar: {...},           // Sidebar navigation
    socialLinks: [...]        // Social media links
  }
})
```

## Deployment

### Automatic (GitHub Pages)

Push to `main` or `dev` branch → deploys via GitHub Actions (`.github/workflows/deploy.yml`)

### Manual

```bash
npm run docs:build
# Deploy contents of src/.vitepress/dist/
```

## Troubleshooting

### Dev server won't start

```bash
rm -rf src/.vitepress/cache node_modules
npm install
npm run docs:dev
```

### Build errors

```bash
# Check config syntax
npm run docs:build

# Clear cache
rm -rf src/.vitepress/cache
```

## Getting Help

- See [SETUP.md](SETUP.md) for detailed documentation
- Check [VitePress docs](https://vitepress.dev) for framework help
- Open issues on GitHub for bugs
- Use discussions for questions
