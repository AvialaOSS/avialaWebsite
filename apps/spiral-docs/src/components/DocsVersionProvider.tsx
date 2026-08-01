import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getDocsVersionFromBasename } from "../docs-base";
import {
  getCoveredDocsVersions,
  getDefaultDocsVersion,
} from "../versions-registry";

const STORAGE_KEY = "aviala-spiral-docs-reading-version";

type DocsVersionContextValue = {
  version: string;
  setVersion: (next: string) => void;
  /** True when switching should full-load another `/v/{version}/` SPA. */
  hardNavigate: boolean;
};

const DocsVersionContext = createContext<DocsVersionContextValue | null>(null);

function readStoredOverride(): string | null {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored && getCoveredDocsVersions().includes(stored)) return stored;
  } catch {
    // sessionStorage may be unavailable
  }
  return null;
}

function writeStoredOverride(version: string) {
  try {
    sessionStorage.setItem(STORAGE_KEY, version);
  } catch {
    // ignore
  }
}

/** Resolve the docs version currently being read (baked URL → soft override → default). */
export function resolveReadingDocsVersion(): string {
  const baked = import.meta.env.VITE_DOCS_VERSION;
  if (typeof baked === "string" && baked.length > 0) return baked;

  const fromUrl = getDocsVersionFromBasename();
  if (fromUrl) return fromUrl;

  return readStoredOverride() ?? getDefaultDocsVersion();
}

/**
 * Local unversioned Vite has no `/v/{ver}/` assets — soft-switch content only.
 * Baked / URL-versioned SPAs hard-navigate between builds.
 */
export function shouldHardNavigateDocsVersion(): boolean {
  if (typeof import.meta.env.VITE_DOCS_VERSION === "string" && import.meta.env.VITE_DOCS_VERSION) {
    return true;
  }
  if (getDocsVersionFromBasename()) return true;
  return false;
}

export function DocsVersionProvider({ children }: { children: ReactNode }) {
  const [version, setVersionState] = useState(resolveReadingDocsVersion);
  const hardNavigate = shouldHardNavigateDocsVersion();

  useEffect(() => {
    setVersionState(resolveReadingDocsVersion());
  }, []);

  const setVersion = (next: string) => {
    if (!getCoveredDocsVersions().includes(next)) return;
    writeStoredOverride(next);
    setVersionState(next);
  };

  return (
    <DocsVersionContext.Provider value={{ version, setVersion, hardNavigate }}>
      {/* Remount page trees when soft-switching so revisions/prose refresh. */}
      <div key={version} className="docs-version-root">
        {children}
      </div>
    </DocsVersionContext.Provider>
  );
}

export function useDocsVersion(): DocsVersionContextValue {
  const ctx = useContext(DocsVersionContext);
  if (!ctx) {
    const version = resolveReadingDocsVersion();
    return {
      version,
      setVersion: writeStoredOverride,
      hardNavigate: shouldHardNavigateDocsVersion(),
    };
  }
  return ctx;
}
