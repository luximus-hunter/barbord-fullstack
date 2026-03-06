import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "node20",
    outDir: "dist",
    minify: "oxc",
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index.mjs",
    },
  },
});
