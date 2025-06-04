# Contributing to Util-Modules

First off, thank you for considering contributing to Util-Modules! It's people like you that make Util-Modules such a great tool. 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [How to Contribute](#how-to-contribute)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Community](#community)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [matthew.ngo@example.com].

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Git

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Click the 'Fork' button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/util-modules.git
   cd util-modules
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/matthew-ngo/util-modules.git
   ```

4. **Install dependencies**
   ```bash
   pnpm install
   ```

5. **Build all packages**
   ```bash
   pnpm build
   ```

6. **Run tests**
   ```bash
   pnpm test
   ```

## 💻 Development Process

### 1. **Create a new branch**
```bash
git checkout -b feat/amazing-feature
# or
git checkout -b fix/bug-description
```

### 2. **Make your changes**
- Write your code
- Add/update tests
- Update documentation
- Follow our coding standards

### 3. **Test your changes**
```bash
# Run tests for specific package
pnpm test --filter @matthew.ngo/storage

# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Check test coverage
pnpm test:coverage
```

### 4. **Lint and format**
```bash
# Lint code
pnpm lint

# Fix lint issues
pnpm lint:fix

# Format code
pnpm format
```

### 5. **Build packages**
```bash
# Build all packages
pnpm build

# Build specific package
pnpm build --filter @matthew.ngo/storage
```

### 6. **Commit your changes**
```bash
# We use commitizen for consistent commit messages
pnpm commit
```

## 🤝 How to Contribute

### Reporting Bugs 🐛

Before creating bug reports, please check existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed**
- **Explain which behavior you expected to see**
- **Include screenshots if possible**
- **Include your environment details**

### Suggesting Features ✨

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Provide specific examples to demonstrate the feature**
- **Describe the current behavior and expected behavior**
- **Explain why this enhancement would be useful**

### Creating Pull Requests 🔄

1. **Ensure your code adheres to the coding standards**
2. **Write or update tests for your changes**
3. **Update documentation as needed**
4. **Ensure all tests pass**
5. **Make sure your code lints**
6. **Issue that pull request!**

#### PR Title Format
```
<type>(<scope>): <subject>

Examples:
feat(storage): add encryption support
fix(ai-toolkit): resolve memory leak
docs(analysis): update API documentation
```

## 📐 Style Guidelines

### TypeScript Style Guide

- Use TypeScript strict mode
- Prefer `const` over `let`
- Use meaningful variable names
- Add JSDoc comments for public APIs
- Use explicit return types for functions
- Avoid `any` type

```typescript
/**
 * Calculates the sum of two numbers
 * @param a - First number
 * @param b - Second number
 * @returns The sum of a and b
 */
export function add(a: number, b: number): number {
  return a + b;
}
```

### File Naming

- Use kebab-case for file names: `my-component.ts`
- Use PascalCase for classes and types: `MyClass`
- Use camelCase for variables and functions: `myFunction`

### Testing Guidelines

- Write tests for all new features
- Maintain test coverage above 80%
- Use descriptive test names
- Follow the AAA pattern (Arrange, Act, Assert)

```typescript
describe('add', () => {
  it('should return the sum of two numbers', () => {
    // Arrange
    const a = 5;
    const b = 3;
    
    // Act
    const result = add(a, b);
    
    // Assert
    expect(result).toBe(8);
  });
});
```

## 💬 Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

### Format
```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Types
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Code style changes (formatting, missing semicolons, etc)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvements
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files

### Examples
```bash
feat(storage): add support for IndexedDB backend
fix(ai-toolkit): prevent race condition in cache invalidation
docs(content-extractor): add examples for PDF extraction
refactor(analysis): simplify sentiment analysis algorithm
```

## 🔄 Pull Request Process

1. **Update the README.md** with details of changes to the interface
2. **Update the documentation** for the package you're modifying
3. **Add your changes to the CHANGELOG** if significant
4. **Ensure all tests pass** and coverage remains high
5. **Request review** from maintainers
6. **Address review feedback** promptly
7. **Squash commits** if requested

### PR Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing unit tests pass locally
- [ ] Any dependent changes have been merged

## 🌟 Recognition

Contributors are recognized in our:
- README.md contributors section
- GitHub contributors page
- Release notes

## 📞 Community

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and discussions
- **Email**: matthew.ngo@example.com for private concerns

## 🎯 Development Tips

### Working with Monorepo

```bash
# Run command for specific package
pnpm --filter @matthew.ngo/storage <command>

# Run command for all packages
pnpm -r <command>

# Run commands in parallel
pnpm -r --parallel <command>
```

### Debugging

```bash
# Enable verbose logging
NX_VERBOSE_LOGGING=true pnpm build

# Debug tests
pnpm test:debug

# Use VS Code debugger
# Press F5 with a test file open
```

### Performance

- Use `pnpm nx affected` commands to only rebuild/test changed packages
- Enable build caching with Nx
- Use `pnpm nx graph` to visualize dependencies

## 📚 Additional Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [pnpm Documentation](https://pnpm.io/)
- [Nx Documentation](https://nx.dev/)
- [Vitest Documentation](https://vitest.dev/)

---

Thank you for contributing! 🙏 Your efforts help make Util-Modules better for everyone.