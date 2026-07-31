import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Resolve install dirs for Spiral packages.
 * `DOCS_PKG_ROOT` points at a cache folder that already ran
 * `npm install @aviala-design/spiral@…` (see build-versioned.mjs).
 */
export function findPackageDir(packageName) {
  const overrideRoot = process.env.DOCS_PKG_ROOT;
  if (overrideRoot) {
    const dir = path.resolve(overrideRoot, "node_modules", packageName);
    if (existsSync(path.join(dir, "package.json"))) return dir;
  }

  const candidates = [
    path.resolve(dirname, `../node_modules/${packageName}`),
    path.resolve(dirname, `../../../node_modules/${packageName}`),
  ];
  for (const dir of candidates) {
    if (existsSync(path.join(dir, "package.json"))) return dir;
  }
  return null;
}

export function findSpiralPackage() {
  return findPackageDir("@aviala-design/spiral");
}

export function findTokensPackage() {
  return findPackageDir("@aviala-design/tokens");
}

export function findIconsPackage() {
  return findPackageDir("@aviala-design/icons");
}

export function readPackageVersion(packageDir) {
  if (!packageDir) return "unknown";
  try {
    return JSON.parse(readFileSync(path.join(packageDir, "package.json"), "utf8")).version ?? "unknown";
  } catch {
    return "unknown";
  }
}

export function readSpiralVersion() {
  return readPackageVersion(findSpiralPackage());
}
