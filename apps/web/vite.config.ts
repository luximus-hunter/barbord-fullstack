import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()], build: {
    target: 'node22',
    rollupOptions: {
      external: ['@barbord/contract', '@barbord/gateway'],
    },
  }
});