# Installation

Multiple ways to install and use kist in your projects.

## Prerequisites

- **Node.js** 22.0.0 or higher
- **npm** 9.0.0 or higher (or **yarn** / **pnpm**)

## Project Installation (recommended)

Install kist as a development dependency in your project:

### npm

```bash
npm install --save-dev kist
```

### yarn

```bash
yarn add -D kist
```

### pnpm

```bash
pnpm add -D kist
```

## Global Installation

You can also install kist globally to use the CLI from anywhere:

```bash
npm install -g kist
```

Verify the installation by running kist in a project that has a `kist.yaml` or `kist.yml`:

```bash
kist
```

kist finds the config file in the current directory and runs the pipeline. Use `--config <path>` to point at a different file.

## Installing Plugins

Install official action plugins as needed — kist discovers them automatically from `node_modules`, so no configuration is required:

```bash
# Style processing
npm install --save-dev @getkist/action-sass @getkist/action-postcss

# Bundling
npm install --save-dev @getkist/action-tsup @getkist/action-terser

# Code quality
npm install --save-dev @getkist/action-eslint @getkist/action-prettier

# Testing
npm install --save-dev @getkist/action-jest

# Assets & templates
npm install --save-dev @getkist/action-svg @getkist/action-nunjucks
```

See [Available Plugins](/plugins/) for the full list.

## Using npx

Run kist without installing globally:

```bash
npx kist --config kist.yml
```

## Development Setup

To contribute to kist or run from source:

```bash
# Clone the repository
git clone https://github.com/getkist/kist.git
cd kist

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Link for local development
npm link
```

## Updating

Update kist to the latest version:

```bash
# Global installation
npm update -g kist

# Project dependency
npm update kist
```

kist is under active 0.x development, so review the [changelog](https://github.com/getkist/kist/blob/main/CHANGELOG.md) when updating.

## Troubleshooting

### Permission Issues (macOS/Linux)

If you encounter permission errors during global installation:

```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Node Version

Ensure you're using Node.js 22 or higher:

```bash
node --version
# Should be v22.x.x or higher
```

Consider using [nvm](https://github.com/nvm-sh/nvm) to manage Node versions:

```bash
nvm install 22
nvm use 22
```

## Verification

After installation, verify that the package is correctly installed:

```bash
npm list kist
```

## Next Steps

- [Configuration](/guide/configuration)
- [Available Plugins](/plugins/)
