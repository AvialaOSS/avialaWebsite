import { Typography } from "@aviala-design/spiral";
import type { ReactNode } from "react";
import { LiveDemo } from "./LiveDemo";
import type { KnobDef, KnobValues } from "./DemoKnobs";

type DemoBlockProps = {
  title?: string;
  /** Short prose under the title (before the playground). */
  description?: ReactNode;
  /** Static preview (legacy) */
  children?: ReactNode;
  /** Live Monaco playground */
  initialCode?: string;
  scope?: Record<string, unknown>;
  knobs?: KnobDef[];
  buildCode?: (values: KnobValues) => string;
};

export function DemoBlock({
  title = "代码演示",
  description,
  children,
  initialCode,
  scope,
  knobs,
  buildCode,
}: DemoBlockProps) {
  const isLive = Boolean(initialCode && scope);

  return (
    <section className="docs-demo">
      <Typography level="title" as="h2">
        {title}
      </Typography>
      {description ? (
        <Typography level="text" as="p" className="docs-demo__description">
          {description}
        </Typography>
      ) : null}
      {isLive ? (
        <LiveDemo
          initialCode={initialCode!}
          scope={scope!}
          knobs={knobs}
          buildCode={buildCode}
        />
      ) : (
        <div className="docs-demo-surface">{children}</div>
      )}
    </section>
  );
}
