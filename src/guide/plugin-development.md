# Plugin Development

This guide covers everything you need to know about developing plugins for kist.

## Overview

kist uses a plugin-based architecture that allows you to extend its functionality with custom actions. Plugins are npm packages whose **default export** implements the `ActionPlugin` interface; the actions they register become available to pipeline steps by name.

### How Discovery Works

On startup, kist scans the consuming project's `node_modules` for packages whose names match one of the default prefixes:

- `@getkist/action-*` - official plugins
- `kist-action-*` - unscoped community plugins
- `kist-plugin-*` - unscoped community plugins (legacy prefix)

Each matching package is imported via its `module`, `main`, or `exports["."]` entry point (falling back to `dist/index.js`). The default export must implement the `ActionPlugin` interface; its `registerActions()` return value is folded into kist's action registry, making the actions available to pipeline steps by name.

Plugins are never declared in `kist.yml` - installing the package is enough. Plugins can also be loaded from a local directory or registered programmatically via `PluginManager.registerPlugin()`.

## The Plugin Contract

A plugin's default export implements `ActionPlugin`:

```typescript
import type { ActionPlugin } from "kist";
import { MyCustomAction } from "./actions/MyCustomAction/index.js";
import packageJson from "../package.json" with { type: "json" };

const plugin: ActionPlugin = {
    // Derive the version from package.json so it never drifts.
    version: packageJson.version,
    description: "My custom kist plugin",
    registerActions() {
        return {
            MyCustomAction,
        };
    },
};

export default plugin;
```

The keys returned by `registerActions()` are the action names users write in `kist.yml`; the values are the action class constructors. Besides `registerActions()`, the interface accepts optional `version`, `description`, `author`, `repository`, and `keywords` fields.

## Creating a Plugin

### 1. Set Up Your Project

Start by creating a new npm package (the name must match a discovery prefix):

```bash
mkdir kist-action-myaction
cd kist-action-myaction
npm init -y
```

::: tip Starting Point
The [kist-action-master](https://github.com/getkist/kist-action-master) repository is a template you can copy to bootstrap a new plugin.
:::

### 2. Install Dependencies

Declare `kist` as a peer dependency (it provides the `Action` base class and interfaces), and install it plus TypeScript for development:

```bash
npm install --save-peer kist
npm install --save-dev kist typescript @types/node
```

### 3. Write an Action

Each action implements `ActionInterface` - most easily by extending the `Action` base class exported from `kist`. Create `src/actions/MyCustomAction/index.ts`:

```typescript
import { Action } from "kist";

export class MyCustomAction extends Action {
    /**
     * Optional: reject bad options up front so the pipeline fails fast
     * with a clear message.
     */
    validateOptions(options: Record<string, unknown>): boolean {
        return typeof options.input === "string";
    }

    async execute(options: Record<string, unknown>): Promise<void> {
        this.logInfo(`Processing ${options.input}...`);
        // ... do the work ...
        // Throw an Error to fail the step (and the build).
    }
}
```

### 4. Export the Plugin

Create `src/index.ts` with the plugin object as the default export:

```typescript
import type { ActionPlugin } from "kist";
import { MyCustomAction } from "./actions/MyCustomAction/index.js";
import packageJson from "../package.json" with { type: "json" };

const plugin: ActionPlugin = {
    version: packageJson.version,
    description: "My custom kist plugin",
    registerActions() {
        return {
            MyCustomAction,
        };
    },
};

export default plugin;
export { MyCustomAction };
```

### 5. Configure package.json

Point the entry fields at the compiled file whose default export is the plugin object:

```json
{
  "name": "kist-action-myaction",
  "version": "1.0.0",
  "description": "A custom kist action plugin",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "keywords": [
    "kist",
    "kist-plugin",
    "kist-action"
  ],
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsc",
    "prepublishOnly": "npm run build"
  },
  "peerDependencies": {
    "kist": ">=0.1.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "kist": ">=0.1.0",
    "typescript": "^5.0.0"
  }
}
```

## Using the Plugin

Once the package is installed in a project, its actions can be referenced directly in `kist.yml`:

```yaml
stages:
    - name: Build
      steps:
          - name: RunMyAction
            action: MyCustomAction
            options:
                input: "./src"
```

## Validating Options

Implement the optional `validateOptions()` method to reject bad configuration before `execute()` does any work:

```typescript
validateOptions(options: Record<string, unknown>): boolean {
    if (!options.inputFile || typeof options.inputFile !== "string") {
        this.logError("Invalid options: 'inputFile' is required and must be a string.");
        return false;
    }
    return true;
}

async execute(options: Record<string, unknown>): Promise<void> {
    if (!this.validateOptions(options)) {
        throw new Error("Invalid options provided to MyCustomAction.");
    }
    // ...
}
```

## Testing Your Plugin

### Unit Testing with Jest

Create `jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov']
};
```

Create `src/index.test.ts`:

```typescript
import plugin from './index';
import { MyCustomAction } from './index';

describe('kist-action-myaction', () => {
  it('registers the action', () => {
    const actions = plugin.registerActions();
    expect(actions.MyCustomAction).toBe(MyCustomAction);
  });

  it('rejects invalid options', () => {
    const action = new MyCustomAction();
    expect(action.validateOptions({})).toBe(false);
  });

  it('executes with valid options', async () => {
    const action = new MyCustomAction();
    await expect(
      action.execute({ input: './fixtures' })
    ).resolves.toBeUndefined();
  });
});
```

### Run Tests

```bash
npm install jest ts-jest @types/jest --save-dev
npm test
```

### Integration Testing

Test your plugin with kist in a real project:

```bash
# Link your plugin locally
cd kist-action-myaction
npm run build
npm link

# In a test project
cd ../test-project
npm link kist-action-myaction

# Create kist.yml
cat > kist.yml << 'EOF'
stages:
    - name: Build
      steps:
          - name: RunMyAction
            action: MyCustomAction
            options:
                input: "./src"
EOF

# Run kist
npx kist --verbose
```

## Best Practices

### Throw on Failure

A thrown error fails the step, the stage, and (with the default `haltOnFailure: true`) the whole build with a non-zero exit code. Never swallow errors - a silently green build is worse than a red one.

```typescript
async execute(options: Record<string, unknown>): Promise<void> {
    try {
        await this.processFile(options);
        this.logInfo("Processing completed successfully.");
    } catch (error) {
        this.logError("Processing failed.", error);
        throw error; // re-throw so the pipeline halts
    }
}
```

### Depend on kist as a Peer

Declare `kist` as a `peerDependency` instead of vendoring the `Action` base class or the interfaces. Vendored copies drift.

### Logging

Log through the base class helpers so output respects the user's configured log level:

```typescript
// Information about progress
this.logInfo('Starting file processing...');

// Warnings that don't stop execution
this.logWarn('File already exists, will be overwritten');

// Errors that cause failure
this.logError('Failed to read configuration file');
```

### Async Operations

Use async/await for file operations:

```typescript
// Good - async with proper error handling
async execute(options: Record<string, unknown>): Promise<void> {
  const content = await fs.promises.readFile(sourcePath, 'utf-8');
  await fs.promises.writeFile(destPath, processedContent);
}
```

## Publishing Your Plugin

### 1. Prepare for Publication

```bash
# Build your plugin
npm run build

# Run tests
npm test

# Check what will be published
npm pack --dry-run
```

### 2. Publishing Checklist

- Name the package `@getkist/action-<name>`, `kist-action-<name>`, or `kist-plugin-<name>` so discovery finds it.
- Point `main`/`module`/`exports` at the compiled entry file whose default export is the plugin object.
- Derive `version` from `package.json` - do not hardcode it.
- Declare `kist` as a `peerDependency`.
- Add `kist` and `kist-plugin` keywords for discoverability.
- Include a README documenting each action and its options.

### 3. Publish to npm

```bash
# Login to npm
npm login

# Publish
npm publish
```

### 4. Add to Community Plugins

Submit a pull request to add your plugin to the [kist community plugins list](https://github.com/getkist/kist).

## Official Plugins

kist maintains several official plugins that serve as excellent references:

| Plugin | Description | Source |
| --- | --- | --- |
| `@getkist/action-sass` | Compile SASS/SCSS to CSS | [GitHub](https://github.com/getkist/kist-action-sass) |
| `@getkist/action-typescript` | Compile TypeScript | [GitHub](https://github.com/getkist/kist-action-typescript) |
| `@getkist/action-nunjucks` | Render Nunjucks/Jinja2 templates | [GitHub](https://github.com/getkist/kist-action-nunjucks) |
| `@getkist/action-svg` | Optimize and package SVGs | [GitHub](https://github.com/getkist/kist-action-svg) |
| `@getkist/action-jest` | Run tests with Jest | [GitHub](https://github.com/getkist/kist-action-jest) |

## Troubleshooting

### Plugin Not Found

If kist can't find your plugin:

1. Ensure it's installed: `npm list kist-action-myaction`
2. Check the package name in `package.json` matches a discovery prefix (`@getkist/action-*`, `kist-action-*`, `kist-plugin-*`)
3. Verify the entry point's default export is the plugin object

### Action Not Found

If a step referencing your action fails validation at startup:

1. Check the action name in `kist.yml` matches a key returned by `registerActions()` (case-sensitive)
2. Look for plugin load errors in the kist output
3. Enable debug logging: `kist --verbose`

### Options Validation Errors

If your action rejects its options:

1. Check the step's `options` against what `validateOptions()` expects
2. Make validation errors specific - log which option failed and why

## Next Steps

- Browse [official plugins](/plugins/) for implementation examples
- Read about [configuration inheritance](/guide/configuration#config-inheritance)
- Learn about [core actions](/guide/core-actions) built into kist
- Join the [community discussions](https://github.com/getkist/kist/discussions)
