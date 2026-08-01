import { useEffect, useMemo, useState } from "react";
import {
  getComponentChangelogs,
  type ComponentChangelogRelease,
  type ComponentChangelogs,
} from "../changelog-registry";
import npmLatestBaked from "../generated/npm-latest.json";
import { getDefaultDocsVersion, isSemverGreater } from "../versions-registry";

export type DocsStaleInfo = {
  latest: string;
  docsVersion: string;
  component: string;
};

const NPM_LATEST_URL = "https://registry.npmjs.org/@aviala-design/spiral/latest";
const CHANGELOGS_CDN = (version: string) =>
  `https://cdn.jsdelivr.net/npm/@aviala-design/spiral@${encodeURIComponent(version)}/dist/component-changelogs.json`;

const LATEST_CACHE_KEY = "spiral-docs:npm-latest";
const CHANGELOGS_CACHE_PREFIX = "spiral-docs:component-changelogs:";
const CACHE_TTL_MS = 60 * 60 * 1000;

function releaseIsBeyondDocs(version: string, docsVersion: string, latest: string): boolean {
  if (version === "Unreleased") return false;
  return isSemverGreater(version, docsVersion) && !isSemverGreater(version, latest);
}

function componentHasUpdatesBeyondDocs(
  releases: ComponentChangelogRelease[] | undefined,
  docsVersion: string,
  latest: string,
): boolean {
  if (!releases?.length) return false;
  return releases.some((release) =>
    releaseIsBeyondDocs(release.version, docsVersion, latest),
  );
}

function getBakedNpmLatest(): string {
  return typeof npmLatestBaked.version === "string" ? npmLatestBaked.version : "";
}

function getBakedChangelogs(): ComponentChangelogs {
  return getComponentChangelogs();
}

function readJsonCache<T>(key: string): T | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { at?: number; value?: T };
    if (
      typeof parsed.at === "number" &&
      Date.now() - parsed.at < CACHE_TTL_MS &&
      parsed.value !== undefined
    ) {
      return parsed.value;
    }
  } catch {
    // ignore
  }
  return null;
}

function writeJsonCache<T>(key: string, value: T) {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), value }));
  } catch {
    // ignore
  }
}

function readCachedNpmLatest(): string | null {
  const cached = readJsonCache<string>(LATEST_CACHE_KEY);
  return typeof cached === "string" && cached ? cached : null;
}

/** Live registry lookup; falls back to null on network / CORS / parse errors. */
export async function fetchNpmLatestVersion(): Promise<string | null> {
  const cached = readCachedNpmLatest();
  if (cached) return cached;

  try {
    const res = await fetch(NPM_LATEST_URL, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { version?: string };
    const version = typeof data.version === "string" ? data.version : "";
    if (!version) return null;
    writeJsonCache(LATEST_CACHE_KEY, version);
    return version;
  } catch {
    return null;
  }
}

function isComponentChangelogs(value: unknown): value is ComponentChangelogs {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/** Live CDN lookup of Spiral's shipped component changelogs for a published version. */
export async function fetchComponentChangelogs(
  version: string,
): Promise<ComponentChangelogs | null> {
  if (!version) return null;
  const cacheKey = `${CHANGELOGS_CACHE_PREFIX}${version}`;
  const cached = readJsonCache<ComponentChangelogs>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(CHANGELOGS_CDN(version), {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (!isComponentChangelogs(data)) return null;
    writeJsonCache(cacheKey, data);
    return data;
  } catch {
    return null;
  }
}

/**
 * Only warn when this component's changelog has a release ahead of docs coverage
 * (and not beyond the known npm latest).
 */
export function resolveDocsStaleInfo(
  latest: string,
  component: string | undefined,
  changelogs: ComponentChangelogs = getBakedChangelogs(),
): DocsStaleInfo | null {
  if (!component) return null;
  const docsVersion = getDefaultDocsVersion();
  if (!latest || !isSemverGreater(latest, docsVersion)) return null;
  if (!componentHasUpdatesBeyondDocs(changelogs[component], docsVersion, latest)) {
    return null;
  }
  return { latest, docsVersion, component };
}

/**
 * Synchronous snapshot using build-time bake (and session cache if any).
 * Prefer `useDocsStaleInfo` in UI for live registry + CDN changelogs.
 */
export function getDocsStaleInfo(component?: string): DocsStaleInfo | null {
  return resolveDocsStaleInfo(
    readCachedNpmLatest() ?? getBakedNpmLatest(),
    component,
    getBakedChangelogs(),
  );
}

/**
 * Timely component-level stale detection:
 * 1) npm latest from registry
 * 2) component-changelogs.json from the published package on CDN
 * Banner only when this component has changelog entries ahead of docs coverage.
 */
export function useDocsStaleInfo(
  component?: string,
  enabled = true,
): DocsStaleInfo | null {
  const [latest, setLatest] = useState(
    () => (enabled ? (readCachedNpmLatest() ?? getBakedNpmLatest()) : ""),
  );
  const [changelogs, setChangelogs] = useState<ComponentChangelogs>(() =>
    enabled ? getBakedChangelogs() : {},
  );

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    void (async () => {
      const liveLatest = (await fetchNpmLatestVersion()) ?? getBakedNpmLatest();
      if (cancelled) return;
      if (liveLatest) setLatest(liveLatest);

      if (!liveLatest) return;
      const liveChangelogs = await fetchComponentChangelogs(liveLatest);
      if (cancelled) return;
      if (liveChangelogs) setChangelogs(liveChangelogs);
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return useMemo(
    () => (enabled ? resolveDocsStaleInfo(latest, component, changelogs) : null),
    [enabled, latest, component, changelogs],
  );
}
