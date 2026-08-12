import type {
  DesignGuideBlock,
  DesignGuideDemoBlock,
  DesignGuideDoc,
  DesignGuideProseBlock,
  DesignGuideRowBlock,
} from "../doc-revisions/types";
import { normalizeMarker } from "./design-guide-markers";

/** Deep-clone a design guide for editor state. */
export function cloneDesignGuide(guide: DesignGuideDoc): DesignGuideDoc {
  return structuredClone(guide);
}

/** Empty published shell for authors starting from scratch. */
export function emptyPublishedDesignGuide(): DesignGuideDoc {
  return { status: "published", blocks: [] };
}

export function formatDesignGuideJson(guide: DesignGuideDoc): string {
  return JSON.stringify(normalizeForExport(guide), null, 2);
}

function formatDesignGuideObject(guide: DesignGuideDoc, indent = 0): string[] {
  const normalized = normalizeForExport(guide);
  const blocks = normalized.blocks ?? [];
  const pad = " ".repeat(indent);
  const inner = " ".repeat(indent + 2);
  const lines = [`${pad}{`];
  lines.push(`${inner}status: ${JSON.stringify(normalized.status)},`);
  if (normalized.prose?.trim() && blocks.length === 0) {
    lines.push(`${inner}prose: ${formatTsString(normalized.prose, indent + 2)},`);
  }
  lines.push(`${inner}blocks: [`);
  for (const block of blocks) {
    lines.push(...formatBlockTs(block, indent + 4));
  }
  lines.push(`${inner}],`);
  lines.push(`${pad}}`);
  return lines;
}

/**
 * Ready-to-paste property snippet (legacy revision embed):
 * `designGuide: { status: "published", blocks: [ … ] },`
 */
export function formatDesignGuideTs(guide: DesignGuideDoc): string {
  const obj = formatDesignGuideObject(guide, 0).join("\n");
  return `designGuide: ${obj},`;
}

/** Standalone versionless module: `doc-revisions/{Component}/design-guide.ts`. */
export function formatDesignGuideModule(guide: DesignGuideDoc): string {
  const obj = formatDesignGuideObject(guide, 0).join("\n");
  return [
    `import type { DesignGuideDoc } from "../types";`,
    ``,
    `const designGuide: DesignGuideDoc = ${obj};`,
    ``,
    `export default designGuide;`,
    ``,
  ].join("\n");
}

function normalizeForExport(guide: DesignGuideDoc): DesignGuideDoc {
  const blocks = (guide.blocks ?? []).map(normalizeBlock);
  const out: DesignGuideDoc = {
    status: guide.status,
    blocks,
  };
  if (guide.prose?.trim() && blocks.length === 0) {
    out.prose = guide.prose;
  }
  return out;
}

function normalizeBlock(block: DesignGuideBlock): DesignGuideBlock {
  if (block.type === "prose") {
    return { type: "prose", text: block.text };
  }
  if (block.type === "demo") {
    return normalizeDemo(block);
  }
  return {
    type: "row",
    columns: block.columns.map((col) =>
      col.type === "prose" ? { type: "prose", text: col.text } : normalizeDemo(col),
    ),
  };
}

function normalizeDemo(demo: DesignGuideDemoBlock): DesignGuideDemoBlock {
  const out: DesignGuideDemoBlock = { type: "demo", code: demo.code };
  if (demo.caption?.trim()) out.caption = demo.caption;
  if (demo.align && demo.align !== "center") out.align = demo.align;
  if (demo.verdict) out.verdict = demo.verdict;
  if (typeof demo.height === "number" && Number.isFinite(demo.height) && demo.height > 0) {
    out.height = Math.round(demo.height);
  }
  if (demo.markers && demo.markers.length > 0) {
    out.markers = demo.markers.map((m) => normalizeMarker(m));
  }
  if (demo.markersProse && Number.isFinite(demo.markersProse.blockIndex)) {
    out.markersProse = {
      blockIndex: demo.markersProse.blockIndex,
      ...(typeof demo.markersProse.columnIndex === "number"
        ? { columnIndex: demo.markersProse.columnIndex }
        : {}),
    };
  }
  return out;
}

function formatBlockTs(block: DesignGuideBlock, indent: number): string[] {
  const pad = " ".repeat(indent);
  if (block.type === "prose") {
    return formatProseTs(block, indent);
  }
  if (block.type === "demo") {
    return formatDemoTs(block, indent);
  }
  return formatRowTs(block, indent, pad);
}

function formatProseTs(block: DesignGuideProseBlock, indent: number): string[] {
  const pad = " ".repeat(indent);
  return [
    `${pad}{`,
    `${pad}  type: "prose",`,
    `${pad}  text: ${formatTsString(block.text, indent + 2)},`,
    `${pad}},`,
  ];
}

function formatDemoTs(block: DesignGuideDemoBlock, indent: number): string[] {
  const pad = " ".repeat(indent);
  const lines = [`${pad}{`, `${pad}  type: "demo",`];
  lines.push(`${pad}  code: ${formatCodeLiteral(block.code, indent + 2)},`);
  if (block.caption?.trim()) {
    lines.push(`${pad}  caption: ${formatTsString(block.caption, indent + 2)},`);
  }
  if (block.align && block.align !== "center") {
    lines.push(`${pad}  align: ${JSON.stringify(block.align)},`);
  }
  if (block.verdict) {
    lines.push(`${pad}  verdict: ${JSON.stringify(block.verdict)},`);
  }
  if (typeof block.height === "number" && Number.isFinite(block.height) && block.height > 0) {
    lines.push(`${pad}  height: ${Math.round(block.height)},`);
  }
  if (block.markers && block.markers.length > 0) {
    lines.push(`${pad}  markers: [`);
    for (const marker of block.markers) {
      const m = normalizeMarker(marker);
      lines.push(`${pad}    {`);
      lines.push(`${pad}      id: ${JSON.stringify(m.id)},`);
      lines.push(`${pad}      selector: ${JSON.stringify(m.selector)},`);
      lines.push(`${pad}      note: ${formatTsString(m.note ?? "", indent + 6)},`);
      if (m.anchor) lines.push(`${pad}      anchor: ${JSON.stringify(m.anchor)},`);
      if (typeof m.margin === "number") lines.push(`${pad}      margin: ${m.margin},`);
      if (typeof m.offsetX === "number") lines.push(`${pad}      offsetX: ${m.offsetX},`);
      if (typeof m.offsetY === "number") lines.push(`${pad}      offsetY: ${m.offsetY},`);
      if (m.line) lines.push(`${pad}      line: true,`);
      lines.push(`${pad}    },`);
    }
    lines.push(`${pad}  ],`);
  }
  if (block.markersProse && Number.isFinite(block.markersProse.blockIndex)) {
    const target = block.markersProse;
    if (typeof target.columnIndex === "number") {
      lines.push(
        `${pad}  markersProse: { blockIndex: ${target.blockIndex}, columnIndex: ${target.columnIndex} },`,
      );
    } else {
      lines.push(`${pad}  markersProse: { blockIndex: ${target.blockIndex} },`);
    }
  }
  lines.push(`${pad}},`);
  return lines;
}

function formatRowTs(block: DesignGuideRowBlock, indent: number, pad: string): string[] {
  const lines = [`${pad}{`, `${pad}  type: "row",`, `${pad}  columns: [`];
  for (const col of block.columns) {
    if (col.type === "prose") {
      lines.push(...formatProseTs(col, indent + 4));
    } else {
      lines.push(...formatDemoTs(col, indent + 4));
    }
  }
  lines.push(`${pad}  ],`, `${pad}},`);
  return lines;
}

/** Prefer template literal when code has no backticks; else JSON string. */
function formatCodeLiteral(code: string, indent: number): string {
  if (!code.includes("`") && !code.includes("${")) {
    const inner = code.replace(/\r\n/g, "\n");
    const lines = inner.split("\n");
    if (lines.length === 1) {
      return `\`${inner}\``;
    }
    const pad = " ".repeat(indent);
    const body = lines.map((line) => `${pad}${line}`).join("\n");
    // Opening backtick on same line as `code:`, closing after indented body
    return `\`\n${body}\n${" ".repeat(indent - 2)}\``;
  }
  return formatTsString(code, indent);
}

function formatTsString(value: string, indent: number): string {
  const json = JSON.stringify(value);
  // Keep single-line JSON strings as-is; multiline stays escaped in one string.
  void indent;
  return json;
}

export function parseDesignGuideJson(text: string): DesignGuideDoc | null {
  try {
    const parsed = JSON.parse(text) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const doc = parsed as DesignGuideDoc;
    if (doc.status !== "draft" && doc.status !== "published") return null;
    return cloneDesignGuide(doc);
  } catch {
    return null;
  }
}

export function createDefaultDemo(): DesignGuideDemoBlock {
  return {
    type: "demo",
    code: `render(
  <div>Replace with a scoped component</div>
);`,
    align: "center",
  };
}

export function createDefaultProse(): DesignGuideProseBlock {
  return { type: "prose", text: "" };
}

export function createDefaultRow(): DesignGuideRowBlock {
  return {
    type: "row",
    columns: [createDefaultDemo(), createDefaultDemo()],
  };
}
