#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// ANSI colors
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

async function runCommand(command, description) {
  try {
    log.info(description);
    execSync(command, { cwd: rootDir, stdio: 'inherit' });
    log.success(`${description} - completed`);
    return true;
  } catch (error) {
    log.error(`${description} - failed`);
    return false;
  }
}

async function setupGitHooks() {
  log.section('Setting up Git Hooks');

  // Install husky and related packages
  await runCommand(
    'pnpm add -D -w husky lint-staged @commitlint/cli @commitlint/config-conventional',
    'Installing Git hooks dependencies'
  );

  // Initialize husky
  await runCommand('pnpm exec husky install', 'Initializing husky');

  // Create hooks directory
  const hooksDir = join(rootDir, '.husky');
  if (!existsSync(hooksDir)) {
    await mkdir(hooksDir, { recursive: true });
  }

  // Pre-commit hook
  const preCommitHook = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🚀 Running pre-commit checks..."
pnpm lint-staged
`;

  await writeFile(join(hooksDir, 'pre-commit'), preCommitHook, { mode: 0o755 });
  log.success('Created pre-commit hook');

  // Commit-msg hook
  const commitMsgHook = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "📝 Validating commit message..."
pnpm exec commitlint --edit "$1"
`;

  await writeFile(join(hooksDir, 'commit-msg'), commitMsgHook, { mode: 0o755 });
  log.success('Created commit-msg hook');

  // Pre-push hook
  const prePushHook = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🧪 Running tests before push..."
pnpm affected:test
`;

  await writeFile(join(hooksDir, 'pre-push'), prePushHook, { mode: 0o755 });
  log.success('Created pre-push hook');
}

async function setupDocumentation() {
  log.section('Setting up Documentation Tools');

  // Install documentation dependencies
  await runCommand(
    'pnpm add -D -w typedoc typedoc-plugin-markdown vitepress @microsoft/api-extractor',
    'Installing documentation dependencies'
  );

  // Create docs directory
  const docsDir = join(rootDir, 'docs');
  if (!existsSync(docsDir)) {
    await mkdir(docsDir, { recursive: true });
  }

  // VitePress config
  const vitepressConfig = `import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Util Modules',
  description: 'A comprehensive collection of utility modules',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' },
          ],
        },
        {
          text: 'Packages',
          items: [
            { text: 'Chrome Storage', link: '/guide/storage' },
            { text: 'AI Toolkit', link: '/guide/ai-toolkit' },
            { text: 'Content Extractor', link: '/guide/content-extractor' },
            { text: 'Analysis', link: '/guide/analysis' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/matthew-ngo/util-modules' },
    ],
  },
});
`;

  await writeFile(join(docsDir, '.vitepress', 'config.ts'), vitepressConfig);
  log.success('Created VitePress configuration');

  // Add documentation scripts to package.json
  log.info('Adding documentation scripts to package.json');
}

async function setupTesting() {
  log.section('Setting up Enhanced Testing');

  // Install testing dependencies
  await runCommand(
    'pnpm add -D -w @testing-library/react @testing-library/jest-dom playwright @faker-js/faker @vitest/ui',
    'Installing enhanced testing dependencies'
  );

  // Create shared test utilities
  const testUtilsDir = join(rootDir, 'test-utils');
  if (!existsSync(testUtilsDir)) {
    await mkdir(testUtilsDir, { recursive: true });
  }

  const testUtils = `// test-utils/index.ts
import { faker } from '@faker-js/faker';

export { faker };

export function createMockData<T>(factory: () => T, count = 1): T[] {
  return Array.from({ length: count }, factory);
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function mockConsole() {
  const originalConsole = { ...console };
  
  beforeEach(() => {
    console.log = vi.fn();
    console.error = vi.fn();
    console.warn = vi.fn();
  });
  
  afterEach(() => {
    console.log = originalConsole.log;
    console.error = originalConsole.error;
    console.warn = originalConsole.warn;
  });
  
  return {
    getLogs: () => (console.log as any).mock.calls,
    getErrors: () => (console.error as any).mock.calls,
    getWarnings: () => (console.warn as any).mock.calls,
  };
}
`;

  await writeFile(join(testUtilsDir, 'index.ts'), testUtils);
  log.success('Created shared test utilities');
}

async function setupVSCodeIntegration() {
  log.section('Setting up VS Code Integration');

  const vscodeDir = join(rootDir, '.vscode');
  if (!existsSync(vscodeDir)) {
    await mkdir(vscodeDir, { recursive: true });
  }

  // VS Code settings
  const vscodeSettings = {
    'editor.formatOnSave': true,
    'editor.defaultFormatter': 'esbenp.prettier-vscode',
    'editor.codeActionsOnSave': {
      'source.fixAll.eslint': true,
    },
    'typescript.tsdk': 'node_modules/typescript/lib',
    'typescript.enablePromptUseWorkspaceTsdk': true,
    'nx.affectedButtonsShown': true,
    'vitest.enable': true,
    'vitest.commandLine': 'pnpm test',
  };

  await writeFile(
    join(vscodeDir, 'settings.json'),
    JSON.stringify(vscodeSettings, null, 2)
  );
  log.success('Created VS Code settings');

  // VS Code extensions
  const vscodeExtensions = {
    recommendations: [
      'nrwl.angular-console',
      'esbenp.prettier-vscode',
      'dbaeumer.vscode-eslint',
      'vitest.explorer',
      'github.vscode-pull-request-github',
      'eamodio.gitlens',
      'usernamehw.errorlens',
      'streetsidesoftware.code-spell-checker',
    ],
  };

  await writeFile(
    join(vscodeDir, 'extensions.json'),
    JSON.stringify(vscodeExtensions, null, 2)
  );
  log.success('Created VS Code extensions recommendations');

  // Debug configurations
  const launchConfig = {
    version: '0.2.0',
    configurations: [
      {
        type: 'node',
        request: 'launch',
        name: 'Debug Current Test File',
        autoAttachChildProcesses: true,
        skipFiles: ['<node_internals>/**', '**/node_modules/**'],
        program: '${workspaceRoot}/node_modules/vitest/vitest.mjs',
        args: ['run', '${relativeFile}'],
        smartStep: true,
        console: 'integratedTerminal',
      },
    ],
  };

  await writeFile(
    join(vscodeDir, 'launch.json'),
    JSON.stringify(launchConfig, null, 2)
  );
  log.success('Created debug configurations');
}

async function setupGitHubTemplates() {
  log.section('Setting up GitHub Templates');

  const githubDir = join(rootDir, '.github');
  const templatesDir = join(githubDir, 'ISSUE_TEMPLATE');
  
  if (!existsSync(templatesDir)) {
    await mkdir(templatesDir, { recursive: true });
  }

  // Bug report template
  const bugReport = `---
name: Bug Report
about: Create a report to help us improve
title: '[Bug]: '
labels: ['bug', 'triage']
assignees: ''
---

## 🐛 Bug Description

A clear and concise description of what the bug is.

## 📋 Steps to Reproduce

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## 🤔 Expected Behavior

A clear and concise description of what you expected to happen.

## 📸 Screenshots

If applicable, add screenshots to help explain your problem.

## 🖥️ Environment

- **Package**: @matthew.ngo/[package-name]
- **Version**: [e.g. 1.0.0]
- **Node**: [e.g. 18.0.0]
- **OS**: [e.g. macOS 13.0]
- **Browser**: [e.g. Chrome 109]

## 📝 Additional Context

Add any other context about the problem here.
`;

  await writeFile(join(templatesDir, 'bug_report.md'), bugReport);
  log.success('Created bug report template');

  // Feature request template
  const featureRequest = `---
name: Feature Request
about: Suggest an idea for this project
title: '[Feature]: '
labels: ['enhancement']
assignees: ''
---

## 🚀 Feature Description

A clear and concise description of what you want to happen.

## 🤔 Problem Statement

Describe the problem you're trying to solve.

## 💡 Proposed Solution

A clear and concise description of what you want to happen.

## 🔄 Alternatives Considered

Describe any alternative solutions or features you've considered.

## 📝 Additional Context

Add any other context or screenshots about the feature request here.
`;

  await writeFile(join(templatesDir, 'feature_request.md'), featureRequest);
  log.success('Created feature request template');

  // Pull request template
  const prTemplate = `## 📋 Description

Please include a summary of the changes and the related issue. Please also include relevant motivation and context.

Fixes # (issue)

## 🔄 Type of Change

Please delete options that are not relevant.

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## ✅ Checklist

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published in downstream modules

## 📸 Screenshots (if appropriate)

## 📝 Additional Notes
`;

  await writeFile(join(githubDir, 'PULL_REQUEST_TEMPLATE.md'), prTemplate);
  log.success('Created pull request template');
}

async function main() {
  console.log(`
${colors.bright}${colors.cyan}
╔═══════════════════════════════════════════╗
║   🚀 Monorepo Improvement Setup Script    ║
╚═══════════════════════════════════════════╝
${colors.reset}
`);

  log.info('This script will set up various improvements for your monorepo');
  log.warning('Make sure you have committed your current changes before proceeding');
  
  // Run all setup functions
  await setupGitHooks();
  await setupDocumentation();
  await setupTesting();
  await setupVSCodeIntegration();
  await setupGitHubTemplates();

  // Final steps
  log.section('Final Steps');
  
  // Update package.json with new scripts
  log.info('Please add these scripts to your root package.json:');
  console.log(`
  "docs:dev": "vitepress dev docs",
  "docs:build": "typedoc && vitepress build docs",
  "docs:preview": "vitepress preview docs",
  "prepare": "husky install",
  "commit": "cz",
  "test:ui": "vitest --ui",
  "test:e2e": "playwright test",
  `);

  console.log(`
${colors.bright}${colors.green}
✨ Setup completed successfully! ✨
${colors.reset}

Next steps:
1. Run ${colors.cyan}pnpm install${colors.reset} to install new dependencies
2. Add the suggested scripts to your package.json
3. Commit the changes with ${colors.cyan}pnpm commit${colors.reset}
4. Start the documentation server with ${colors.cyan}pnpm docs:dev${colors.reset}

Happy coding! 🎉
`);
}

main().catch((error) => {
  log.error(`Setup failed: ${error.message}`);
  process.exit(1);
});