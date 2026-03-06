import { defineConfig } from "vite";

export default defineConfig({
  build: {
    ssr: "entrypoint.ts",
    target: "node20",
    outDir: "dist",
    // minify: "oxc",
    rollupOptions: {
      input: "entrypoint.ts",
      external: [
        "@prisma/client",
        /^@prisma\/.*/,
        /^node:.*/,
      ],
      output: {
        entryFileNames: "server.mjs",
      },
    },
  },
});
