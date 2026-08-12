import type { DesignGuideDoc } from "@spiral-docs/doc-revisions/types";
import { formatDesignGuideTs } from "@spiral-docs/lib/design-guide-serialize";

function findMatchingBrace(source: string, openIndex: number): number {
  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let escaped = false;

  for (let i = openIndex; i < source.length; i++) {
    const ch = source[i]!;
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === "\\" && (inSingle || inDouble || inTemplate)) {
      escaped = true;
      continue;
    }
    if (!inDouble && !inTemplate && ch === "'" && !inSingle) {
      inSingle = true;
      continue;
    }
    if (inSingle && ch === "'") {
      inSingle = false;
      continue;
    }
    if (!inSingle && !inTemplate && ch === '"' && !inDouble) {
      inDouble = true;
      continue;
    }
    if (inDouble && ch === '"') {
      inDouble = false;
      continue;
    }
    if (!inSingle && !inDouble && ch === "`") {
      inTemplate = !inTemplate;
      continue;
    }
    if (inSingle || inDouble || inTemplate) continue;

    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function findDesignGuideSpan(
  source: string,
): { keyStart: number; valueStart: number; valueEnd: number } | null {
  const re =
    /(?:(?:const|let|var)\s+designGuide(?:\s*:\s*[^=]+)?\s*=|designGuide\s*:)/;
  const m = re.exec(source);
  if (!m) return null;
  let i = m.index + m[0].length;
  while (i < source.length && /\s/.test(source[i]!)) i += 1;
  if (source[i] !== "{") return null;
  const valueEnd = findMatchingBrace(source, i);
  if (valueEnd < 0) return null;
  return { keyStart: m.index, valueStart: i, valueEnd };
}

/** Evaluate the `designGuide` object literal from a standalone or revision .ts file. */
export function extractDesignGuide(source: string): DesignGuideDoc | null {
  const span = findDesignGuideSpan(source);
  if (!span) return null;
  const literal = source.slice(span.valueStart, span.valueEnd + 1);
  try {
    // Object literal with template strings / trailing commas — JS Function is enough.
    const value = new Function(`"use strict"; return (${literal});`)();
    if (!value || typeof value !== "object") return null;
    const doc = value as DesignGuideDoc;
    if (doc.status !== "draft" && doc.status !== "published") return null;
    return structuredClone(doc);
  } catch {
    return null;
  }
}

/**
 * Replace or insert `designGuide: { … },` using formatDesignGuideTs output.
 */
export function applyDesignGuideToSource(
  source: string,
  guide: DesignGuideDoc,
): string {
  const snippet = formatDesignGuideTs(guide).trimEnd();
  const span = findDesignGuideSpan(source);
  if (span) {
    let end = span.valueEnd + 1;
    while (end < source.length && /\s/.test(source[end]!)) end += 1;
    if (source[end] === ",") end += 1;
    const before = source.slice(0, span.keyStart);
    const after = source.slice(end);
    const needsLeadingNl = before.length > 0 && !before.endsWith("\n");
    const indentMatch = before.match(/(?:^|\n)([ \t]*)$/);
    const indent = indentMatch?.[1] ?? "  ";
    const indented = snippet
      .split("\n")
      .map((line, idx) => (idx === 0 ? line : `${indent}${line}`))
      .join("\n");
    return `${before}${needsLeadingNl ? "\n" : ""}${indented}${after}`;
  }

  // Insert before the closing `};` of `const revision = { … };`
  const close = source.lastIndexOf("};");
  if (close < 0) {
    throw new Error("无法在 revision 文件中定位插入点（缺少 designGuide 且找不到 };）");
  }
  const before = source.slice(0, close);
  const indent = "  ";
  const indented = snippet
    .split("\n")
    .map((line) => `${indent}${line}`)
    .join("\n");
  return `${before}${indented}\n${source.slice(close)}`;
}
