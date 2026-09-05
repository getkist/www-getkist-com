# www-getkist-com Documentation

This repository hosts the documentation site for the getkist organization.

## Overview

- Static site built with VitePress (content under `src/`)
- Deployment via GitHub Pages workflow

## Structure

- `src/` — VitePress site source (`src/.vitepress/config.js` is the site config)
- `src/guide/`, `src/api/`, `src/plugins/` — guides, API/CLI reference, plugin docs
- `src/projects/` — per-project doc trees (maintained manually)
- `.github/workflows/deploy.yml` — deployment pipeline

## Usage

- `npm run docs:dev` — start dev server
- `npm run docs:build` — build static site
- `npm run docs:preview` — preview production build
- `npm run format` / `npm run lint` — Prettier / ESLint over `src/**/*.ts`

## Notes

- `npm run sync:docs` is defined in `package.json` but `scripts/sync-docs.js` is not present in the repo, so the command currently fails.
- This `doc/` folder provides a minimal reference for this repo; main site content lives in `src/`.
