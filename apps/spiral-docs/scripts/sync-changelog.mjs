import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { findSpiralPackage, readSpiralVersion } from "./spiral-package.mjs";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const target = path.resolve(dirname, "../src/generated/component-changelogs.json");
const repoRoot = path.resolve(dirname, "../../..");

const SECTION_ALIASES = {
  added: "Added",
  changed: "Changed",
  fixed: "Fixed",
  removed: "Removed",
  deprecated: "Deprecated",
};

function parseComponentChangelog(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const releases = [];
  let current = null;
  let section = null;

  for (const raw of lines) {
    const line = raw.trimEnd();
    const versionMatch = line.match(/^##\s+\[?([^\]]+)\]?\s*$/);
    if (versionMatch) {
      current = { version: versionMatch[1].trim(), sections: {} };
      releases.push(current);
      section = null;
      continue;
    }
    if (!current) continue;

    const sectionMatch = line.match(/^###\s+(.+)\s*$/);
    if (sectionMatch) {
      const key = sectionMatch[1].trim();
      section = SECTION_ALIASES[key.toLowerCase()] ?? key;
      if (!current.sections[section]) current.sections[section] = [];
      continue;
    }

    const bullet = line.match(/^-\s+(.+)$/);
    if (bullet && section) {
      current.sections[section].push(bullet[1].trim());
    }
  }

  return releases.filter((release) =>
    Object.values(release.sections).some((items) => items.length > 0),
  );
}

function loadFromMarkdownDir(dir) {
  if (!existsSync(dir)) return null;
  const registry = {};
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".md")) continue;
    registry[file.slice(0, -3)] = parseComponentChangelog(
      readFileSync(path.join(dir, file), "utf8"),
    );
  }
  return Object.keys(registry).length > 0 ? registry : null;
}

function resolveRegistry() {
  // Prefer sibling Spiral2 when present (local monorepo / dual-checkout),
  // matching sync-props.mjs so unpublished component changelogs appear in docs.
  const siblingJson = path.resolve(
    repoRoot,
    "../Spiral2/packages/ui/dist/component-changelogs.json",
  );
  if (existsSync(siblingJson)) {
    console.log("Synced component changelogs from sibling Spiral2 dist JSON");
    return JSON.parse(readFileSync(siblingJson, "utf8"));
  }

  const siblingMd = path.resolve(repoRoot, "../Spiral2/packages/ui/changelogs");
  const fromMd = loadFromMarkdownDir(siblingMd);
  if (fromMd) {
    console.log("Synced component changelogs from sibling Spiral2 changelogs/*.md");
    return fromMd;
  }

  const packageDir = findSpiralPackage();
  const fromPackage = packageDir
    ? path.join(packageDir, "dist/component-changelogs.json")
    : null;
  if (fromPackage && existsSync(fromPackage)) {
    console.log(
      `Synced component changelogs from @aviala-design/spiral@${readSpiralVersion()}`,
    );
    return JSON.parse(readFileSync(fromPackage, "utf8"));
  }

  if (existsSync(target)) {
    console.warn(
      `@aviala-design/spiral@${readSpiralVersion()} has no component-changelogs.json; using committed generated file.`,
    );
    return JSON.parse(readFileSync(target, "utf8"));
  }

  console.warn("No component changelogs found; writing empty registry.");
  return {};
}

const registry = resolveRegistry();
mkdirSync(path.dirname(target), { recursive: true });
writeFileSync(target, `${JSON.stringify(registry, null, 2)}\n`);
console.log(`Wrote ${Object.keys(registry).length} component changelogs → ${target}`);
