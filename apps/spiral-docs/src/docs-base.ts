/** Shared docs URL helpers (basename may include /v/{version}). */

export function getDocsBasename(): string {
  const fromEnv = import.meta.env.VITE_DOCS_BASENAME;
  if (typeof fromEnv === "string" && fromEnv.length > 0) return fromEnv.replace(/\/$/, "");

  if (typeof window !== "undefined") {
    const match = window.location.pathname.match(/^(\/docs\/spiral(?:\/v\/[^/]+)?)/);
    if (match) return match[1];
  }
  return "/docs/spiral";
}

export function getDocsVersionFromBasename(basename = getDocsBasename()): string | null {
  const match = basename.match(/\/docs\/spiral\/v\/([^/]+)$/);
  return match?.[1] ?? null;
}

export function docsPathToHref(to: string, basename = getDocsBasename()): string {
  const path = to.startsWith("/") ? to : `/${to}`;
  return `${basename}${path}`;
}

/** Path after the docs basename (always starts with /). */
export function getDocsRestPath(pathname = window.location.pathname): string {
  const basename = getDocsBasename();
  if (pathname === basename || pathname === `${basename}/`) return "/";
  if (pathname.startsWith(`${basename}/`)) {
    return pathname.slice(basename.length) || "/";
  }
  // Unversioned deep link while viewing a versioned build, or vice versa.
  const stripped = pathname.replace(/^\/docs\/spiral(?:\/v\/[^/]+)?/, "") || "/";
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
}
