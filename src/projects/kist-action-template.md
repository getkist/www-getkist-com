# kist-action-template

## Links

- [GitHub Repository](https://github.com/getkist/kist-action-template)

## Installation

```bash
npm install @getkist/kist-action-template
```

## Documentation

<p align="center">
    <img src="https://raw.githubusercontent.com/getkist/brand/master/src/logo/kist.png" width="20%" alt="kist logo"></p>
<h1 align="center" style='border-bottom: none;'>kist</h1>
<h3 align="center">Package Pipeline Processor</h3>

<br/>

<div align="center">

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fwww.kist&up_message=Up&up_color=5e4d34&down_message=Down&down_color=5e4d34&style=flat-square&logo=Firefox&logoColor=FFFFFF&label=Website&labelColor=5e4d34&color=5e4d34)
](https://www.kist)
[![NPM Version](https://img.shields.io/npm/v/kist?style=flat-square&logo=npm&logoColor=FFFFFF&label=NPM&labelColor=5e4d34&color=5e4d34&link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fkist)](https://www.npmjs.com/package/kist)
[![devContainer](https://img.shields.io/badge/devContainer-235e4d34?style=flat-square&logo=Docker&logoColor=%23FFFFFF&labelColor=%235e4d34&color=%235e4d34)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/getkist/kist)
[![StackBlitz](https://img.shields.io/badge/StackBlitz-235e4d34?style=flat-square&logo=StackBlitz&logoColor=%23FFFFFF&labelColor=%235e4d34&color=%235e4d34)](https://stackblitz.com/github/getkist/kist/tree/main?file=src%2Findex.html)
[![GitHub License](https://img.shields.io/github/license/getkist/kist?style=flat-square&logo=readthedocs&logoColor=FFFFFF&label=&labelColor=%235e4d34&color=%235e4d34&link=LICENSE)](https://github.com/getkist/kist/blob/main/LICENSE)

</div>

<div align="center">

[![Report a Bug](https://img.shields.io/badge/Report%20a%20Bug-GitHub?style=flat-square&&logoColor=%23FFFFFF&color=%23D2D9DF)](https://github.com/getkist/kist/issues/new?assignees=&labels=Needs%3A+Triage+%3Amag%3A%2Ctype%3Abug-suspected&projects=&template=bug_report.yml)
[![Request a Feature](https://img.shields.io/badge/Request%20a%20Feature-GitHub?style=flat-square&&logoColor=%23FFFFFF&color=%23D2D9DF)](https://github.com/getkist/kist/issues/new?assignees=&labels=Needs%3A+Triage+%3Amag%3A%2Ctype%3Abug-suspected&projects=&template=feature_request.yml)
[![Ask a Question](https://img.shields.io/badge/Ask%20a%20Question-GitHub?style=flat-square&&logoColor=%23FFFFFF&color=%23D2D9DF)](https://github.com/getkist/kist/issues/new?assignees=&labels=Needs%3A+Triage+%3Amag%3A%2Ctype%3Abug-suspected&projects=&template=question.yml)
[![Make a Suggestion](https://img.shields.io/badge/Make%20a%20Suggestion-GitHub?style=flat-square&&logoColor=%23FFFFFF&color=%23D2D9DF)](https://github.com/getkist/kist/issues/new?assignees=&labels=Needs%3A+Triage+%3Amag%3A%2Ctype%3Abug-suspected&projects=&template=suggestion.yml)
[![Start a Discussion](https://img.shields.io/badge/Start%20a%20Discussion-GitHub?style=flat-square&&logoColor=%23FFFFFF&color=%23D2D9DF)](https://github.com/getkist/kist/issues/new?assignees=&labels=Needs%3A+Triage+%3Amag%3A%2Ctype%3Abug-suspected&projects=&template=discussion.yml)

</div>

---

# Kist Action Template

Template repository for creating [kist](https://github.com/getkist/kist) action plugins.

## Quick Start

### 1. Use This Template

Click "Use this template" on GitHub or clone this repository:

```bash
git clone https://github.com/yourusername/kist-action-template.git my-kist-action
cd my-kist-action
```

### 2. Customize Your Action

1. **Update `package.json`:**
   - Change `name` to `@kist/action-yourname` or `kist-action-yourname`
   - Update `description`, `author`, `repository`, and `keywords`
   - Set appropriate `version` (start with `0.1.0` or `1.0.0`)

2. **Rename the Action:**
   - Rename `src/actions/ExampleAction.ts` to your action name
   - Update the class name and implementation
   - Update exports in `src/index.ts`

3. **Update Documentation:**
   - Modify this README with your action's documentation
   - Update `LICENSE` if needed

### 3. Install Dependencies

```bash
npm install
```

### 4. Develop Your Action

```bash
# Build TypeScript
npm run build

# Watch mode for development
npm run build:watch

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Check test coverage
npm run test:coverage

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Project Structure

```
kist-action-template/
├── src/
│   ├── actions/
│   │   ├── ExampleAction.ts       # Action implementation
│   │   └── ExampleAction.test.ts  # Action tests
│   └── index.ts                    # Plugin entry point
├── dist/                           # Compiled output (generated)
├── .eslintrc.json                  # ESLint configuration
├── .prettierrc                     # Prettier configuration
├── jest.config.js                  # Jest configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json
├── README.md
└── LICENSE
```

## Creating Your Action

### 1. Implement Your Action Class

```typescript
import { Action, ActionOptionsType } from "kist";

export interface YourActionOptions extends ActionOptionsType {
  input: string;
  output: string;
  // Add your options here
}

export class YourAction extends Action {
  validateOptions(options: ActionOptionsType): boolean {
    const opts = options as YourActionOptions;
    // Validate required options
    if (!opts.input || !opts.output) {
      throw new Error("YourAction requires input and output options");
    }
    return true;
  }

  async execute(options: ActionOptionsType): Promise<void> {
    const opts = options as YourActionOptions;
    this.logInfo("Starting YourAction...");
    
    try {
      // Your action logic here
      
      this.logInfo("YourAction completed successfully.");
    } catch (error) {
      this.logError("YourAction failed:", error);
      throw error;
    }
  }
}
```

### 2. Register Your Action

Update `src/index.ts`:

```typescript
import { ActionPlugin } from "kist";
import { YourAction } from "./actions/YourAction.js";

const plugin: ActionPlugin = {
  version: "1.0.0",
  description: "Your action description",
  
  registerActions() {
    return {
      YourAction: YourAction,
    };
  },
};

export default plugin;
export { YourAction };
```

### 3. Write Tests

```typescript
import { YourAction } from "./YourAction";

describe("YourAction", () => {
  let action: YourAction;

  beforeEach(() => {
    action = new YourAction();
  });

  it("should validate options correctly", () => {
    expect(action.validateOptions({ 
      input: "src", 
      output: "dist" 
    })).toBe(true);
  });

  it("should execute successfully", async () => {
    await action.execute({
      input: "./test/fixtures",
      output: "./test/output",
    });
  });
});
```

## Testing Locally

### Link to Test Project

```bash
# In your action directory
npm link

# In your test project
npm link @kist/action-yourname
```

### Use in kist.yml

```yaml
pipeline:
  stages:
    - name: build
      steps:
        - name: your-step
          action: YourAction
          options:
            input: ./src
            output: ./dist
```

## Publishing

### 1. Build and Test

```bash
npm run build
npm test
```

### 2. Version Bump

```bash
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

### 3. Publish to npm

```bash
npm login
npm publish --access public
```

## Action Naming Conventions

### Official Actions (kist organization)
- Name: `@kist/action-{name}`
- Example: `@kist/action-sass`, `@kist/action-typescript`
- Repository: `getkist/action-{name}`

### Community Actions
- Name: `kist-action-{name}` or `@yourscope/kist-action-{name}`
- Example: `kist-action-markdown`, `@mycompany/kist-action-custom`

## Action Guidelines

### Best Practices

1. **Validation**: Always validate options in `validateOptions()`
2. **Logging**: Use `this.logInfo()`, `this.logWarn()`, `this.logError()`, `this.logDebug()`
3. **Error Handling**: Wrap execution logic in try-catch blocks
4. **TypeScript**: Define clear interfaces for your options
5. **Testing**: Aim for >80% code coverage
6. **Documentation**: Provide clear README and inline documentation

### Example Options Interface

```typescript
export interface YourActionOptions extends ActionOptionsType {
  // Required options
  input: string;
  output: string;
  
  // Optional options with defaults
  verbose?: boolean;
  overwrite?: boolean;
  
  // Complex options
  config?: {
    minify?: boolean;
    sourceMap?: boolean;
  };
}
```

## Examples

See the `src/actions/ExampleAction.ts` for a complete implementation example that demonstrates:
- Options validation
- Type safety with TypeScript
- Error handling
- Logging
- Async operations

## Resources

- [kist Documentation](https://github.com/getkist/kist)
- [Plugin Development Guide](https://github.com/getkist/kist/blob/main/PLUGIN_DEVELOPMENT.md)
- [Plugin Migration Guide](https://github.com/getkist/kist/blob/main/PLUGIN_MIGRATION.md)
- [Official Actions](https://github.com/getkist?q=action-)

## Support

- Issues: [GitHub Issues](https://github.com/yourusername/kist-action-yourname/issues)
- Discussions: [kist Discussions](https://github.com/getkist/kist/discussions)

## License

MIT © [Your Name]

## Repository Info

- **Language**: TypeScript
- **License**: MIT
- **Stars**: 0
- **Forks**: 0
- **Last Updated**: 12/20/2025
