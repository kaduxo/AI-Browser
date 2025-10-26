# Contributing to AI Browser

Thank you for your interest in contributing to AI Browser! 🎉

This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Community](#community)

## Code of Conduct

This project adheres to the Contributor Covenant [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior by opening an issue.

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Git** for version control
- **LM Studio** for testing AI features
- **Code editor** (VS Code recommended)

### Setup Development Environment

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/kaduxo/ai-browser.git
   cd ai-browser
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Run in development mode**:
   ```bash
   npm run dev
   ```

### Project Structure

```
ai-browser/
├── src/
│   ├── main.ts          # Electron main process
│   ├── preload.ts       # Secure IPC bridge
│   ├── renderer.ts      # UI logic and AI integration
│   └── index.html       # Application UI
├── dist/                # Compiled JavaScript
├── .github/             # GitHub templates and workflows
├── docs/                # Additional documentation
└── tests/               # Test files (if applicable)
```

## How to Contribute

### Reporting Bugs

Found a bug? Help us fix it!

1. **Check existing issues** to avoid duplicates
2. **Use the bug report template** when creating a new issue
3. **Provide detailed information**:
   - OS and version
   - AI Browser version
   - LM Studio version and model
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots or console logs

### Suggesting Features

Have an idea? We'd love to hear it!

1. **Check existing feature requests** to avoid duplicates
2. **Use the feature request template**
3. **Describe your use case** and benefits
4. **Be open to discussion** and feedback

### Improving Documentation

Documentation is crucial! You can help by:
- Fixing typos or unclear explanations
- Adding examples and tutorials
- Translating documentation
- Creating video tutorials or guides

## Development Workflow

### Working on Issues

1. **Find an issue** to work on:
   - Look for `good first issue` or `help wanted` labels
   - Comment on the issue to claim it
   - Wait for maintainer approval before starting

2. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Make your changes**:
   - Write clean, readable code
   - Follow the coding standards
   - Add comments for complex logic
   - Test your changes thoroughly

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add: brief description of changes"
   ```
   
   Use conventional commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**:
   - Use the PR template
   - Link related issues
   - Describe your changes clearly
   - Add screenshots if applicable

### Testing Your Changes

Before submitting, ensure:

1. **Build succeeds**:
   ```bash
   npm run build
   ```

2. **Application runs**:
   ```bash
   npm start
   ```

3. **Test core features**:
   - Browser navigation
   - AI chat functionality
   - LM Studio connection
   - Agent mode (if applicable)
   - File operations

4. **Test on multiple platforms** (if possible):
   - Windows
   - macOS
   - Linux

### Code Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be in the next release!

## Coding Standards

### TypeScript Style

- Use **TypeScript** for type safety
- Enable strict mode in `tsconfig.json`
- Avoid `any` types when possible
- Use interfaces for object shapes
- Document complex types

```typescript
// Good
interface BrowserConfig {
  url: string;
  enableAI: boolean;
}

function navigate(config: BrowserConfig): void {
  // implementation
}

// Avoid
function navigate(config: any): any {
  // implementation
}
```

### Code Formatting

- Use **2 spaces** for indentation
- Use **semicolons**
- Use **single quotes** for strings (unless template literals)
- Max line length: **100 characters**
- Add trailing commas in multi-line objects/arrays

### Naming Conventions

- **Variables/Functions**: camelCase (`getUserData`)
- **Classes/Interfaces**: PascalCase (`BrowserWindow`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Files**: kebab-case (`user-manager.ts`)

### Comments

- Write clear, concise comments
- Explain **why**, not **what** (code should be self-explanatory)
- Use JSDoc for functions and classes

```typescript
/**
 * Connects to LM Studio API and validates the connection
 * @param endpoint - The API endpoint URL
 * @returns Promise that resolves when connected
 * @throws Error if connection fails after retries
 */
async function connectToLMStudio(endpoint: string): Promise<void> {
  // implementation
}
```

### Error Handling

- Always handle errors gracefully
- Provide meaningful error messages
- Log errors for debugging
- Never expose sensitive information in errors

```typescript
try {
  await performOperation();
} catch (error) {
  console.error('Operation failed:', error);
  showUserFriendlyError('Unable to complete operation. Please try again.');
}
```

## Submitting Changes

### Pull Request Checklist

Before submitting your PR, ensure:

- [ ] Code follows project style guidelines
- [ ] All tests pass (`npm run build` succeeds)
- [ ] Documentation is updated (if applicable)
- [ ] Commit messages are clear and descriptive
- [ ] PR description explains the changes
- [ ] Related issues are linked
- [ ] Screenshots added (for UI changes)
- [ ] You've tested on at least one platform

### PR Review Timeline

- Initial review: 1-3 days
- Follow-up reviews: 1-2 days
- Please be patient and respectful

### After Your PR is Merged

- Your contribution will be in the next release
- You'll be credited in the CHANGELOG
- Consider watching the repo for updates
- Help others by reviewing PRs!

## Community

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and general discussion
- **Pull Requests**: Code contributions and reviews

### Recognition

We value all contributions! Contributors are:
- Listed in the CHANGELOG
- Recognized in release notes
- Part of our growing community

### Getting Help

Stuck? Need help?

- Comment on the issue you're working on
- Ask in GitHub Discussions
- Review existing documentation
- Check out example code

## Additional Resources

- [Architecture Guide](ARCHITECTURE.md) - System design
- [Agent Mode Guide](AGENT_MODE_GUIDE.md) - AI agent details
- [Examples](EXAMPLES.md) - Usage examples
- [Release Guide](RELEASE_GUIDE.md) - Creating releases
- [Electron Documentation](https://www.electronjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## License

By contributing to AI Browser, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

Thank you for contributing to AI Browser! Your efforts help make this project better for everyone. 🚀

