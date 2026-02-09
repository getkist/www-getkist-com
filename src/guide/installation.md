# Installation

Multiple ways to install and use kist in your projects.

## Prerequisites

- **Node.js** 20.0.0 or higher
- **npm**, **yarn**, or **pnpm**

## Global Installation

Install kist globally to use the CLI from anywhere:

```bash
npm install -g kist
```

Verify the installation:

```bash
kist --version
# Output: 0.1.62
```

## Project Installation

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

## Installing Plugins

Install official action plugins as needed:

```bash
# Style processing
npm install --save-dev @getkist/action-sass @getkist/action-postcss

# TypeScript & bundling
npm install --save-dev @getkist/action-typescript @getkist/action-tsup

# Code quality
npm install --save-dev @getkist/action-eslint @getkist/action-prettier

# Testing
npm install --save-dev @getkist/action-jest

# Assets
npm install --save-dev @getkist/action-svg @getkist/action-nunjucks
```

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

Ensure you're using Node.js 20+:

```bash
node --version
# Should be v20.x.x or higher
```

Consider using [nvm](https://github.com/nvm-sh/nvm) to manage Node versions:

```bash
nvm install 20
nvm use 20
```
```bash
npm run build
```

## Verification

After installation, verify that the package is correctly installed:

```bash
npm list @getkist/[project-name]
```

## Next Steps

- [Configuration](/guide/configuration)
- [Available Plugins](/plugins/)
