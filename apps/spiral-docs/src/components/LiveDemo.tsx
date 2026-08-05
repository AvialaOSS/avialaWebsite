import {
  EditAdjust,
  GeneralTranslate,
  SymbolEyeSlash,
  SymbolInformationCircle,
} from "@aviala-design/icons";
import Editor, { type Monaco, type OnMount } from "@monaco-editor/react";
import {
  Button,
  ConfigProvider,
  enUS,
  FormField,
  Loading,
  LocaleProvider,
  SegmentatorGroup,
  SegmentatorItem,
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Typography,
  useTheme,
  zhCN,
  type Direction,
} from "@aviala-design/spiral";
import {
  Component,
  startTransition,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { applySpiralMonacoThemes, spiralMonacoThemeId } from "../lib/monaco-spiral-theme";
import { evaluateLiveCode } from "../lib/live-eval";
import { buildDemoIconScope, isIconCatalogLoaded, loadIconCatalog } from "../demos/demo-icons";
import {
  DemoKnobs,
  defaultKnobValues,
  type KnobDef,
  type KnobValues,
} from "./DemoKnobs";

type MonacoStandaloneEditor = Parameters<OnMount>[0];

/** Live demo stage tools: preview / API knobs / locale + direction smoke test. */
type DemoToolsMode = "preview" | "knobs" | "locale";
type DemoLocaleCode = "zh-CN" | "en-US";

const DEMO_LOCALES = {
  "zh-CN": zhCN,
  "en-US": enUS,
} as const;

function DemoLocalePanel({
  localeCode,
  direction,
  onLocaleChange,
  onDirectionChange,
}: {
  localeCode: DemoLocaleCode;
  direction: Direction;
  onLocaleChange: (next: DemoLocaleCode) => void;
  onDirectionChange: (next: Direction) => void;
}) {
  const localeFieldId = useId();
  const directionFieldId = useId();

  return (
    <div className="docs-demo-knobs-fields">
      <FormField label="locale" htmlFor={localeFieldId}>
        <Select
          value={localeCode}
          onValueChange={(next) => {
            if (next === "zh-CN" || next === "en-US") onLocaleChange(next);
          }}
        >
          <SelectTrigger id={localeFieldId} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItemGroup>
              <SelectItem value="zh-CN" itemFunction="radio">
                zh-CN
              </SelectItem>
              <SelectItem value="en-US" itemFunction="radio">
                en-US
              </SelectItem>
            </SelectItemGroup>
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="direction" htmlFor={directionFieldId}>
        <Select
          value={direction}
          onValueChange={(next) => {
            if (next === "ltr" || next === "rtl") onDirectionChange(next);
          }}
        >
          <SelectTrigger id={directionFieldId} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItemGroup>
              <SelectItem value="ltr" itemFunction="radio">
                ltr
              </SelectItem>
              <SelectItem value="rtl" itemFunction="radio">
                rtl
              </SelectItem>
            </SelectItemGroup>
          </SelectContent>
        </Select>
      </FormField>
      <Typography level="caption" as="p" className="docs-live-locale-hint">
        <code>LocaleProvider</code> 切换内置文案；<code>ConfigProvider</code> 的{" "}
        <code>direction</code> 控制 LTR/RTL 布局镜像。
      </Typography>
    </div>
  );
}

function collectIconKnobNames(knobs: KnobDef[], values: KnobValues): string[] {
  const names: string[] = [];
  for (const knob of knobs) {
    if (knob.kind === "icon") {
      const name = String(values[knob.name] ?? knob.defaultValue);
      if (name) names.push(name);
      continue;
    }
    if (knob.kind !== "items") continue;
    const items = Array.isArray(values[knob.name])
      ? (values[knob.name] as Array<Record<string, string | boolean>>)
      : knob.defaultValue;
    for (const field of knob.fields) {
      if (field.kind !== "icon") continue;
      for (const item of items) {
        const name = String(item[field.name] ?? field.defaultValue);
        if (name) names.push(name);
      }
    }
  }
  return names;
}

function hasIconKnobs(knobs: KnobDef[]): boolean {
  return knobs.some(
    (knob) =>
      knob.kind === "icon" ||
      (knob.kind === "items" && knob.fields.some((field) => field.kind === "icon"))
  );
}

/** Stable fallback — inline `[]` defaults recreate every render and retrigger sync effects. */
const EMPTY_KNOBS: KnobDef[] = [];

function normalizeLiveCode(code: string) {
  return code.replace(/\r\n/g, "\n");
}

type LiveDemoProps = {
  initialCode: string;
  scope: Record<string, unknown>;
  knobs?: KnobDef[];
  buildCode?: (values: KnobValues) => string;
};

class LivePreviewErrorBoundary extends Component<
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

export function LiveDemo({ initialCode, scope, knobs = EMPTY_KNOBS, buildCode }: LiveDemoProps) {
  const { mode } = useTheme();
  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<MonacoStandaloneEditor | null>(null);
  const gateRef = useRef<HTMLButtonElement>(null);
  const isEditingRef = useRef(false);
  /** Last code pushed by knobs / reset / initial — Monaco onChange echoes must not desync. */
  const lastPushedCodeRef = useRef(initialCode);
  const monacoTheme = spiralMonacoThemeId(mode);
  const hasKnobs = knobs.length > 0;
  const knobsCanSync = Boolean(buildCode && hasKnobs);
  const usesIconKnobs = hasIconKnobs(knobs);
  const knobDefaults = useMemo(() => defaultKnobValues(knobs), [knobs]);
  const [knobValues, setKnobValues] = useState<KnobValues>(knobDefaults);
  const [catalogReady, setCatalogReady] = useState(isIconCatalogLoaded());
  const [toolsMode, setToolsMode] = useState<DemoToolsMode>("preview");
  const [localeCode, setLocaleCode] = useState<DemoLocaleCode>("zh-CN");
  const [demoDirection, setDemoDirection] = useState<Direction>("ltr");
  const sidePanelOpen = toolsMode === "knobs" || toolsMode === "locale";
  const demoLocale = DEMO_LOCALES[localeCode];
  const [code, setCode] = useState(initialCode);
  const [editorCode, setEditorCode] = useState(initialCode);
  const [knobsSynced, setKnobsSynced] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  /** Defer Monaco until after first paint — init is a major route-change cost. */
  const [monacoReady, setMonacoReady] = useState(false);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    lastPushedCodeRef.current = initialCode;
    setCode(initialCode);
    setEditorCode(initialCode);
    setKnobValues(defaultKnobValues(knobs));
    setKnobsSynced(true);
    setToolsMode("preview");
    setLocaleCode("zh-CN");
    setDemoDirection("ltr");
    setIsEditing(false);
    isEditingRef.current = false;
  }, [initialCode, knobs, buildCode]);

  useEffect(() => {
    if (monacoReady) return;

    let cancelled = false;
    const enable = () => {
      if (cancelled) return;
      startTransition(() => setMonacoReady(true));
    };

    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(enable, { timeout: 400 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }

    const timeoutId = window.setTimeout(enable, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [initialCode, monacoReady]);

  useEffect(() => {
    if (!usesIconKnobs || catalogReady) return;
    void loadIconCatalog().then(() => setCatalogReady(true));
  }, [usesIconKnobs, catalogReady]);

  const mergedScope = useMemo(() => {
    // Always include common icons — many demos hardcode <GeneralSetting /> without icon knobs.
    const iconScope = buildDemoIconScope(
      usesIconKnobs ? collectIconKnobNames(knobs, knobValues) : [],
    );
    return { ...iconScope, ...scope };
  }, [scope, knobs, knobValues, usesIconKnobs, catalogReady]);

  const applyKnobs = useCallback(
    (values: KnobValues) => {
      setKnobValues(values);
      if (buildCode) {
        const next = buildCode(values);
        lastPushedCodeRef.current = next;
        setCode(next);
        setEditorCode(next);
        setKnobsSynced(true);
      }
    },
    [buildCode]
  );

  const handleEditorChange = (value: string | undefined) => {
    const next = value ?? "";
    setEditorCode(next);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setCode(next);
    }, 180);

    // Monaco fires onChange on mount and when the controlled `value` is updated from
    // knobs — especially visible with multiple LiveDemos. Only mark desynced for real edits.
    if (normalizeLiveCode(next) === normalizeLiveCode(lastPushedCodeRef.current)) {
      setKnobsSynced(true);
      return;
    }
    // Only meaningful when knobs drive the editor; bare demos have nothing to desync.
    if (knobsCanSync) setKnobsSynced(false);
  };

  useEffect(
    () => () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    },
    []
  );

  const { element, error } = useMemo(() => evaluateLiveCode(code, mergedScope), [code, mergedScope]);

  const reset = () => {
    lastPushedCodeRef.current = initialCode;
    setKnobValues(knobDefaults);
    setCode(initialCode);
    setEditorCode(initialCode);
    setKnobsSynced(true);
  };

  const setEditorTabbable = useCallback((tabbable: boolean) => {
    const root = editorRef.current?.getDomNode();
    if (!root) return;
    root.querySelectorAll<HTMLElement>("textarea, [tabindex]").forEach((node) => {
      node.tabIndex = tabbable ? 0 : -1;
    });
  }, []);

  const enterEdit = useCallback(() => {
    if (!monacoReady) setMonacoReady(true);
    isEditingRef.current = true;
    setIsEditing(true);
    if (!monacoReady) return;
    requestAnimationFrame(() => {
      setEditorTabbable(true);
      editorRef.current?.focus();
    });
  }, [monacoReady, setEditorTabbable]);

  useEffect(() => {
    if (!monacoReady || !isEditing) return;
    requestAnimationFrame(() => {
      setEditorTabbable(true);
      editorRef.current?.focus();
    });
  }, [monacoReady, isEditing, setEditorTabbable]);

  const exitEdit = useCallback(() => {
    isEditingRef.current = false;
    setIsEditing(false);
    setEditorTabbable(false);
    requestAnimationFrame(() => {
      gateRef.current?.focus();
    });
  }, [setEditorTabbable]);

  const handleMonacoBeforeMount = useCallback((monaco: Monaco) => {
    monacoRef.current = monaco;
    applySpiralMonacoThemes(monaco);
  }, []);

  const handleMonacoMount = useCallback<OnMount>(
    (editor, monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;
      setEditorTabbable(false);

      // Monaco may steal focus before the gate is ready — bounce back while gated.
      editor.onDidFocusEditorText(() => {
        if (isEditingRef.current) return;
        setEditorTabbable(false);
        editor.getDomNode()?.blur();
        gateRef.current?.focus();
      });

      editor.onKeyDown((event) => {
        if (event.keyCode !== monaco.KeyCode.Escape) return;
        const root = editor.getDomNode();
        const widgetOpen = Boolean(
          root?.querySelector(".suggest-widget.visible") ||
            root?.querySelector(".monaco-hover") ||
            root?.querySelector(".find-widget") ||
            document.querySelector(".context-view.monaco-menu-container")
        );
        if (widgetOpen) return;
        event.preventDefault();
        event.stopPropagation();
        exitEdit();
      });

      editor.onDidBlurEditorWidget(() => {
        window.setTimeout(() => {
          if (!isEditingRef.current) return;
          const active = document.activeElement;
          const root = editor.getDomNode();
          if (root && active && root.contains(active)) return;
          isEditingRef.current = false;
          setIsEditing(false);
          setEditorTabbable(false);
        }, 0);
      });
    },
    [exitEdit, setEditorTabbable]
  );

  const handleGateKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      enterEdit();
    }
  };

  useLayoutEffect(() => {
    if (!monacoRef.current) return;
    applySpiralMonacoThemes(monacoRef.current);
  }, [mode]);

  return (
    <TooltipProvider>
      <div className="docs-live-demo">
        <div
          className={`docs-live-stage${hasKnobs ? " has-knobs" : ""}${hasKnobs && sidePanelOpen ? " has-panel-open" : ""}`}
        >
          <div className="docs-live-preview docs-demo-surface">
            <LivePreviewErrorBoundary resetKey={`${code}:${demoLocale.code}:${demoDirection}`}>
              {/* Remount preview when live code / locale / direction changes */}
              <ConfigProvider direction={demoDirection} syncDocumentDir={false}>
                <LocaleProvider locale={demoLocale}>
                  <div
                    key={`${code}:${demoLocale.code}:${demoDirection}`}
                    className="docs-live-preview-host"
                  >
                    {element}
                  </div>
                </LocaleProvider>
              </ConfigProvider>
            </LivePreviewErrorBoundary>

            {(localeCode !== "zh-CN" || demoDirection !== "ltr") && toolsMode !== "locale" ? (
              <Typography level="caption" as="p" className="docs-live-locale-badge" aria-live="polite">
                {demoLocale.code}
                {demoDirection === "rtl" ? " · rtl" : ""}
              </Typography>
            ) : null}

            {hasKnobs ? (
              <div className="docs-live-stage-tools">
                <SegmentatorGroup
                  direction="vertical"
                  mode="nested"
                  value={toolsMode}
                  onValueChange={(next) => {
                    if (next === "preview" || next === "knobs" || next === "locale") {
                      setToolsMode(next);
                    }
                  }}
                  aria-label="演示工具"
                >
                  <SegmentatorItem
                    value="preview"
                    iconOnly
                    leftIcon={<SymbolEyeSlash aria-hidden />}
                    aria-label="仅预览"
                  />
                  <SegmentatorItem
                    value="knobs"
                    iconOnly
                    leftIcon={<EditAdjust aria-hidden />}
                    aria-label="API 调参"
                  />
                  <SegmentatorItem
                    value="locale"
                    iconOnly
                    leftIcon={<GeneralTranslate aria-hidden />}
                    aria-label="本地化调试"
                  />
                </SegmentatorGroup>
              </div>
            ) : null}
          </div>

          {hasKnobs ? (
            <div
              className="docs-live-knobs-rail"
              aria-hidden={!sidePanelOpen}
              inert={!sidePanelOpen ? true : undefined}
            >
              <div className="docs-live-knobs-rail-inner">
                <aside
                  className="docs-live-knobs-panel"
                  aria-label={toolsMode === "locale" ? "本地化调试" : "API 调参"}
                >
                  <div className="docs-live-knobs-header">
                    <Typography level="subtitle" as="p" className="docs-live-knobs-title">
                      {toolsMode === "locale" ? "本地化调试" : "API 调参"}
                    </Typography>
                  </div>
                  <div className="docs-live-knobs-body">
                    {toolsMode === "locale" ? (
                      <DemoLocalePanel
                        localeCode={localeCode}
                        direction={demoDirection}
                        onLocaleChange={setLocaleCode}
                        onDirectionChange={setDemoDirection}
                      />
                    ) : (
                      <DemoKnobs knobs={knobs} values={knobValues} onChange={applyKnobs} />
                    )}
                  </div>
                </aside>
              </div>
            </div>
          ) : null}
        </div>

        {(error || (knobsCanSync && !knobsSynced)) && (
          <div className="docs-live-meta">
            {error ? (
              <Typography level="caption" className="docs-live-error">
                {error}
              </Typography>
            ) : null}
            {knobsCanSync && !knobsSynced ? (
              <Typography level="caption" className="docs-live-hint">
                已手动编辑代码，API 调参与编辑器内容可能不同步。
              </Typography>
            ) : null}
          </div>
        )}

        <div className="docs-live-editor-wrap">
          <div className="docs-live-editor-toolbar">
            <div className="docs-live-editor-label">
              <Typography level="caption">代码</Typography>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="docs-live-info-trigger"
                    aria-label="代码编辑说明"
                  >
                    <SymbolInformationCircle width={16} height={16} aria-hidden />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="docs-live-info-tooltip">
                  在 Monaco 编辑器中编写 JSX，通过 render(...) 输出预览。需要 state 时可定义组件后
                  render(&lt;Demo /&gt;)。
                </TooltipContent>
              </Tooltip>
            </div>
            <Button mode="default" size="small" onClick={reset}>
              重置
            </Button>
          </div>
          <div className="docs-monaco-shell">
            <div
              className="docs-monaco-editor-host"
              // Keep Monaco out of Tab order until Enter / click activates editing.
              {...(!isEditing ? { inert: true } : {})}
            >
              {monacoReady ? (
                <Editor
                  className="docs-monaco-editor"
                  height="220px"
                  language="javascript"
                  theme={monacoTheme}
                  value={editorCode}
                  onChange={handleEditorChange}
                  beforeMount={handleMonacoBeforeMount}
                  onMount={handleMonacoMount}
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
                    padding: { top: 8, bottom: 8 },
                    tabFocusMode: true,
                  }}
                />
              ) : (
                <div className="docs-monaco-loading" role="status">
                  <Loading level="text" mode="theme" label="加载编辑器" />
                </div>
              )}
            </div>
            {!isEditing ? (
              <button
                ref={gateRef}
                type="button"
                className="docs-monaco-focus-gate"
                aria-label="代码编辑器，按下 Enter 开始编辑"
                onKeyDown={handleGateKeyDown}
                onClick={enterEdit}
              >
                <span className="docs-monaco-focus-gate__hint">
                  <SymbolInformationCircle mode="fill" width={18} height={18} aria-hidden />
                  按下 Enter 编辑
                </span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

