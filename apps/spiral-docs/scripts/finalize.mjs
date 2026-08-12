import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSearchPages } from "./build-search-index.mjs";
import { readSpiralVersion } from "./spiral-package.mjs";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(dirname, "../../..");
const outDir = path.join(siteRoot, "static/docs");

function hashAssets(dir) {
  const hash = createHash("sha256");
  let found = false;
  for (const asset of ["assets/spiral-docs.js", "assets/spiral-docs.css"]) {
    const file = path.join(dir, asset);
    if (!existsSync(file)) continue;
    hash.update(readFileSync(file));
    found = true;
  }
  return found ? hash.digest("hex").slice(0, 12) : null;
}

const viteIndex = path.join(outDir, "index.html");
if (existsSync(viteIndex)) {
  unlinkSync(viteIndex);
  console.log("Removed Vite index.html so Hugo can own /docs/");
}

const versionsDir = path.join(outDir, "v");
if (existsSync(versionsDir)) {
  for (const version of readdirSync(versionsDir)) {
    const index = path.join(versionsDir, version, "index.html");
    if (existsSync(index)) unlinkSync(index);
  }
}

const rootAssetVersion = hashAssets(outDir);
if (!rootAssetVersion) {
  console.error("Missing expected build output under static/docs/assets/");
  process.exit(1);
}

const versionAssetVersions = {};
if (existsSync(versionsDir)) {
  for (const version of readdirSync(versionsDir)) {
    const hashed = hashAssets(path.join(versionsDir, version));
    if (hashed) versionAssetVersions[version] = hashed;
  }
}

let docsCoveredVersion = readSpiralVersion();
let covered = [];
try {
  const manifest = JSON.parse(
    readFileSync(path.resolve(dirname, "../src/versions/manifest.json"), "utf8"),
  );
  docsCoveredVersion = manifest.default ?? docsCoveredVersion;
  covered = manifest.covered ?? [];
} catch {
  /* keep */
}

const spiralVersion = docsCoveredVersion || readSpiralVersion();
const searchPages = buildSearchPages();
const dataFile = path.join(siteRoot, "data/spiraldocs.json");

let npmLatestVersion = "";
try {
  const npmLatest = JSON.parse(
    readFileSync(path.resolve(dirname, "../src/generated/npm-latest.json"), "utf8"),
  );
  npmLatestVersion = npmLatest.version ?? "";
} catch {
  /* optional */
}

const payload = {
  assetVersion: rootAssetVersion,
  spiralVersion,
  docsCoveredVersion,
  npmLatestVersion,
  covered,
  versionAssetVersions,
  searchPages,
};

mkdirSync(path.dirname(dataFile), { recursive: true });
writeFileSync(dataFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(
  `Wrote ${dataFile} (spiral ${spiralVersion}, asset ${payload.assetVersion}, versions ${Object.keys(versionAssetVersions).join(",") || "none"}, searchPages ${searchPages.length})`,
);
