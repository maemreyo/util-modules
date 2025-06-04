# Getting Started

Welcome to Util Modules! This guide will help you get up and running quickly.

## Overview

Util Modules is a collection of high-quality TypeScript utilities designed for modern web development. Each module is:

- 🎯 **Focused** - Does one thing well
- 🚀 **Performant** - Optimized for speed and size
- 🛡️ **Type-safe** - Full TypeScript support
- 📦 **Tree-shakeable** - Only bundle what you use
- 🧪 **Well-tested** - >90% test coverage

## Prerequisites

Before you begin, ensure you have:

- Node.js 18.0.0 or higher
- A package manager (pnpm, npm, or yarn)
- Basic knowledge of JavaScript/TypeScript

## Installation

::: code-group

```bash [pnpm]
pnpm add @matthew.ngo/storage
```

```bash [npm]
npm install @matthew.ngo/storage
```

```bash [yarn]
yarn add @matthew.ngo/storage
```

:::

## Your First Example

Let's start with a simple example using the Chrome Storage module:

```typescript
import { createStorage } from '@matthew.ngo/storage';

// Create a storage instance
const storage = createStorage({
  prefix: 'myapp_',
  encryption: true
});

// Store data
await storage.set('user', {
  name: 'John Doe',
  email: 'john@example.com'
});

// Retrieve data
const user = await storage.get('user');
console.log(user); // { name: 'John Doe', email: 'john@example.com' }

// Remove data
await storage.remove('user');
```

## Available Packages

### 🔐 Chrome Storage
Advanced Chrome extension storage with encryption and sync.

```bash
pnpm add @matthew.ngo/storage
```

[Learn more →](/packages/storage/)

### 🤖 AI Toolkit
Multi-provider AI integration with caching and streaming.

```bash
pnpm add @matthew.ngo/ai-toolkit
```

[Learn more →](/packages/ai-toolkit/)

### 📄 Content Extractor
Extract content from web pages and documents.

```bash
pnpm add @matthew.ngo/content-extractor
```

[Learn more →](/packages/content-extractor/)

### 📊 Analysis Engine
Advanced text and data analysis tools.

```bash
pnpm add @matthew.ngo/analysis
```

[Learn more →](/packages/analysis/)

## TypeScript Configuration

All packages are written in TypeScript and include type definitions. For the best experience, use these TypeScript settings:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## Module Systems

All packages support both ESM and CommonJS:

::: code-group

```javascript [ESM]
import { createStorage } from '@matthew.ngo/storage';
```

```javascript [CommonJS]
const { createStorage } = require('@matthew.ngo/storage');
```

:::

## Bundle Size

Each package is optimized for minimal bundle size:

| Package | Minified | Gzipped |
|---------|----------|---------|
| @matthew.ngo/storage | 8.2 KB | 3.1 KB |
| @matthew.ngo/ai-toolkit | 12.5 KB | 4.7 KB |
| @matthew.ngo/content-extractor | 15.3 KB | 5.8 KB |
| @matthew.ngo/analysis | 18.7 KB | 6.9 KB |

## Browser Support

All packages support:

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Node.js 18+

## Next Steps

Now that you have the basics, explore:

- 📖 [Core Concepts](/guide/core-concepts) - Understand the design principles
- 🏗️ [Monorepo Structure](/guide/monorepo) - How the project is organized
- 🧪 [Testing Guide](/guide/testing) - Write tests for your code
- 📚 [API Reference](/api/) - Detailed API documentation

## Getting Help

If you run into issues:

1. Check the [FAQ](/guide/faq)
2. Search [existing issues](https://github.com/matthew-ngo/util-modules/issues)
3. Join our [Discord community](https://discord.gg/util-modules)
4. Create a [new issue](https://github.com/matthew-ngo/util-modules/issues/new)

## Contributing

We welcome contributions! See our [Contributing Guide](/contributing) to get started.

::: tip Ready to dive deeper?
Check out the individual package documentation for detailed usage examples and advanced features.
:::