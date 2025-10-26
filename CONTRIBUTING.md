# Contributing to AI Browser

Thank you for considering contributing to AI Browser! This document provides guidelines and instructions for contributing.

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Making Changes](#making-changes)
5. [Coding Standards](#coding-standards)
6. [Testing](#testing)
7. [Pull Request Process](#pull-request-process)
8. [Bug Reports](#bug-reports)
9. [Feature Requests](#feature-requests)

---

## Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in all interactions.

### Expected Behavior
- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior
- Harassment or discriminatory language
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- LM Studio (for testing AI features)
- Code editor (VS Code recommended)

### Fork and Clone
```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/ai-browser.git
cd ai-browser

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/ai-browser.git
```

---

## Development Setup

### Initial Setup
```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start in dev mode
npm run dev
```

### Development Workflow
```bash
# Terminal 1: Watch TypeScript compilation
npm run watch

# Terminal 2: Run Electron
npm start
```

### Project Structure
```
ai-browser/
├── src/
│   ├── main.ts          # Main process (Electron)
│   ├── preload.ts       # Preload script (IPC bridge)
│   ├── renderer.ts      # Renderer process (UI logic)
│   └── index.html       # Application UI
├── dist/                # Compiled output (generated)
├── docs/                # Documentation
├── package.json
├── tsconfig.json
└── README.md
```

---

## Making Changes

### Branch Naming
- Feature: `feature/description`
- Bug fix: `fix/description`
- Documentation: `docs/description`
- Refactor: `refactor/description`

**Example**:
```bash
git checkout -b feature/add-bookmark-support
```

### Commit Messages
Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

**Format**: `<type>(<scope>): <subject>`

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples**:
```bash
git commit -m "feat(chat): add streaming response support"
git commit -m "fix(navigation): resolve back button issue on reload"
git commit -m "docs(readme): update installation instructions"
```

### Keep Your Fork Updated
```bash
# Fetch upstream changes
git fetch upstream

# Merge upstream main into your branch
git checkout main
git merge upstream/main

# Push to your fork
git push origin main
```

---

## Coding Standards

### TypeScript Guidelines
1. **Use TypeScript** for all new code
2. **Enable strict mode** (already configured)
3. **Define interfaces** for complex objects
4. **Avoid `any`** type when possible
5. **Use async/await** for promises

**Good Example**:
```typescript
interface PageContext {
  url: string;
  title: string;
  content?: string;
}

async function getPageContent(): Promise<PageContext | null> {
  try {
    const result = await someAsyncOperation();
    return result;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}
```

**Bad Example**:
```typescript
// Avoid this
function getPageContent(): any {
  return someOperation();
}
```

### Code Style
- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Required
- **Line length**: Max 100 characters (soft limit)
- **Comments**: Use JSDoc for functions

**Function Documentation**:
```typescript
/**
 * Summarize the current page content
 * @param maxLength - Maximum summary length
 * @returns Promise resolving to summary string
 */
async function summarizePage(maxLength: number): Promise<string> {
  // Implementation
}
```

### File Organization
- **One class per file** (when using classes)
- **Group related functions** together
- **Export at the end** of the file
- **Imports at the top**

```typescript
// Imports
import { something } from 'somewhere';

// Constants
const DEFAULT_TIMEOUT = 5000;

// Interfaces/Types
interface Config {
  // ...
}

// Main code
function myFunction() {
  // ...
}

// Exports
export { myFunction };
```

---

## Testing

### Manual Testing
Before submitting a PR, test these scenarios:

1. **Navigation**:
   - [ ] URL bar navigation
   - [ ] Back/forward buttons
   - [ ] Reload button

2. **AI Chat**:
   - [ ] Send messages
   - [ ] Context inclusion
   - [ ] Selected text support

3. **Features**:
   - [ ] Page summarization
   - [ ] Script execution
   - [ ] File operations
   - [ ] Shell commands

4. **Agent Mode**:
   - [ ] Enable/disable
   - [ ] Action confirmations
   - [ ] Interrupt button

5. **Settings**:
   - [ ] Change settings
   - [ ] Test connection
   - [ ] Settings persistence

### Testing Checklist
- [ ] Test on your target platform (Windows/macOS/Linux)
- [ ] Test with LM Studio connected
- [ ] Test with LM Studio disconnected (error handling)
- [ ] Check console for errors
- [ ] Verify no TypeScript compilation errors

---

## Pull Request Process

### Before Submitting
1. **Update from main**:
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. **Build and test**:
   ```bash
   npm run build
   npm start
   # Perform manual testing
   ```

3. **Check for linting errors** (if ESLint is configured)

4. **Update documentation** if needed:
   - README.md for new features
   - EXAMPLES.md for new use cases
   - Inline comments for complex code

### PR Template
When creating a PR, include:

**Title**: Clear, concise description

**Description**:
```markdown
## What does this PR do?
Brief description of changes

## Why is this needed?
Explanation of the problem or feature

## How was this tested?
- [ ] Manual testing steps
- [ ] Test scenarios covered

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Documentation updated
- [ ] Tested on [platform]
- [ ] No console errors
- [ ] Commits follow conventional format
```

### PR Review Process
1. Maintainer reviews your code
2. Feedback is provided (if needed)
3. You make requested changes
4. Maintainer approves and merges

### After Merge
```bash
# Update your local main
git checkout main
git pull upstream main

# Delete your feature branch
git branch -d feature/your-feature
git push origin --delete feature/your-feature
```

---

## Bug Reports

### Before Reporting
1. Check existing issues
2. Verify it's reproducible
3. Test on latest version
4. Check console for errors

### Bug Report Template
```markdown
**Describe the bug**
Clear description of the issue

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Actual behavior**
What actually happens

**Screenshots**
If applicable

**Environment**
- OS: [Windows 10/macOS 13/Ubuntu 22.04]
- AI Browser version: [e.g. 1.0.0]
- LM Studio version: [e.g. 0.2.9]
- Node.js version: [e.g. 18.17.0]

**Console output**
```
Paste relevant console errors
```

**Additional context**
Any other relevant information
```

---

## Feature Requests

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
What you want to happen

**Describe alternatives you've considered**
Other solutions you thought about

**Use cases**
How would you use this feature?

**Additional context**
Mockups, examples, links, etc.
```

---

## Areas for Contribution

### Good First Issues
- Documentation improvements
- UI/UX enhancements
- Bug fixes
- Error message improvements

### Medium Complexity
- New tool integrations
- Settings improvements
- UI features (dark mode, themes)
- Performance optimizations

### Advanced
- Multi-tab support
- Plugin system architecture
- Cloud LLM integrations
- Advanced automation features

---

## Questions?

- Open a GitHub issue with the `question` label
- Check existing documentation
- Review closed issues for similar questions

---

## Recognition

Contributors will be:
- Listed in the project README
- Credited in release notes
- Recognized in the community

Thank you for contributing to AI Browser! 🎉


Kaduxo Built with ❤️ for the AI community