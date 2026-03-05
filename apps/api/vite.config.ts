import { defineConfig } from "vite";

export default defineConfig({
  build: {
    ssr: "src/server.ts",
    target: "node20",
    outDir: "dist",
    // minify: "oxc",
    rollupOptions: {
      input: "src/server.ts",
      external: [
        "@prisma/client",
        /^@prisma\/.*/,
        /^node:.*/,
      ],
    },
  },
});
