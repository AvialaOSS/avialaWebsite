import { Typography } from "@aviala-design/spiral";
import type {
  DesignDemoMarker,
  DesignGuideBlock,
  DesignGuideColumn,
  DesignGuideDoc,
} from "../doc-revisions/types";
import { splitProseWithMarkers } from "../lib/design-guide-markers";
import { DesignDemoFrame } from "./DesignDemoFrame";
import { DesignGuideMarkdown } from "./DesignGuideMarkdown";
import { MarkerHoverProvider, useMarkerHover } from "./MarkerHoverContext";

type DesignGuideViewProps = {
  guide: DesignGuideDoc;
  scope: Record<string, unknown>;
};

function ProseParagraphs({ text }: { text: string }) {
  return <DesignGuideMarkdown text={text} />;
}

/** Public / shared prose renderer — expands managed marker fence into hoverable list. */
export function DesignGuideProse({
  text,
  markerIds,
}: {
  text: string;
  /** Optional ids aligned with demo markers (same order as fence notes). */
  markerIds?: string[];
}) {
  const hover = useMarkerHover();
  const { before, markers, after } = splitProseWithMarkers(text);

  return (
    <div className="docs-prose docs-design-guide__prose">
      {before ? <ProseParagraphs text={before} /> : null}
      {markers && markers.length > 0 ? (
        <ol className="docs-design-guide__marker-list">
          {markers.map((item) => {
            const id = markerIds?.[item.n - 1];
            const active = Boolean(id && hover?.activeId === id);
            return (
              <li
                key={`${item.n}-${item.note}`}
                className={`docs-design-guide__marker-item${active ? " is-active" : ""}`}
                onMouseEnter={() => id && hover?.setActiveId(id)}
                onMouseLeave={() => hover?.setActiveId(null)}
              >
                <span className={`docs-design-marker${active ? " is-active" : ""}`} aria-hidden>
                  {item.n}
                </span>
                <Typography level="text" as="span" className="docs-design-guide__marker-note">
                  {item.note || "（无说明）"}
                </Typography>
              </li>
            );
          })}
        </ol>
      ) : null}
      {after ? <ProseParagraphs text={after} /> : null}
    </div>
  );
}

function findDemoMarkersForProse(
  blocks: DesignGuideBlock[],
  blockIndex: number,
  columnIndex?: number,
): DesignDemoMarker[] | undefined {
  for (const block of blocks) {
    if (block.type === "demo" && block.markersProse) {
      const t = block.markersProse;
      if (
        t.blockIndex === blockIndex &&
        (t.columnIndex ?? undefined) === (columnIndex ?? undefined)
      ) {
        return block.markers;
      }
    }
    if (block.type === "row") {
      for (const col of block.columns) {
        if (col.type === "demo" && col.markersProse) {
          const t = col.markersProse;
          if (
            t.blockIndex === blockIndex &&
            (t.columnIndex ?? undefined) === (columnIndex ?? undefined)
          ) {
            return col.markers;
          }
        }
      }
    }
  }
  return undefined;
}

function renderColumn(
  column: DesignGuideColumn,
  scope: Record<string, unknown>,
  key: string,
  blockIndex: number,
  columnIndex: number,
  blocks: DesignGuideBlock[],
) {
  if (column.type === "prose") {
    const linked = findDemoMarkersForProse(blocks, blockIndex, columnIndex);
    return (
      <div key={key} className="docs-design-guide__col">
        <DesignGuideProse
          text={column.text}
          markerIds={linked?.map((m) => m.id)}
        />
      </div>
    );
  }

  return (
    <div key={key} className="docs-design-guide__col">
      <DesignDemoFrame
        code={column.code}
        scope={scope}
        caption={column.caption}
        align={column.align}
        verdict={column.verdict}
        height={column.height}
        markers={column.markers}
      />
    </div>
  );
}

function renderBlock(
  block: DesignGuideBlock,
  scope: Record<string, unknown>,
  index: number,
  blocks: DesignGuideBlock[],
) {
  if (block.type === "prose") {
    const linked = findDemoMarkersForProse(blocks, index);
    return (
      <DesignGuideProse
        key={`prose-${index}`}
        text={block.text}
        markerIds={linked?.map((m) => m.id)}
      />
    );
  }

  if (block.type === "demo") {
    return (
      <div key={`demo-${index}`} className="docs-design-guide__solo">
        <DesignDemoFrame
          code={block.code}
          scope={scope}
          caption={block.caption}
          align={block.align}
          verdict={block.verdict}
          height={block.height}
          markers={block.markers}
        />
      </div>
    );
  }

  return (
    <div
      key={`row-${index}`}
      className="docs-design-guide__row"
      style={{ ["--docs-design-cols" as string]: String(Math.max(block.columns.length, 1)) }}
    >
      {block.columns.map((column, colIndex) =>
        renderColumn(column, scope, `row-${index}-col-${colIndex}`, index, colIndex, blocks),
      )}
    </div>
  );
}

export function DesignGuideView({ guide, scope }: DesignGuideViewProps) {
  const blocks = guide.blocks;

  if (blocks && blocks.length > 0) {
    return (
      <MarkerHoverProvider>
        <div className="docs-design-guide">
          {blocks.map((block, index) => renderBlock(block, scope, index, blocks))}
        </div>
      </MarkerHoverProvider>
    );
  }

  const prose = guide.prose?.trim();
  if (!prose) return null;

  return (
    <div className="docs-prose docs-design-guide">
      <DesignGuideProse text={prose} />
    </div>
  );
}
