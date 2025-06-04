module.exports = {
  // TypeScript files
  '*.{ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    'vitest related --run',
  ],
  
  // JavaScript files
  '*.{js,jsx}': [
    'eslint --fix',
    'prettier --write',
  ],
  
  // JSON files
  '*.json': [
    'prettier --write',
  ],
  
  // Markdown files
  '*.md': [
    'prettier --write',
  ],
  
  // Package.json files
  'package.json': [
    'prettier --write',
    'pnpm lint:package-json',
  ],
  
  // Check TypeScript on commit
  '**/*.ts?(x)': () => 'tsc --noEmit',
};