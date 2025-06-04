---
layout: home

hero:
  name: "Util Modules"
  text: "Modern Utility Collection"
  tagline: Enterprise-grade TypeScript utilities for web development
  image:
    src: /logo.svg
    alt: Util Modules
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/matthew-ngo/util-modules

features:
  - icon: 🔐
    title: Chrome Storage
    details: Advanced Chrome extension storage with encryption, compression, and sync capabilities
    link: /packages/storage/
    
  - icon: 🤖
    title: AI Toolkit
    details: Multi-provider AI integration with caching, rate limiting, and streaming support
    link: /packages/ai-toolkit/
    
  - icon: 📄
    title: Content Extractor
    details: Intelligent content extraction from web pages, PDFs, and various document formats
    link: /packages/content-extractor/
    
  - icon: 📊
    title: Analysis Engine
    details: Advanced text and data analysis tools with sentiment analysis and NLP capabilities
    link: /packages/analysis/

  - icon: ⚡
    title: Lightning Fast
    details: Optimized for performance with tree-shaking and minimal bundle size
    
  - icon: 🛡️
    title: Type Safe
    details: Built with TypeScript from the ground up with strict type checking
---

## Quick Start

Get started with Util Modules in under 5 minutes:

```bash
# Install with pnpm (recommended)
pnpm add @matthew.ngo/storage

# Install with npm
npm install @matthew.ngo/ai-toolkit

# Install with yarn
yarn add @matthew.ngo/content-extractor
```

## Why Util Modules?

<div class="features">
  <div class="feature">
    <h3>🚀 Modern Architecture</h3>
    <p>Built with the latest web standards and best practices. ESM first, tree-shakeable, and optimized for modern bundlers.</p>
  </div>
  
  <div class="feature">
    <h3>🧪 Battle Tested</h3>
    <p>Comprehensive test coverage (>90%) with real-world usage in production applications serving millions of users.</p>
  </div>
  
  <div class="feature">
    <h3>📚 Excellent Documentation</h3>
    <p>Detailed API documentation, guides, and examples for every use case. Interactive playground for testing.</p>
  </div>
  
  <div class="feature">
    <h3>🤝 Active Community</h3>
    <p>Join our growing community of developers. Get help, share ideas, and contribute to the project.</p>
  </div>
</div>

## Trusted By

<div class="sponsors">
  <img src="/sponsors/company1.svg" alt="Company 1" />
  <img src="/sponsors/company2.svg" alt="Company 2" />
  <img src="/sponsors/company3.svg" alt="Company 3" />
  <img src="/sponsors/company4.svg" alt="Company 4" />
</div>

## Latest Updates

::: info Version 1.0.0 Released! 🎉
Major release with improved performance, new features, and better TypeScript support.
[Read the announcement →](/blog/v1-release)
:::

## Get Involved

- ⭐ [Star on GitHub](https://github.com/matthew-ngo/util-modules)
- 🐛 [Report Issues](https://github.com/matthew-ngo/util-modules/issues)
- 💬 [Join Discussions](https://github.com/matthew-ngo/util-modules/discussions)
- 🤝 [Contribute](https://github.com/matthew-ngo/util-modules/blob/main/CONTRIBUTING.md)

<style>
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.feature {
  padding: 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.feature:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.sponsors {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 2rem 0;
  filter: grayscale(100%);
  opacity: 0.7;
}

.sponsors img {
  height: 40px;
}
</style>