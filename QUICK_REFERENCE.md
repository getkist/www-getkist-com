# Quick Reference Guide

## Common Commands

```bash
# Development
npm run docs:dev          # Start dev server at http://localhost:5173
npm run docs:build        # Build for production
npm run docs:preview      # Preview production build

# Documentation
npm run sync:docs         # Sync docs from getkist repos
```

## File Structure Quick Reference

```
www-getkist-com/
├── docs/                 # All documentation content
│   ├── .vitepress/      # Configuration
│   │   └── config.js    # Main config file
│   ├── guide/           # User guides
│   ├── projects/        # Project docs (auto-generated)
│   ├── api/             # API reference
│   └── index.md         # Homepage
│
├── scripts/
│   └── sync-docs.js     # Fetch docs from GitHub
│
├── .github/workflows/
│   └── deploy.yml       # Auto-deploy to GitHub Pages
│
├── package.json         # Dependencies and scripts
├── README.md           # Project overview
└── SETUP.md            # Detailed setup guide
```

## Key URLs

- **Local Dev**: http://localhost:5173
- **GitHub Org**: https://github.com/getkist
- **VitePress Docs**: https://vitepress.dev

## Adding New Content

### New Guide Page

1. Create file: `docs/guide/your-page.md`
2. Add to sidebar in `docs/.vitepress/config.js`

### Update Project Docs

```bash
npm run sync:docs
```

## Configuration

Main config: [docs/.vitepress/config.js](docs/.vitepress/config.js)

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

Push to `main` or `dev` branch → Auto-deploys via GitHub Actions

### Manual

```bash
npm run docs:build
# Deploy contents of docs/.vitepress/dist/
```

## Troubleshooting

### Dev server won't start
```bash
rm -rf docs/.vitepress/cache node_modules
npm install
npm run docs:dev
```

### Sync fails
```bash
# Add GitHub token for higher rate limits
export GITHUB_TOKEN=your_token
npm run sync:docs
```

### Build errors
```bash
# Check config syntax
npm run docs:build

# Clear cache
rm -rf docs/.vitepress/cache
```

## Project Features

✅ VitePress static site generator
✅ Auto-sync from getkist repos
✅ Search functionality
✅ Responsive design
✅ GitHub Actions deployment
✅ Multiple project documentation
✅ User guides and API reference

## Next Steps

1. ✅ Site is set up and running
2. Review generated documentation
3. Customize homepage and guides
4. Add project-specific content
5. Set up GitHub Pages deployment
6. Share with the team!

## Getting Help

- See [SETUP.md](SETUP.md) for detailed documentation
- Check [VitePress docs](https://vitepress.dev) for framework help
- Open issues on GitHub for bugs
- Use discussions for questions

---

**Current Status**: ✅ Site is running at http://localhost:5173
