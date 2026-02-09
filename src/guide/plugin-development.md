# Plugin Development

Create custom plugins to extend kist with new actions.

## Overview

A kist plugin is an npm package that exports one or more **actions**. Actions are the building blocks of pipelines - they perform specific tasks like compiling code, running tests, or processing files.

## Quick Start

### 1. Create the Project

```bash
mkdir kist-plugin-example
cd kist-plugin-example
npm init -y
npm install typescript @getkist/kist -D
```

### 2. Create the Plugin

```typescript
// src/index.ts
import type { Plugin, Action, ActionContext, ActionResult } from '@getkist/kist';

class HelloAction implements Action {
  name = 'HelloAction';
  
  async execute(context: ActionContext): Promise<ActionResult> {
    const { options, logger } = context;
    const message = options.message || 'Hello, World!';
    
    logger.info(message);
    
    return {
      success: true,
      outputs: { message }
    };
  }
}

const plugin: Plugin = {
  name: 'kist-plugin-example',
  version: '1.0.0',
  actions: [HelloAction]
};

export default plugin;
```

### 3. Build & Publish

```bash
# Build
npx tsc

# Test locally
npm link
```

### 4. Use the Plugin

```yaml
# kist.yml
plugins:
  - kist-plugin-example

pipeline:
  demo:
    stages:
      - name: greet
        steps:
          - action: HelloAction
            options:
              message: "Hello from my plugin!"
```

## Plugin Structure

### Required Exports

A plugin must export a default object with:

```typescript
interface Plugin {
  name: string;           // Package name
  version: string;        // Semantic version
  actions: Action[];      // Array of action classes
}
```

### Action Interface

Each action must implement:

```typescript
interface Action {
  name: string;           // Action name (used in kist.yml)
  
  execute(context: ActionContext): Promise<ActionResult>;
}
```

### ActionContext

The context passed to every action:

```typescript
interface ActionContext {
  // Options from kist.yml step
  options: Record<string, unknown>;
  
  // Current working directory
  cwd: string;
  
  // Environment variables
  env: Record<string, string>;
  
  // Logger instance
  logger: Logger;
  
  // Outputs from previous steps
  outputs: Record<string, unknown>;
  
  // Pipeline metadata
  pipeline: {
    name: string;
    stage: string;
    step: number;
  };
}
```

### ActionResult

What an action returns:

```typescript
interface ActionResult {
  success: boolean;
  error?: Error;
  outputs?: Record<string, unknown>;
  metrics?: {
    duration?: number;
    files?: number;
    bytes?: number;
  };
}
```

## Example: File Transform Action

A more complete example that transforms files:

```typescript
// src/TransformAction.ts
import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';
import type { Action, ActionContext, ActionResult } from '@getkist/kist';

interface TransformOptions {
  inputFile: string;
  outputFile: string;
  transform: 'uppercase' | 'lowercase' | 'reverse';
}

export class TransformAction implements Action {
  name = 'TransformAction';
  
  async execute(context: ActionContext): Promise<ActionResult> {
    const { options, cwd, logger } = context;
    const { inputFile, outputFile, transform } = options as TransformOptions;
    
    try {
      // Validate options
      if (!inputFile || !outputFile) {
        throw new Error('inputFile and outputFile are required');
      }
      
      // Read input
      const inputPath = `${cwd}/${inputFile}`;
      const content = await readFile(inputPath, 'utf-8');
      
      // Transform
      let result: string;
      switch (transform) {
        case 'uppercase':
          result = content.toUpperCase();
          break;
        case 'lowercase':
          result = content.toLowerCase();
          break;
        case 'reverse':
          result = content.split('').reverse().join('');
          break;
        default:
          result = content;
      }
      
      // Write output
      const outputPath = `${cwd}/${outputFile}`;
      await mkdir(dirname(outputPath), { recursive: true });
      await writeFile(outputPath, result);
      
      logger.info(`Transformed ${inputFile} → ${outputFile}`);
      
      return {
        success: true,
        outputs: {
          outputFile,
          bytes: result.length
        },
        metrics: {
          bytes: result.length
        }
      };
      
    } catch (error) {
      logger.error(`Transform failed: ${error.message}`);
      return {
        success: false,
        error
      };
    }
  }
}
```

## Option Validation

Use a schema for option validation:

```typescript
import { z } from 'zod';

const optionsSchema = z.object({
  inputFile: z.string().min(1),
  outputFile: z.string().min(1),
  transform: z.enum(['uppercase', 'lowercase', 'reverse']).default('uppercase')
});

class TransformAction implements Action {
  name = 'TransformAction';
  
  async execute(context: ActionContext): Promise<ActionResult> {
    try {
      const options = optionsSchema.parse(context.options);
      // ... use validated options
    } catch (error) {
      return {
        success: false,
        error: new Error(`Invalid options: ${error.message}`)
      };
    }
  }
}
```

## Logging

Use the provided logger for consistent output:

```typescript
async execute(context: ActionContext): Promise<ActionResult> {
  const { logger } = context;
  
  logger.debug('Starting action...');
  logger.info('Processing files');
  logger.warn('Deprecated option used');
  logger.error('Something went wrong');
  
  // With data
  logger.info('Processed', { files: 5, duration: 123 });
}
```

## Accessing Previous Outputs

Use outputs from earlier steps:

```typescript
async execute(context: ActionContext): Promise<ActionResult> {
  const { outputs } = context;
  
  // Access output from a previous step
  const previousFile = outputs.outputFile as string;
  
  // Use it in this step
  // ...
}
```

## Testing Plugins

### Unit Tests

```typescript
// tests/TransformAction.test.ts
import { TransformAction } from '../src/TransformAction';

describe('TransformAction', () => {
  const action = new TransformAction();
  
  const mockContext = {
    options: {
      inputFile: 'test/input.txt',
      outputFile: 'test/output.txt',
      transform: 'uppercase'
    },
    cwd: process.cwd(),
    env: process.env,
    logger: {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    },
    outputs: {},
    pipeline: { name: 'test', stage: 'test', step: 0 }
  };
  
  it('transforms to uppercase', async () => {
    const result = await action.execute(mockContext);
    expect(result.success).toBe(true);
  });
});
```

### Integration Tests

```typescript
// tests/integration.test.ts
import { Kist } from '@getkist/kist';
import plugin from '../src';

describe('Plugin integration', () => {
  it('works with kist', async () => {
    const kist = new Kist();
    kist.registerPlugin(plugin);
    
    // Create test pipeline
    kist.addPipeline({
      name: 'test',
      stages: [{
        name: 'transform',
        steps: [{
          action: 'TransformAction',
          options: {
            inputFile: 'test/input.txt',
            outputFile: 'test/output.txt'
          }
        }]
      }]
    });
    
    const result = await kist.run('test');
    expect(result.success).toBe(true);
  });
});
```

## Publishing

### Package.json

```json
{
  "name": "kist-plugin-example",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "keywords": ["kist", "kist-plugin"],
  "peerDependencies": {
    "@getkist/kist": "^0.1.0"
  }
}
```

### Naming Convention

- **Official plugins**: `@getkist/action-*`
- **Community plugins**: `kist-plugin-*`

### Publish

```bash
npm publish
```

## Best Practices

1. **Clear naming**: Action names should describe what they do
2. **Validate options**: Always validate input options
3. **Error handling**: Return `{ success: false, error }`, don't throw
4. **Logging**: Use the provided logger, not console
5. **Outputs**: Return useful outputs for downstream steps
6. **Documentation**: Document all options and outputs
7. **TypeScript**: Provide type definitions
8. **Tests**: Include unit and integration tests

## Next Steps

- [Plugins](/plugins/) - See official plugins for examples
- [API Reference](/api/) - Full API documentation
- [Configuration](/guide/configuration) - YAML reference
