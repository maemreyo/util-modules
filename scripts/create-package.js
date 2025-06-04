#!/usr/bin/env node
// scripts/create-package.js

import { mkdir, writeFile, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
};

async function createPackage() {
  const packageName = process.argv[2];
  
  if (!packageName) {
    log.error('Please provide a package name');
    console.log(`Usage: pnpm create:package <package-name>`);
    process.exit(1);
  }

  const packageDir = join(rootDir, 'packages', packageName);
  
  if (existsSync(packageDir)) {
    log.error(`Package "${packageName}" already exists`);
    process.exit(1);
  }

  log.info(`Creating package: ${colors.bright}${packageName}${colors.reset}`);

  // Create directory structure
  const dirs = [
    packageDir,
    join(packageDir, 'src'),
    join(packageDir, 'tests'),
  ];

  for (const dir of dirs) {
    await mkdir(dir, { recursive: true });
    log.success(`Created directory: ${dir.replace(rootDir, '.')}`);
  }

  // Package.json
  const packageJson = {
    name: `@matthew.ngo/${packageName}`,
    version: '0.0.0',
    description: `${packageName} utility module`,
    keywords: ['utility', 'typescript', packageName],
    author: 'Matthew Ngo',
    license: 'MIT',
    homepage: `https://github.com/matthew-ngo/util-modules/tree/main/packages/${packageName}`,
    repository: {
      type: 'git',
      url: 'https://github.com/matthew-ngo/util-modules.git',
      directory: `packages/${packageName}`,
    },
    bugs: {
      url: 'https://github.com/matthew-ngo/util-modules/issues',
    },
    type: 'module',
    exports: {
      '.': {
        types: './dist/index.d.ts',
        import: './dist/index.mjs',
        require: './dist/index.js',
      },
      './package.json': './package.json',
    },
    main: './dist/index.js',
    module: './dist/index.mjs',
    types: './dist/index.d.ts',
    files: ['dist', 'README.md', 'LICENSE', 'CHANGELOG.md'],
    sideEffects: false,
    scripts: {
      build: 'tsup',
      'build:watch': 'tsup --watch',
      dev: 'tsup --watch',
      clean: 'rm -rf dist coverage .turbo',
      typecheck: 'tsc --noEmit',
      test: 'vitest run',
      'test:watch': 'vitest watch',
      'test:coverage': 'vitest run --coverage',
      'test:ui': 'vitest --ui',
      lint: 'eslint src --ext .ts,.tsx',
      'lint:fix': 'eslint src --ext .ts,.tsx --fix',
      format: 'prettier --write "src/**/*.{ts,tsx,js,jsx,json,md}"',
      'format:check': 'prettier --check "src/**/*.{ts,tsx,js,jsx,json,md}"',
      prepublishOnly: 'pnpm run clean && pnpm run build',
      size: 'size-limit',
      analyze: 'size-limit --why',
    },
    dependencies: {},
    devDependencies: {},
    engines: {
      node: '>=18.0.0',
    },
    publishConfig: {
      access: 'public',
      registry: 'https://registry.npmjs.org/',
    },
    'size-limit': [
      {
        path: 'dist/index.mjs',
        limit: '10 KB',
      },
      {
        path: 'dist/index.js',
        limit: '10 KB',
      },
    ],
  };

  await writeFile(
    join(packageDir, 'package.json'),
    JSON.stringify(packageJson, null, 2) + '\n'
  );
  log.success('Created package.json');

  // tsconfig.json
  const tsConfig = {
    extends: '../../configs/tsconfig.base.json',
    compilerOptions: {
      rootDir: './src',
      outDir: './dist',
      declarationDir: './dist',
      tsBuildInfoFile: './dist/tsconfig.tsbuildinfo',
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist', 'tests', '**/*.test.ts', '**/*.spec.ts'],
  };

  await writeFile(
    join(packageDir, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2) + '\n'
  );
  log.success('Created tsconfig.json');

  // tsup.config.ts
  const tsupConfig = `import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  treeshake: true,
  shims: true,
  skipNodeModulesBundle: true,
  external: ['node:*'],
  noExternal: [],
  esbuildOptions(options) {
    options.banner = {
      js: '"use strict";',
    };
  },
  onSuccess: 'echo "✅ Build completed!"',
});
`;

  await writeFile(join(packageDir, 'tsup.config.ts'), tsupConfig);
  log.success('Created tsup.config.ts');

  // vitest.config.ts
  const vitestConfig = `import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'build/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/**',
        '**/tests/**',
        '**/__mocks__/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
    include: ['tests/**/*.test.ts', 'tests/**/*.spec.ts'],
    exclude: ['node_modules', 'dist', 'build', '.idea', '.git', '.cache'],
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
`;

  await writeFile(join(packageDir, 'vitest.config.ts'), vitestConfig);
  log.success('Created vitest.config.ts');

  // src/index.ts
  const indexTs = `/**
 * ${packageName} utility module
 * @packageDocumentation
 */

export const VERSION = '0.0.0';

/**
 * Example function
 * @param name - The name to greet
 * @returns A greeting message
 */
export function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

// Export all public APIs here
export * from './types';
`;

  await writeFile(join(packageDir, 'src', 'index.ts'), indexTs);
  log.success('Created src/index.ts');

  // src/types.ts
  const typesTs = `/**
 * Type definitions for ${packageName}
 */

/**
 * Example interface
 */
export interface Config {
  /**
   * Enable debug mode
   * @default false
   */
  debug?: boolean;
  
  /**
   * Custom options
   */
  options?: Record<string, unknown>;
}
`;

  await writeFile(join(packageDir, 'src', 'types.ts'), typesTs);
  log.success('Created src/types.ts');

  // tests/index.test.ts
  const testFile = `import { describe, it, expect } from 'vitest';
import { greet } from '../src';

describe('${packageName}', () => {
  describe('greet', () => {
    it('should return a greeting message', () => {
      expect(greet('World')).toBe('Hello, World!');
    });
    
    it('should handle empty string', () => {
      expect(greet('')).toBe('Hello, !');
    });
  });
});
`;

  await writeFile(join(packageDir, 'tests', 'index.test.ts'), testFile);
  log.success('Created tests/index.test.ts');

  // README.md
  const readme = `# @matthew.ngo/${packageName}

> ${packageName} utility module for modern web development

## 📦 Installation

\`\`\`bash
pnpm add @matthew.ngo/${packageName}
# or
npm install @matthew.ngo/${packageName}
# or
yarn add @matthew.ngo/${packageName}
\`\`\`

## 🚀 Usage

\`\`\`typescript
import { greet } from '@matthew.ngo/${packageName}';

console.log(greet('World'));
// Output: Hello, World!
\`\`\`

## 📖 API Reference

### \`greet(name: string): string\`

Returns a greeting message.

#### Parameters

- \`name\` (string): The name to greet

#### Returns

- (string): A greeting message

## 🛠️ Development

\`\`\`bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Lint code
pnpm lint

# Type check
pnpm typecheck
\`\`\`

## 📄 License

MIT © Matthew Ngo
`;

  await writeFile(join(packageDir, 'README.md'), readme);
  log.success('Created README.md');

  // .eslintrc.js
  const eslintConfig = `module.exports = {
  extends: ['../../configs/eslint.base.js'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    // Package-specific rules
  },
};
`;

  await writeFile(join(packageDir, '.eslintrc.js'), eslintConfig);
  log.success('Created .eslintrc.js');

  // Update root package.json to include new package in references
  log.info('Updating root tsconfig.json...');
  const rootTsConfigPath = join(rootDir, 'tsconfig.json');
  if (existsSync(rootTsConfigPath)) {
    const rootTsConfig = JSON.parse(await readFile(rootTsConfigPath, 'utf-8'));
    if (!rootTsConfig.references) {
      rootTsConfig.references = [];
    }
    rootTsConfig.references.push({ path: `./packages/${packageName}` });
    await writeFile(rootTsConfigPath, JSON.stringify(rootTsConfig, null, 2) + '\n');
    log.success('Updated root tsconfig.json');
  }

  log.info('Installing dependencies...');
  execSync('pnpm install', { cwd: rootDir, stdio: 'inherit' });

  console.log('');
  log.success(`${colors.bright}Package "${packageName}" created successfully!${colors.reset}`);
  console.log('');
  console.log('Next steps:');
  console.log(`  1. cd packages/${packageName}`);
  console.log('  2. Start developing your module');
  console.log('  3. Run tests: pnpm test');
  console.log('  4. Build: pnpm build');
}

createPackage().catch((error) => {
  log.error(error.message);
  process.exit(1);
});