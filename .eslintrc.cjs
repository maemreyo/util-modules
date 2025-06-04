module.exports = {
  root: true,
  extends: ['./configs/eslint.base.cjs'],
  parserOptions: {
    project: [
      './tsconfig.json',
      './tsconfig.tools.json',
      './packages/*/tsconfig.json',
    ],
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '*.config.js',
    '*.config.ts',
    '!docs/**/*.config.ts', // Allow config files in docs
    '.eslintrc.js',
    'scripts/',
  ],
  rules: {
    // Root-level overrides if needed
  },
  overrides: [
    // VitePress config
    {
      files: ['docs/.vitepress/config.ts'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
    // Test utilities
    {
      files: ['test-utils/**/*.ts'],
      env: {
        jest: true,
        node: true,
      },
      globals: {
        vi: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/unbound-method': 'off',
        'no-console': 'off',
        'unicorn/prefer-export-from': 'off',
      },
    },
  ],
};
