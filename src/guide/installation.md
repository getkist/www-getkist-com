# Installation

This guide covers the installation process for Kist projects.

## Prerequisites

Before installing any Kist project, ensure you have:

- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm package manager
- Git (for development)

## Package Manager

Most Kist projects are available via npm and can be installed using your preferred package manager.

### npm

```bash
npm install @getkist/[project-name]
```

### yarn

```bash
yarn add @getkist/[project-name]
```

### pnpm

```bash
pnpm add @getkist/[project-name]
```

## From Source

To install from source:

1. Clone the repository:
```bash
git clone https://github.com/getkist/[project-name].git
cd [project-name]
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
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
- [Project-specific documentation](/projects/)
