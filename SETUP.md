# Setting Up the Documentation Website

This guide explains how to set up and maintain the getkist documentation website.

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

This installs VitePress and all required dependencies.

### 2. Sync Documentation

```bash
npm run sync:docs
```

This script:
- Fetches all repositories from the getkist GitHub organization
- Pulls each repository's `doc/` directory (fallback to `docs/`, then README)
- Stores docs under `src/projects/<repo>/`
- Ensures each project has an `index.md`
- Updates the projects index page and sidebar navigation

### 3. Start Development Server

```bash
npm run docs:dev
```

Visit http://localhost:5173 to view the site.

## Project Structure

```
www-getkist-com/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages deployment
├── src/
│   ├── .vitepress/
│   │   └── config.js          # VitePress configuration
│   ├── api/
│   │   └── index.md           # API reference overview
│   ├── guide/
│   │   ├── getting-started.md
│   │   ├── installation.md
│   │   ├── configuration.md
│   │   ├── architecture.md
│   │   └── best-practices.md
│   ├── projects/
│   │   ├── index.md           # Projects overview (auto-generated)
│   │   └── <project>/...      # Synced doc trees per project
│   ├── contributing.md
│   └── index.md               # Homepage
├── scripts/
│   └── sync-docs.js           # Documentation sync script
├── package.json
└── README.md
```

## Documentation Workflow

### Adding New Content

#### Manual Pages

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

#### Project Documentation

Project documentation is automatically synced from getkist repositories:

1. The sync script fetches all repos from https://github.com/getkist
2. It generates a page for each repository
3. The page includes the README and repository metadata

To update project docs:
```bash
npm run sync:docs
```

### Customizing Project Pages

If you need to customize a project's documentation beyond the auto-generated content:

1. Edit the generated files under `src/projects/[project-name]/`
2. Your changes will be overwritten next time you run `sync:docs`
3. Consider using git submodules for more complex project docs

### Using Git Submodules for Project Docs

For projects with extensive documentation, you can use git submodules:

```bash
# Add a project's docs as a submodule
git submodule add https://github.com/getkist/[project-name].git src/projects/[project-name]-src

# Update the config to point to the submodule
# Edit src/.vitepress/config.js
```

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

### Sync Script Configuration

Edit `scripts/sync-docs.js` to customize:

- Which repositories to include/exclude
- What content to fetch
- How pages are generated

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
3. Syncs documentation
4. Builds the site
5. Deploys to GitHub Pages

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

Run these commands regularly to keep docs up-to-date:

```bash
# Update dependencies
npm update

# Sync latest documentation
npm run sync:docs

# Test locally
npm run docs:dev

# Build and deploy
npm run docs:build
```

### Monitoring

- Check GitHub Actions for deployment status
- Monitor repository for new getkist projects
- Review and update manual documentation pages
- Check for broken links

### Environment Variables

For better rate limits when syncing, set a GitHub token:

```bash
export GITHUB_TOKEN=your_github_personal_access_token
npm run sync:docs
```

Or add to `.env`:
```
GITHUB_TOKEN=your_github_personal_access_token
```

## Troubleshooting

### Sync Script Issues

If `npm run sync:docs` fails:

1. Check GitHub API rate limits
2. Verify repository access
3. Check console for error messages
4. Try with a GitHub token

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

1. **Regular Syncs**: Run `npm run sync:docs` regularly to keep project docs updated
2. **Test Locally**: Always test with `npm run docs:dev` before deploying
3. **Version Control**: Commit changes to generated docs to track history
4. **Documentation Standards**: Follow markdown best practices
5. **Links**: Use relative links for internal navigation
6. **Images**: Host images externally or in a dedicated assets folder
7. **Performance**: Keep pages concise and well-organized

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

- VitePress Documentation: https://vitepress.dev/
- GitHub Issues: https://github.com/getkist/www-getkist-com/issues
- Discussions: https://github.com/getkist/www-getkist-com/discussions
