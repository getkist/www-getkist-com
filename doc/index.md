# www-getkist-com Documentation

This repository hosts the documentation site for the getkist organization.

## Overview
- Static site built with VitePress (content under `src/`)
- Docs aggregation script pulls `doc/` (or `docs/`) folders from getkist repos into `src/projects/`
- Deployment via GitHub Pages workflow

## Structure
- `src/` — VitePress site source
- `src/projects/` — Synced docs from getkist repos
- `scripts/sync-docs.js` — Aggregation script
- `.github/workflows/deploy.yml` — Deployment pipeline

## Usage
- `npm run docs:dev` — start dev server
- `npm run docs:build` — build static site
- `npm run sync:docs` — refresh project docs from org

## Notes
- This `doc/` folder provides a minimal reference for this repo; main site content lives in `src/`.
