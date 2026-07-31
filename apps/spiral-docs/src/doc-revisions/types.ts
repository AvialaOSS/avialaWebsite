import type { KnobDef, KnobValues } from "../components/DemoKnobs";

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
};

export type ComponentDocFallback = {
  title: string;
  description: string;
  prose: string;
  propsKey?: string;
  liveCode: string;
  knobs: KnobDef[];
  buildCode: (values: KnobValues) => string;
};
