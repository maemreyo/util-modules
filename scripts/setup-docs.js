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
    execSync(
      'pnpm add -D -w vitepress typedoc typedoc-plugin-markdown vue @vueuse/core',
      { cwd: rootDir, stdio: 'inherit' }
    );
    log.success('Dependencies installed successfully');
  } catch (error) {
    log.error('Failed to install dependencies');
    throw error;
  }
}

async function createPackageDocumentation() {
  log.section('Creating Package Documentation Templates');
  
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

## Try It Out

<CodePlayground 
  title="Chrome Storage Example"
  code="\`\`\`javascript
// Try modifying this code!
const storage = createStorage({ prefix: 'demo_' });

// Store some data
await storage.set('counter', 0);

// Increment counter
const current = await storage.get('counter');
await storage.set('counter', current + 1);

console.log('Counter:', await storage.get('counter'));
\`\`\`"
/>

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
    await createPackageDocumentation();
    await createComponents();
    await updatePackageJson();
    await createExampleFiles();
    
    log.section('Setup Complete! 🎉');
    
    console.log(`
${colors.green}Documentation system has been set up successfully!${colors.reset}

${colors.bright}Next steps:${colors.reset}

1. Start the development server:
   ${colors.cyan}pnpm docs:dev${colors.reset}

2. Build API documentation:
   ${colors.cyan}pnpm docs:api${colors.reset}

3. Build for production:
   ${colors.cyan}pnpm docs:build${colors.reset}

4. Preview production build:
   ${colors.cyan}pnpm docs:preview${colors.reset}

${colors.bright}Customize your docs:${colors.reset}

- Edit ${colors.yellow}docs/.vitepress/config.ts${colors.reset} for site configuration
- Modify ${colors.yellow}docs/.vitepress/theme/style.css${colors.reset} for custom styling
- Add content in ${colors.yellow}docs/src/${colors.reset} directory
- Create examples in each package's ${colors.yellow}examples/${colors.reset} folder

${colors.bright}Tips:${colors.reset}
- Use ${colors.cyan}<PackageInfo />${colors.reset} component for package headers
- Use ${colors.cyan}<CodePlayground />${colors.reset} for interactive examples  
- Use ${colors.cyan}<ApiTable />${colors.reset} for API documentation
- Enable search by adding Algolia DocSearch

Happy documenting! 📚
`);
  } catch (error) {
    log.error(`Setup failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

main();