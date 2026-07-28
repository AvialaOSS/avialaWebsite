import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readSpiralVersion } from "./spiral-package.mjs";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(dirname, "../../..");
const outDir = path.join(siteRoot, "static/docs/spiral");

const viteIndex = path.join(outDir, "index.html");
if (existsSync(viteIndex)) {
  unlinkSync(viteIndex);
  console.log("Removed Vite index.html so Hugo can own /docs/spiral/");
}

const hash = createHash("sha256");
for (const asset of ["assets/spiral-docs.js", "assets/spiral-docs.css"]) {
  const file = path.join(outDir, asset);
  if (!existsSync(file)) {
    console.error(`Missing expected build output: ${asset}`);
    process.exit(1);
  }
  hash.update(readFileSync(file));
}

const spiralVersion = readSpiralVersion();
const dataFile = path.join(siteRoot, "data/spiraldocs.json");
const payload = { assetVersion: hash.digest("hex").slice(0, 12), spiralVersion };

mkdirSync(path.dirname(dataFile), { recursive: true });
writeFileSync(dataFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Wrote ${dataFile} (spiral ${spiralVersion}, asset ${payload.assetVersion})`);
