import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'node20',
    outDir: 'dist',
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index.mjs',
    },
    rollupOptions: {
      external: ['@barbord/contract', '@barbord/db'],
    },
  },
});