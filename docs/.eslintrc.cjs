module.exports = {
  root: false,
  extends: ['../.eslintrc.cjs'],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '*.config.js',
    // Remove *.config.ts ignore for this directory
    '.eslintrc.js',
  ],
  rules: {
    'import/no-default-export': 'off',
  },
};
