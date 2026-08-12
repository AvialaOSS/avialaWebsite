import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(dirname, "..");
const srcRoot = path.join(appRoot, "src");
const BASENAME = "/docs";

/**
 * @typedef {{ label: string, path: string, component?: string, section: string }} NavEntry
 * @typedef {{ title: string, tags: string[], categories: string[], contents: string, permalink: string }} SearchPage
 */

/**
 * Parse nav.ts for section / label / path / component without importing TS.
 * @param {string} source
 * @returns {NavEntry[]}
 */
export function parseNav(source) {
  /** @type {NavEntry[]} */
  const entries = [];
  const sectionRe =
    /section:\s*"([^"]+)"\s*,\s*items:\s*\[([\s\S]*?)\]\s*,?\s*\}/g;

  let sectionMatch;
  while ((sectionMatch = sectionRe.exec(source)) !== null) {
    const section = sectionMatch[1];
    const itemsBody = sectionMatch[2];
    const objectRe = /\{[^{}]*\}/g;
    let objectMatch;
    while ((objectMatch = objectRe.exec(itemsBody)) !== null) {
      const block = objectMatch[0];
      const label = block.match(/label:\s*"([^"]+)"/)?.[1];
      const itemPath = block.match(/path:\s*"([^"]+)"/)?.[1];
      if (!label || !itemPath) continue;

      /** @type {NavEntry} */
      const entry = { section, label, path: itemPath };
      const component = block.match(/component:\s*"([^"]+)"/)?.[1];
      if (component) entry.component = component;
      entries.push(entry);
    }
  }

  return entries;
}

/**
 * @param {string} dir
 * @param {(file: string) => boolean} predicate
 * @returns {string[]}
 */
function walkFiles(dir, predicate) {
  /** @type {string[]} */
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) {
      out.push(...walkFiles(full, predicate));
    } else if (predicate(full)) {
      out.push(full);
    }
  }
  return out;
}

/**
 * Extract title/description pairs from DocPageHeader and DocShell usages.
 * @param {string} source
 * @returns {{ title: string, description: string }[]}
 */
export function extractHeaders(source) {
  /** @type {{ title: string, description: string }[]} */
  const headers = [];

  const patterns = [
    /<DocPageHeader\b([\s\S]*?)\/>/g,
    /<DocShell\b([\s\S]*?)\/>/g,
  ];

  for (const re of patterns) {
    for (const match of source.matchAll(re)) {
      const attrs = match[1];
      const title =
        attrs.match(/\btitle\s*=\s*"([^"]*)"/)?.[1] ??
        attrs.match(/\btitle\s*=\s*'([^']*)'/)?.[1] ??
        null;
      if (!title) continue;

      let description =
        attrs.match(/\bdescription\s*=\s*"([^"]*)"/)?.[1] ??
        attrs.match(/\bdescription\s*=\s*'([^']*)'/)?.[1] ??
        attrs.match(/\bdescription\s*=\s*\{`([^`]*)`\}/)?.[1] ??
        attrs.match(/\bdescription\s*=\s*`([^`]*)`/)?.[1] ??
        "";

      description = description.replace(/\$\{[^}]*\}/g, " ").replace(/\s+/g, " ").trim();
      headers.push({ title, description });
    }
  }

  return headers;
}

/**
 * Strip MDX/markdown to plain searchable text.
 * @param {string} source
 */
export function mdxToPlain(source) {
  return source
    .replace(/^import\s.+;?\s*$/gm, "")
    .replace(/^export\s.+;?\s*$/gm, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * @param {string} navPath
 */
function permalinkFor(navPath) {
  const suffix = navPath.startsWith("/") ? navPath : `/${navPath}`;
  return `${BASENAME}${suffix}`;
}

/**
 * @returns {SearchPage[]}
 */
export function buildSearchPages() {
  const navSource = readFileSync(path.join(srcRoot, "nav.ts"), "utf8");
  const navEntries = parseNav(navSource);

  /** @type {Map<string, { title: string, description: string }>} */
  const headersByTitle = new Map();
  for (const file of walkFiles(path.join(srcRoot, "pages"), (f) => f.endsWith(".tsx"))) {
    for (const header of extractHeaders(readFileSync(file, "utf8"))) {
      headersByTitle.set(header.title, header);
    }
  }

  /** @type {Record<string, { props?: { name: string }[] }> | null} */
  let propsRegistry = null;
  const propsFile = path.join(srcRoot, "generated", "props.json");
  if (existsSync(propsFile)) {
    propsRegistry = JSON.parse(readFileSync(propsFile, "utf8"));
  }

  /** @type {SearchPage[]} */
  const pages = [];

  for (const entry of navEntries) {
    /** @type {string[]} */
    const parts = [entry.section, entry.label];
    if (entry.component) parts.push(entry.component);

    const header = headersByTitle.get(entry.label);
    if (header?.description) parts.push(header.description);

    if (entry.path.startsWith("/start/")) {
      const slug = entry.path.slice("/start/".length);
      const mdxPath = path.join(srcRoot, "content", "start", `${slug}.mdx`);
      if (existsSync(mdxPath)) {
        parts.push(mdxToPlain(readFileSync(mdxPath, "utf8")));
      }
    }

    if (entry.component && propsRegistry?.[entry.component]?.props) {
      const propNames = propsRegistry[entry.component].props
        .map((p) => p.name)
        .filter(Boolean);
      if (propNames.length) parts.push(propNames.join(" "));
    }

    pages.push({
      title: entry.label,
      tags: ["Spiral", entry.section],
      categories: ["Spiral"],
      contents: parts.join(" ").replace(/\s+/g, " ").trim(),
      permalink: permalinkFor(entry.path),
    });
  }

  return pages;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const pages = buildSearchPages();
  console.log(JSON.stringify({ searchPages: pages }, null, 2));
  console.error(`Built ${pages.length} Spiral search pages`);
}
