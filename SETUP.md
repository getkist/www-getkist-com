# Setting Up the Documentation Website

This guide explains how to set up and maintain the getkist documentation website. For a project overview see [README.md](README.md); for a terse command list see [QUICK_REFERENCE.md](QUICK_REFERENCE.md).

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

This installs VitePress and all required dependencies. Use Node.js 18+ (the repo's `.nvmrc` pins Node 22; run `nvm use` if you use nvm).

### 2. Start Development Server

```bash
npm run docs:dev
```

Visit `http://localhost:5173` to view the site.

## Project Structure

```text
www-getkist-com/
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Pages deployment
├── src/
│   ├── .vitepress/
│   │   └── config.js          # VitePress configuration
│   ├── api/
│   │   ├── index.md           # Programmatic API reference
│   │   └── cli.md             # CLI reference
│   ├── guide/                 # User guides
│   │   ├── getting-started.md
│   │   ├── installation.md
│   │   ├── configuration.md
│   │   ├── architecture.md
│   │   ├── core-actions.md
│   │   ├── plugin-development.md
│   │   ├── best-practices.md
│   │   └── contributing.md
│   ├── plugins/               # Plugin docs (index, using-plugins, action-*.md)
│   ├── projects/              # Per-project doc trees (maintained manually)
│   ├── media/                 # Media assets
│   ├── public/                # Static files served as-is (CNAME, ...)
│   ├── contributing.md
│   └── index.md               # Homepage
├── doc/
│   └── index.md               # Minimal reference for this repo itself
├── package.json
├── README.md
├── SETUP.md
└── QUICK_REFERENCE.md
```

## Documentation Workflow

### Adding New Content

1. Create a new markdown file in the appropriate directory:

   ```bash
   touch src/guide/new-guide.md
   ```

2. Add the page to the sidebar in `src/.vitepress/config.js`:

   ```javascript
   sidebar: {
     '/guide/': [
       {
         text: 'Guide',
         items: [
           { text: 'New Guide', link: '/guide/new-guide' }
         ]
       }
     ]
   }
   ```

### Project Documentation

Documentation for individual getkist projects lives under `src/projects/<project>/` and is currently maintained manually: edit the files there and update the sidebar in `src/.vitepress/config.js` as needed.

> **About `npm run sync:docs`:** `package.json` defines a `sync:docs` script that runs `node scripts/sync-docs.js`, but `scripts/sync-docs.js` is not currently present in the repository, so the command fails. If you re-introduce an aggregation script, restore it at that path (the deploy workflow no longer invokes it).

## Configuration

### Site Configuration

Edit `src/.vitepress/config.js` to customize:

- Site title and description
- Navigation menu
- Sidebar structure
- Theme colors
- Social links
- Search settings

Example:

```javascript
export default defineConfig({
  title: "Kist",
  description: "Documentation for getkist projects",
  themeConfig: {
    logo: 'https://example.com/logo.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' }
    ]
  }
})
```

## Building for Production

### Local Build

```bash
npm run docs:build
```

Output will be in `src/.vitepress/dist/`

### Preview Production Build

```bash
npm run docs:preview
```

## Deployment

### GitHub Pages

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:

1. Runs on push to main/dev branches
2. Installs dependencies
3. Builds the site with VitePress
4. Deploys to GitHub Pages

To enable:

1. Go to repository Settings > Pages
2. Set Source to "GitHub Actions"
3. Push to main/dev branch

### Other Platforms

#### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

#### Custom Server

```bash
# Build the site
npm run docs:build

# Copy dist folder to your server
scp -r src/.vitepress/dist/* user@server:/path/to/webroot/
```

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Test locally
npm run docs:dev

# Build for deployment
npm run docs:build
```

### Monitoring

- Check GitHub Actions for deployment status
- Monitor the organization for new getkist projects that need doc pages
- Review and update documentation pages
- Check for broken links

## Troubleshooting

### Build Errors

If build fails:

1. Check `src/.vitepress/config.js` for syntax errors
2. Verify all markdown files are valid
3. Check for broken internal links
4. Clear cache: `rm -rf src/.vitepress/cache`

### Development Server Issues

If `npm run docs:dev` fails:

1. Check port 5173 is available
2. Verify Node.js version (18+)
3. Clear node_modules and reinstall
4. Check for config errors

## Best Practices

1. **Test Locally**: Always test with `npm run docs:dev` before deploying
2. **Documentation Standards**: Follow markdown best practices
3. **Links**: Use relative links for internal navigation
4. **Images**: Host images in `src/media/` or `src/public/`
5. **Performance**: Keep pages concise and well-organized

## Advanced Features

### Custom Themes

Create a custom theme by extending VitePress:

```javascript
// src/.vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  ...DefaultTheme,
  // Custom enhancements
}
```

### Plugins

Add VitePress plugins in `src/.vitepress/config.js`:

```javascript
export default defineConfig({
  vite: {
    plugins: [
      // Your plugins here
    ]
  }
})
```

### Custom Components

Create Vue components in `src/.vitepress/theme/components/`:

```vue
<!-- MyComponent.vue -->
<template>
  <div class="my-component">
    <!-- Your content -->
  </div>
</template>
```

## Support

- [VitePress Documentation](https://vitepress.dev/)
- [GitHub Issues](https://github.com/getkist/www-getkist-com/issues)
- [Discussions](https://github.com/getkist/www-getkist-com/discussions)
