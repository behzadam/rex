import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'], // Entry point
  format: ['esm', 'cjs'], // Output formats
  dts: true, // Generate TypeScript declaration files
  clean: true, // Clean the output directory before building
  sourcemap: true, // Generate sourcemaps
})
