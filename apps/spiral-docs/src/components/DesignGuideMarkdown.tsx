import { Link, Typography } from "@aviala-design/spiral";
import type { ComponentPropsWithoutRef } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

type TypographyHtmlProps = Omit<
  ComponentPropsWithoutRef<"h1">,
  "content" | "as" | "tone" | "asChild"
>;

type MdTypographyProps = TypographyHtmlProps & { node?: unknown };

const markdownComponents: Components = {
  h1: ({ children, node: _node, ...props }: MdTypographyProps) => (
    <Typography level="headline1" as="h1" {...props}>
      {children}
    </Typography>
  ),
  h2: ({ children, node: _node, ...props }: MdTypographyProps) => (
    <Typography level="title" as="h2" {...props}>
      {children}
    </Typography>
  ),
  h3: ({ children, node: _node, ...props }: MdTypographyProps) => (
    <Typography level="subtitle" as="h3" {...props}>
      {children}
    </Typography>
  ),
  h4: ({ children, node: _node, ...props }: MdTypographyProps) => (
    <Typography level="subtitle" as="h4" {...props}>
      {children}
    </Typography>
  ),
  p: ({ children, node: _node, ...props }: MdTypographyProps) => (
    <Typography level="text" as="p" {...props}>
      {children}
    </Typography>
  ),
  a: ({ href = "", children, node: _node, ...props }) => {
    const external = /^https?:\/\//.test(href);
    return (
      <Link
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...props}
      >
        {children}
      </Link>
    );
  },
};

/** GFM markdown for design-guide prose (public + editor live preview). */
export function DesignGuideMarkdown({ text }: { text: string }) {
  const source = text.trim();
  if (!source) return null;
  return (
    <div className="docs-prose docs-design-guide__md">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {source}
      </ReactMarkdown>
    </div>
  );
}
