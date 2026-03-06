import { defineConfig } from "vite";

export default defineConfig({
  build: {
    ssr: "entrypoint.ts",
    target: "node20",
    outDir: "dist/api",
    // minify: "oxc",
    rollupOptions: {
      input: "entrypoint.ts",
      external: [
        "@prisma/client",
        /^@prisma\/.*/,
        /^node:.*/,
      ],
      output: {
        entryFileNames: "index.mjs",
        format: "esm",
      },
    },
  },
});
