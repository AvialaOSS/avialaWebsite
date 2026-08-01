import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const generatedDir = path.resolve(dirname, "../src/generated");
const latestTarget = path.resolve(generatedDir, "npm-latest.json");
const releasesTarget = path.resolve(generatedDir, "npm-releases.json");

const PACKAGE_NAME = "@aviala-design/spiral";
const REGISTRY_URL = `https://registry.npmjs.org/${PACKAGE_NAME}`;
const DEFAULT_REPO = "https://github.com/AvialaOSS/spiral-2";

function repoUrlFromNpm(repository) {
  if (!repository) return DEFAULT_REPO;
  const raw = typeof repository === "string" ? repository : repository.url;
  if (!raw || typeof raw !== "string") return DEFAULT_REPO;
  return raw
    .replace(/^git\+/, "")
    .replace(/^git:\/\//, "https://")
    .replace(/\.git$/, "")
    .replace(/^ssh:\/\/git@github\.com\//, "https://github.com/")
    .replace(/^git@github\.com:/, "https://github.com/");
}

function writeLatest(payload) {
  writeFileSync(latestTarget, `${JSON.stringify(payload, null, 2)}\n`);
}

function writeReleases(payload) {
  writeFileSync(releasesTarget, `${JSON.stringify(payload, null, 2)}\n`);
}

function keepExistingReleases(errorMessage) {
  if (!existsSync(releasesTarget)) {
    writeReleases({
      name: PACKAGE_NAME,
      repositoryUrl: DEFAULT_REPO,
      fetchedAt: null,
      versions: {},
      error: errorMessage,
    });
    return;
  }
  try {
    const existing = JSON.parse(readFileSync(releasesTarget, "utf8"));
    writeReleases({
      ...existing,
      fetchedAt: existing.fetchedAt ?? null,
      error: errorMessage,
    });
  } catch {
    writeReleases({
      name: PACKAGE_NAME,
      repositoryUrl: DEFAULT_REPO,
      fetchedAt: null,
      versions: {},
      error: errorMessage,
    });
  }
}

async function fetchPackage() {
  const res = await fetch(REGISTRY_URL, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`npm registry ${res.status} ${res.statusText}`);
  }
  return res.json();
}

try {
  const data = await fetchPackage();
  const latestVersion = String(data["dist-tags"]?.latest ?? "");
  const fetchedAt = new Date().toISOString();
  const repositoryUrl = repoUrlFromNpm(data.repository);
  const versions = {};

  for (const [version, publishedAt] of Object.entries(data.time ?? {})) {
    if (!/^\d/.test(version)) continue;
    if (typeof publishedAt !== "string") continue;
    versions[version] = { publishedAt };
  }

  mkdirSync(generatedDir, { recursive: true });
  writeLatest({
    name: PACKAGE_NAME,
    version: latestVersion,
    fetchedAt,
  });
  writeReleases({
    name: PACKAGE_NAME,
    repositoryUrl,
    fetchedAt,
    versions,
  });
  console.log(
    `npm @aviala-design/spiral latest=${latestVersion} versions=${Object.keys(versions).length} → ${generatedDir}`,
  );
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`Could not fetch npm package metadata (${message}); writing placeholders.`);
  mkdirSync(generatedDir, { recursive: true });
  writeLatest({
    name: PACKAGE_NAME,
    version: "",
    fetchedAt: null,
    error: message,
  });
  keepExistingReleases(message);
}
