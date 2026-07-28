import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// The package `exports` map deliberately hides package.json and dist internals,
// so locate the install directory on disk instead of going through resolution.
const candidates = [
  path.resolve(dirname, "../node_modules/@aviala-design/spiral"),
  path.resolve(dirname, "../../../node_modules/@aviala-design/spiral"),
];

export function findSpiralPackage() {
  for (const dir of candidates) {
    if (existsSync(path.join(dir, "package.json"))) {
      return dir;
    }
  }
  return null;
}

export function readSpiralVersion() {
  const dir = findSpiralPackage();
  if (!dir) return "unknown";

  try {
    return JSON.parse(readFileSync(path.join(dir, "package.json"), "utf8")).version ?? "unknown";
  } catch {
    return "unknown";
  }
}
