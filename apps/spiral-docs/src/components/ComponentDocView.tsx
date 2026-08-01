import { Alert, Typography } from "@aviala-design/spiral";
import type { ReactNode } from "react";
import { DemoBlock } from "./DemoBlock";
import type { KnobDef, KnobValues } from "./DemoKnobs";
import { PropsTable } from "./PropsTable";
import { DocPageHeader } from "./TableOfContents";
import { getActiveDocsVersion, getComponentDocRevision } from "../doc-revisions";
import type { ComponentDocFallback } from "../doc-revisions/types";
import { getComponentProps } from "../props-registry";
import { getDefaultDocsVersion } from "../versions-registry";

type ComponentDocViewProps = {
  component: string;
  scope: Record<string, unknown>;
  fallback: ComponentDocFallback;
  /** Extra demo blocks after the primary one (e.g. DatePicker variants). */
  children?: ReactNode;
};

export function ComponentDocView({
  component,
  scope,
  fallback,
  children,
}: ComponentDocViewProps) {
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

  const doc = getComponentProps(propsKey);
  const latestReading = getDefaultDocsVersion();
  const isInherited =
    Boolean(revision) && revision!.revision !== readingVersion;
  // Inherited content while browsing an older covered version — hide on latest.
  const showInheritedHint =
    isInherited && readingVersion !== latestReading;

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
      <DemoBlock
        initialCode={liveCode}
        scope={scope}
        knobs={knobs}
        buildCode={buildCode}
      />
      {children}
      {doc?.props.length ? <PropsTable title="API" id="api" props={doc.props} /> : null}
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
  );
}
