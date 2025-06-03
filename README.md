# 🛠️ Util Modules

A comprehensive collection of utility modules for modern web development, built with TypeScript and designed for enterprise-grade applications.

## 📦 Packages

| Package | Version | Description | Status |
|---------|---------|-------------|--------|
| [`@matthew.ngo/chrome-storage`](./storage) | ![npm](https://img.shields.io/npm/v/@matthew.ngo/chrome-storage) | Advanced Chrome storage with encryption, compression, and sync | ✅ Stable |
| [`@matthew.ngo/ai-toolkit`](./ai-toolkit) | ![npm](https://img.shields.io/npm/v/@matthew.ngo/ai-toolkit) | Multi-provider AI toolkit with caching and rate limiting | ✅ Stable |
| [`@matthew.ngo/content-extractor`](./content-extractor) | ![npm](https://img.shields.io/npm/v/@matthew.ngo/content-extractor) | Intelligent content extraction from web pages | 🚧 Beta |
| [`@matthew.ngo/analysis`](./analysis) | ![npm](https://img.shields.io/npm/v/@matthew.ngo/analysis) | Advanced text and data analysis tools | 🚧 Beta |

## 🚀 Quick Start

### Installation

```bash
# Install all packages
pnpm install

# Install specific package
pnpm add @matthew.ngo/chrome-storage
pnpm add @matthew.ngo/ai-toolkit
pnpm add @matthew.ngo/content-extractor
pnpm add @matthew.ngo/analysis
```

### Usage

```typescript
// Chrome Storage
import { createStorage } from '@matthew.ngo/chrome-storage';
const storage = createStorage('secure');

// AI Toolkit
import { createAI } from '@matthew.ngo/ai-toolkit';
const ai = await createAI({ provider: 'openai' });

// Content Extractor
import { ContentExtractor } from '@matthew.ngo/content-extractor';
const extractor = new ContentExtractor();

// Analysis
import { AnalysisEngine } from '@matthew.ngo/analysis';
const analyzer = new AnalysisEngine();
```

## 🏗️ Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
# Clone repository
git clone https://github.com/matthew-ngo/util-modules.git
cd util-modules

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Start development mode
pnpm dev
```

### Monorepo Commands

```bash
# Build all packages
pnpm build

# Watch mode for all packages
pnpm dev

# Run tests for all packages
pnpm test

# Run tests with coverage
pnpm test:coverage

# Lint all packages
pnpm lint

# Type check all packages
pnpm typecheck

# Clean all packages
pnpm clean

# Audit all modules
pnpm audit

# Update dependencies
pnpm deps:update

# Check outdated dependencies
pnpm deps:check
```

### Working with Nx

```bash
# Build only affected packages
pnpm affected:build

# Test only affected packages
pnpm affected:test

# Lint only affected packages
pnpm affected:lint

# View dependency graph
pnpm graph
```

## 📋 Module Management

### Adding a New Module

```bash
# Create new module structure
mkdir packages/new-module
cd packages/new-module

# Initialize package.json
pnpm init

# Add to workspace
# (automatically detected by pnpm workspace)
```

### Module Standards

Each module must include:

- ✅ `package.json` with proper metadata
- ✅ `tsconfig.json` for TypeScript configuration
- ✅ `src/` directory with source code
- ✅ `tests/` directory with test files
- ✅ `README.md` with documentation
- ✅ Build script (using tsup)
- ✅ Test script (using vitest)
- ✅ Lint script (using eslint)
- ✅ Type check script

### Quality Gates

All modules are automatically checked for:

- 📊 Code coverage > 80%
- 🔍 No console.log/warn/error usage
- 📝 No TODO/FIXME comments
- 🎯 TypeScript strict mode
- 📦 Proper exports configuration
- 🔒 Security vulnerabilities

## 🔄 Release Process

### Using Changesets

```bash
# Add changeset for your changes
pnpm changeset

# Version packages (updates package.json and CHANGELOG.md)
pnpm changeset:version

# Publish to npm
pnpm changeset:publish
```

### Automated Releases

- 🤖 **CI/CD**: Automated testing and building
- 📦 **Auto-publish**: Releases are published automatically on merge to main
- 📝 **Changelogs**: Generated automatically from changesets
- 🏷️ **Versioning**: Semantic versioning with automated bumps

## 📊 Module Health

Run the audit script to check module health:

```bash
pnpm audit
```

This will generate a report showing:

- ✅ Module completeness scores
- ⚠️ Missing files or configurations
- 🚨 Critical issues
- 📈 Overall health metrics

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Add** tests and documentation
5. **Run** quality checks: `pnpm lint && pnpm test && pnpm typecheck`
6. **Add** changeset: `pnpm changeset`
7. **Submit** a pull request

### Code Standards

- 🎯 **TypeScript**: Strict mode enabled
- 🧪 **Testing**: Vitest with >80% coverage
- 🎨 **Linting**: ESLint + Prettier
- 📚 **Documentation**: JSDoc for all public APIs
- 🔒 **Security**: No hardcoded secrets or console usage

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🆘 Support

- 📖 **Documentation**: Check individual package READMEs
- 🐛 **Issues**: [GitHub Issues](https://github.com/matthew-ngo/util-modules/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/matthew-ngo/util-modules/discussions)

---

**Built with ❤️ by Matthew Ngo**