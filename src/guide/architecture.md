# Pipeline Architecture

Understanding how kist's pipeline system works.

## Overview

kist is built around a pipeline architecture that processes build tasks through a series of stages and steps. This design provides:

- **Modularity** - Break complex builds into manageable pieces
- **Reusability** - Share configurations across projects
- **Extensibility** - Add custom functionality via plugins
- **Predictability** - Clear execution order and dependencies

## Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                          Kist                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │PluginManager │  │ActionRegistry│  │PipelineManager│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                 │                 │               │
│         ▼                 ▼                 ▼               │
│  ┌──────────────────────────────────────────────────┐      │
│  │                    Pipeline                       │      │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐          │      │
│  │  │ Stage 1 │→ │ Stage 2 │→ │ Stage 3 │          │      │
│  │  │┌───────┐│  │┌───────┐│  │┌───────┐│          │      │
│  │  ││ Step  ││  ││ Step  ││  ││ Step  ││          │      │
│  │  │└───────┘│  │└───────┘│  │└───────┘│          │      │
│  │  └─────────┘  └─────────┘  └─────────┘          │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Kist (Main Class)

The entry point that orchestrates all components:

```typescript
import { Kist } from 'kist';

const kist = new Kist({
  configPath: 'kist.yml'
});

await kist.run();
```

### PluginManager

Discovers and loads plugins from:
- `@getkist/action-*` (official scoped)
- `kist-plugin-*` (community)
- Local plugin directories

```typescript
// Automatic discovery
const plugins = await pluginManager.discover();

// Manual registration
pluginManager.register(myPlugin);
```

### ActionRegistry

Manages available actions (both core and plugin-provided):

```typescript
// Register an action
actionRegistry.register('MyAction', MyAction);

// Get an action
const action = actionRegistry.get('MyAction');
```

### Pipeline

Executes stages in sequence:

```typescript
pipeline.addStage({
  name: 'build',
  steps: [
    { action: 'TypeScriptCompilerAction', options: { ... } }
  ]
});

await pipeline.execute();
```

## Execution Flow

```
1. Initialize Kist
   ├── Load configuration
   ├── Initialize PluginManager
   │   └── Discover and load plugins
   ├── Initialize ActionRegistry
   │   ├── Register core actions
   │   └── Register plugin actions
   └── Initialize PipelineManager

2. Build Pipeline
   ├── Parse pipeline configuration
   ├── Create stages
   └── Create steps with action instances

3. Execute Pipeline
   ├── For each stage (sequential):
   │   ├── Log stage start
   │   ├── For each step:
   │   │   ├── Validate options
   │   │   ├── Execute action
   │   │   └── Handle errors
   │   └── Log stage complete
   └── Report results
```

## Plugin System

Plugins extend kist by providing actions:

```typescript
// Plugin structure
const plugin: ActionPlugin = {
  name: '@getkist/action-sass',
  version: '1.0.0',
  description: 'SCSS/Sass compilation',
  
  registerActions() {
    return {
      StyleProcessingAction
    };
  }
};

export default plugin;
```

### Plugin Discovery

kist automatically discovers plugins from `node_modules`:

```
node_modules/
├── @getkist/
│   ├── action-sass/       ✓ Discovered
│   ├── action-typescript/ ✓ Discovered
│   └── action-eslint/     ✓ Discovered
└── kist-plugin-custom/    ✓ Discovered
```

## Action Interface

All actions implement a common interface:

```typescript
interface Action {
  name: string;
  
  // Validate options before execution
  validateOptions(options: unknown): boolean;
  
  // Execute the action
  execute(options: unknown): Promise<void>;
  
  // Optional: describe the action
  describe(): string;
}
```

### Creating Custom Actions

```typescript
import { Action } from 'kist';

class MyCustomAction extends Action {
  name = 'MyCustomAction';
  
  validateOptions(options: MyOptions): boolean {
    return options.input !== undefined;
  }
  
  async execute(options: MyOptions): Promise<void> {
    // Your implementation
    console.log(`Processing ${options.input}`);
  }
}
```

## Error Handling

kist provides structured error handling:

```typescript
try {
  await kist.run();
} catch (error) {
  if (error instanceof KistConfigError) {
    // Configuration issue
  } else if (error instanceof KistActionError) {
    // Action execution failed
  } else if (error instanceof KistPluginError) {
    // Plugin loading failed
  }
}
```

## Logging

Built-in logging with levels:

```
[INFO]  [Kist] Starting pipeline...
[INFO]  [PluginManager] Loaded 3 plugins
[INFO]  [Pipeline] Stage: build (2 steps)
[INFO]  [TypeScriptCompilerAction] Compiling...
[WARN]  [ESLintAction] 2 warnings found
[ERROR] [Action] Failed: File not found
```

## Performance

kist is optimized for performance:

- **Lazy loading** - Plugins loaded on demand
- **Parallel execution** - Steps can run concurrently
- **Caching** - Avoid redundant operations
- **Minimal dependencies** - Core package is lightweight

## Next Steps

- [Configuration](/guide/configuration) - Full configuration reference
- [Plugin Development](/guide/plugin-development) - Create your own plugins
- [API Reference](/api/) - Full API documentation
