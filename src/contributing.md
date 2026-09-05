# Contributing

Thank you for your interest in contributing to Kist projects! This guide will help you get started.

## How to Contribute

There are many ways to contribute to Kist:

- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit pull requests
- 🤝 Help others in discussions

## Getting Started

### 1. Find a Project

Browse the [getkist organization](https://github.com/getkist) and find a project you'd like to contribute to.

### 2. Check Issues

Look for existing issues labeled:

- `good first issue` - Great for newcomers
- `help wanted` - Contributions welcome
- `bug` - Bug reports needing fixes
- `enhancement` - Feature requests

### 3. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR-USERNAME/PROJECT-NAME.git
cd PROJECT-NAME
```

### 4. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

## Development Workflow

### Install Dependencies

```bash
npm install
```

### Make Your Changes

- Write clean, readable code
- Follow the project's coding style
- Add tests for new features
- Update documentation as needed

### Test Your Changes

```bash
npm test
npm run lint
```

In the main [kist repository](https://github.com/getkist/kist) you can also run `npm run build:check` for a type-check without emitting output, and `npm run format` to apply Prettier formatting. Other projects may define additional scripts — check each repo's `package.json`.

### Commit Your Changes

Write clear, descriptive commit messages:

```bash
git commit -m "feat: add new feature"
git commit -m "fix: resolve issue with..."
git commit -m "docs: update installation guide"
```

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Test updates
- `refactor:` - Code refactoring
- `style:` - Code style changes
- `chore:` - Maintenance tasks

### Push and Create PR

```bash
git push origin your-branch-name
```

Then create a pull request on GitHub with:

- Clear title and description
- Reference related issues
- Screenshots (if applicable)
- Test results

## Code Standards

### TypeScript

- Use TypeScript for new code
- Provide proper type definitions
- Avoid `any` types when possible
- Document complex types

### Code Style

- Use consistent formatting (Prettier)
- Follow ESLint rules
- Write self-documenting code
- Add comments for complex logic

### Testing

- Write unit tests for new features
- Maintain or improve code coverage
- Test edge cases
- Include integration tests when needed

### Documentation

- Update README files
- Add JSDoc comments
- Include usage examples
- Document breaking changes

## Review Process

1. **Automated Checks** - CI runs tests and linting
2. **Code Review** - Maintainers review your code
3. **Feedback** - Address any requested changes
4. **Merge** - PR is merged once approved

## Community Guidelines

### Be Respectful

- Be kind and welcoming
- Respect different viewpoints
- Accept constructive criticism
- Focus on what's best for the project

### Communication

- Use clear, concise language
- Provide context and examples
- Be patient with responses
- Help others when you can

## Questions?

- Check existing documentation
- Search closed issues
- Ask in discussions
- Tag maintainers if needed

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Kist! Together we can build better tools for the developer community. 🚀
