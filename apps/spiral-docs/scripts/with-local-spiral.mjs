/**
 * Run a command with DOCS_SPIRAL_LOCAL=1 so Vite resolves
 * @aviala-design/* from a sibling Spiral2 checkout.
 *
 * Usage:
 *   node apps/spiral-docs/scripts/with-local-spiral.mjs npm run dev -w @aviala/spiral-docs
 *
 * Daily local docs need Spiral2 next to avialaWebsite (or DOCS_SPIRAL_ROOT).
 * Tokens CSS is served via Spiral2's tokens vite-plugin (no tokens build).
 * Icons use packages/icons/src (codegen); only missing src needs icons:build.
 * Set DOCS_SPIRAL_LOCAL_DIST=1 to force package dist folders instead.
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, "../../..");

process.env.DOCS_SPIRAL_LOCAL = "1";

function resolveSpiralRoot() {
  const rootEnv = process.env.DOCS_SPIRAL_ROOT?.trim();
  return rootEnv
    ? path.resolve(siteRoot, rootEnv)
    : path.resolve(siteRoot, "../Spiral2");
}

function preflight() {
  const root = resolveSpiralRoot();
  const preferDist = process.env.DOCS_SPIRAL_LOCAL_DIST === "1";
  const errors = [];

  if (!existsSync(path.join(root, "package.json"))) {
    errors.push(
      `Spiral2 not found at ${root}\n` +
        `  Clone it next to avialaWebsite, or set DOCS_SPIRAL_ROOT.`,
    );
  } else {
    for (const rel of ["packages/ui", "packages/tokens", "packages/icons"]) {
      if (!existsSync(path.join(root, rel, "package.json"))) {
        errors.push(`Missing ${rel} under ${root}`);
      }
    }

    if (!preferDist) {
      const plugin = path.join(root, "packages/tokens/vite-plugin.mjs");
      if (!existsSync(plugin)) {
        errors.push(
          `Missing tokens vite-plugin at ${plugin}\n` +
            `  Update Spiral2 (playground uses the same plugin for zero-build CSS).`,
        );
      }

      const iconsSrc = path.join(root, "packages/icons/src/index.ts");
      const iconsDist = path.join(root, "packages/icons/dist/index.js");
      if (!existsSync(iconsSrc) && !existsSync(iconsDist)) {
        errors.push(
          `Icons entry missing under ${path.join(root, "packages/icons")}\n` +
            `  In Spiral2 run: pnpm --filter @aviala-design/icons build\n` +
            `  (or pnpm icons:sync if you need a Figma export first)`,
        );
      }

      const uiSrc = path.join(root, "packages/ui/src/index.ts");
      if (!existsSync(uiSrc)) {
        errors.push(`Missing UI source entry: ${uiSrc}`);
      }
    } else {
      for (const [label, filter, rel] of [
        ["spiral", "@aviala-design/spiral", "packages/ui/dist/index.js"],
        ["tokens", "@aviala-design/tokens", "packages/tokens/dist/styles.css"],
        ["icons", "@aviala-design/icons", "packages/icons/dist/index.js"],
      ]) {
        const abs = path.join(root, rel);
        if (!existsSync(abs)) {
          errors.push(
            `DOCS_SPIRAL_LOCAL_DIST=1 but missing ${label} at ${abs}\n` +
              `  In Spiral2 run: pnpm --filter ${filter} build`,
          );
        }
      }
    }
  }

  if (errors.length) {
    console.error("[spiral-docs:local] preflight failed:\n");
    for (const err of errors) {
      console.error(`- ${err}\n`);
    }
    process.exit(1);
  }

  console.log(
    `[spiral-docs:local] preflight ok → ${root}` +
      (preferDist ? " (dist mode)" : " (src + tokens vite-plugin)"),
  );
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: with-local-spiral.mjs <command> [...args]");
  process.exit(1);
}

preflight();

const child = spawn(args[0], args.slice(1), {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
