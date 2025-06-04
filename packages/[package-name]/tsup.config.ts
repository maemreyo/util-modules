import { defineConfig } from 'tsup';

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
  external: [
    'node:*',
  ],
  noExternal: [],
  esbuildOptions(options) {
    options.banner = {
      js: '"use strict";',
    };
  },
  onSuccess: 'echo "✅ Build completed!"',
});


