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

- Node.js 18.x or higher
- npm 9.x or higher
- Git

### Installing Dependencies

```bash
npm install
```

### Building

```bash
# Build TypeScript to JavaScript
npm run build

# Watch mode for development
npm run build:watch
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- path/to/test.ts
```

### Linting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

## Project Structure

```
kist/
├── bin/               # CLI entry points
│   └── ts/            # TypeScript CLI source
├── src/               # Main source code
│   ├── actions/       # Built-in action implementations
│   ├── core/          # Core engine components
│   └── utils/         # Utility functions
├── doc/               # Documentation source files
├── scripts/           # Build and utility scripts
└── test/              # Test files
```

## Coding Standards

### TypeScript

- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Document public APIs with JSDoc comments
- Use meaningful variable and function names

```typescript
// Good
interface ActionConfig {
  source: string;
  destination: string;
}

async function processFile(config: ActionConfig): Promise<void> {
  // ...
}

// Avoid
type Config = {
  src: string;
  dst: string;
}

async function doStuff(c: Config) {
  // ...
}
```

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in multiline arrays/objects
- Maximum line length: 100 characters

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
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
```
feat(actions): add support for glob patterns in file_copy

fix(cli): handle spaces in file paths correctly

docs: update plugin development guide

test(core): add unit tests for config parser
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

- Place tests next to source files or in `test/` directory
- Use descriptive test names
- Test both success and failure cases
- Mock external dependencies

```typescript
describe('FileProcessor', () => {
  describe('processFile', () => {
    it('should copy file to destination', async () => {
      // Arrange
      const source = 'test/fixtures/input.txt';
      const dest = 'test/output/output.txt';
      
      // Act
      await processFile({ source, destination: dest });
      
      // Assert
      expect(fs.existsSync(dest)).toBe(true);
    });

    it('should throw error when source does not exist', async () => {
      // Arrange
      const source = 'nonexistent.txt';
      
      // Act & Assert
      await expect(processFile({ source, destination: 'out.txt' }))
        .rejects.toThrow('Source file not found');
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
- **Discussions**: For questions and general discussion
- **Discord**: For real-time chat with the community

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to kist! Your efforts help make the tool better for everyone.
