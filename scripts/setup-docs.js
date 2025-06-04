#!/usr/bin/env node

import { mkdir, writeFile, copyFile, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}${colors.bright}=== ${msg} ===${colors.reset}\n`),
};

async function createDirectoryStructure() {
  log.section('Creating Documentation Structure');
  
  const dirs = [
    'docs',
    'docs/.vitepress',
    'docs/.vitepress/theme',
    'docs/.vitepress/theme/components',
    'docs/src',
    'docs/src/guide',
    'docs/src/packages',
    'docs/src/packages/storage',
    'docs/src/packages/storage/examples',
    'docs/src/packages/ai-toolkit',
    'docs/src/packages/ai-toolkit/providers',
    'docs/src/packages/content-extractor',
    'docs/src/packages/analysis',
    'docs/src/api',
    'docs/public',
    'docs/public/images',
  ];

  for (const dir of dirs) {
    const fullPath = join(rootDir, dir);
    if (!existsSync(fullPath)) {
      await mkdir(fullPath, { recursive: true });
      log.success(`Created: ${dir}`);
    }
  }
}

async function installDependencies() {
  log.section('Installing Documentation Dependencies');
  
  try {
    // First, try to install with --ignore-scripts to avoid native dependency issues
    log.info('Installing dependencies with --ignore-scripts to avoid native compilation issues...');
    execSync(
      'pnpm add -D -w vitepress typedoc typedoc-plugin-markdown vue @vueuse/core --ignore-scripts',
      { cwd: rootDir, stdio: 'inherit' }
    );
    
    log.success('Dependencies installed successfully (with --ignore-scripts)');
    log.warning('Note: Some packages may have skipped post-install scripts to avoid compilation issues');
    
  } catch (error) {
    log.warning('Failed with --ignore-scripts, trying alternative approach...');
    
    try {
      // Try installing without the problematic lz4 dependency
      log.info('Trying to install without problematic native dependencies...');
      execSync(
        'pnpm add -D -w vitepress typedoc typedoc-plugin-markdown vue @vueuse/core --no-optional',
        { cwd: rootDir, stdio: 'inherit' }
      );
      
      log.success('Dependencies installed successfully (without optional dependencies)');
      
    } catch (secondError) {
      log.error('Failed to install dependencies with both methods');
      log.info('Possible solutions:');
      log.info('1. Install Python distutils: pip install setuptools');
      log.info('2. Use Node.js 18 instead of 20');
      log.info('3. Set PYTHON environment variable to Python 3.11 or earlier');
      log.info('4. Install Xcode command line tools: xcode-select --install');
      
      // Don't throw error, continue with setup
      log.warning('Continuing setup without installing dependencies. You may need to install them manually.');
    }
  }
}

async function createVitePressConfig() {
  log.section('Creating VitePress Configuration');
  
  const config = `import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Util Modules',
  description: 'A collection of utility modules for modern web development',
  
  // Paths
  srcDir: './src',
  outDir: './dist',
  cacheDir: './.vitepress/cache',
  
  // Theme
  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Packages', link: '/packages/' },
      { text: 'API', link: '/api/' }
    ],
    
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' }
          ]
        }
      ],
      
      '/packages/': [
        {
          text: 'Packages',
          items: [
            { text: 'Overview', link: '/packages/' },
            { text: 'Chrome Storage', link: '/packages/storage/' },
            { text: 'AI Toolkit', link: '/packages/ai-toolkit/' },
            { text: 'Content Extractor', link: '/packages/content-extractor/' },
            { text: 'Analysis', link: '/packages/analysis/' }
          ]
        }
      ]
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/matthew-ngo/util-modules' }
    ],
    
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Matthew Ngo'
    },
    
    search: {
      provider: 'local'
    }
  },
  
  // Markdown
  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  },
  
  // Build
  build: {
    chunkSizeWarningLimit: 1600
  }
});`;

  await writeFile(
    join(rootDir, 'docs/.vitepress/config.ts'),
    config
  );
  log.success('Created VitePress configuration');
}

async function createThemeFiles() {
  log.section('Creating Theme Files');
  
  // Create theme index
  const themeIndex = `import DefaultTheme from 'vitepress/theme';
import PackageInfo from './components/PackageInfo.vue';
import CodePlayground from './components/CodePlayground.vue';
import ApiTable from './components/ApiTable.vue';
import './style.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('PackageInfo', PackageInfo);
    app.component('CodePlayground', CodePlayground);
    app.component('ApiTable', ApiTable);
  }
};`;

  await writeFile(
    join(rootDir, 'docs/.vitepress/theme/index.ts'),
    themeIndex
  );
  log.success('Created theme index');
  
  // Create custom styles
  const customStyles = `:root {
  --vp-c-brand-1: #3eaf7c;
  --vp-c-brand-2: #3eaf7c;
  --vp-c-brand-3: #3eaf7c;
}

/* Package Info Component */
.package-info {
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  background: var(--vp-c-bg-soft);
}

.package-info__header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.package-info__icon {
  font-size: 24px;
}

.package-info__title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.package-info__version {
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-default-soft);
  padding: 2px 6px;
  border-radius: 4px;
}

.badge {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge--stable {
  background: #10b981;
  color: white;
}

.badge--beta {
  background: #f59e0b;
  color: white;
}

.badge--deprecated {
  background: #ef4444;
  color: white;
}

/* Code Playground Component */
.code-playground {
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  overflow: hidden;
  margin: 20px 0;
}

.code-playground__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-border);
}

.code-playground__title {
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.code-playground__actions {
  display: flex;
  gap: 8px;
}

.code-playground__button {
  padding: 4px 8px;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 12px;
}

.code-playground__button:hover {
  background: var(--vp-c-bg-soft);
}

.code-playground__editor {
  padding: 16px;
}

.code-playground__output {
  border-top: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-alt);
  padding: 16px;
}

.code-playground__output pre {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-1);
}

/* API Table Component */
.api-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.api-table th,
.api-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--vp-c-border);
}

.api-table th {
  background: var(--vp-c-bg-soft);
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.api-table__param {
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  background: var(--vp-c-default-soft);
  padding: 2px 4px;
  border-radius: 3px;
}

.api-table__type {
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  color: var(--vp-c-brand-1);
}

.api-table__required {
  font-size: 12px;
  font-weight: 500;
  color: #ef4444;
}

/* Feature Grid */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin: 20px 0;
}

.feature-card {
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 16px;
  background: var(--vp-c-bg-soft);
}

.feature-card h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: var(--vp-c-text-1);
}

.feature-card p {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
}`;

  await writeFile(
    join(rootDir, 'docs/.vitepress/theme/style.css'),
    customStyles
  );
  log.success('Created custom styles');
}

async function createPackageDocumentation() {
  log.section('Creating Package Documentation Templates');
  
  // Create main index
  const mainIndex = `# Util Modules

Welcome to the **Util Modules** documentation! This is a collection of utility modules designed to make modern web development easier and more efficient.

## 🚀 Quick Start

Choose a package to get started:

<div class="feature-grid">
  <div class="feature-card">
    <h3>🔐 Chrome Storage</h3>
    <p>Secure, encrypted storage wrapper for Chrome extensions</p>
    <a href="/packages/storage/">Get Started →</a>
  </div>
  <div class="feature-card">
    <h3>🤖 AI Toolkit</h3>
    <p>Unified interface for multiple AI providers</p>
    <a href="/packages/ai-toolkit/">Get Started →</a>
  </div>
  <div class="feature-card">
    <h3>📄 Content Extractor</h3>
    <p>Extract and parse content from various sources</p>
    <a href="/packages/content-extractor/">Get Started →</a>
  </div>
  <div class="feature-card">
    <h3>📊 Analysis</h3>
    <p>Data analysis and processing utilities</p>
    <a href="/packages/analysis/">Get Started →</a>
  </div>
</div>

## 📦 Installation

All packages are available on npm and can be installed individually:

\`\`\`bash
# Install specific packages
pnpm add @matthew.ngo/storage
pnpm add @matthew.ngo/ai-toolkit

# Or install all at once
pnpm add @matthew.ngo/storage @matthew.ngo/ai-toolkit @matthew.ngo/content-extractor @matthew.ngo/analysis
\`\`\`

## 🛠️ Features

- **TypeScript First** - Full type safety and excellent IntelliSense
- **Tree Shakeable** - Only import what you need
- **Well Tested** - Comprehensive test coverage
- **Documentation** - Detailed docs with examples
- **Modern** - Built with latest standards and best practices

## 📖 Documentation

- [Installation Guide](/guide/installation)
- [Quick Start](/guide/quick-start)
- [API Reference](/api/)
- [Examples](https://github.com/matthew-ngo/util-modules/tree/main/examples)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/matthew-ngo/util-modules/blob/main/CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](https://github.com/matthew-ngo/util-modules/blob/main/LICENSE) for details.
`;

  await writeFile(join(rootDir, 'docs/src/index.md'), mainIndex);
  log.success('Created main documentation index');
  
  // Storage package documentation
  const storageIndex = `# Chrome Storage

<PackageInfo 
  name="@matthew.ngo/storage"
  icon="🔐"
  version="1.0.0"
  status="stable"
/>

## Overview

The Chrome Storage module provides a robust and type-safe wrapper around Chrome's storage APIs with additional features like encryption, compression, and migration support.

## Features

- 🔐 **Encryption Support** - Secure your sensitive data
- 🗜️ **Compression** - Reduce storage usage automatically
- 🔄 **Sync Storage** - Seamlessly sync across devices
- 📊 **Storage Analytics** - Monitor usage and performance
- 🔀 **Migration Tools** - Upgrade storage schemas safely
- 🎯 **TypeScript First** - Full type safety and IntelliSense

## Installation

::: code-group
\`\`\`bash [pnpm]
pnpm add @matthew.ngo/storage
\`\`\`

\`\`\`bash [npm]
npm install @matthew.ngo/storage
\`\`\`

\`\`\`bash [yarn]
yarn add @matthew.ngo/storage
\`\`\`
:::

## Quick Start

\`\`\`typescript
import { createStorage } from '@matthew.ngo/storage';

// Create a storage instance with encryption
const storage = createStorage({
  type: 'local',
  prefix: 'myapp_',
  encryption: {
    enabled: true,
    key: process.env.ENCRYPTION_KEY
  }
});

// Store encrypted data
await storage.set('user', { 
  id: 123, 
  name: 'John Doe' 
});

// Retrieve and decrypt automatically
const user = await storage.get('user');
\`\`\`

## Next Steps

- [Installation Guide](./installation)
- [Basic Usage](./usage)
- [API Reference](./api)
- [Examples](./examples/basic)
`;

  await writeFile(
    join(rootDir, 'docs/src/packages/storage/index.md'),
    storageIndex
  );
  log.success('Created storage package documentation');

  // AI Toolkit documentation
  const aiToolkitIndex = `# AI Toolkit

<PackageInfo 
  name="@matthew.ngo/ai-toolkit"
  icon="🤖"
  version="1.0.0"
  status="stable"
/>

## Overview

The AI Toolkit provides a unified interface for working with multiple AI providers including OpenAI, Anthropic, Google AI, and more. Built with performance and developer experience in mind.

## Features

- 🔌 **Multi-Provider Support** - OpenAI, Anthropic, Google, and more
- 💾 **Smart Caching** - Reduce API calls and costs
- ⚡ **Streaming Support** - Real-time responses
- 🔒 **Rate Limiting** - Prevent API quota issues
- 🎯 **Type Safe** - Full TypeScript support
- 📊 **Usage Analytics** - Track costs and performance

## Supported Providers

<div class="feature-grid">
  <div class="feature-card">
    <h3>OpenAI</h3>
    <p>GPT-4, GPT-3.5, DALL-E, Whisper</p>
  </div>
  <div class="feature-card">
    <h3>Anthropic</h3>
    <p>Claude 3, Claude 2, Claude Instant</p>
  </div>
  <div class="feature-card">
    <h3>Google AI</h3>
    <p>Gemini Pro, PaLM 2</p>
  </div>
  <div class="feature-card">
    <h3>Custom</h3>
    <p>Bring your own provider</p>
  </div>
</div>

## Quick Start

\`\`\`typescript
import { createAI } from '@matthew.ngo/ai-toolkit';

// Initialize with your preferred provider
const ai = createAI({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
  cache: {
    enabled: true,
    ttl: 3600 // 1 hour
  }
});

// Generate text
const response = await ai.complete({
  prompt: 'Write a haiku about programming',
  model: 'gpt-4',
  temperature: 0.7
});

console.log(response.text);
\`\`\`

## Next Steps

- [Installation](./installation)
- [Configuration](./configuration)
- [Provider Guides](./providers/openai)
- [API Reference](./api)
`;

  await writeFile(
    join(rootDir, 'docs/src/packages/ai-toolkit/index.md'),
    aiToolkitIndex
  );
  log.success('Created AI toolkit documentation');
}

async function createComponents() {
  log.section('Creating Vue Components');
  
  // PackageInfo component
  const packageInfoComponent = `<template>
  <div class="package-info">
    <div class="package-info__header">
      <span class="package-info__icon">{{ icon }}</span>
      <h3 class="package-info__title">{{ name }}</h3>
      <span class="package-info__version">v{{ version }}</span>
      <span :class="['badge', \`badge--\${status}\`]">{{ status }}</span>
    </div>
    <div class="package-info__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string;
  icon: string;
  version: string;
  status: 'stable' | 'beta' | 'deprecated';
}

defineProps<Props>();
</script>
`;

  await writeFile(
    join(rootDir, 'docs/.vitepress/theme/components/PackageInfo.vue'),
    packageInfoComponent
  );
  log.success('Created PackageInfo component');

  // CodePlayground component
  const codePlaygroundComponent = `<template>
  <div class="code-playground">
    <div class="code-playground__header">
      <span class="code-playground__title">{{ title }}</span>
      <div class="code-playground__actions">
        <button @click="runCode" class="code-playground__button">
          ▶️ Run
        </button>
        <button @click="resetCode" class="code-playground__button">
          🔄 Reset
        </button>
        <button @click="copyCode" class="code-playground__button">
          📋 Copy
        </button>
      </div>
    </div>
    <div class="code-playground__editor">
      <slot />
    </div>
    <div v-if="output" class="code-playground__output">
      <pre>{{ output }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  title: string;
  code: string;
}

const props = defineProps<Props>();
const output = ref('');

const runCode = () => {
  // Simulate code execution
  output.value = 'Code executed successfully!\\nOutput would appear here...';
};

const resetCode = () => {
  output.value = '';
};

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code);
    alert('Code copied to clipboard!');
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
</script>
`;

  await writeFile(
    join(rootDir, 'docs/.vitepress/theme/components/CodePlayground.vue'),
    codePlaygroundComponent
  );
  log.success('Created CodePlayground component');

  // ApiTable component
  const apiTableComponent = `<template>
  <table class="api-table">
    <thead>
      <tr>
        <th>Parameter</th>
        <th>Type</th>
        <th>Required</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="param in params" :key="param.name">
        <td><code class="api-table__param">{{ param.name }}</code></td>
        <td><span class="api-table__type">{{ param.type }}</span></td>
        <td>
          <span v-if="param.required" class="api-table__required">Required</span>
          <span v-else>Optional</span>
        </td>
        <td>{{ param.description }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
interface ApiParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface Props {
  params: ApiParam[];
}

defineProps<Props>();
</script>
`;

  await writeFile(
    join(rootDir, 'docs/.vitepress/theme/components/ApiTable.vue'),
    apiTableComponent
  );
  log.success('Created ApiTable component');
}

async function createTypedocConfig() {
  log.section('Creating TypeDoc Configuration');
  
  const typedocConfig = `{
  "entryPoints": [
    "./packages/*/src/index.ts"
  ],
  "out": "./docs/src/api",
  "plugin": ["typedoc-plugin-markdown"],
  "theme": "markdown",
  "hideGenerator": true,
  "disableSources": true,
  "excludePrivate": true,
  "excludeProtected": true,
  "excludeExternals": true,
  "readme": "none",
  "navigation": {
    "includeCategories": true,
    "includeGroups": true
  }
}`;

  await writeFile(join(rootDir, 'typedoc.json'), typedocConfig);
  log.success('Created TypeDoc configuration');
}

async function updatePackageJson() {
  log.section('Updating package.json');
  
  const packageJsonPath = join(rootDir, 'package.json');
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'));
  
  // Add documentation scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    'docs:dev': 'vitepress dev docs',
    'docs:build': 'pnpm docs:api && vitepress build docs',
    'docs:preview': 'vitepress preview docs',
    'docs:api': 'typedoc',
    'docs:serve': 'pnpm docs:build && pnpm docs:preview',
  };
  
  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  log.success('Updated package.json with documentation scripts');
}

async function createExampleFiles() {
  log.section('Creating Example Files');
  
  // Create a simple logo placeholder
  const logoSvg = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="8" fill="#3eaf7c"/>
  <path d="M16 8L22 12V20L16 24L10 20V12L16 8Z" fill="white"/>
</svg>`;

  await writeFile(join(rootDir, 'docs/public/logo.svg'), logoSvg);
  log.success('Created logo.svg');

  // Create favicon
  const favicon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="16" height="16" rx="3" fill="#3eaf7c"/>
  <path d="M8 4L11 6V10L8 12L5 10V6L8 4Z" fill="white"/>
</svg>`;

  await writeFile(join(rootDir, 'docs/public/favicon.svg'), favicon);
  log.success('Created favicon.svg');
}

async function main() {
  console.log(`
${colors.bright}${colors.cyan}
╔═══════════════════════════════════════════╗
║   📚 Documentation System Setup          ║
╚═══════════════════════════════════════════╝
${colors.reset}
`);

  try {
    await createDirectoryStructure();
    await installDependencies();
    await createVitePressConfig();
    await createThemeFiles();
    await createPackageDocumentation();
    await createComponents();
    await createTypedocConfig();
    await updatePackageJson();
    await createExampleFiles();
    
    log.section('Setup Complete! 🎉');
    
    console.log(`
${colors.green}Documentation system has been set up successfully!${colors.reset}

${colors.bright}Next steps:${colors.reset}

1. If dependencies failed to install, try manually:
   ${colors.cyan}pnpm add -D -w vitepress typedoc typedoc-plugin-markdown vue @vueuse/core --ignore-scripts${colors.reset}

2. Start the development server:
   ${colors.cyan}pnpm docs:dev${colors.reset}

3. Build API documentation:
   ${colors.cyan}pnpm docs:api${colors.reset}

4. Build for production:
   ${colors.cyan}pnpm docs:build${colors.reset}

${colors.bright}To fix the lz4/distutils error:${colors.reset}

${colors.yellow}Option 1 - Install Python setuptools:${colors.reset}
   pip install setuptools

${colors.yellow}Option 2 - Use older Python:${colors.reset}
   export PYTHON=/usr/bin/python3.11

${colors.yellow}Option 3 - Use Node.js 18:${colors.reset}
   nvm use 18

${colors.bright}Customize your docs:${colors.reset}

- Edit ${colors.yellow}docs/.vitepress/config.ts${colors.reset} for site configuration
- Modify ${colors.yellow}docs/.vitepress/theme/style.css${colors.reset} for custom styling
- Add content in ${colors.yellow}docs/src/${colors.reset} directory

Happy documenting! 📚
`);
  } catch (error) {
    log.error(`Setup failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

main();