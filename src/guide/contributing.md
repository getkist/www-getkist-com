# Contributing Guide

Thank you for your interest in contributing to kist! This guide will help you get started.

## Quick Start

1. **Fork & Clone**

    ```bash
    git clone https://github.com/YOUR_USERNAME/kist.git
    cd kist
    npm install
    ```

2. **Create a Branch**

    ```bash
    git checkout -b feature/your-feature-name
    # or
    git checkout -b fix/issue-description
    ```

3. **Make Changes & Test**

    ```bash
    npm run build
    npm test
    ```

4. **Submit PR**
    - Write clear commit messages
    - Reference any related issues
    - Ensure all tests pass

## Development Setup

### Prerequisites

- Node.js 22.0.0 or higher
- npm 9.0.0 or higher
- Git

### Installing Dependencies

```bash
npm install
```

### Building

```bash
# Compile TypeScript, then run kist's own pipeline (self-build)
npm run build

# Type-check only, without emitting output
npm run build:check

# Build and run the CLI against the repo's kist.yml
npm run dev
```

### Running Tests

```bash
# Run the full test suite
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Linting & Formatting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format with Prettier
npm run format
```

## Project Structure

```text
kist/
├── bin/               # Utility scripts (test runner, version bump, ...)
├── src/
│   └── ts/            # TypeScript source
│       ├── actions/   # Built-in action implementations
│       ├── cli/       # CLI entry point
│       ├── config/    # Default configuration
│       ├── core/      # Engine: pipeline, plugin, cache, validation
│       ├── interface/ # Public interfaces (config, actions, plugins)
│       ├── live/      # Live reload server and watcher
│       ├── logger/    # Logging
│       └── types/     # Shared type definitions
├── tst/               # Test files
├── dist/              # Build output (generated)
└── kist.yml           # kist's own pipeline configuration
```

## Coding Standards

### TypeScript

- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Document public APIs with JSDoc comments
- Use meaningful variable and function names

```typescript
// Good
interface CopyOptions {
    srcFile: string;
    destDir: string;
}

async function copyFile(options: CopyOptions): Promise<void> {
    // ...
}

// Avoid
type Opts = {
    s: string;
    d: string;
};

async function doStuff(o: Opts) {
    // ...
}
```

### Code Style

Formatting and linting are enforced by the repo's Prettier and ESLint configurations — run `npm run format` and `npm run lint` before committing. In short:

- 4 spaces for indentation
- Double quotes for strings
- Trailing commas in multiline arrays/objects

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```text
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or modifying tests
- `chore`: Build process or auxiliary tool changes

Examples:

```text
feat(actions): add batch copy support to FileCopyAction

fix(cli): handle spaces in config file paths correctly

docs: update plugin development guide

test(core): add unit tests for config validation
```

## Types of Contributions

### Bug Reports

When reporting bugs, please include:

- **Description**: Clear description of the issue
- **Steps to reproduce**: Minimal steps to trigger the bug
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**: OS, Node.js version, kist version
- **Configuration**: Relevant `kist.yml` content

### Feature Requests

For new features:

- Describe the use case and motivation
- Explain the proposed solution
- Consider backwards compatibility
- Discuss alternatives you've considered

### Code Contributions

1. Check existing issues and PRs to avoid duplicate work
2. For major changes, open an issue first to discuss
3. Write tests for new functionality
4. Update documentation as needed
5. Ensure CI passes before requesting review

### Documentation

Improvements to documentation are always welcome:

- Fix typos and clarify confusing sections
- Add examples and use cases
- Improve API documentation
- Translate to other languages

## Testing Guidelines

### Writing Tests

- Place tests in the `tst/` directory
- Use descriptive test names
- Test both success and failure cases
- Mock external dependencies

```typescript
describe("FileCopyAction", () => {
    describe("execute", () => {
        it("should copy file to destination directory", async () => {
            // Arrange
            const action = new FileCopyAction();

            // Act
            await action.execute({
                srcFile: "tst/fixtures/input.txt",
                destDir: "tst/output",
            });

            // Assert
            expect(fs.existsSync("tst/output/input.txt")).toBe(true);
        });

        it("should throw when required options are missing", async () => {
            // Arrange
            const action = new FileCopyAction();

            // Act & Assert
            await expect(action.execute({})).rejects.toThrow(
                "Missing required options"
            );
        });
    });
});
```

### Test Coverage

- Aim for at least 80% code coverage for new code
- Focus on testing business logic
- Don't test trivial getters/setters

## Pull Request Process

1. **Update your fork**

    ```bash
    git fetch upstream
    git rebase upstream/main
    ```

2. **Push your branch**

    ```bash
    git push origin feature/your-feature
    ```

3. **Create Pull Request**
    - Use a clear, descriptive title
    - Fill out the PR template
    - Link related issues

4. **Code Review**
    - Address review feedback
    - Keep commits clean (squash if needed)
    - Be responsive to questions

5. **Merge**
    - Maintainers will merge when approved
    - Your commits may be squashed

## Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to kist! Your efforts help make the tool better for everyone.
