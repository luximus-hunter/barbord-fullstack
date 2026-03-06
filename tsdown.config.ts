import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "tsdown";

type PackageJson = {
  name?: string;
};

const packageJsonPath = resolve(process.cwd(), "package.json");

let packageName = "";
try {
  const packageJson = JSON.parse(
    readFileSync(packageJsonPath, "utf8"),
  ) as PackageJson;
  packageName = packageJson.name ?? "";
} catch {
  packageName = "";
}

const isDbPackage = packageName === "@barbord/db";

export default defineConfig({
  entry: ["index.ts"],
  format: ["esm"],
  outDir: "dist",
  dts: true,
  clean: true,
  platform: isDbPackage ? "node" : undefined,
  target: isDbPackage ? "node20" : undefined,
  external: isDbPackage
    ? ["@prisma/client", "@prisma/adapter-mariadb", "dotenv"]
    : [],
});