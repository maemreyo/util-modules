module.exports = {
  // Entry points
  entryPoints: [
    'packages/storage/src/index.ts',
    'packages/ai-toolkit/src/index.ts',
    'packages/content-extractor/src/index.ts',
    'packages/analysis/src/index.ts'
  ],
  
  // Output directory
  out: 'docs/src/api',
  
  // Documentation settings
  name: 'Util Modules API Reference',
  readme: 'README.md',
  
  // Theme and navigation
  navigation: {
    includeCategories: true,
    includeGroups: true
  },
  
  // Include/exclude settings
  exclude: [
    '**/node_modules/**',
    '**/tests/**',
    '**/*.test.ts',
    '**/*.spec.ts',
    '**/dist/**'
  ],
  
  // Type documentation
  includeVersion: true,
  categorizeByGroup: true,
  categoryOrder: [
    'Chrome Storage',
    'AI Toolkit',
    'Content Extractor',
    'Analysis',
    '*'
  ],
  
  // Source code links
  gitRevision: 'main',
  gitRemote: 'origin',
  
  // Plugin configuration
  plugin: [
    'typedoc-plugin-markdown',
    'typedoc-plugin-missing-exports'
  ],
  
  // Markdown specific options
  hideBreadcrumbs: false,
  hideInPageTOC: false,
  publicPath: '/api/',
  
  // Output options
  preserveLinkText: true,
  useCodeBlocks: true,
  expandObjects: true,
  
  // Theme options
  theme: 'markdown',
  lightHighlightTheme: 'github-light',
  darkHighlightTheme: 'github-dark',
  
  // TypeScript options
  tsconfig: 'tsconfig.json',
  compilerOptions: {
    strict: true
  },
  
  // Custom options
  customCss: './docs/custom.css',
  
  // Watch mode
  watch: process.env.TYPEDOC_WATCH === 'true',
  
  // Validation
  validation: {
    notExported: true,
    invalidLink: true,
    notDocumented: false
  }
};