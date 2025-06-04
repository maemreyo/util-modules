module.exports = {
  root: true,
  extends: ['./configs/eslint.base.js'],
  parserOptions: {
    project: ['./tsconfig.json', './packages/*/tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '*.config.js',
    '*.config.ts',
    '.eslintrc.js',
    'scripts/',
  ],
  rules: {
    // Root-level overrides if needed
  },
};