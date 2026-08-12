import type { KnobDef, KnobValues } from "../components/DemoKnobs";

/** Placement of preview content inside the design demo stage. */
export type DesignDemoAlign = "start" | "center" | "end";

/** Do / don't badge inside the stage (bottom inset). */
export type DesignDemoVerdict = "good" | "bad";

export type DesignGuideProseBlock = {
  type: "prose";
  text: string;
};

/** DOM-anchored callout on a design demo stage (order → display number). */
export type DesignDemoMarkerAnchor =
  | "top-start"
  | "top-center"
  | "top-end"
  | "center-start"
  | "center"
  | "center-end"
  | "bottom-start"
  | "bottom-center"
  | "bottom-end";

export type DesignDemoMarker = {
  id: string;
  /** CSS selector relative to `.docs-design-demo__preview`. */
  selector: string;
  note: string;
  /** Badge placement on the target box. Default `top-start`. */
  anchor?: DesignDemoMarkerAnchor;
  /** Extra px after anchor + margin. */
  offsetX?: number;
  offsetY?: number;
  /** Gap between target edge and badge (px). Default 4. */
  margin?: number;
  /** Draw a leader line from badge to the target. */
  line?: boolean;
};

/** Points at a prose block/column that owns the managed marker list fence. */
export type DesignDemoMarkersProseTarget = {
  blockIndex: number;
  columnIndex?: number;
};

export type DesignGuideDemoBlock = {
  type: "demo";
  /** Live eval source — same `render(...)` contract as LiveDemo. */
  code: string;
  caption?: string;
  align?: DesignDemoAlign;
  verdict?: DesignDemoVerdict;
  /** Fixed stage height in CSS pixels. Omit for content-driven height. */
  height?: number;
  /** Numbered callouts anchored to live preview DOM nodes. */
  markers?: DesignDemoMarker[];
  /** Prose that receives the managed `<<<design-markers` list. */
  markersProse?: DesignDemoMarkersProseTarget;
};

export type DesignGuideColumn = DesignGuideProseBlock | DesignGuideDemoBlock;

export type DesignGuideRowBlock = {
  type: "row";
  columns: DesignGuideColumn[];
};

export type DesignGuideBlock = DesignGuideProseBlock | DesignGuideRowBlock | DesignGuideDemoBlock;

/**
 * Design & usage guide for a component — **versionless**.
 * Lives in `doc-revisions/{Component}/design-guide.ts`, not in semver revision files.
 * Missing file, `draft`, or published without `blocks` / `prose` → empty state.
 * Independent of manifest version `ready` / `draft`.
 */
export type DesignGuideDoc = {
  status: "draft" | "published";
  /**
   * Legacy single paragraph. Used when `blocks` is absent.
   * Shown only when `status === "published"`.
   */
  prose?: string;
  /** Structured layout; preferred over `prose` when present and non-empty. */
  blocks?: DesignGuideBlock[];
};

/** Hand-written docs content for one component at one content-revision id. */
export type ComponentDocRevision = {
  /** Content revision id — usually a Spiral semver, e.g. `2.1.0`. */
  revision: string;
  title: string;
  description: string;
  prose: string;
  /** Props table lookup key; defaults to the component folder name. */
  propsKey?: string;
  /** Optional demo overrides; omit to keep page-level / shared demos. */
  liveCode?: string;
  knobs?: KnobDef[];
  buildCode?: (values: KnobValues) => string;
  /** @deprecated Prefer `doc-revisions/{Component}/design-guide.ts`. Still read as fallback. */
  designGuide?: DesignGuideDoc;
};

export type ComponentDocFallback = {
  title: string;
  description: string;
  prose: string;
  propsKey?: string;
  liveCode: string;
  knobs: KnobDef[];
  buildCode: (values: KnobValues) => string;
  designGuide?: DesignGuideDoc;
};

/** True when the design tab should render authored content (not empty). */
export function designGuideHasContent(guide: DesignGuideDoc | undefined): boolean {
  if (!guide || guide.status !== "published") return false;
  if (guide.blocks && guide.blocks.length > 0) return true;
  return Boolean(guide.prose?.trim());
}
