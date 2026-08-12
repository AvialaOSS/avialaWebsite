import {
  DirectionArrowDown,
  DirectionArrowLeft,
  DirectionArrowRight,
  DirectionArrowUp,
  DevelopTerminal,
  GeneralDelete,
  GeneralGrabber,
  GeneralMenu,
  SymbolAdd,
} from "@aviala-design/icons";
import Editor, { type Monaco, type OnMount } from "@monaco-editor/react";
import {
  Button,
  HoverPopover,
  Loading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeaderText,
  ResponsiveTooltip,
  SegmentatorGroup,
  SegmentatorItem,
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectTrigger,
  SelectValue,
  Textarea,
  TooltipProvider,
  Typography,
  useTheme,
} from "@aviala-design/spiral";
import { useEffect, useMemo, useRef, useState, type DragEvent, type ReactElement } from "react";
import { getComponentLiveApi } from "../design-guide/component-live-api";
import {
  getDesignGuideTemplates,
  type DesignGuideDemoTemplate,
} from "../design-guide/templates";
import { defaultKnobValues, DemoKnobs, type KnobValues } from "./DemoKnobs";
import {
  cloneDesignGuide,
  createDefaultProse,
  emptyPublishedDesignGuide,
  formatDesignGuideModule,
} from "../lib/design-guide-serialize";
import { applySpiralMonacoThemes, spiralMonacoThemeId } from "../lib/monaco-spiral-theme";
import type {
  DesignDemoAlign,
  DesignDemoMarker,
  DesignDemoMarkersProseTarget,
  DesignDemoVerdict,
  DesignGuideBlock,
  DesignGuideColumn,
  DesignGuideDemoBlock,
  DesignGuideDoc,
  DesignGuideProseBlock,
  DesignGuideRowBlock,
} from "../doc-revisions/types";
import {
  createMarkerId,
  stripManagedMarkers,
  syncMarkersIntoProse,
} from "../lib/design-guide-markers";
import { DesignDemoFrame } from "./DesignDemoFrame";
import { DesignGuideWysiwyg } from "./DesignGuideWysiwyg";
import { MarkerHoverProvider, useMarkerHover } from "./MarkerHoverContext";

type DesignGuideEditorProps = {
  component: string;
  /** @deprecated Design guides are versionless; omit. */
  readingVersion?: string;
  repositoryGuide: DesignGuideDoc | undefined;
  liveCode?: string;
  scope: Record<string, unknown>;
  /** Shown in toolbar when editing via the standalone FS app. */
  fileLabel?: string;
  /** External status (e.g.「已保存到本地文件」). */
  externalSaveHint?: string | null;
  /** Persist guide (File System Access). When set, localStorage draft is not used. */
  onSave?: (guide: DesignGuideDoc) => Promise<void>;
  onReloadFromDisk?: () => void;
  onOpenDocs?: () => void;
  onChangeFolder?: () => void;
};

type Selection =
  | { blockIndex: number; columnIndex?: undefined }
  | { blockIndex: number; columnIndex: number };

function initialGuide(repositoryGuide: DesignGuideDoc | undefined): DesignGuideDoc {
  if (!repositoryGuide) return emptyPublishedDesignGuide();
  const cloned = cloneDesignGuide(repositoryGuide);
  if (!cloned.blocks) cloned.blocks = [];
  if (cloned.blocks.length === 0 && cloned.prose?.trim()) {
    cloned.blocks = [{ type: "prose", text: cloned.prose }];
    delete cloned.prose;
  }
  if (cloned.status !== "draft" && cloned.status !== "published") {
    cloned.status = "published";
  }
  return cloned;
}

function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item!);
  return next;
}

const DGE_DRAG_MIME = "application/x-dge-drag";

type DgeDragSource =
  | { type: "block"; index: number }
  | { type: "column"; blockIndex: number; columnIndex: number };

type DgeDropTarget =
  | { type: "stack"; index: number }
  | { type: "side"; index: number; side: "left" | "right" }
  | { type: "gap"; afterIndex: number }
  | { type: "col-side"; blockIndex: number; columnIndex: number; side: "left" | "right" };

function parseDragSource(raw: string): DgeDragSource | null {
  try {
    const parsed = JSON.parse(raw) as DgeDragSource;
    if (parsed?.type === "block" && typeof parsed.index === "number") return parsed;
    if (
      parsed?.type === "column" &&
      typeof parsed.blockIndex === "number" &&
      typeof parsed.columnIndex === "number"
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function readDragSource(dt: DataTransfer): DgeDragSource | null {
  const raw = dt.getData(DGE_DRAG_MIME) || dt.getData("text/plain");
  if (!raw) return null;
  const parsed = parseDragSource(raw);
  if (parsed) return parsed;
  const asIndex = Number(raw);
  if (Number.isFinite(asIndex)) return { type: "block", index: asIndex };
  return null;
}

function cloneBlocks(blocks: DesignGuideBlock[]): DesignGuideBlock[] {
  return blocks.map((b) =>
    b.type === "row" ? { type: "row", columns: [...b.columns] } : { ...b },
  );
}

function columnsFrom(payload: DesignGuideBlock | DesignGuideColumn): DesignGuideColumn[] {
  if (payload.type === "row") return [...payload.columns];
  return [payload];
}

function blockFromColumns(cols: DesignGuideColumn[]): DesignGuideBlock {
  return cols.length === 1 ? cols[0]! : { type: "row", columns: cols };
}

function extractSource(
  blocks: DesignGuideBlock[],
  source: DgeDragSource,
): { blocks: DesignGuideBlock[]; payload: DesignGuideBlock | DesignGuideColumn } | null {
  const next = cloneBlocks(blocks);
  if (source.type === "block") {
    if (source.index < 0 || source.index >= next.length) return null;
    const [payload] = next.splice(source.index, 1);
    return { blocks: next, payload: payload! };
  }
  const row = next[source.blockIndex];
  if (!row || row.type !== "row") return null;
  if (source.columnIndex < 0 || source.columnIndex >= row.columns.length) return null;
  const [payload] = row.columns.splice(source.columnIndex, 1);
  if (row.columns.length === 0) {
    next.splice(source.blockIndex, 1);
  } else if (row.columns.length === 1) {
    next[source.blockIndex] = row.columns[0]!;
  }
  return { blocks: next, payload: payload! };
}

function sameDropSource(source: DgeDragSource, target: DgeDropTarget): boolean {
  if (source.type === "block") {
    if (target.type === "stack" || target.type === "side") return source.index === target.index;
    return false;
  }
  if (target.type === "col-side") {
    return (
      source.blockIndex === target.blockIndex && source.columnIndex === target.columnIndex
    );
  }
  if (target.type === "side" || target.type === "stack") {
    return source.blockIndex === target.index;
  }
  return false;
}

function applyDragDrop(
  blocks: DesignGuideBlock[],
  source: DgeDragSource,
  target: DgeDropTarget,
): DesignGuideBlock[] | null {
  if (sameDropSource(source, target) && target.type !== "gap") {
    // Allow side-of-self only when dragging a column onto the parent row edge
    // to move to start/end — handled below for same-row cases.
    if (!(source.type === "column" && target.type === "side")) return null;
  }

  // Reorder within the same row via column side targets
  if (
    source.type === "column" &&
    target.type === "col-side" &&
    source.blockIndex === target.blockIndex
  ) {
    const next = cloneBlocks(blocks);
    const row = next[source.blockIndex];
    if (!row || row.type !== "row") return null;
    let to = target.side === "left" ? target.columnIndex : target.columnIndex + 1;
    const from = source.columnIndex;
    if (from < to) to -= 1;
    if (from === to) return null;
    const [item] = row.columns.splice(from, 1);
    row.columns.splice(to, 0, item!);
    return next;
  }

  if (source.type === "column" && target.type === "side" && source.blockIndex === target.index) {
    const next = cloneBlocks(blocks);
    const row = next[source.blockIndex];
    if (!row || row.type !== "row") return null;
    const [item] = row.columns.splice(source.columnIndex, 1);
    if (target.side === "left") row.columns.unshift(item!);
    else row.columns.push(item!);
    return next;
  }

  const removedRow =
    source.type === "column" &&
    blocks[source.blockIndex]?.type === "row" &&
    (blocks[source.blockIndex] as DesignGuideRowBlock).columns.length === 1;

  if (source.type === "block" && target.type === "stack") {
    return moveItem(blocks, source.index, target.index);
  }

  const extracted = extractSource(blocks, source);
  if (!extracted) return null;
  const next = extracted.blocks;
  const cols = columnsFrom(extracted.payload);
  let t = target;

  if (source.type === "block") {
    const si = source.index;
    if (t.type === "side") {
      if (si < t.index) t = { ...t, index: t.index - 1 };
    } else if (t.type === "gap") {
      if (si <= t.afterIndex) t = { ...t, afterIndex: t.afterIndex - 1 };
    } else if (t.type === "col-side") {
      if (si < t.blockIndex) t = { ...t, blockIndex: t.blockIndex - 1 };
    }
  } else if (removedRow) {
    if (t.type === "stack" || t.type === "side") {
      if (source.blockIndex < t.index) t = { ...t, index: t.index - 1 };
    } else if (t.type === "gap") {
      if (source.blockIndex <= t.afterIndex) t = { ...t, afterIndex: t.afterIndex - 1 };
    } else if (t.type === "col-side") {
      if (source.blockIndex < t.blockIndex) t = { ...t, blockIndex: t.blockIndex - 1 };
      else if (source.blockIndex === t.blockIndex) return null;
    }
  } else if (source.type === "column" && t.type === "stack") {
    // Row still exists (unwrapped or multi-col); stack index unchanged unless
    // we need to place relative to blocks after the row — index stays valid.
  }

  if (t.type === "gap") {
    next.splice(t.afterIndex + 1, 0, blockFromColumns(cols));
    return next;
  }

  if (t.type === "stack") {
    if (t.index < 0 || t.index > next.length) return null;
    next.splice(t.index, 0, blockFromColumns(cols));
    return next;
  }

  if (t.type === "side") {
    const targetBlock = next[t.index];
    if (!targetBlock) return null;
    if (targetBlock.type === "row") {
      if (t.side === "left") targetBlock.columns.unshift(...cols);
      else targetBlock.columns.push(...cols);
    } else {
      next[t.index] = {
        type: "row",
        columns: t.side === "left" ? [...cols, targetBlock] : [targetBlock, ...cols],
      };
    }
    return next;
  }

  if (t.type === "col-side") {
    const row = next[t.blockIndex];
    if (!row) return null;
    if (row.type !== "row") {
      next[t.blockIndex] = {
        type: "row",
        columns: t.side === "left" ? [...cols, row] : [row, ...cols],
      };
      return next;
    }
    const at = t.side === "left" ? t.columnIndex : t.columnIndex + 1;
    row.columns.splice(at, 0, ...cols);
    return next;
  }

  return null;
}

function zoneFromPointer(
  clientX: number,
  _clientY: number,
  rect: DOMRect,
): "left" | "right" | "stack" {
  const xRatio = (clientX - rect.left) / Math.max(rect.width, 1);
  if (xRatio < 0.28) return "left";
  if (xRatio > 0.72) return "right";
  return "stack";
}

function colZoneFromPointer(
  clientX: number,
  rect: DOMRect,
): "left" | "right" | "center" {
  const xRatio = (clientX - rect.left) / Math.max(rect.width, 1);
  if (xRatio < 0.35) return "left";
  if (xRatio > 0.65) return "right";
  return "center";
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function IconTip({
  content,
  side = "top",
  children,
}: {
  content: string;
  side?: "top" | "right" | "bottom" | "left";
  children: ReactElement;
}) {
  return (
    <ResponsiveTooltip content={content} side={side}>
      {children}
    </ResponsiveTooltip>
  );
}

function demoFromTemplate(tpl: DesignGuideDemoTemplate): DesignGuideDemoBlock {
  return {
    type: "demo",
    code: tpl.code,
    caption: tpl.caption ?? tpl.label,
    align: tpl.align ?? "center",
    verdict: tpl.verdict,
  };
}

function MarkerListPreview({ markers }: { markers: DesignDemoMarker[] }) {
  const hover = useMarkerHover();
  if (markers.length === 0) return null;

  return (
    <ol className="docs-design-guide__marker-list docs-dge-prose__marker-preview-list">
      {markers.map((marker, index) => {
        const n = index + 1;
        const active = hover?.activeId === marker.id;
        return (
          <li
            key={marker.id}
            className={`docs-design-guide__marker-item${active ? " is-active" : ""}`}
            onMouseEnter={() => hover?.setActiveId(marker.id)}
            onMouseLeave={() => hover?.setActiveId(null)}
          >
            <span className={`docs-design-marker${active ? " is-active" : ""}`} aria-hidden>
              {n}
            </span>
            <Typography level="text" as="span" className="docs-design-guide__marker-note">
              {marker.note.trim() || "（无说明）"}
            </Typography>
          </li>
        );
      })}
    </ol>
  );
}

function InlineProse({
  prose,
  onChange,
  linkedMarkers,
}: {
  prose: DesignGuideProseBlock;
  onChange: (next: DesignGuideProseBlock) => void;
  /** When this prose is a markers sync target, free text hides the machine fence. */
  linkedMarkers?: DesignDemoMarker[];
}) {
  const freeText = stripManagedMarkers(prose.text);
  const hasLinked = Boolean(linkedMarkers && linkedMarkers.length > 0);

  return (
    <div className="docs-dge-prose" onClick={(e) => e.stopPropagation()}>
      <DesignGuideWysiwyg
        value={freeText}
        placeholder="输入说明文案，支持 Markdown"
        onChange={(nextFree) => {
          const text =
            hasLinked && linkedMarkers
              ? syncMarkersIntoProse(nextFree, linkedMarkers)
              : nextFree;
          onChange({ ...prose, text });
        }}
      />
      {hasLinked && linkedMarkers ? (
        <div className="docs-dge-prose__marker-preview">
          <MarkerListPreview markers={linkedMarkers} />
        </div>
      ) : null}
    </div>
  );
}

type ProseTargetOption = DesignDemoMarkersProseTarget & { key: string; label: string };

function proseTargetKey(t: DesignDemoMarkersProseTarget): string {
  return typeof t.columnIndex === "number"
    ? `${t.blockIndex}:${t.columnIndex}`
    : `${t.blockIndex}`;
}

function listProseTargets(blocks: DesignGuideBlock[]): ProseTargetOption[] {
  const out: ProseTargetOption[] = [];
  blocks.forEach((block, blockIndex) => {
    if (block.type === "prose") {
      const t = { blockIndex };
      out.push({ ...t, key: proseTargetKey(t), label: `块 ${blockIndex + 1} · 文字` });
      return;
    }
    if (block.type === "row") {
      block.columns.forEach((col, columnIndex) => {
        if (col.type !== "prose") return;
        const t = { blockIndex, columnIndex };
        out.push({
          ...t,
          key: proseTargetKey(t),
          label: `块 ${blockIndex + 1} · 列 ${columnIndex + 1} · 文字`,
        });
      });
    }
  });
  return out;
}

function getProseAt(
  blocks: DesignGuideBlock[],
  target: DesignDemoMarkersProseTarget,
): DesignGuideProseBlock | null {
  const block = blocks[target.blockIndex];
  if (!block) return null;
  if (typeof target.columnIndex === "number") {
    if (block.type !== "row") return null;
    const col = block.columns[target.columnIndex];
    return col?.type === "prose" ? col : null;
  }
  return block.type === "prose" ? block : null;
}

function setProseAt(
  blocks: DesignGuideBlock[],
  target: DesignDemoMarkersProseTarget,
  prose: DesignGuideProseBlock,
): DesignGuideBlock[] {
  return blocks.map((block, blockIndex) => {
    if (blockIndex !== target.blockIndex) return block;
    if (typeof target.columnIndex === "number") {
      if (block.type !== "row") return block;
      return {
        ...block,
        columns: block.columns.map((col, i) =>
          i === target.columnIndex ? prose : col,
        ),
      };
    }
    return prose;
  });
}

function sameProseTarget(
  a?: DesignDemoMarkersProseTarget,
  b?: DesignDemoMarkersProseTarget,
): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return (
    a.blockIndex === b.blockIndex &&
    (a.columnIndex ?? undefined) === (b.columnIndex ?? undefined)
  );
}

/** Patch a demo and sync/strip managed fences on linked prose. */
function applyDemoWithMarkerSync(
  blocks: DesignGuideBlock[],
  blockIndex: number,
  columnIndex: number | undefined,
  nextDemo: DesignGuideDemoBlock,
): DesignGuideBlock[] {
  const prevBlock = blocks[blockIndex];
  let prevDemo: DesignGuideDemoBlock | null = null;
  if (prevBlock?.type === "demo" && columnIndex === undefined) {
    prevDemo = prevBlock;
  } else if (prevBlock?.type === "row" && typeof columnIndex === "number") {
    const col = prevBlock.columns[columnIndex];
    if (col?.type === "demo") prevDemo = col;
  }

  let next = blocks.map((block, i) => {
    if (i !== blockIndex) return block;
    if (typeof columnIndex === "number" && block.type === "row") {
      return {
        ...block,
        columns: block.columns.map((c, ci) => (ci === columnIndex ? nextDemo : c)),
      };
    }
    return nextDemo;
  });

  const prevTarget = prevDemo?.markersProse;
  const nextTarget = nextDemo.markersProse;
  const markers = nextDemo.markers ?? [];

  if (prevTarget && !sameProseTarget(prevTarget, nextTarget)) {
    const oldProse = getProseAt(next, prevTarget);
    if (oldProse) {
      next = setProseAt(next, prevTarget, {
        ...oldProse,
        text: stripManagedMarkers(oldProse.text),
      });
    }
  }

  if (nextTarget) {
    const prose = getProseAt(next, nextTarget);
    if (prose) {
      next = setProseAt(next, nextTarget, {
        ...prose,
        text:
          markers.length > 0
            ? syncMarkersIntoProse(prose.text, markers)
            : stripManagedMarkers(prose.text),
      });
    }
  }

  return next;
}

function findLinkedMarkers(
  blocks: DesignGuideBlock[],
  blockIndex: number,
  columnIndex?: number,
): DesignDemoMarker[] | undefined {
  for (const block of blocks) {
    if (block.type === "demo" && block.markersProse && block.markers) {
      if (sameProseTarget(block.markersProse, { blockIndex, columnIndex })) {
        return block.markers;
      }
    }
    if (block.type === "row") {
      for (const col of block.columns) {
        if (col.type === "demo" && col.markersProse && col.markers) {
          if (sameProseTarget(col.markersProse, { blockIndex, columnIndex })) {
            return col.markers;
          }
        }
      }
    }
  }
  return undefined;
}

function InlineCaption({
  value,
  onChange,
}: {
  value?: string;
  onChange: (next?: string) => void;
}) {
  const areaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.max(el.scrollHeight, 22)}px`;
  }, [value]);

  return (
    <div className="docs-dge-caption" onClick={(e) => e.stopPropagation()}>
      <Textarea
        ref={areaRef}
        className="docs-dge-caption__textarea"
        value={value ?? ""}
        placeholder="下方说明…"
        showController={false}
        aria-label="Demo 说明"
        onChange={(e) => onChange(e.target.value || undefined)}
      />
    </div>
  );
}

function isCodeModalOutsideExempt(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return Boolean(
    el?.closest(
      ".aviala-select-content, .aviala-popover-content, .docs-icon-picker-panel",
    ),
  );
}

function DemoCodeModal({
  open,
  onOpenChange,
  demo,
  component,
  scope,
  proseTargets,
  onApply,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  demo: DesignGuideDemoBlock;
  component: string;
  scope: Record<string, unknown>;
  proseTargets: ProseTargetOption[];
  onApply: (next: {
    code: string;
    markers?: DesignDemoMarker[];
    markersProse?: DesignGuideDemoBlock["markersProse"];
  }) => void;
}) {
  const { mode } = useTheme();
  const monacoTheme = spiralMonacoThemeId(mode);
  const liveApi = useMemo(() => getComponentLiveApi(component), [component]);
  const [draft, setDraft] = useState(demo.code);
  const [draftMarkers, setDraftMarkers] = useState<DesignDemoMarker[]>(
    () => demo.markers ?? [],
  );
  const [draftProseTarget, setDraftProseTarget] = useState(
    () => demo.markersProse,
  );
  const [annotateMode, setAnnotateMode] = useState(false);
  const [monacoReady, setMonacoReady] = useState(false);
  const [knobValues, setKnobValues] = useState<KnobValues>(() =>
    liveApi ? defaultKnobValues(liveApi.knobs) : {},
  );

  useEffect(() => {
    if (!open) return;
    setDraft(demo.code);
    setDraftMarkers(demo.markers ?? []);
    setDraftProseTarget(demo.markersProse);
    setAnnotateMode(false);
    setMonacoReady(false);
    if (liveApi) setKnobValues(defaultKnobValues(liveApi.knobs));
    const id = window.setTimeout(() => setMonacoReady(true), 0);
    return () => window.clearTimeout(id);
  }, [open, demo.code, demo.markers, demo.markersProse, liveApi]);

  const handleBeforeMount = (monaco: Monaco) => {
    applySpiralMonacoThemes(monaco);
  };

  const handleMount: OnMount = (_editor, monaco) => {
    applySpiralMonacoThemes(monaco);
  };

  const applyKnobs = (values: KnobValues) => {
    if (!liveApi) return;
    setKnobValues(values);
    setDraft(liveApi.buildCode(values));
  };

  const patchMarker = (id: string, patch: Partial<DesignDemoMarker>) => {
    setDraftMarkers((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const next: DesignDemoMarker = { ...m, ...patch };
        if (patch.line === false) delete next.line;
        return next;
      }),
    );
  };

  const targetKey = draftProseTarget
    ? proseTargetKey(draftProseTarget)
    : "none";

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent
        size="large"
        className={`docs-dge-code-modal has-markers${liveApi ? " has-knobs" : ""}`}
        onPointerDownOutside={(event) => {
          if (isCodeModalOutsideExempt(event.target)) event.preventDefault();
        }}
        onFocusOutside={(event) => {
          if (isCodeModalOutsideExempt(event.target)) event.preventDefault();
        }}
        onInteractOutside={(event) => {
          if (isCodeModalOutsideExempt(event.target)) event.preventDefault();
        }}
      >
        <ModalHeaderText
          title="编辑 Demo 代码与标注"
          description="左侧调参写入代码蓝本；右侧预览可标注 DOM。悬浮序号可调对齐、边距与连接线。「应用」写入 code 与 markers。"
        />
        <ModalBody className="docs-dge-code-modal__body">
          <MarkerHoverProvider>
            <div
              className={`docs-dge-code-modal__layout has-markers${liveApi ? " has-knobs" : ""}`}
            >
              {liveApi ? (
                <div className="docs-dge-code-modal__knobs">
                  <Typography level="caption" className="docs-dge-code-modal__preview-label">
                    API 调参
                  </Typography>
                  <div className="docs-dge-code-modal__knobs-body">
                    <DemoKnobs knobs={liveApi.knobs} values={knobValues} onChange={applyKnobs} />
                  </div>
                </div>
              ) : null}
              <div className="docs-dge-code-modal__editor">
                {monacoReady ? (
                  <Editor
                    className="docs-dge-code-modal__monaco"
                    height="100%"
                    language="javascript"
                    theme={monacoTheme}
                    value={draft}
                    onChange={(value) => setDraft(value ?? "")}
                    beforeMount={handleBeforeMount}
                    onMount={handleMount}
                    loading={
                      <div className="docs-monaco-loading" role="status">
                        <Loading level="text" mode="theme" label="加载编辑器" />
                      </div>
                    }
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      lineNumbers: "on",
                      scrollBeyondLastLine: false,
                      wordWrap: "on",
                      tabSize: 2,
                      automaticLayout: true,
                      padding: { top: 10, bottom: 10 },
                    }}
                  />
                ) : (
                  <div className="docs-monaco-loading" role="status">
                    <Loading level="text" mode="theme" label="加载编辑器" />
                  </div>
                )}
              </div>
              <div className="docs-dge-code-modal__preview">
                <div className="docs-dge-code-modal__preview-head">
                  <Typography level="caption" className="docs-dge-code-modal__preview-label">
                    预览 / 标注
                  </Typography>
                  <Button
                    mode={annotateMode ? "primary" : "defaultCustom"}
                    size="small"
                    onClick={() => setAnnotateMode((v) => !v)}
                  >
                    {annotateMode ? "标注中…" : "标注"}
                  </Button>
                </div>
                {annotateMode ? (
                  <Typography level="caption" className="docs-dge-markers-panel__hint">
                    点击预览中的元素添加序号；悬浮序号可调位置与连接线
                  </Typography>
                ) : null}
                <DesignDemoFrame
                  code={draft}
                  scope={scope}
                  align={demo.align}
                  verdict={demo.verdict}
                  height={demo.height ?? 280}
                  markers={draftMarkers}
                  annotateMode={annotateMode}
                  showMissingMarkers
                  editableMarkers
                  onPickElement={(selector) => {
                    if (draftMarkers.some((m) => m.selector === selector)) return;
                    setDraftMarkers((prev) => [
                      ...prev,
                      { id: createMarkerId(), selector, note: "", line: true },
                    ]);
                  }}
                  onMarkerChange={patchMarker}
                />
                <div className="docs-dge-markers-panel docs-dge-code-modal__markers">
                  <div className="docs-dge-markers-panel__head">
                    <Typography level="caption">序号列表</Typography>
                    <Select
                      value={targetKey}
                      onValueChange={(v) => {
                        if (v === "none") {
                          setDraftProseTarget(undefined);
                          return;
                        }
                        const opt = proseTargets.find((t) => t.key === v);
                        if (!opt) return;
                        setDraftProseTarget({
                          blockIndex: opt.blockIndex,
                          ...(typeof opt.columnIndex === "number"
                            ? { columnIndex: opt.columnIndex }
                            : {}),
                        });
                      }}
                    >
                      <SelectTrigger
                        className="docs-dge-markers-panel__target"
                        aria-label="同步到文字块"
                      >
                        <SelectValue placeholder="同步到文字…" />
                      </SelectTrigger>
                      <SelectContent className="docs-dge-select-content">
                        <SelectItem value="none">不同步</SelectItem>
                        {proseTargets.map((t) => (
                          <SelectItem key={t.key} value={t.key}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {draftMarkers.length === 0 ? (
                    <Typography level="caption" className="docs-dge-markers-panel__empty">
                      尚无标注
                    </Typography>
                  ) : (
                    <ul className="docs-dge-markers-panel__list">
                      {draftMarkers.map((marker, index) => (
                        <li key={marker.id} className="docs-dge-markers-panel__item">
                          <span className="docs-design-marker" aria-hidden>
                            {index + 1}
                          </span>
                          <Textarea
                            className="docs-dge-markers-panel__note"
                            value={marker.note}
                            placeholder="说明…"
                            showController={false}
                            aria-label={`标注 ${index + 1} 说明`}
                            onChange={(e) =>
                              patchMarker(marker.id, { note: e.target.value })
                            }
                          />
                          <div className="docs-dge-markers-panel__item-actions">
                            <Button
                              mode="noBackgroundCustom"
                              size="tiny"
                              iconOnly
                              allRound
                              disabled={index === 0}
                              aria-label="上移"
                              onClick={() => {
                                if (index === 0) return;
                                setDraftMarkers((prev) => {
                                  const next = [...prev];
                                  const tmp = next[index - 1]!;
                                  next[index - 1] = next[index]!;
                                  next[index] = tmp;
                                  return next;
                                });
                              }}
                            >
                              <DirectionArrowUp width={12} height={12} aria-hidden />
                            </Button>
                            <Button
                              mode="noBackgroundCustom"
                              size="tiny"
                              iconOnly
                              allRound
                              disabled={index === draftMarkers.length - 1}
                              aria-label="下移"
                              onClick={() => {
                                if (index >= draftMarkers.length - 1) return;
                                setDraftMarkers((prev) => {
                                  const next = [...prev];
                                  const tmp = next[index + 1]!;
                                  next[index + 1] = next[index]!;
                                  next[index] = tmp;
                                  return next;
                                });
                              }}
                            >
                              <DirectionArrowDown width={12} height={12} aria-hidden />
                            </Button>
                            <Button
                              mode="noBackgroundCustom"
                              size="tiny"
                              iconOnly
                              allRound
                              aria-label="删除标注"
                              onClick={() =>
                                setDraftMarkers((prev) =>
                                  prev.filter((m) => m.id !== marker.id),
                                )
                              }
                            >
                              <GeneralDelete width={12} height={12} aria-hidden />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </MarkerHoverProvider>
        </ModalBody>
        <ModalFooter className="docs-dge-code-modal__footer">
          <Button mode="defaultCustom" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            mode="primary"
            onClick={() => {
              onApply({
                code: draft,
                markers: draftMarkers.length > 0 ? draftMarkers : undefined,
                markersProse: draftProseTarget,
              });
              onOpenChange(false);
            }}
          >
            应用
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function DemoInspector({
  demo,
  component,
  scope,
  proseTargets,
  onChange,
}: {
  demo: DesignGuideDemoBlock;
  component: string;
  scope: Record<string, unknown>;
  proseTargets: ProseTargetOption[];
  onChange: (next: DesignGuideDemoBlock) => void;
}) {
  const [codeOpen, setCodeOpen] = useState(false);
  const markerCount = demo.markers?.length ?? 0;

  return (
    <div className="docs-dge-inspector" onClick={(e) => e.stopPropagation()}>
      <div className="docs-dge-inspector__row">
        <SegmentatorGroup
          className="docs-dge-inspector__seg"
          value={demo.verdict ?? "none"}
          onValueChange={(v) =>
            onChange({
              ...demo,
              verdict: v === "good" || v === "bad" ? (v as DesignDemoVerdict) : undefined,
            })
          }
          aria-label="推荐或避免"
        >
          <SegmentatorItem value="none">无</SegmentatorItem>
          <SegmentatorItem value="good">推荐</SegmentatorItem>
          <SegmentatorItem value="bad">避免</SegmentatorItem>
        </SegmentatorGroup>

        <SegmentatorGroup
          className="docs-dge-inspector__seg"
          value={demo.align ?? "center"}
          onValueChange={(v) => onChange({ ...demo, align: v as DesignDemoAlign })}
          aria-label="对齐"
        >
          <SegmentatorItem value="start">左</SegmentatorItem>
          <SegmentatorItem value="center">中</SegmentatorItem>
          <SegmentatorItem value="end">右</SegmentatorItem>
        </SegmentatorGroup>

        <Button
          mode="noBackgroundCustom"
          size="default"
          className="docs-dge-inspector__code-entry"
          leftIcon={<DevelopTerminal aria-hidden width={14} height={14} />}
          onClick={() => setCodeOpen(true)}
        >
          代码{markerCount > 0 ? ` · ${markerCount}` : ""}
        </Button>
      </div>

      <DemoCodeModal
        open={codeOpen}
        onOpenChange={setCodeOpen}
        demo={demo}
        component={component}
        scope={scope}
        proseTargets={proseTargets}
        onApply={({ code, markers, markersProse }) =>
          onChange({
            ...demo,
            code,
            markers,
            markersProse,
          })
        }
      />
    </div>
  );
}

const STAGE_HEIGHT_MIN = 80;
const STAGE_HEIGHT_MAX = 960;

function clampStageHeight(value: number): number {
  return Math.round(Math.min(STAGE_HEIGHT_MAX, Math.max(STAGE_HEIGHT_MIN, value)));
}

function parseStageHeightInput(raw: string): number | null {
  const trimmed = raw.trim().replace(/px$/i, "");
  if (!trimmed) return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return null;
  return clampStageHeight(n);
}

/**
 * Bottom-edge resize for demo stage.
 * Drag sets height; click turns the grip into an input — Enter commits a fixed height.
 */
function DemoStageHeightHandle({
  height,
  measureHeight,
  onPreview,
  onCommit,
}: {
  height?: number;
  measureHeight: () => number;
  onPreview: (next: number | null) => void;
  onCommit: (next: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startY: number;
    startHeight: number;
    moved: boolean;
  } | null>(null);

  useEffect(() => {
    if (!editing) return;
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    el.select();
  }, [editing]);

  const commit = (raw: string) => {
    const next = parseStageHeightInput(raw);
    if (next == null) {
      setEditing(false);
      setDraft("");
      return;
    }
    onPreview(null);
    onCommit(next);
    setEditing(false);
    setDraft("");
  };

  return (
    <div
      className={`docs-dge-height-handle${editing ? " is-editing" : ""}${dragging ? " is-dragging" : ""}`}
      onClick={(e) => e.stopPropagation()}
    >
      {editing ? (
        <input
          ref={inputRef}
          className="docs-dge-height-handle__input"
          type="text"
          inputMode="numeric"
          aria-label="舞台高度（像素）"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit(draft);
            } else if (e.key === "Escape") {
              e.preventDefault();
              setEditing(false);
              setDraft("");
            }
          }}
          onBlur={() => {
            commit(draft);
          }}
        />
      ) : (
        <button
          type="button"
          className="docs-dge-height-handle__grip"
          aria-label="拖拽调整高度，点按输入高度"
          title={
            height != null ? `高度 ${height}px · 拖拽或点按输入` : "拖拽调整高度，点按输入"
          }
          onPointerDown={(e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            const startHeight = height ?? measureHeight();
            dragRef.current = {
              pointerId: e.pointerId,
              startY: e.clientY,
              startHeight,
              moved: false,
            };
            (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            const drag = dragRef.current;
            if (!drag || drag.pointerId !== e.pointerId) return;
            const delta = e.clientY - drag.startY;
            if (!drag.moved && Math.abs(delta) < 3) return;
            drag.moved = true;
            setDragging(true);
            onPreview(clampStageHeight(drag.startHeight + delta));
          }}
          onPointerUp={(e) => {
            const drag = dragRef.current;
            if (!drag || drag.pointerId !== e.pointerId) return;
            dragRef.current = null;
            setDragging(false);
            try {
              (e.currentTarget as HTMLButtonElement).releasePointerCapture(e.pointerId);
            } catch {
              /* already released */
            }
            if (drag.moved) {
              const next = clampStageHeight(drag.startHeight + (e.clientY - drag.startY));
              onPreview(null);
              onCommit(next);
              return;
            }
            const current = height ?? measureHeight();
            setDraft(String(Math.round(current)));
            setEditing(true);
          }}
          onPointerCancel={() => {
            dragRef.current = null;
            setDragging(false);
            onPreview(null);
          }}
        >
          <span className="docs-dge-height-handle__bar" aria-hidden />
          {height != null ? (
            <span className="docs-dge-height-handle__value" aria-hidden>
              {height}
            </span>
          ) : null}
        </button>
      )}
    </div>
  );
}

function DemoBlockView({
  demo,
  component,
  onChange,
  scope,
  proseTargets,
}: {
  demo: DesignGuideDemoBlock;
  component: string;
  liveCode?: string;
  onChange: (next: DesignGuideDemoBlock) => void;
  scope: Record<string, unknown>;
  proseTargets: ProseTargetOption[];
}) {
  const stageWrapRef = useRef<HTMLDivElement>(null);
  const [previewHeight, setPreviewHeight] = useState<number | null>(null);
  const effectiveHeight = previewHeight ?? demo.height;

  return (
    <div className="docs-dge-demo">
      <div className="docs-dge-float-anchor">
        <DemoInspector
          demo={demo}
          component={component}
          scope={scope}
          proseTargets={proseTargets}
          onChange={onChange}
        />
      </div>
      <div className="docs-dge-demo__stage-wrap" ref={stageWrapRef}>
        <DesignDemoFrame
          code={demo.code}
          scope={scope}
          align={demo.align}
          verdict={demo.verdict}
          height={effectiveHeight}
          markers={demo.markers}
        />
        <DemoStageHeightHandle
          height={effectiveHeight}
          measureHeight={() => {
            const stage = stageWrapRef.current?.querySelector(
              ".docs-design-demo__stage",
            ) as HTMLElement | null;
            return Math.round(stage?.getBoundingClientRect().height ?? STAGE_HEIGHT_MIN);
          }}
          onPreview={setPreviewHeight}
          onCommit={(height) => {
            setPreviewHeight(null);
            onChange({ ...demo, height });
          }}
        />
      </div>
      <InlineCaption
        value={demo.caption}
        onChange={(caption) => onChange({ ...demo, caption })}
      />
    </div>
  );
}

function BlockMenu({
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
  dragSource,
  onDragStart,
  onDragEnd,
}: {
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  dragSource: DgeDragSource;
  onDragStart: (source: DgeDragSource) => void;
  onDragEnd: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`docs-dge-gutter${open ? " is-open" : ""}`}
      onClick={(e) => e.stopPropagation()}
    >
      <HoverPopover
        side="right"
        align="start"
        showArrow
        openDelay={40}
        closeDelay={160}
        open={open}
        onOpenChange={setOpen}
        contentClassName="docs-dge-gutter-pop"
        content={
          <div className="docs-dge-gutter__actions" role="menu" aria-label="块操作">
            <IconTip content="拖拽调整位置" side="right">
              <Button
                type="button"
                mode="noBackgroundCustom"
                size="tiny"
                iconOnly
                allRound
                className="docs-dge-drag-handle"
                draggable
                aria-label="拖拽调整位置或分栏"
                leftIcon={<GeneralGrabber aria-hidden width={14} height={14} />}
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = "move";
                  const raw = JSON.stringify(dragSource);
                  e.dataTransfer.setData(DGE_DRAG_MIME, raw);
                  e.dataTransfer.setData("text/plain", raw);
                  onDragStart(dragSource);
                  setOpen(false);
                }}
                onDragEnd={onDragEnd}
              />
            </IconTip>
            <IconTip content="上移" side="right">
              <Button
                type="button"
                mode="noBackgroundCustom"
                size="tiny"
                iconOnly
                allRound
                aria-label="上移"
                disabled={!canMoveUp}
                leftIcon={<DirectionArrowUp aria-hidden width={14} height={14} />}
                onClick={onMoveUp}
              />
            </IconTip>
            <IconTip content="下移" side="right">
              <Button
                type="button"
                mode="noBackgroundCustom"
                size="tiny"
                iconOnly
                allRound
                aria-label="下移"
                disabled={!canMoveDown}
                leftIcon={<DirectionArrowDown aria-hidden width={14} height={14} />}
                onClick={onMoveDown}
              />
            </IconTip>
            <IconTip content="删除" side="right">
              <Button
                type="button"
                mode="noBackgroundCustom"
                size="tiny"
                iconOnly
                allRound
                aria-label="删除"
                leftIcon={<GeneralDelete aria-hidden width={14} height={14} />}
                onClick={onDelete}
              />
            </IconTip>
          </div>
        }
      >
        <Button
          type="button"
          mode="outlineCustom"
          size="tiny"
          iconOnly
          allRound
          aria-label="块操作"
          aria-expanded={open}
          aria-haspopup="true"
          leftIcon={<GeneralMenu aria-hidden width={14} height={14} />}
        />
      </HoverPopover>
    </div>
  );
}

function InsertGap({
  open,
  onOpenChange,
  component,
  liveCode,
  onInsertProse,
  onInsertRow,
  onInsertDemo,
  dropActive,
  onDragOverGap,
  onDragLeaveGap,
  onDropGap,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  component: string;
  liveCode?: string;
  onInsertProse: () => void;
  onInsertRow: () => void;
  onInsertDemo: (tpl: DesignGuideDemoTemplate) => void;
  dropActive?: boolean;
  onDragOverGap?: (e: DragEvent) => void;
  onDragLeaveGap?: (e: DragEvent) => void;
  onDropGap?: (e: DragEvent) => void;
}) {
  const templates = useMemo(
    () => getDesignGuideTemplates(component, { liveCode }),
    [component, liveCode],
  );
  const [nonce, setNonce] = useState(0);

  return (
    <div
      className={`docs-dge-gap${open ? " is-open" : ""}${dropActive ? " is-drop-target" : ""}`}
      onDragOver={onDragOverGap}
      onDragLeave={onDragLeaveGap}
      onDrop={onDropGap}
    >
      <span className="docs-dge-gap__line" aria-hidden />
      <Select
        key={nonce}
        open={open}
        onOpenChange={onOpenChange}
        onValueChange={(value) => {
          if (value === "__prose") onInsertProse();
          else if (value === "__row") onInsertRow();
          else if (value.startsWith("demo:")) {
            const id = value.slice("demo:".length);
            const tpl = templates.find((t) => t.id === id);
            if (tpl) onInsertDemo(tpl);
          }
          setNonce((n) => n + 1);
          onOpenChange(false);
        }}
      >
        <SelectTrigger
          className="docs-dge-gap__select"
          aria-label="插入块"
          leftIcon={<SymbolAdd aria-hidden width={14} height={14} />}
          expandIcon={<span className="docs-dge-select-expand-hide" aria-hidden />}
        >
          <SelectValue placeholder="插入" />
        </SelectTrigger>
        <SelectContent className="docs-dge-insert-select">
          <SelectItemGroup label="插入" showDivider>
            <SelectItem value="__prose" itemFunction="radio">
              文案
            </SelectItem>
            <SelectItem value="__row" itemFunction="radio">
              并排对比行
            </SelectItem>
          </SelectItemGroup>
          <SelectItemGroup label="Demo">
            {templates.map((tpl) => (
              <SelectItem key={tpl.id} value={`demo:${tpl.id}`} itemFunction="radio">
                {tpl.label}
              </SelectItem>
            ))}
          </SelectItemGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export function DesignGuideEditor({
  component,
  repositoryGuide,
  liveCode,
  scope,
  fileLabel,
  externalSaveHint,
  onSave,
  onReloadFromDisk,
  onOpenDocs,
  onChangeFolder,
}: DesignGuideEditorProps) {
  const fsMode = Boolean(onSave);
  const [guide, setGuide] = useState<DesignGuideDoc>(() =>
    initialGuide(repositoryGuide),
  );
  const [selection, setSelection] = useState<Selection | null>(null);
  const [insertAfter, setInsertAfter] = useState<number | null>(null);
  const [copyHint, setCopyHint] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [dragging, setDragging] = useState<DgeDragSource | null>(null);
  const [dropHighlight, setDropHighlight] = useState<DgeDropTarget | null>(null);
  const draggingRef = useRef<DgeDragSource | null>(null);
  const [dirty, setDirty] = useState(false);

  const setGuideTracked = (next: DesignGuideDoc | ((prev: DesignGuideDoc) => DesignGuideDoc)) => {
    setGuide(next);
    setDirty(true);
  };

  const blocks = guide.blocks ?? [];
  const proseTargets = useMemo(() => listProseTargets(blocks), [blocks]);

  const setBlocks = (nextBlocks: DesignGuideBlock[]) => {
    setGuideTracked((prev) => ({ ...prev, blocks: nextBlocks }));
  };

  const setGuideStatus = (status: DesignGuideDoc["status"]) => {
    setGuideTracked((prev) => (prev.status === status ? prev : { ...prev, status }));
  };

  const updateBlock = (index: number, next: DesignGuideBlock) => {
    setBlocks(blocks.map((b, i) => (i === index ? next : b)));
  };

  const updateDemoAt = (
    blockIndex: number,
    columnIndex: number | undefined,
    next: DesignGuideDemoBlock,
  ) => {
    setBlocks(applyDemoWithMarkerSync(blocks, blockIndex, columnIndex, next));
  };

  const flashCopy = (ok: boolean, kind: string) => {
    setCopyHint(ok ? `已复制${kind}` : `复制${kind}失败`);
    window.setTimeout(() => setCopyHint(null), 2000);
  };

  const handleReset = () => {
    if (fsMode && onReloadFromDisk) {
      onReloadFromDisk();
      return;
    }
    setGuide(initialGuide(repositoryGuide));
    setDirty(false);
    setSelection(null);
    setInsertAfter(null);
  };

  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    setSaveError(null);
    try {
      await onSave(guide);
      setDirty(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  const statusHint = externalSaveHint || copyHint || saveError;

  const insertAt = (afterIndex: number, nextBlock: DesignGuideBlock) => {
    const at = afterIndex + 1;
    const next = [...blocks.slice(0, at), nextBlock, ...blocks.slice(at)];
    setBlocks(next);
    setSelection({ blockIndex: at });
    setInsertAfter(null);
  };

  const clearDragState = () => {
    draggingRef.current = null;
    setDragging(null);
    setDropHighlight(null);
  };

  const beginDrag = (source: DgeDragSource) => {
    draggingRef.current = source;
    setDragging(source);
  };

  const commitDrop = (source: DgeDragSource | null, target: DgeDropTarget) => {
    if (!source) {
      clearDragState();
      return;
    }
    const next = applyDragDrop(blocks, source, target);
    if (next) {
      setBlocks(next);
      if (target.type === "side" || target.type === "col-side") {
        const idx =
          target.type === "side"
            ? source.type === "block" && source.index < target.index
              ? target.index - 1
              : target.index
            : target.blockIndex;
        setSelection({ blockIndex: Math.max(0, Math.min(idx, next.length - 1)) });
      } else if (target.type === "gap") {
        const at =
          source.type === "block" && source.index <= target.afterIndex
            ? target.afterIndex
            : target.afterIndex + 1;
        setSelection({ blockIndex: Math.max(0, Math.min(at, next.length - 1)) });
      } else {
        setSelection({
          blockIndex: Math.max(0, Math.min(target.index, next.length - 1)),
        });
      }
    }
    clearDragState();
  };

  const setHighlightIfChanged = (next: DgeDropTarget | null) => {
    setDropHighlight((cur) => {
      if (!cur && !next) return cur;
      if (!cur || !next) return next;
      return JSON.stringify(cur) === JSON.stringify(next) ? cur : next;
    });
  };

  const isDraggingBlock = (index: number) =>
    dragging?.type === "block" && dragging.index === index;

  const isDraggingColumn = (blockIndex: number, columnIndex: number) =>
    dragging?.type === "column" &&
    dragging.blockIndex === blockIndex &&
    dragging.columnIndex === columnIndex;

  const renderColumnEditor = (
    column: DesignGuideColumn,
    blockIndex: number,
    columnIndex: number,
  ) => {
    const patchColumn = (next: DesignGuideColumn) => {
      if (next.type === "demo") {
        updateDemoAt(blockIndex, columnIndex, next);
        return;
      }
      const row = blocks[blockIndex] as DesignGuideRowBlock;
      updateBlock(blockIndex, {
        ...row,
        columns: row.columns.map((c, i) => (i === columnIndex ? next : c)),
      });
    };
    const row = blocks[blockIndex] as DesignGuideRowBlock;
    const colDragSource: DgeDragSource = {
      type: "column",
      blockIndex,
      columnIndex,
    };
    const colHighlight =
      dropHighlight?.type === "col-side" &&
      dropHighlight.blockIndex === blockIndex &&
      dropHighlight.columnIndex === columnIndex
        ? dropHighlight.side
        : null;

    return (
      <div
        key={columnIndex}
        className={[
          "docs-dge-col",
          isDraggingColumn(blockIndex, columnIndex) ? "is-dragging" : "",
          colHighlight === "left" ? "is-drop-left" : "",
          colHighlight === "right" ? "is-drop-right" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onDragOver={(e) => {
          if (!draggingRef.current) return;
          e.preventDefault();
          e.stopPropagation();
          e.dataTransfer.dropEffect = "move";
          const rect = e.currentTarget.getBoundingClientRect();
          const zone = colZoneFromPointer(e.clientX, rect);
          if (zone === "center") {
            setHighlightIfChanged({
              type: "side",
              index: blockIndex,
              side: e.clientX < rect.left + rect.width / 2 ? "left" : "right",
            });
          } else {
            setHighlightIfChanged({
              type: "col-side",
              blockIndex,
              columnIndex,
              side: zone,
            });
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const source = readDragSource(e.dataTransfer) ?? draggingRef.current;
          const rect = e.currentTarget.getBoundingClientRect();
          const zone = colZoneFromPointer(e.clientX, rect);
          const target: DgeDropTarget =
            zone === "center"
              ? {
                  type: "side",
                  index: blockIndex,
                  side: e.clientX < rect.left + rect.width / 2 ? "left" : "right",
                }
              : { type: "col-side", blockIndex, columnIndex, side: zone };
          commitDrop(source, target);
        }}
      >
        <div className="docs-dge-col__ops">
          <IconTip content="拖拽列" side="bottom">
            <Button
              type="button"
              mode="noBackgroundCustom"
              size="tiny"
              iconOnly
              allRound
              className="docs-dge-drag-handle"
              draggable
              aria-label="拖拽列"
              leftIcon={<GeneralGrabber aria-hidden width={12} height={12} />}
              onDragStart={(e) => {
                e.stopPropagation();
                e.dataTransfer.effectAllowed = "move";
                const raw = JSON.stringify(colDragSource);
                e.dataTransfer.setData(DGE_DRAG_MIME, raw);
                e.dataTransfer.setData("text/plain", raw);
                beginDrag(colDragSource);
              }}
              onDragEnd={clearDragState}
            />
          </IconTip>
          <IconTip content="左移" side="bottom">
            <Button
              type="button"
              mode="noBackgroundCustom"
              size="tiny"
              iconOnly
              allRound
              aria-label="左移列"
              disabled={columnIndex === 0}
              leftIcon={<DirectionArrowLeft aria-hidden width={12} height={12} />}
              onClick={(e) => {
                e.stopPropagation();
                updateBlock(blockIndex, {
                  ...row,
                  columns: moveItem(row.columns, columnIndex, columnIndex - 1),
                });
                setSelection({ blockIndex, columnIndex: columnIndex - 1 });
              }}
            />
          </IconTip>
          <IconTip content="右移" side="bottom">
            <Button
              type="button"
              mode="noBackgroundCustom"
              size="tiny"
              iconOnly
              allRound
              aria-label="右移列"
              disabled={columnIndex === row.columns.length - 1}
              leftIcon={<DirectionArrowRight aria-hidden width={12} height={12} />}
              onClick={(e) => {
                e.stopPropagation();
                updateBlock(blockIndex, {
                  ...row,
                  columns: moveItem(row.columns, columnIndex, columnIndex + 1),
                });
                setSelection({ blockIndex, columnIndex: columnIndex + 1 });
              }}
            />
          </IconTip>
          <IconTip content="删除列" side="bottom">
            <Button
              type="button"
              mode="noBackgroundCustom"
              size="tiny"
              iconOnly
              allRound
              aria-label="删除列"
              leftIcon={<GeneralDelete aria-hidden width={12} height={12} />}
              onClick={(e) => {
                e.stopPropagation();
                const columns = row.columns.filter((_, i) => i !== columnIndex);
                if (columns.length === 0) {
                  setBlocks(blocks.filter((_, i) => i !== blockIndex));
                  setSelection(null);
                } else if (columns.length === 1) {
                  updateBlock(blockIndex, columns[0]!);
                  setSelection({ blockIndex });
                } else {
                  updateBlock(blockIndex, { ...row, columns });
                  setSelection({ blockIndex });
                }
              }}
            />
          </IconTip>
        </div>
        {column.type === "prose" ? (
          <InlineProse
            prose={column}
            onChange={(next) => patchColumn(next)}
            linkedMarkers={findLinkedMarkers(blocks, blockIndex, columnIndex)}
          />
        ) : (
          <DemoBlockView
            demo={column}
            component={component}
            liveCode={liveCode}
            onChange={(next) => patchColumn(next)}
            scope={scope}
            proseTargets={proseTargets}
          />
        )}
      </div>
    );
  };

  const gapProps = (afterIndex: number) => ({
    open: insertAfter === afterIndex,
    onOpenChange: (open: boolean) => setInsertAfter(open ? afterIndex : null),
    component,
    liveCode,
    onInsertProse: () => insertAt(afterIndex, createDefaultProse()),
    onInsertRow: () => {
      const templates = getDesignGuideTemplates(component, { liveCode });
      const a = demoFromTemplate(templates[0]!);
      const b = demoFromTemplate(templates[1] ?? templates[0]!);
      if (templates[1]) {
        a.verdict = a.verdict ?? "good";
        b.verdict = b.verdict ?? "bad";
      }
      insertAt(afterIndex, { type: "row", columns: [a, b] });
    },
    onInsertDemo: (tpl: DesignGuideDemoTemplate) => insertAt(afterIndex, demoFromTemplate(tpl)),
    dropActive: dropHighlight?.type === "gap" && dropHighlight.afterIndex === afterIndex,
    onDragOverGap: (e: DragEvent) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setHighlightIfChanged({ type: "gap", afterIndex });
    },
    onDragLeaveGap: (e: DragEvent) => {
      const next = e.relatedTarget as Node | null;
      if (next && e.currentTarget.contains(next)) return;
      setDropHighlight((cur) =>
        cur?.type === "gap" && cur.afterIndex === afterIndex ? null : cur,
      );
    },
    onDropGap: (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const source = readDragSource(e.dataTransfer) ?? draggingRef.current;
      commitDrop(source, { type: "gap", afterIndex });
    },
  });

  return (
    <TooltipProvider>
    <MarkerHoverProvider>
    <div
      className="docs-design-guide-editor"
      onClick={() => {
        setSelection(null);
        setInsertAfter(null);
      }}
    >
      <div
        className="docs-design-guide-editor__toolbar"
        onClick={(e) => e.stopPropagation()}
        role="toolbar"
        aria-label="设计指南编辑操作"
      >
        <Typography level="caption" className="docs-design-guide-editor__badge">
          {fileLabel
            ? `${fileLabel}${dirty ? " · 未保存" : ""}`
            : `${component}${dirty ? " · 未保存" : ""}`}
          {guide.status === "draft" ? " · 草稿（文档站为空态）" : ""}
        </Typography>
        <div className="docs-design-guide-editor__toolbar-actions">
          <SegmentatorGroup
            value={guide.status}
            aria-label="设计指南发布状态"
            onValueChange={(v) => {
              if (v === "draft" || v === "published") setGuideStatus(v);
            }}
          >
            <SegmentatorItem value="draft">草稿</SegmentatorItem>
            <SegmentatorItem value="published">已发布</SegmentatorItem>
          </SegmentatorGroup>
          {onChangeFolder ? (
            <Button mode="noBackgroundCustom" size="small" onClick={onChangeFolder}>
              更换目录
            </Button>
          ) : null}
          <Button mode="noBackgroundCustom" size="small" onClick={handleReset}>
            {fsMode ? "从磁盘重载" : "重置"}
          </Button>
          <Button
            mode="defaultCustom"
            size="small"
            onClick={() =>
              void copyText(formatDesignGuideModule(guide)).then((ok) =>
                flashCopy(ok, " TypeScript"),
              )
            }
          >
            复制 TS
          </Button>
          {onOpenDocs ? (
            <Button mode="defaultCustom" size="small" onClick={onOpenDocs}>
              打开预览
            </Button>
          ) : null}
          {onSave ? (
            <Button
              mode="primary"
              size="small"
              disabled={saving}
              onClick={() => void handleSave()}
            >
              {saving ? "保存中…" : "保存到本地"}
            </Button>
          ) : null}
        </div>
        {statusHint ? (
          <Typography
            level="caption"
            className={`docs-design-guide-editor__hint${saveError ? " docs-dge-gate__error" : ""}`}
          >
            {statusHint}
          </Typography>
        ) : null}
      </div>

      <div
        className="docs-dge-page docs-design-guide"
        onClick={() => {
          setSelection(null);
          setInsertAfter(null);
        }}
      >
        <InsertGap {...gapProps(-1)} />

        {blocks.length === 0 ? (
          <Typography level="text" className="docs-dge-empty">
            点上方「插入」开始添加文案或 Demo
          </Typography>
        ) : null}

        {blocks.map((block, index) => {
          const sideHighlight =
            dropHighlight?.type === "side" && dropHighlight.index === index
              ? dropHighlight.side
              : null;
          const stackHighlight =
            dropHighlight?.type === "stack" && dropHighlight.index === index;

          return (
            <div key={index}>
              <div
                className={[
                  "docs-dge-block",
                  selection?.blockIndex === index ? "is-active" : "",
                  isDraggingBlock(index) ? "is-dragging" : "",
                  stackHighlight ? "is-drag-over" : "",
                  sideHighlight === "left" ? "is-drop-left" : "",
                  sideHighlight === "right" ? "is-drop-right" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelection({ blockIndex: index });
                  setInsertAfter(null);
                }}
                onDragOver={(e) => {
                  if (!draggingRef.current) return;
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  const rect = e.currentTarget.getBoundingClientRect();
                  const zone = zoneFromPointer(e.clientX, e.clientY, rect);
                  if (zone === "left" || zone === "right") {
                    setHighlightIfChanged({ type: "side", index, side: zone });
                  } else {
                    setHighlightIfChanged({ type: "stack", index });
                  }
                }}
                onDragLeave={(e) => {
                  const next = e.relatedTarget as Node | null;
                  if (next && e.currentTarget.contains(next)) return;
                  setDropHighlight((cur) => {
                    if (!cur) return cur;
                    if (
                      (cur.type === "stack" || cur.type === "side") &&
                      cur.index === index
                    ) {
                      return null;
                    }
                    return cur;
                  });
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const source = readDragSource(e.dataTransfer) ?? draggingRef.current;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const zone = zoneFromPointer(e.clientX, e.clientY, rect);
                  const target: DgeDropTarget =
                    zone === "left" || zone === "right"
                      ? { type: "side", index, side: zone }
                      : { type: "stack", index };
                  commitDrop(source, target);
                }}
              >
                <BlockMenu
                  dragSource={{ type: "block", index }}
                  canMoveUp={index > 0}
                  canMoveDown={index < blocks.length - 1}
                  onDragStart={beginDrag}
                  onDragEnd={clearDragState}
                  onMoveUp={() => {
                    setBlocks(moveItem(blocks, index, index - 1));
                    setSelection({ blockIndex: index - 1 });
                  }}
                  onMoveDown={() => {
                    setBlocks(moveItem(blocks, index, index + 1));
                    setSelection({ blockIndex: index + 1 });
                  }}
                  onDelete={() => {
                    setBlocks(blocks.filter((_, i) => i !== index));
                    setSelection(null);
                  }}
                />

                <div className="docs-dge-block__body">
                  {block.type === "prose" ? (
                    <InlineProse
                      prose={block}
                      onChange={(next) => updateBlock(index, next)}
                      linkedMarkers={findLinkedMarkers(blocks, index)}
                    />
                  ) : null}

                  {block.type === "demo" ? (
                    <DemoBlockView
                      demo={block}
                      component={component}
                      liveCode={liveCode}
                      onChange={(next) => updateDemoAt(index, undefined, next)}
                      scope={scope}
                      proseTargets={proseTargets}
                    />
                  ) : null}

                  {block.type === "row" ? (
                    <div className="docs-dge-row">
                      <div
                        className="docs-design-guide__row docs-dge-row__grid"
                        style={{
                          ["--docs-design-cols" as string]: String(
                            Math.max(block.columns.length, 1),
                          ),
                        }}
                      >
                        {block.columns.map((column, colIndex) =>
                          renderColumnEditor(column, index, colIndex),
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <InsertGap {...gapProps(index)} />
            </div>
          );
        })}
      </div>
    </div>
    </MarkerHoverProvider>
    </TooltipProvider>
  );
}
