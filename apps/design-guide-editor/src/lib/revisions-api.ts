/** Client for the Vite design-guide / revisions API (local disk, no folder picker). */

export function designGuideRelPath(component: string): string {
  return `${component}/design-guide.ts`;
}

export function revisionRelPath(component: string, version: string): string {
  return `${component}/${version}.ts`;
}

function designGuideUrl(component: string): string {
  return `/api/design-guides/${encodeURIComponent(component)}`;
}

function revisionUrl(component: string, version: string): string {
  return `/api/revisions/${encodeURIComponent(component)}/${encodeURIComponent(version)}`;
}

async function readErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    if (data.error) return data.error;
  } catch {
    /* plain */
  }
  return fallback;
}

/** Returns `null` when the versionless file does not exist yet. */
export async function fetchDesignGuideText(component: string): Promise<string | null> {
  const res = await fetch(designGuideUrl(component));
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(await readErrorMessage(res, `加载失败 (${res.status})`));
  }
  return res.text();
}

export async function putDesignGuideText(component: string, text: string): Promise<void> {
  const res = await fetch(designGuideUrl(component), {
    method: "PUT",
    headers: { "Content-Type": "text/plain; charset=utf-8" },
    body: text,
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res, `保存失败 (${res.status})`));
  }
}

export async function fetchRevisionText(
  component: string,
  version: string,
): Promise<string> {
  const res = await fetch(revisionUrl(component, version));
  if (!res.ok) {
    throw new Error(await readErrorMessage(res, `加载失败 (${res.status})`));
  }
  return res.text();
}

export async function putRevisionText(
  component: string,
  version: string,
  text: string,
): Promise<void> {
  const res = await fetch(revisionUrl(component, version), {
    method: "PUT",
    headers: { "Content-Type": "text/plain; charset=utf-8" },
    body: text,
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res, `保存失败 (${res.status})`));
  }
}
