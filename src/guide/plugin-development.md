# Plugin Development

This guide covers everything you need to know about developing plugins for kist.

## Overview

Kist uses a plugin-based architecture that allows you to extend its functionality with custom actions. Plugins are npm packages that export action classes implementing the `ActionPlugin` interface.

### Plugin Architecture

```
┌─────────────────────────────────────────────────┐
│                  kist Core                       │
├─────────────────────────────────────────────────┤
│  PluginManager                                   │
│  ├── loadPlugins() - Discovers and loads plugins │
│  ├── getAction() - Retrieves action by name     │
│  └── listActions() - Lists all available actions │
├─────────────────────────────────────────────────┤
│  Core Actions (Built-in)                         │
│  ├── directory_clean                             │
│  ├── directory_copy                              │
│  ├── directory_create                            │
│  ├── file_copy                                   │
│  ├── file_rename                                 │
│  ├── template_render                             │
│  └── version_write                               │
├─────────────────────────────────────────────────┤
│  Plugin Actions (External)                       │
│  ├── kist-action-sass                            │
│  ├── kist-action-typescript                      │
│  ├── kist-action-jinja                           │
│  └── ... (community plugins)                     │
└─────────────────────────────────────────────────┘
```

## Creating a Plugin

### 1. Set Up Your Project

Start by creating a new npm package:

```bash
mkdir kist-action-myaction
cd kist-action-myaction
npm init -y
```

### 2. Install Dependencies

```bash
npm install typescript --save-dev
npm install @types/node --save-dev
```

### 3. Configure TypeScript

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "declaration": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": false,
    "inlineSourceMap": true,
    "inlineSources": true,
    "experimentalDecorators": true,
    "strictPropertyInitialization": false,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 4. Create the Plugin Class

Create `src/index.ts`:

```typescript
import * as fs from 'fs';
import * as path from 'path';

/**
 * Plugin metadata interface
 */
export interface PluginInfo {
  name: string;
  version: string;
  description: string;
  author?: string;
}

/**
 * Action execution context
 */
export interface ActionContext {
  workingDir: string;
  config: Record<string, any>;
  logger: {
    info: (msg: string) => void;
    warn: (msg: string) => void;
    error: (msg: string) => void;
    debug: (msg: string) => void;
  };
}

/**
 * Action execution result
 */
export interface ActionResult {
  success: boolean;
  message?: string;
  data?: Record<string, any>;
}

/**
 * Action configuration for your plugin
 */
export interface MyActionConfig {
  source: string;
  destination: string;
  options?: {
    verbose?: boolean;
    // Add your custom options here
  };
}

/**
 * My Custom Action Plugin
 * 
 * This action does something useful with files.
 */
export class MyAction {
  /**
   * Unique identifier for the action
   */
  static readonly actionName = 'my_action';

  /**
   * Human-readable description
   */
  static readonly description = 'Performs a custom action on files';

  /**
   * Plugin metadata
   */
  static readonly pluginInfo: PluginInfo = {
    name: 'kist-action-myaction',
    version: '1.0.0',
    description: 'A custom kist action plugin'
  };

  /**
   * Configuration schema for validation
   */
  static readonly configSchema = {
    type: 'object',
    required: ['source', 'destination'],
    properties: {
      source: {
        type: 'string',
        description: 'Source file or directory'
      },
      destination: {
        type: 'string',
        description: 'Destination file or directory'
      },
      options: {
        type: 'object',
        properties: {
          verbose: {
            type: 'boolean',
            description: 'Enable verbose output'
          }
        }
      }
    }
  };

  /**
   * Execute the action
   * 
   * @param config - Action configuration from kist.yml
   * @param context - Execution context with working directory and logger
   * @returns Promise resolving to action result
   */
  async execute(
    config: MyActionConfig,
    context: ActionContext
  ): Promise<ActionResult> {
    const { source, destination, options = {} } = config;
    const { workingDir, logger } = context;

    try {
      // Resolve paths relative to working directory
      const sourcePath = path.resolve(workingDir, source);
      const destPath = path.resolve(workingDir, destination);

      // Validate source exists
      if (!fs.existsSync(sourcePath)) {
        return {
          success: false,
          message: `Source not found: ${sourcePath}`
        };
      }

      if (options.verbose) {
        logger.info(`Processing: ${sourcePath}`);
      }

      // Your action logic here
      // ...

      logger.info(`Successfully processed ${source} → ${destination}`);

      return {
        success: true,
        message: 'Action completed successfully',
        data: {
          source: sourcePath,
          destination: destPath
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : String(error);

      logger.error(`Action failed: ${errorMessage}`);

      return {
        success: false,
        message: errorMessage
      };
    }
  }
}

// Default export for plugin discovery
export default MyAction;
```

### 5. Configure Package.json

Update your `package.json`:

```json
{
  "name": "kist-action-myaction",
  "version": "1.0.0",
  "description": "A custom kist action plugin",
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
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

## Configuration Schema

### Validation

Kist validates action configurations against the `configSchema`. Use JSON Schema format:

```typescript
static readonly configSchema = {
  type: 'object',
  required: ['inputFile', 'outputFile'],
  properties: {
    inputFile: {
      type: 'string',
      description: 'Input file path'
    },
    outputFile: {
      type: 'string',
      description: 'Output file path'
    },
    minify: {
      type: 'boolean',
      default: false,
      description: 'Enable minification'
    },
    sourcemap: {
      type: 'boolean',
      default: true,
      description: 'Generate source maps'
    },
    advanced: {
      type: 'object',
      properties: {
        optimization: {
          type: 'string',
          enum: ['none', 'basic', 'full'],
          default: 'basic'
        }
      }
    }
  }
};
```

### Complex Validation Example

```typescript
static readonly configSchema = {
  type: 'object',
  required: ['source'],
  properties: {
    source: {
      oneOf: [
        { type: 'string' },
        { 
          type: 'array',
          items: { type: 'string' }
        }
      ],
      description: 'Source file(s) - can be string or array'
    },
    output: {
      type: 'object',
      required: ['directory'],
      properties: {
        directory: { type: 'string' },
        filename: { 
          type: 'string',
          pattern: '^[a-zA-Z0-9_-]+\\.[a-z]+$'
        }
      }
    },
    transforms: {
      type: 'array',
      items: {
        type: 'object',
        required: ['type'],
        properties: {
          type: { 
            type: 'string',
            enum: ['minify', 'compress', 'optimize']
          },
          options: { type: 'object' }
        }
      }
    }
  }
};
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
import { MyAction } from './index';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('MyAction', () => {
  let tempDir: string;
  let mockLogger: any;

  beforeEach(() => {
    // Create temp directory for tests
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'myaction-test-'));
    
    // Mock logger
    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn()
    };
  });

  afterEach(() => {
    // Clean up temp directory
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should have correct action name', () => {
    expect(MyAction.actionName).toBe('my_action');
  });

  it('should have valid config schema', () => {
    expect(MyAction.configSchema).toBeDefined();
    expect(MyAction.configSchema.type).toBe('object');
    expect(MyAction.configSchema.required).toContain('source');
  });

  it('should execute successfully with valid config', async () => {
    // Setup test file
    const sourceFile = path.join(tempDir, 'input.txt');
    fs.writeFileSync(sourceFile, 'test content');

    const action = new MyAction();
    const result = await action.execute(
      {
        source: 'input.txt',
        destination: 'output.txt'
      },
      {
        workingDir: tempDir,
        config: {},
        logger: mockLogger
      }
    );

    expect(result.success).toBe(true);
  });

  it('should fail when source does not exist', async () => {
    const action = new MyAction();
    const result = await action.execute(
      {
        source: 'nonexistent.txt',
        destination: 'output.txt'
      },
      {
        workingDir: tempDir,
        config: {},
        logger: mockLogger
      }
    );

    expect(result.success).toBe(false);
    expect(result.message).toContain('Source not found');
  });

  it('should log verbose output when enabled', async () => {
    const sourceFile = path.join(tempDir, 'input.txt');
    fs.writeFileSync(sourceFile, 'test content');

    const action = new MyAction();
    await action.execute(
      {
        source: 'input.txt',
        destination: 'output.txt',
        options: { verbose: true }
      },
      {
        workingDir: tempDir,
        config: {},
        logger: mockLogger
      }
    );

    expect(mockLogger.info).toHaveBeenCalled();
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
npm link

# In a test project
cd ../test-project
npm link kist-action-myaction

# Create kist.yml
cat > kist.yml << 'EOF'
project:
  name: test-project
  version: 1.0.0

actions:
  - name: my_action
    source: src/input.txt
    destination: dist/output.txt
    options:
      verbose: true
EOF

# Run kist
npx kist run
```

## Best Practices

### Error Handling

Always wrap your action logic in try-catch and return meaningful error messages:

```typescript
async execute(config: Config, context: ActionContext): Promise<ActionResult> {
  try {
    // Validate inputs
    if (!config.source) {
      return {
        success: false,
        message: 'Missing required configuration: source'
      };
    }

    // Perform action
    await this.processFile(config, context);

    return { success: true };
  } catch (error) {
    // Handle specific error types
    if (error instanceof FileNotFoundError) {
      return {
        success: false,
        message: `File not found: ${error.path}`
      };
    }

    // Log full error for debugging
    context.logger.error(`Unexpected error: ${error}`);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
```

### Logging

Use the provided logger for consistent output:

```typescript
// Information about progress
context.logger.info('Starting file processing...');

// Warnings that don't stop execution
context.logger.warn('File already exists, will be overwritten');

// Errors that cause failure
context.logger.error('Failed to read configuration file');

// Debug info (only shown in verbose mode)
context.logger.debug(`Processing options: ${JSON.stringify(options)}`);
```

### Path Handling

Always resolve paths relative to the working directory:

```typescript
// Good - resolved to working directory
const sourcePath = path.resolve(context.workingDir, config.source);

// Bad - relative to current process directory
const sourcePath = config.source;
```

### Async Operations

Use async/await for file operations:

```typescript
// Good - async with proper error handling
async execute(config: Config, context: ActionContext): Promise<ActionResult> {
  const content = await fs.promises.readFile(sourcePath, 'utf-8');
  await fs.promises.writeFile(destPath, processedContent);
  return { success: true };
}

// Avoid - synchronous operations block the event loop
execute(config: Config, context: ActionContext): ActionResult {
  const content = fs.readFileSync(sourcePath, 'utf-8');
  fs.writeFileSync(destPath, processedContent);
  return { success: true };
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

### 2. Update Documentation

Create a comprehensive README.md:

```markdown
# kist-action-myaction

A kist plugin for doing X.

## Installation

\`\`\`bash
npm install kist-action-myaction
\`\`\`

## Usage

In your `kist.yml`:

\`\`\`yaml
actions:
  - name: my_action
    source: src/input.txt
    destination: dist/output.txt
    options:
      verbose: true
\`\`\`

## Configuration

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| source | string | Yes | - | Source file path |
| destination | string | Yes | - | Destination file path |
| options.verbose | boolean | No | false | Enable verbose output |

## Examples

### Basic Usage

\`\`\`yaml
actions:
  - name: my_action
    source: input.txt
    destination: output.txt
\`\`\`

### With All Options

\`\`\`yaml
actions:
  - name: my_action
    source: src/data.json
    destination: dist/data.min.json
    options:
      verbose: true
\`\`\`

## License

MIT
```

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

Kist maintains several official plugins that serve as excellent references:

| Plugin | Description | Source |
|--------|-------------|--------|
| `kist-action-sass` | Compile SASS/SCSS to CSS | [GitHub](https://github.com/getkist/kist-action-sass) |
| `kist-action-typescript` | Compile TypeScript | [GitHub](https://github.com/getkist/kist-action-typescript) |
| `kist-action-jinja` | Process Jinja2 templates | [GitHub](https://github.com/getkist/kist-action-jinja) |
| `kist-action-svg` | Optimize and package SVGs | [GitHub](https://github.com/getkist/kist-action-svg) |
| `kist-action-test` | Run tests with jest/vitest | [GitHub](https://github.com/getkist/kist-action-test) |

## Troubleshooting

### Plugin Not Found

If kist can't find your plugin:

1. Ensure it's installed: `npm list kist-action-myaction`
2. Check the package name in `package.json` starts with `kist-action-`
3. Verify the main entry point exports the action class

### Configuration Validation Errors

If you get schema validation errors:

1. Check your `configSchema` matches the expected format
2. Ensure all required fields are defined in the schema
3. Verify types match (string vs array, etc.)

### Action Not Executing

If your action isn't running:

1. Check the action name in `kist.yml` matches `actionName`
2. Look for errors in the kist output
3. Enable verbose mode: `kist run --verbose`

## Next Steps

- Browse [official plugins](/plugins/) for implementation examples
- Read about [configuration inheritance](/guide/configuration#config-inheritance)
- Learn about [core actions](/guide/core-actions) built into kist
- Join the [community discussions](https://github.com/getkist/kist/discussions)
