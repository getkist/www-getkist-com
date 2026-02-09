# API Reference

Programmatic API for using kist in Node.js applications.

## Installation

```bash
npm install @getkist/kist
```

## Quick Start

```typescript
import { Kist, Pipeline, Stage, Step } from '@getkist/kist';

// Load from kist.yml
const kist = new Kist();
await kist.load('kist.yml');
await kist.run('build');
```

## Core Classes

### Kist

The main entry point for programmatic usage.

```typescript
import { Kist } from '@getkist/kist';

const kist = new Kist(options);
```

#### Constructor Options

```typescript
interface KistOptions {
  configPath?: string;      // Path to kist.yml
  cwd?: string;             // Working directory
  env?: Record<string, string>;  // Environment variables
  verbose?: boolean;        // Enable verbose logging
}
```

#### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `load(configPath)` | `Promise<void>` | Load configuration file |
| `run(pipelineName)` | `Promise<Result>` | Run a pipeline |
| `runStage(pipeline, stage)` | `Promise<Result>` | Run a specific stage |
| `registerPlugin(plugin)` | `void` | Register a plugin |

### Pipeline

Represents a sequence of stages.

```typescript
interface Pipeline {
  name: string;
  stages: Stage[];
  env?: Record<string, string>;
}
```

### Stage

A named group of steps.

```typescript
interface Stage {
  name: string;
  steps: Step[];
  condition?: string;
  continueOnError?: boolean;
}
```

### Step

An individual action execution.

```typescript
interface Step {
  action: string;
  options?: Record<string, unknown>;
  condition?: string;
  continueOnError?: boolean;
}
```

## Creating Pipelines Programmatically

```typescript
import { Kist, Pipeline } from '@getkist/kist';

const pipeline: Pipeline = {
  name: 'build',
  stages: [
    {
      name: 'compile',
      steps: [
        {
          action: 'TypeScriptCompilerAction',
          options: {
            tsconfig: 'tsconfig.json'
          }
        }
      ]
    }
  ]
};

const kist = new Kist();
kist.addPipeline(pipeline);
await kist.run('build');
```

## Plugin API

### Creating a Plugin

```typescript
import { Plugin, Action, ActionContext, ActionResult } from '@getkist/kist';

const myPlugin: Plugin = {
  name: 'my-plugin',
  version: '1.0.0',
  actions: [MyAction]
};

class MyAction implements Action {
  name = 'MyAction';
  
  async execute(context: ActionContext): Promise<ActionResult> {
    const { options, logger, cwd } = context;
    
    // Your action logic here
    
    return {
      success: true,
      outputs: {}
    };
  }
}

export default myPlugin;
```

### ActionContext

```typescript
interface ActionContext {
  options: Record<string, unknown>;  // Step options
  cwd: string;                        // Working directory
  env: Record<string, string>;        // Environment variables
  logger: Logger;                     // Logging interface
  outputs: Record<string, unknown>;   // Previous outputs
}
```

### ActionResult

```typescript
interface ActionResult {
  success: boolean;
  error?: Error;
  outputs?: Record<string, unknown>;
  metrics?: {
    duration?: number;
    files?: number;
  };
}
```

## Events

Subscribe to pipeline events:

```typescript
const kist = new Kist();

kist.on('pipeline:start', (name) => {
  console.log(`Pipeline ${name} started`);
});

kist.on('stage:start', (stage) => {
  console.log(`Stage ${stage.name} started`);
});

kist.on('step:complete', (step, result) => {
  console.log(`Step ${step.action} completed:`, result.success);
});

kist.on('pipeline:complete', (name, result) => {
  console.log(`Pipeline ${name} finished`);
});
```

## Error Handling

```typescript
try {
  const result = await kist.run('build');
  
  if (!result.success) {
    console.error('Pipeline failed:', result.error);
  }
} catch (error) {
  console.error('Unexpected error:', error);
}
```

## TypeScript Support

Full TypeScript definitions are included:

```typescript
import type {
  Kist,
  Pipeline,
  Stage,
  Step,
  Action,
  ActionContext,
  ActionResult,
  Plugin,
  KistOptions
} from '@getkist/kist';
```

## Next Steps

- [CLI Reference](/api/cli) - Command-line interface
- [Plugin Development](/guide/plugin-development) - Create plugins
- [Configuration](/guide/configuration) - YAML reference
