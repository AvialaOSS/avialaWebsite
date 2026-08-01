/**
 * Run a command with DOCS_SPIRAL_LOCAL=1 so Vite resolves
 * @aviala-design/* from a sibling Spiral2 checkout.
 *
 * Usage:
 *   node apps/spiral-docs/scripts/with-local-spiral.mjs npm run dev -w @aviala/spiral-docs
 */
import { spawn } from "node:child_process";

process.env.DOCS_SPIRAL_LOCAL = "1";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: with-local-spiral.mjs <command> [...args]");
  process.exit(1);
}

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
