import { Typography } from "@aviala-design/spiral";
import type { ReactNode } from "react";
import { DemoBlock } from "./DemoBlock";
import type { KnobDef, KnobValues } from "./DemoKnobs";
import { PropsTable } from "./PropsTable";
import { DocPageHeader } from "./TableOfContents";
import { getComponentDocRevision } from "../doc-revisions";
import type { ComponentDocFallback } from "../doc-revisions/types";
import { getComponentProps } from "../props-registry";

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
  const revision = getComponentDocRevision(component);
  const title = revision?.title ?? fallback.title;
  const description = revision?.description ?? fallback.description;
  const prose = revision?.prose ?? fallback.prose;
  const propsKey = revision?.propsKey ?? fallback.propsKey ?? component;
  const liveCode = revision?.liveCode ?? fallback.liveCode;
  const knobs: KnobDef[] = revision?.knobs ?? fallback.knobs;
  const buildCode: (values: KnobValues) => string =
    revision?.buildCode ?? fallback.buildCode;

  const doc = getComponentProps(propsKey);

  return (
    <>
      <DocPageHeader title={title} description={description} />
      {revision ? (
        <p className="docs-revision-meta">
          <Typography level="caption" as="span">
            文档修订 <code>{revision.revision}</code>
          </Typography>
        </p>
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
      {doc ? <PropsTable props={doc.props} /> : null}
    </>
  );
}
