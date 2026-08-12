/**
 * Build spiral-docs for every covered patch in versions/manifest.json.
 *
 * For each version:
 *   1. npm install pinned spiral/tokens/icons into .docs-pkg-cache/{version}
 *   2. sync props + changelogs from that install
 *   3. vite build → static/docs/v/{version}/
 * Then build the default version again at static/docs/ (basename /docs)
 * so existing Hugo mounts keep working.
 *
 * Usage:
 *   node scripts/build-versioned.mjs --dry-run
 *   node scripts/build-versioned.mjs
 *   node scripts/build-versioned.mjs --only 2.2.0
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(dirname, "..");
const siteRoot = path.resolve(appRoot, "../..");
const staticRoot = path.join(siteRoot, "static/docs");
const cacheRoot = path.join(appRoot, ".docs-pkg-cache");
const dryRun = process.argv.includes("--dry-run");
const onlyIdx = process.argv.indexOf("--only");
const onlyVersion = onlyIdx >= 0 ? process.argv[onlyIdx + 1] : null;

const manifest = JSON.parse(
  readFileSync(path.join(appRoot, "src/versions/manifest.json"), "utf8"),
);

function run(command, args, env = {}, cwd = appRoot) {
  const result = spawnSync(command, args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with ${result.status}`);
  }
}

function npmCmd() {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}

function npxCmd() {
  return process.platform === "win32" ? "npx.cmd" : "npx";
}

function ensurePkgCache(version, entry) {
  const dir = path.join(cacheRoot, version);
  const marker = path.join(dir, ".installed");
  const expected = JSON.stringify({
    spiral: entry.spiral,
    tokens: entry.tokens,
    icons: entry.icons,
  });

  if (existsSync(marker) && readFileSync(marker, "utf8") === expected) {
    console.log(`  cache hit ${version}`);
    return dir;
  }

  console.log(`  installing packages for ${version}…`);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    path.join(dir, "package.json"),
    JSON.stringify(
      {
        name: `spiral-docs-pkg-${version}`,
        private: true,
        dependencies: {
          "@aviala-design/spiral": entry.spiral,
          "@aviala-design/tokens": entry.tokens,
          "@aviala-design/icons": entry.icons,
        },
      },
      null,
      2,
    ),
  );
  run(npmCmd(), ["install", "--omit=dev", "--no-fund", "--no-audit"], {}, dir);
  writeFileSync(marker, expected);
  return dir;
}

function buildWithPkg({ version, entry, outDir, basename, emptyOutDir }) {
  const pkgRoot = ensurePkgCache(version, entry);

  console.log(`  syncing metadata from cache ${version}`);
  run("node", ["./scripts/sync-props.mjs"], { DOCS_PKG_ROOT: pkgRoot });
  run("node", ["./scripts/sync-changelog.mjs"], { DOCS_PKG_ROOT: pkgRoot });

  console.log(`  vite build → ${path.relative(siteRoot, outDir)} (base ${basename}/)`);
  run(
    npxCmd(),
    ["vite", "build"],
    {
      DOCS_PKG_ROOT: pkgRoot,
      DOCS_OUT_DIR: outDir,
      DOCS_EMPTY_OUT_DIR: emptyOutDir ? "1" : "0",
      VITE_DOCS_VERSION: version || "",
      VITE_DOCS_BASENAME: basename,
    },
  );
}

const versions = (manifest.covered ?? []).filter((v) =>
  onlyVersion ? v === onlyVersion : true,
);

if (versions.length === 0) {
  console.error(onlyVersion ? `No covered version matching ${onlyVersion}` : "No covered versions");
  process.exit(1);
}

console.log(`Docs version matrix (${versions.length}):`);
for (const version of versions) {
  const entry = manifest.versions?.[version];
  console.log(
    `  - ${version}  spiral@${entry?.spiral ?? "?"}  status=${entry?.status ?? "?"}`,
  );
}

if (dryRun) {
  console.log("Dry run only — no install/build.");
  process.exit(0);
}

run("node", ["./scripts/sync-npm-latest.mjs"]);

if (!onlyVersion) {
  rmSync(staticRoot, { recursive: true, force: true });
}
mkdirSync(staticRoot, { recursive: true });

for (const version of versions) {
  const entry = manifest.versions?.[version];
  if (!entry) {
    console.error(`Missing manifest.versions[${version}]`);
    process.exit(1);
  }
  console.log(`\nBuilding docs for Spiral ${version}`);
  buildWithPkg({
    version,
    entry,
    outDir: path.join(staticRoot, "v", version),
    basename: `/docs/v/${version}`,
    emptyOutDir: false,
  });
}

const defaultVersion = onlyVersion || manifest.default;
const defaultEntry = manifest.versions[defaultVersion];
console.log(`\nBuilding unversioned root SPA for default ${defaultVersion}`);
buildWithPkg({
  version: defaultVersion,
  entry: defaultEntry,
  outDir: staticRoot,
  basename: "/docs",
  emptyOutDir: false,
});

run("node", ["./scripts/finalize.mjs"]);
console.log("\nVersioned docs build complete.");
