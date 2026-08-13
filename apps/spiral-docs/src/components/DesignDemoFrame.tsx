import { SymbolRightCircle, SymbolWrongCircle } from "@aviala-design/icons";
import { Button, Input, Switch, Typography } from "@aviala-design/spiral";
import {
  Component,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { buildDemoIconScope } from "../demos/demo-icons";
import type {
  DesignDemoAlign,
  DesignDemoMarker,
  DesignDemoMarkerAnchor,
  DesignDemoVerdict,
} from "../doc-revisions/types";
import {
  buildRelativeSelector,
  DEFAULT_MARKER_ANCHOR,
  DEFAULT_MARKER_MARGIN,
  MARKER_BADGE_SIZE,
  placeMarkerOnTarget,
  queryMarkerTarget,
  resolveAnnotateTarget,
} from "../lib/design-guide-markers";
import { evaluateLiveCode } from "../lib/live-eval";
import { useMarkerHover } from "./MarkerHoverContext";

type DesignDemoFrameProps = {
  code: string;
  scope: Record<string, unknown>;
  caption?: string;
  align?: DesignDemoAlign;
  verdict?: DesignDemoVerdict;
  height?: number;
  markers?: DesignDemoMarker[];
  annotateMode?: boolean;
  onPickElement?: (selector: string) => void;
  showMissingMarkers?: boolean;
  /** Editor: hover badge to tweak anchor / margin / line. */
  editableMarkers?: boolean;
  onMarkerChange?: (id: string, patch: Partial<DesignDemoMarker>) => void;
};

type MarkerLayout = {
  id: string;
  n: number;
  left: number;
  top: number;
  lineFromX: number;
  lineFromY: number;
  lineToX: number;
  lineToY: number;
  missing: boolean;
  line: boolean;
  marker: DesignDemoMarker;
};

const ANCHOR_OPTIONS: DesignDemoMarkerAnchor[] = [
  "top-start",
  "top-center",
  "top-end",
  "center-start",
  "center",
  "center-end",
  "bottom-start",
  "bottom-center",
  "bottom-end",
];

const ANCHOR_LABELS: Record<DesignDemoMarkerAnchor, string> = {
  "top-start": "左上",
  "top-center": "上",
  "top-end": "右上",
  "center-start": "左",
  center: "中",
  "center-end": "右",
  "bottom-start": "左下",
  "bottom-center": "下",
  "bottom-end": "右下",
};

class DesignPreviewErrorBoundary extends Component<
  { children: ReactNode; resetKey: string },
  { error: string | null }
> {
  state = { error: null as string | null };

  static getDerivedStateFromError(error: Error) {
    return { error: error.message };
  }

  componentDidUpdate(prevProps: { resetKey: string }) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <Typography level="caption" className="docs-live-error">
          渲染错误：{this.state.error}
        </Typography>
      );
    }
    return this.props.children;
  }
}

function VerdictIcon({ verdict }: { verdict: DesignDemoVerdict }) {
  const Icon = verdict === "good" ? SymbolRightCircle : SymbolWrongCircle;
  return (
    <span
      className={`docs-design-demo__verdict docs-design-demo__verdict--${verdict}`}
      aria-hidden
    >
      <Icon width={20} height={20} mode="fill" />
    </span>
  );
}

function MarkerEditPop({
  marker,
  onChange,
  onSubmenuHoldChange,
}: {
  marker: DesignDemoMarker;
  onChange: (patch: Partial<DesignDemoMarker>) => void;
  /** Keep the parent float open while the position flyout is hovered. */
  onSubmenuHoldChange?: (hold: boolean) => void;
}) {
  const anchor = marker.anchor ?? DEFAULT_MARKER_ANCHOR;
  const margin = marker.margin ?? DEFAULT_MARKER_MARGIN;
  const offsetX = marker.offsetX ?? 0;
  const offsetY = marker.offsetY ?? 0;
  const [posOpen, setPosOpen] = useState(false);
  const posHideTimer = useRef<number | null>(null);

  const clearPosHide = () => {
    if (posHideTimer.current != null) {
      window.clearTimeout(posHideTimer.current);
      posHideTimer.current = null;
    }
  };

  const openPos = () => {
    clearPosHide();
    setPosOpen(true);
    onSubmenuHoldChange?.(true);
  };

  const scheduleClosePos = () => {
    clearPosHide();
    posHideTimer.current = window.setTimeout(() => {
      setPosOpen(false);
      onSubmenuHoldChange?.(false);
    }, 160);
  };

  useEffect(() => {
    return () => {
      clearPosHide();
      onSubmenuHoldChange?.(false);
    };
  }, [onSubmenuHoldChange]);

  return (
    <div
      className="docs-dge-marker-pop"
      onMouseEnter={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="docs-dge-marker-pop__row">
        <div
          className={`docs-dge-marker-pop__pos${posOpen ? " is-open" : ""}`}
          onMouseEnter={openPos}
          onMouseLeave={scheduleClosePos}
        >
          <Button
            mode={posOpen ? "primary" : "noBackgroundCustom"}
            size="small"
            className="docs-dge-marker-pop__pos-btn"
            aria-expanded={posOpen}
            aria-haspopup="true"
          >
            位置 · {ANCHOR_LABELS[anchor]}
          </Button>
          {posOpen ? (
            <div className="docs-dge-marker-pop__pos-flyout" role="dialog" aria-label="对齐位置">
              <Typography level="caption" className="docs-dge-marker-pop__flyout-label">
                对齐到目标
              </Typography>
              <div className="docs-dge-marker-pop__pad" role="group" aria-label="对齐位置">
                {ANCHOR_OPTIONS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`docs-dge-marker-pop__cell${anchor === value ? " is-active" : ""}`}
                    aria-label={ANCHOR_LABELS[value]}
                    aria-pressed={anchor === value}
                    onClick={() => onChange({ anchor: value })}
                  >
                    <span className="docs-dge-marker-pop__dot" aria-hidden />
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <label className="docs-dge-marker-pop__compact">
          <span>边距</span>
          <Input
            className="docs-dge-marker-pop__input"
            type="number"
            size="regular"
            value={String(margin)}
            min={0}
            max={80}
            onChange={(e) => onChange({ margin: Number(e.target.value) || 0 })}
            aria-label="边距"
          />
        </label>
        <label className="docs-dge-marker-pop__compact">
          <span>X</span>
          <Input
            className="docs-dge-marker-pop__input"
            type="number"
            size="regular"
            value={String(offsetX)}
            onChange={(e) => onChange({ offsetX: Number(e.target.value) || 0 })}
            aria-label="水平偏移"
          />
        </label>
        <label className="docs-dge-marker-pop__compact">
          <span>Y</span>
          <Input
            className="docs-dge-marker-pop__input"
            type="number"
            size="regular"
            value={String(offsetY)}
            onChange={(e) => onChange({ offsetY: Number(e.target.value) || 0 })}
            aria-label="垂直偏移"
          />
        </label>

        <div className="docs-dge-marker-pop__line">
          <Typography level="caption">连接线</Typography>
          <Switch
            size="small"
            checked={Boolean(marker.line)}
            onCheckedChange={(checked) => onChange({ line: checked })}
            aria-label="显示连接线"
          />
        </div>
      </div>
    </div>
  );
}

function DesignMarkerBadge({
  n,
  active,
  missing,
  onHover,
  onFocusEdit,
}: {
  n: number;
  active: boolean;
  missing?: boolean;
  onHover: (on: boolean) => void;
  onFocusEdit?: () => void;
}) {
  return (
    <span
      className={`docs-design-marker${active ? " is-active" : ""}${missing ? " is-missing" : ""}`}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={(e) => {
        if (!onFocusEdit) return;
        e.stopPropagation();
        onFocusEdit();
      }}
      role={onFocusEdit ? "button" : undefined}
      tabIndex={onFocusEdit ? 0 : undefined}
      aria-hidden={!onFocusEdit}
    >
      {missing ? "?" : n}
    </span>
  );
}

/** Preview-only live surface for design guides — no knobs, no Monaco. */
export function DesignDemoFrame({
  code,
  scope,
  caption,
  align = "center",
  verdict,
  height,
  markers,
  annotateMode = false,
  onPickElement,
  showMissingMarkers = false,
  editableMarkers = false,
  onMarkerChange,
}: DesignDemoFrameProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const hover = useMarkerHover();
  const [editingId, setEditingId] = useState<string | null>(null);
  const hideTimer = useRef<number | null>(null);
  const submenuHoldRef = useRef(false);

  const mergedScope = useMemo(
    () => ({
      ...buildDemoIconScope([]),
      useState,
      ...scope,
    }),
    [scope],
  );
  const { element, error } = useMemo(
    () => evaluateLiveCode(code, mergedScope),
    [code, mergedScope],
  );
  const fixedHeight =
    typeof height === "number" && Number.isFinite(height) && height > 0
      ? Math.round(height)
      : undefined;

  const [layouts, setLayouts] = useState<MarkerLayout[]>([]);

  const measureMarkers = useCallback(() => {
    const stage = stageRef.current;
    const preview = previewRef.current;
    const list = markers ?? [];
    if (!stage || !preview || list.length === 0) {
      setLayouts([]);
      return;
    }
    const stageRect = stage.getBoundingClientRect();
    const next: MarkerLayout[] = [];
    list.forEach((marker, index) => {
      const target = queryMarkerTarget(preview, marker.selector);
      if (!target) {
        if (showMissingMarkers) {
          next.push({
            id: marker.id,
            n: index + 1,
            left: 8,
            top: 8 + index * 24,
            lineFromX: 18,
            lineFromY: 18 + index * 24,
            lineToX: 40,
            lineToY: 18 + index * 24,
            missing: true,
            line: false,
            marker,
          });
        }
        return;
      }
      const rect = target.getBoundingClientRect();
      const box = {
        left: rect.left - stageRect.left + stage.scrollLeft,
        top: rect.top - stageRect.top + stage.scrollTop,
        width: rect.width,
        height: rect.height,
      };
      const placed = placeMarkerOnTarget(box, marker, MARKER_BADGE_SIZE);
      next.push({
        id: marker.id,
        n: index + 1,
        left: placed.left,
        top: placed.top,
        lineFromX: placed.lineFromX,
        lineFromY: placed.lineFromY,
        lineToX: placed.lineToX,
        lineToY: placed.lineToY,
        missing: false,
        line: Boolean(marker.line),
        marker,
      });
    });
    setLayouts(next);
  }, [markers, showMissingMarkers]);

  useLayoutEffect(() => {
    measureMarkers();
  }, [measureMarkers, element, code, fixedHeight]);

  useEffect(() => {
    const stage = stageRef.current;
    const preview = previewRef.current;
    if (!stage || !preview) return;
    const ro = new ResizeObserver(() => measureMarkers());
    ro.observe(stage);
    ro.observe(preview);
    window.addEventListener("scroll", measureMarkers, true);
    const id = window.setTimeout(measureMarkers, 50);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", measureMarkers, true);
      window.clearTimeout(id);
    };
  }, [measureMarkers]);

  useEffect(() => {
    if (!annotateMode || !onPickElement) return;
    const preview = previewRef.current;
    if (!preview) return;

    const onClick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const target = resolveAnnotateTarget(preview, event.target);
      if (!target) return;
      const selector = buildRelativeSelector(preview, target);
      if (!selector) return;
      onPickElement(selector);
    };

    preview.addEventListener("click", onClick, true);
    return () => preview.removeEventListener("click", onClick, true);
  }, [annotateMode, onPickElement, element]);

  const openEdit = useCallback(
    (id: string) => {
      if (hideTimer.current != null) {
        window.clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }
      setEditingId(id);
      hover?.setActiveId(id);
    },
    [hover],
  );

  const scheduleCloseEdit = useCallback(() => {
    if (submenuHoldRef.current) return;
    if (hideTimer.current != null) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (submenuHoldRef.current) return;
      setEditingId(null);
      hover?.setActiveId(null);
    }, 220);
  }, [hover]);

  const setSubmenuHold = useCallback(
    (hold: boolean) => {
      const wasHolding = submenuHoldRef.current;
      submenuHoldRef.current = hold;
      if (wasHolding && !hold) {
        scheduleCloseEdit();
      }
    },
    [scheduleCloseEdit],
  );

  const editingLayout = layouts.find((l) => l.id === editingId);
  const [portalPos, setPortalPos] = useState<{ top: number; left: number } | null>(
    null,
  );

  useLayoutEffect(() => {
    if (!editingId || !editableMarkers) {
      setPortalPos(null);
      return;
    }

    const update = () => {
      const el = stageRef.current?.querySelector(
        `[data-marker-id="${CSS.escape(editingId)}"]`,
      ) as HTMLElement | null;
      if (!el) {
        setPortalPos(null);
        return;
      }
      const rect = el.getBoundingClientRect();
      setPortalPos({ top: rect.top, left: rect.left });
    };

    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    const ro = stageRef.current ? new ResizeObserver(update) : null;
    if (stageRef.current && ro) ro.observe(stageRef.current);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      ro?.disconnect();
    };
  }, [editingId, editableMarkers, layouts, editingLayout?.left, editingLayout?.top]);

  const markerPop =
    editableMarkers && editingLayout && onMarkerChange && portalPos
      ? createPortal(
          <div
            className="docs-dge-marker-pop-anchor is-portal"
            style={{ top: portalPos.top, left: portalPos.left }}
            onMouseEnter={() => openEdit(editingLayout.id)}
            onMouseLeave={scheduleCloseEdit}
          >
            <MarkerEditPop
              marker={editingLayout.marker}
              onChange={(patch) => onMarkerChange(editingLayout.id, patch)}
              onSubmenuHoldChange={setSubmenuHold}
            />
          </div>,
          document.body,
        )
      : null;

  return (
    <figure className="docs-design-demo">
      <div
        ref={stageRef}
        className={`docs-design-demo__stage docs-demo-surface docs-design-demo__stage--align-${align}${
          verdict ? " has-verdict" : ""
        }${fixedHeight != null ? " is-fixed-height" : ""}${
          annotateMode ? " is-annotate" : ""
        }`}
        style={fixedHeight != null ? { height: fixedHeight, minHeight: fixedHeight } : undefined}
      >
        <div ref={previewRef} className="docs-design-demo__preview">
          <DesignPreviewErrorBoundary resetKey={code}>
            {error ? (
              <Typography level="caption" className="docs-live-error">
                {error}
              </Typography>
            ) : (
              element
            )}
          </DesignPreviewErrorBoundary>
        </div>

        {layouts.some((l) => l.line && !l.missing) ? (
          <svg className="docs-design-demo__marker-lines" aria-hidden>
            {layouts
              .filter((l) => l.line && !l.missing)
              .map((l) => (
                <line
                  key={`line-${l.id}`}
                  className={`docs-design-demo__marker-line${
                    hover?.activeId === l.id ? " is-active" : ""
                  }`}
                  x1={l.lineFromX}
                  y1={l.lineFromY}
                  x2={l.lineToX}
                  y2={l.lineToY}
                />
              ))}
          </svg>
        ) : null}

        {layouts.length > 0 ? (
          <div className="docs-design-demo__markers" aria-hidden={!editableMarkers}>
            {layouts.map((layout) => (
              <span
                key={layout.id}
                data-marker-id={layout.id}
                className="docs-design-demo__marker-anchor"
                style={{ top: layout.top, left: layout.left }}
                onMouseEnter={() => {
                  if (editableMarkers) openEdit(layout.id);
                  else hover?.setActiveId(layout.id);
                }}
                onMouseLeave={() => {
                  if (editableMarkers) scheduleCloseEdit();
                  else hover?.setActiveId(null);
                }}
              >
                <DesignMarkerBadge
                  n={layout.n}
                  missing={layout.missing}
                  active={hover?.activeId === layout.id || editingId === layout.id}
                  onHover={(on) => {
                    if (!editableMarkers) hover?.setActiveId(on ? layout.id : null);
                  }}
                  onFocusEdit={
                    editableMarkers
                      ? () => openEdit(layout.id)
                      : undefined
                  }
                />
              </span>
            ))}
          </div>
        ) : null}

        {verdict ? <VerdictIcon verdict={verdict} /> : null}
      </div>
      {caption ? (
        <Typography level="caption" as="p" className="docs-design-demo__caption">
          {caption}
        </Typography>
      ) : null}
      {markerPop}
    </figure>
  );
}
