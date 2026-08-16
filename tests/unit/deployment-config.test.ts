import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(join(process.cwd(), file), "utf8")) as T;
}

test("configures Nitro output for Vercel without replacing the default Sites build", () => {
  const packageJson = readJson<{
    engines: { node: string };
    scripts: Record<string, string>;
    devDependencies: Record<string, string>;
  }>("package.json");
  const vercelConfig = readJson<{
    framework: string;
    buildCommand: string;
    outputDirectory?: string;
  }>("vercel.json");

  assert.equal(packageJson.engines.node, "22.x");
  assert.equal(
    packageJson.scripts["build:vercel"],
    "NITRO_PRESET=vercel vite build",
  );
  assert.equal(packageJson.scripts.build, "WRANGLER_LOG_PATH=.wrangler/wrangler.log vinext build");
  assert.equal(packageJson.devDependencies.nitro, "3.0.260610-beta");
  assert.equal(vercelConfig.outputDirectory, undefined);
  assert.deepEqual(vercelConfig, {
    $schema: "https://openapi.vercel.sh/vercel.json",
    framework: "nitro",
    buildCommand: "npm run build:vercel",
  });
});
