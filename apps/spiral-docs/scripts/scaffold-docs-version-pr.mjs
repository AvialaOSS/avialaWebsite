/**
 * Scaffold a docs-coverage PR payload on avialaWebsite after Spiral publishes.
 *
 * Normally run by `.github/workflows/scaffold-spiral-docs.yml` (repository_dispatch
 * from Spiral2). Locally:
 *
 *   SPIRAL_VERSION=2.3.1 \
 *   COMPONENT_CHANGELOGS=./path/to/component-changelogs.json \
 *   node apps/spiral-docs/scripts/scaffold-docs-version-pr.mjs
 *
 * Set OPEN_PR=1 only for local experiments that push + `gh pr create` themselves.
 * CI commits/pushes in the workflow instead (OPEN_PR=0).
 */
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(dirname, "..");
const manifestPath = path.join(appRoot, "src/versions/manifest.json");

const spiralVersion = process.env.SPIRAL_VERSION;
if (!spiralVersion) {
  console.error("Set SPIRAL_VERSION to the published @aviala-design/spiral version.");
  process.exit(1);
}

const changelogsPath = process.env.COMPONENT_CHANGELOGS
  ?? path.resolve(appRoot, "../../../Spiral2/packages/ui/dist/component-changelogs.json");

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
if (manifest.covered.includes(spiralVersion)) {
  console.log(`Manifest already covers ${spiralVersion}; nothing to scaffold.`);
  process.exit(0);
}

const previous = manifest.default;
const previousEntry = manifest.versions[previous];
const changedComponents = new Set();

if (existsSync(changelogsPath)) {
  const changelogs = JSON.parse(readFileSync(changelogsPath, "utf8"));
  for (const [name, releases] of Object.entries(changelogs)) {
    if (releases.some((r) => r.version === spiralVersion)) {
      changedComponents.add(name);
    }
  }
}

/**
 * tokens/icons versions do not track the spiral package version — resolve from
 * the published spiral package dependencies (falls back to previous entry).
 */
function resolveCompanionVersions(version) {
  const result = spawnSync(
    process.platform === "win32" ? "npm.cmd" : "npm",
    ["view", `@aviala-design/spiral@${version}`, "dependencies", "--json"],
    { encoding: "utf8", shell: process.platform === "win32" },
  );
  if (result.status === 0 && result.stdout?.trim()) {
    try {
      const deps = JSON.parse(result.stdout);
      const tokens = deps["@aviala-design/tokens"];
      const icons = deps["@aviala-design/icons"];
      if (tokens && icons) return { tokens, icons };
    } catch {
      // fall through
    }
  }
  console.warn(
    `Could not resolve companion versions from npm for spiral@${version}; using previous manifest entry.`,
  );
  return {
    tokens: previousEntry?.tokens ?? version,
    icons: previousEntry?.icons ?? "2.0.2",
  };
}

const companions = resolveCompanionVersions(spiralVersion);

const components = {};
const prevComponents = previousEntry?.components ?? {};
for (const name of Object.keys(prevComponents)) {
  if (changedComponents.has(name)) {
    components[name] = { rev: spiralVersion };
  } else {
    components[name] = { inherits: previous };
  }
}
for (const name of changedComponents) {
  if (!components[name]) components[name] = { rev: spiralVersion };
}

manifest.covered.push(spiralVersion);
manifest.versions[spiralVersion] = {
  spiral: spiralVersion,
  tokens: companions.tokens,
  icons: companions.icons,
  status: "draft",
  components,
};
// Keep serving the last ready default until humans mark ready.
manifest.default = previous;

mkdirSync(path.dirname(manifestPath), { recursive: true });
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

const revisionsRoot = path.join(appRoot, "src/doc-revisions");
const stubPaths = [];
for (const name of [...changedComponents].sort()) {
  const dir = path.join(revisionsRoot, name);
  const file = path.join(dir, `${spiralVersion}.ts`);
  if (existsSync(file)) continue;
  mkdirSync(dir, { recursive: true });
  const stub = `import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  revision: ${JSON.stringify(spiralVersion)},
  title: ${JSON.stringify(name)},
  description: "TODO: update description for ${spiralVersion}",
  prose: "TODO: update docs for ${name} @ ${spiralVersion}",
};

export default revision;
`;
  writeFileSync(file, stub);
  stubPaths.push(path.relative(appRoot, file));
}

const changedList = [...changedComponents].sort().join(", ") || "(none detected)";
console.log(`Scaffolded draft docs version ${spiralVersion}`);
console.log(`  changed components: ${changedList}`);
console.log(`  inherits from: ${previous}`);
console.log(`  default remains: ${manifest.default}`);
if (stubPaths.length) {
  console.log(`  revision stubs:\n    - ${stubPaths.join("\n    - ")}`);
}

if (process.env.OPEN_PR === "1") {
  const branch = `docs/spiral-${spiralVersion}`;
  const title = `docs(spiral): scaffold coverage for ${spiralVersion}`;
  const body = [
    `## Summary`,
    `- Scaffold docs manifest entry for \`@aviala-design/spiral@${spiralVersion}\` (status: draft).`,
    `- Components with changelog entries: ${changedList}`,
    `- Other components inherit from \`${previous}\`.`,
    stubPaths.length ? `- Created revision stubs:\n  - ${stubPaths.join("\n  - ")}` : "",
    ``,
    `## Checklist`,
    `- [ ] Update doc revisions / demos for changed components`,
    `- [ ] Set manifest status to \`ready\``,
    `- [ ] Point \`default\` to \`${spiralVersion}\``,
    `- [ ] Verify stale banner clears after merge`,
  ]
    .filter(Boolean)
    .join("\n");

  spawnSync("git", ["checkout", "-b", branch], { stdio: "inherit" });
  spawnSync("git", ["add", manifestPath, ...stubPaths.map((p) => path.join(appRoot, p))], {
    stdio: "inherit",
  });
  spawnSync("git", ["commit", "-m", title], { stdio: "inherit" });
  spawnSync("git", ["push", "-u", "origin", branch], { stdio: "inherit" });
  spawnSync(
    "gh",
    ["pr", "create", "--title", title, "--body", body],
    { stdio: "inherit" },
  );
}
