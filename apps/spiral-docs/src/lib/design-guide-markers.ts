import type {
  DesignDemoMarker,
  DesignDemoMarkerAnchor,
} from "../doc-revisions/types";

export const DESIGN_MARKERS_FENCE_START = "<<<design-markers";
export const DESIGN_MARKERS_FENCE_END = ">>>";
export const DEFAULT_MARKER_ANCHOR: DesignDemoMarkerAnchor = "top-start";
export const DEFAULT_MARKER_MARGIN = 4;
export const MARKER_BADGE_SIZE = 20;

const FENCE_RE =
  /(?:^|\n)<<<design-markers\r?\n([\s\S]*?)\r?\n>>>(?:\r?\n|$)/;

const SKIP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "SVG",
  "PATH",
  "BR",
  "HR",
]);

export function createMarkerId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Replace or append the managed marker list fence; keep other prose. */
export function syncMarkersIntoProse(
  text: string,
  markers: DesignDemoMarker[],
): string {
  const fence = formatMarkersFence(markers);
  const match = FENCE_RE.exec(text);
  if (match) {
    const start = match.index + (match[0].startsWith("\n") ? 1 : 0);
    const end = match.index + match[0].length;
    const before = text.slice(0, start).replace(/\n+$/, "");
    const after = text.slice(end).replace(/^\n+/, "");
    return [before, fence, after].filter((part) => part.length > 0).join("\n\n");
  }
  const trimmed = text.replace(/\s+$/, "");
  if (!trimmed) return fence;
  return `${trimmed}\n\n${fence}`;
}

/** Remove the managed fence; leave surrounding copy. */
export function stripManagedMarkers(text: string): string {
  const next = text.replace(FENCE_RE, (full) => (full.startsWith("\n") ? "\n" : ""));
  return next.replace(/\n{3,}/g, "\n\n").trimEnd();
}

export function parseManagedMarkers(
  text: string,
): { notes: string[]; before: string; after: string } | null {
  const match = FENCE_RE.exec(text);
  if (!match) return null;
  const body = match[1] ?? "";
  const notes = body
    .split("\n")
    .map((line) => {
      const m = /^(\d+)\.\s?(.*)$/.exec(line);
      return m ? m[2]! : null;
    })
    .filter((n): n is string => n != null);

  const start = match.index + (match[0].startsWith("\n") ? 1 : 0);
  const end = match.index + match[0].length;
  return {
    notes,
    before: text.slice(0, start).replace(/\n+$/, ""),
    after: text.slice(end).replace(/^\n+/, ""),
  };
}

export function formatMarkersFence(markers: DesignDemoMarker[]): string {
  const lines = markers.map((m, i) => `${i + 1}. ${m.note}`);
  return [DESIGN_MARKERS_FENCE_START, ...lines, DESIGN_MARKERS_FENCE_END].join(
    "\n",
  );
}

/** Split prose for rendering: free paragraphs + managed marker list. */
export function splitProseWithMarkers(text: string): {
  before: string;
  markers: { n: number; note: string }[] | null;
  after: string;
} {
  const parsed = parseManagedMarkers(text);
  if (!parsed) {
    return { before: text, markers: null, after: "" };
  }
  return {
    before: parsed.before,
    markers: parsed.notes.map((note, i) => ({ n: i + 1, note })),
    after: parsed.after,
  };
}

export type MarkerBox = { left: number; top: number; width: number; height: number };

export type MarkerPlacement = {
  left: number;
  top: number;
  lineFromX: number;
  lineFromY: number;
  lineToX: number;
  lineToY: number;
};

function anchorNormals(anchor: DesignDemoMarkerAnchor): {
  ax: number;
  ay: number;
  nx: number;
  ny: number;
} {
  const map: Record<
    DesignDemoMarkerAnchor,
    { ax: number; ay: number; nx: number; ny: number }
  > = {
    "top-start": { ax: 0, ay: 0, nx: -0.5, ny: -1 },
    "top-center": { ax: 0.5, ay: 0, nx: 0, ny: -1 },
    "top-end": { ax: 1, ay: 0, nx: 0.5, ny: -1 },
    "center-start": { ax: 0, ay: 0.5, nx: -1, ny: 0 },
    center: { ax: 0.5, ay: 0.5, nx: 0, ny: 0 },
    "center-end": { ax: 1, ay: 0.5, nx: 1, ny: 0 },
    "bottom-start": { ax: 0, ay: 1, nx: -0.5, ny: 1 },
    "bottom-center": { ax: 0.5, ay: 1, nx: 0, ny: 1 },
    "bottom-end": { ax: 1, ay: 1, nx: 0.5, ny: 1 },
  };
  return map[anchor];
}

/** Place badge relative to a target box in the same coordinate space. */
export function placeMarkerOnTarget(
  box: MarkerBox,
  marker: Pick<DesignDemoMarker, "anchor" | "margin" | "offsetX" | "offsetY">,
  badgeSize = MARKER_BADGE_SIZE,
): MarkerPlacement {
  const anchor = marker.anchor ?? DEFAULT_MARKER_ANCHOR;
  const margin = marker.margin ?? DEFAULT_MARKER_MARGIN;
  const offsetX = marker.offsetX ?? 0;
  const offsetY = marker.offsetY ?? 0;
  const { ax, ay, nx, ny } = anchorNormals(anchor);

  const attachX = box.left + box.width * ax;
  const attachY = box.top + box.height * ay;
  const len = Math.hypot(nx, ny) || 1;
  const ux = nx / len;
  const uy = ny / len;
  const gap = margin + badgeSize / 2;
  const centerX = attachX + ux * gap + offsetX;
  const centerY = attachY + uy * gap + offsetY;

  return {
    left: centerX - badgeSize / 2,
    top: centerY - badgeSize / 2,
    lineFromX: centerX,
    lineFromY: centerY,
    lineToX: attachX,
    lineToY: attachY,
  };
}

export function normalizeMarker(m: DesignDemoMarker): DesignDemoMarker {
  const out: DesignDemoMarker = {
    id: m.id,
    selector: m.selector,
    note: m.note ?? "",
  };
  if (m.anchor && m.anchor !== DEFAULT_MARKER_ANCHOR) out.anchor = m.anchor;
  if (typeof m.offsetX === "number" && m.offsetX !== 0) {
    out.offsetX = Math.round(m.offsetX);
  }
  if (typeof m.offsetY === "number" && m.offsetY !== 0) {
    out.offsetY = Math.round(m.offsetY);
  }
  if (typeof m.margin === "number" && m.margin !== DEFAULT_MARKER_MARGIN) {
    out.margin = Math.round(m.margin);
  }
  if (m.line) out.line = true;
  return out;
}

function cssEscapeIdent(value: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  return value.replace(/([^\w-])/g, "\\$1");
}

function stableClassTokens(el: Element): string[] {
  const raw = typeof el.className === "string" ? el.className : "";
  return raw
    .split(/\s+/)
    .map((c) => c.trim())
    .filter(
      (c) =>
        c &&
        !c.startsWith("docs-") &&
        !c.startsWith("is-") &&
        !c.startsWith("has-") &&
        c !== "focus-visible",
    );
}

function preferAvialaClasses(tokens: string[]): string[] {
  const aviala = tokens.filter((c) => c.startsWith("aviala-"));
  return aviala.length > 0 ? aviala.slice(0, 2) : tokens.slice(0, 2);
}

function nthOfTypeSelector(el: Element): string {
  const tag = el.tagName.toLowerCase();
  const parent = el.parentElement;
  if (!parent) return tag;
  const siblings = [...parent.children].filter((c) => c.tagName === el.tagName);
  if (siblings.length <= 1) return tag;
  const index = siblings.indexOf(el) + 1;
  return `${tag}:nth-of-type(${index})`;
}

function segmentFor(el: Element): string {
  if (el.id && !el.id.includes(":")) {
    return `#${cssEscapeIdent(el.id)}`;
  }
  const classes = preferAvialaClasses(stableClassTokens(el));
  if (classes.length > 0) {
    return `${el.tagName.toLowerCase()}${classes.map((c) => `.${cssEscapeIdent(c)}`).join("")}`;
  }
  return nthOfTypeSelector(el);
}

export function buildRelativeSelector(root: Element, el: Element): string | null {
  if (!root.contains(el) || el === root) return null;

  const parts: string[] = [];
  let current: Element | null = el;
  while (current && current !== root) {
    parts.unshift(segmentFor(current));
    const trial = parts.join(" > ");
    try {
      const matches = root.querySelectorAll(trial);
      if (matches.length === 1 && matches[0] === el) {
        return trial;
      }
    } catch {
      /* invalid */
    }
    current = current.parentElement;
  }

  const path: string[] = [];
  current = el;
  while (current && current !== root) {
    path.unshift(nthOfTypeSelector(current));
    current = current.parentElement;
  }
  return path.length > 0 ? path.join(" > ") : null;
}

export function queryMarkerTarget(
  root: Element,
  selector: string,
): Element | null {
  try {
    return root.querySelector(selector);
  } catch {
    return null;
  }
}

export function resolveAnnotateTarget(
  root: Element,
  from: EventTarget | null,
): Element | null {
  let el = from instanceof Element ? from : null;
  if (!el && from instanceof Text) el = from.parentElement;
  while (el && el !== root) {
    if (!SKIP_TAGS.has(el.tagName) && root.contains(el)) {
      if (el.closest(".docs-design-marker, .docs-dge-marker-pop")) return null;
      return el;
    }
    el = el.parentElement;
  }
  return null;
}
