import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "node20",
    outDir: "dist",
    minify: "oxc",
    lib: {
      entry: "src/dev.ts",
      formats: ["es"],
      fileName: "dev",
    },
    rollupOptions: {
      external: [
        /^node:.*/,
        "@hono/node-server",
        "hono",
        "@hono/zod-validator",
        "@repo/contract",
        "@repo/db",
        "@vercel/blob",
        "bcrypt",
        "sharp",
        "zod",
      ],
    },
  },
});
