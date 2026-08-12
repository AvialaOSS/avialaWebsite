import * as Spiral from "@aviala-design/spiral";

/** Capitalized runtime exports from Spiral for live demo eval. */
export function buildEditorDemoScope(): Record<string, unknown> {
  const scope: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(Spiral)) {
    if (!key || key[0] !== key[0]!.toUpperCase()) continue;
    if (value == null) continue;
    scope[key] = value;
  }
  return scope;
}
