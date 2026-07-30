import { Typography } from "@aviala-design/spiral";
import type { ComponentPropsWithoutRef } from "react";
import { Link as RouterLink } from "react-router-dom";

/** HTML attributes forwarded to Typography for headings/paragraphs.
 *  `content` (an RDFa global HTML attribute typed `string`) collides with
 *  Typography's `content: "text" | "number"`, so it is omitted from the
 *  spread. `as`/`tone`/`asChild` are Typography-specific and also omitted. */
type TypographyHtmlProps = Omit<
  ComponentPropsWithoutRef<"h1">,
  "content" | "as" | "tone" | "asChild"
>;

function MdxLink({ href = "", children, ...props }: ComponentPropsWithoutRef<"a">) {
  if (href.startsWith("/docs/spiral/")) {
    const to = href.replace(/^\/docs\/spiral\/?/, "");
    return <RouterLink to={to}>{children}</RouterLink>;
  }
  return (
    <Typography level="text" asChild>
      <a href={href} className="text-[var(--primary)]" {...props}>
        {children}
      </a>
    </Typography>
  );
}

function MdxH1({ children, ...props }: TypographyHtmlProps) {
  return <Typography level="headline1" as="h1" {...props}>{children}</Typography>;
}

function MdxH2({ children, ...props }: TypographyHtmlProps) {
  return <Typography level="title" as="h2" {...props}>{children}</Typography>;
}

function MdxH3({ children, ...props }: TypographyHtmlProps) {
  return <Typography level="subtitle" as="h3" {...props}>{children}</Typography>;
}

function MdxP({ children, ...props }: TypographyHtmlProps) {
  return <Typography level="text" as="p" {...props}>{children}</Typography>;
}

export const mdxComponents = {
  a: MdxLink,
  h1: MdxH1,
  h2: MdxH2,
  h3: MdxH3,
  p: MdxP,
};
