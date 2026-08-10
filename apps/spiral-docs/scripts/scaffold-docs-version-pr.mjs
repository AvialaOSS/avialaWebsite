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
 *
 * Set BUMP_DEPS=1 (CI default) to pin workspace deps to the published spiral /
 * tokens / icons versions and refresh package-lock.json.
 */
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(dirname, "..");
const siteRoot = path.resolve(appRoot, "../..");
const manifestPath = path.join(appRoot, "src/versions/manifest.json");
const resultPath = path.join(appRoot, ".tmp/scaffold-result.json");

const spiralVersion = process.env.SPIRAL_VERSION;
if (!spiralVersion) {
  console.error("Set SPIRAL_VERSION to the published @aviala-design/spiral version.");
  process.exit(1);
}

const changelogsPath = process.env.COMPONENT_CHANGELOGS
  ?? path.resolve(appRoot, "../../../Spiral2/packages/ui/dist/component-changelogs.json");
const bumpDeps = process.env.BUMP_DEPS === "1";

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
if (manifest.covered.includes(spiralVersion)) {
  console.log(`Manifest already covers ${spiralVersion}; nothing to scaffold.`);
  mkdirSync(path.dirname(resultPath), { recursive: true });
  writeFileSync(
    resultPath,
    `${JSON.stringify({ skipped: true, version: spiralVersion }, null, 2)}\n`,
  );
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
      if (tokens && icons) {
        return {
          tokens: String(tokens).replace(/^[\^~]/, ""),
          icons: String(icons).replace(/^[\^~]/, ""),
        };
      }
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

function npmCmd() {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}

function runNpm(args) {
  const result = spawnSync(npmCmd(), args, {
    cwd: siteRoot,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) {
    throw new Error(`npm ${args.join(" ")} failed with ${result.status}`);
  }
}

function bumpWorkspaceDeps(companions) {
  console.log(
    `Bumping workspace deps → spiral@${spiralVersion} tokens@${companions.tokens} icons@${companions.icons}`,
  );
  runNpm([
    "install",
    `@aviala-design/spiral@${spiralVersion}`,
    `@aviala-design/tokens@${companions.tokens}`,
    `@aviala-design/icons@${companions.icons}`,
    "-w",
    "@aviala/spiral-docs",
  ]);
  runNpm([
    "install",
    `@aviala-design/spiral@${spiralVersion}`,
    `@aviala-design/icons@${companions.icons}`,
    "-w",
    "@aviala/colorcat",
  ]);
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

if (bumpDeps) {
  bumpWorkspaceDeps(companions);
}

const changedList = [...changedComponents].sort();
const changedListText = changedList.join(", ") || "(none detected)";
console.log(`Scaffolded draft docs version ${spiralVersion}`);
console.log(`  changed components: ${changedListText}`);
console.log(`  inherits from: ${previous}`);
console.log(`  default remains: ${manifest.default}`);
if (stubPaths.length) {
  console.log(`  revision stubs:\n    - ${stubPaths.join("\n    - ")}`);
}

mkdirSync(path.dirname(resultPath), { recursive: true });
writeFileSync(
  resultPath,
  `${JSON.stringify(
    {
      skipped: false,
      version: spiralVersion,
      previous,
      companions,
      changedComponents: changedList,
      stubPaths,
      bumpedDeps: bumpDeps,
    },
    null,
    2,
  )}\n`,
);

if (process.env.OPEN_PR === "1") {
  const branch = `docs/spiral-${spiralVersion}`;
  const title = `docs(spiral): scaffold coverage for ${spiralVersion}`;
  const body = [
    `## Summary`,
    `- Scaffold docs manifest entry for \`@aviala-design/spiral@${spiralVersion}\` (status: draft).`,
    `- Components with changelog entries: ${changedListText}`,
    `- Other components inherit from \`${previous}\`.`,
    bumpDeps
      ? `- Bumped \`@aviala-design/spiral@${spiralVersion}\`, tokens@${companions.tokens}, icons@${companions.icons} (+ lockfile).`
      : "",
    stubPaths.length ? `- Created revision stubs:\n  - ${stubPaths.join("\n  - ")}` : "",
    ``,
    `Checklist is posted as a follow-up bot comment after the PR opens.`,
  ]
    .filter(Boolean)
    .join("\n");

  spawnSync("git", ["checkout", "-b", branch], { stdio: "inherit" });
  const addPaths = [
    manifestPath,
    ...stubPaths.map((p) => path.join(appRoot, p)),
  ];
  if (bumpDeps) {
    addPaths.push(
      path.join(appRoot, "package.json"),
      path.join(siteRoot, "apps/colorcat/package.json"),
      path.join(siteRoot, "package-lock.json"),
    );
  }
  spawnSync("git", ["add", ...addPaths], { stdio: "inherit" });
  spawnSync("git", ["commit", "-m", title], { stdio: "inherit" });
  spawnSync("git", ["push", "-u", "origin", branch], { stdio: "inherit" });
  const create = spawnSync(
    "gh",
    ["pr", "create", "--title", title, "--body", body],
    { encoding: "utf8", shell: process.platform === "win32" },
  );
  if (create.status !== 0) {
    console.error(create.stderr || create.stdout);
    process.exit(create.status ?? 1);
  }
  const checklist = [
    `<!-- spiral-docs-scaffold-checklist -->`,
    `## Docs coverage checklist (\`${spiralVersion}\`)`,
    ``,
    `- [ ] Update doc revisions / demos for changed components${
      changedList.length ? ` (${changedList.join(", ")})` : ""
    }`,
    `- [ ] Set manifest \`status\` to \`ready\``,
    `- [ ] Point \`default\` to \`${spiralVersion}\``,
    `- [ ] Verify stale banner clears after merge`,
    bumpDeps
      ? `- [ ] Confirm lockfile installs (\`npm ci\`) and docs build against spiral@${spiralVersion}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");
  spawnSync("gh", ["pr", "comment", "--body", checklist], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
}
