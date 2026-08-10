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
 *
 * Changed-component stubs prefer `import previous from "./{prevRev}"` and append
 * a short prose note from component-changelogs.json (Added/Changed/Fixed/…).
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
/** @type {Record<string, Array<{ version: string, sections?: Record<string, string[]> }>>} */
let changelogs = {};

if (existsSync(changelogsPath)) {
  changelogs = JSON.parse(readFileSync(changelogsPath, "utf8"));
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

/**
 * Walk rev / inherits from a docs version (before the new draft entry matters).
 * Mirrors apps/spiral-docs/src/versions-registry.ts resolveComponentRevision.
 */
function resolveContentRevision(docsVersion, component, seen = new Set()) {
  if (!docsVersion || seen.has(docsVersion)) return undefined;
  seen.add(docsVersion);

  const entry = manifest.versions[docsVersion];
  const pointer = entry?.components?.[component];
  if (pointer?.rev) return pointer.rev;
  if (pointer?.inherits) {
    if (manifest.versions[pointer.inherits]) {
      return resolveContentRevision(pointer.inherits, component, seen);
    }
    return pointer.inherits;
  }

  const coveredAsc = [...manifest.covered]
    .filter((v) => v !== spiralVersion)
    .sort((a, b) => {
      const pa = a.split(".").map((n) => Number.parseInt(n, 10) || 0);
      const pb = b.split(".").map((n) => Number.parseInt(n, 10) || 0);
      for (let i = 0; i < 3; i++) {
        if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
      }
      return 0;
    });
  const idx = coveredAsc.indexOf(docsVersion);
  if (idx > 0) {
    return resolveContentRevision(coveredAsc[idx - 1], component, seen);
  }
  return undefined;
}

/** Build a short Chinese appendix from Added/Changed/(Fixed) bullets. */
function formatChangelogAppendix(component) {
  const releases = changelogs[component] ?? [];
  const release = releases.find((r) => r.version === spiralVersion);
  const sections = release?.sections ?? {};
  const parts = [];
  for (const key of ["Added", "Changed", "Fixed", "Removed", "Deprecated"]) {
    const items = sections[key];
    if (!Array.isArray(items) || items.length === 0) continue;
    for (const item of items) {
      const text = String(item).trim().replace(/[。；;]+$/u, "");
      if (text) parts.push(text);
    }
  }
  if (parts.length === 0) return "";
  return `${spiralVersion}：${parts.join("；")}。`;
}

function buildRevisionStub(component, prevRevId, appendix) {
  const prevFile =
    prevRevId &&
    path.join(revisionsRoot, component, `${prevRevId}.ts`);

  if (prevRevId && prevFile && existsSync(prevFile)) {
    const proseExpr = appendix
      ? `previous.prose + ${JSON.stringify(` ${appendix}`)}`
      : `previous.prose + ${JSON.stringify(` （待补：${spiralVersion} 变更说明）`)}`;
    return `import previous from ${JSON.stringify(`./${prevRevId}`)};
import type { ComponentDocRevision } from "../types";

/** Scaffolded from ${prevRevId}${appendix ? " + component changelog" : ""}. Review before marking ready. */
const revision: ComponentDocRevision = {
  ...previous,
  revision: ${JSON.stringify(spiralVersion)},
  prose: ${proseExpr},
};

export default revision;
`;
  }

  const prose = appendix || `TODO: update docs for ${component} @ ${spiralVersion}`;
  const description = appendix
    ? `${spiralVersion} 变更见下方说明；请补全组件简介。`
    : `TODO: update description for ${spiralVersion}`;
  return `import type { ComponentDocRevision } from "../types";

/** Scaffolded without a prior revision file. Review before marking ready. */
const revision: ComponentDocRevision = {
  revision: ${JSON.stringify(spiralVersion)},
  title: ${JSON.stringify(component)},
  description: ${JSON.stringify(description)},
  prose: ${JSON.stringify(prose)},
};

export default revision;
`;
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
  const prevRevId = resolveContentRevision(previous, name);
  const appendix = formatChangelogAppendix(name);
  const stub = buildRevisionStub(name, prevRevId, appendix);
  writeFileSync(file, stub);
  stubPaths.push(path.relative(appRoot, file));
  console.log(
    `  stub ${name}: prev=${prevRevId ?? "(none)"} appendix=${appendix ? "yes" : "no"}`,
  );
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
