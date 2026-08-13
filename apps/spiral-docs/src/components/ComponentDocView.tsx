import { Alert, Button, Typography } from "@aviala-design/spiral";
import type { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { DemoBlock } from "./DemoBlock";
import { DesignGuideEmpty } from "./DesignGuideEmpty";
import { DesignGuideView } from "./DesignGuideView";
import type { KnobDef, KnobValues } from "./DemoKnobs";
import { PropsTable } from "./PropsTable";
import { DocPageHeader } from "./TableOfContents";
import {
  getActiveDocsVersion,
  getComponentDesignGuide,
  getComponentDocRevision,
} from "../doc-revisions";
import {
  designGuideHasContent,
  type ComponentDocFallback,
} from "../doc-revisions/types";
import { spiralHasTab, Tab, TabItem } from "../lib/spiral-optional";
import { getComponentProps } from "../props-registry";
import { getDefaultDocsVersion } from "../versions-registry";

const canEditDesignGuide = import.meta.env.DEV;

function designGuideEditorOrigin(): string {
  return (
    import.meta.env.VITE_DESIGN_GUIDE_EDITOR_ORIGIN?.replace(/\/$/, "") ||
    "http://localhost:5176"
  );
}

function openDesignGuideEditor(component: string) {
  const url = `${designGuideEditorOrigin()}/?component=${encodeURIComponent(component)}`;
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (!win) {
    window.alert(
      `无法打开编辑器窗口。请先运行 npm run dev:design-guide-editor，再访问：\n${url}`,
    );
  }
}

type ComponentDocViewProps = {
  component: string;
  scope: Record<string, unknown>;
  fallback: ComponentDocFallback;
  /** Extra demo blocks after the primary one (e.g. DatePicker variants). */
  children?: ReactNode;
};

type DocGuide = "dev" | "design";

function resolveGuide(raw: string | null): DocGuide {
  return raw === "design" ? "design" : "dev";
}

export function ComponentDocView({
  component,
  scope,
  fallback,
  children,
}: ComponentDocViewProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const guide = resolveGuide(searchParams.get("guide"));

  const readingVersion = getActiveDocsVersion();
  const revision = getComponentDocRevision(component, readingVersion);
  const title = revision?.title ?? fallback.title;
  const description = revision?.description ?? fallback.description;
  const prose = revision?.prose ?? fallback.prose;
  const propsKey = revision?.propsKey ?? fallback.propsKey ?? component;
  const liveCode = revision?.liveCode ?? fallback.liveCode;
  const knobs: KnobDef[] = revision?.knobs ?? fallback.knobs;
  const buildCode: (values: KnobValues) => string =
    revision?.buildCode ?? fallback.buildCode;
  const designGuide =
    getComponentDesignGuide(component, readingVersion) ?? fallback.designGuide;
  const showDesignBody = designGuideHasContent(designGuide);

  const doc = getComponentProps(propsKey);
  const latestReading = getDefaultDocsVersion();
  const isInherited =
    Boolean(revision) && revision!.revision !== readingVersion;
  // Inherited content while browsing an older covered version — hide on latest.
  const showInheritedHint =
    isInherited && readingVersion !== latestReading;

  const setGuide = (next: DocGuide) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (next === "design") {
          params.set("guide", "design");
        } else {
          params.delete("guide");
          params.delete("edit");
        }
        return params;
      },
      { replace: true },
    );
  };

  return (
    <>
      <DocPageHeader title={title} description={description} showVersionControls />
      {showInheritedHint ? (
        <Alert
          className="docs-revision-inherit"
          type="neutral"
          appearance="light"
          title="该组件在该版本无变更"
          description={
            <>
              正在阅读来自 <code>{revision!.revision}</code> 版本的文档。
            </>
          }
          dismissible={false}
        />
      ) : null}
      <div className="docs-prose">
        <Typography level="text" as="p">
          {prose}
        </Typography>
      </div>

      <div className="docs-guide-switch">
        {spiralHasTab && Tab && TabItem ? (
          <Tab
            className="docs-guide-switch__tab"
            style="default"
            value={guide}
            onValueChange={(v: string) => setGuide(resolveGuide(String(v)))}
            aria-label="文档指南"
          >
            <TabItem value="dev">开发指南</TabItem>
            <TabItem value="design">设计与使用指南</TabItem>
          </Tab>
        ) : (
          <div className="docs-guide-switch__fallback" role="tablist" aria-label="文档指南">
            <button
              type="button"
              role="tab"
              aria-selected={guide === "dev"}
              className={
                guide === "dev"
                  ? "docs-guide-switch__fallback-item is-active"
                  : "docs-guide-switch__fallback-item"
              }
              onClick={() => setGuide("dev")}
            >
              开发指南
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={guide === "design"}
              className={
                guide === "design"
                  ? "docs-guide-switch__fallback-item is-active"
                  : "docs-guide-switch__fallback-item"
              }
              onClick={() => setGuide("design")}
            >
              设计与使用指南
            </button>
          </div>
        )}
        {canEditDesignGuide && guide === "design" ? (
          <Button
            className="docs-guide-switch__edit"
            mode="noBackgroundCustom"
            size="small"
            onClick={() => openDesignGuideEditor(component)}
          >
            编辑布局
          </Button>
        ) : null}
      </div>

      {guide === "dev" ? (
        <>
          <DemoBlock
            initialCode={liveCode}
            scope={scope}
            knobs={knobs}
            buildCode={buildCode}
          />
          {children}
          {doc?.props.length ? (
            <PropsTable title="API" id="api" props={doc.props} />
          ) : null}
          {doc?.parts?.map((part) =>
            part.props.length > 0 ? (
              <PropsTable
                key={part.displayName}
                title={`${part.displayName} API`}
                id={`api-${part.displayName}`}
                props={part.props}
              />
            ) : null,
          )}
        </>
      ) : showDesignBody && designGuide ? (
        <DesignGuideView guide={designGuide} scope={scope} />
      ) : (
        <DesignGuideEmpty />
      )}
    </>
  );
}
