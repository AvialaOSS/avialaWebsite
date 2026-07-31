import { Link, type LinkProps } from "@aviala-design/spiral";
import { startTransition, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { docsPathToHref } from "../docs-base";

type DocsLinkProps = Omit<LinkProps, "href" | "asChild"> & {
  to: string;
};

/** In-app docs navigation that respects BrowserRouter basename (incl. /v/{version}). */
export function DocsLink({ to, onClick, children, ...props }: DocsLinkProps) {
  const navigate = useNavigate();
  const href = docsPathToHref(to);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    startTransition(() => {
      navigate(to);
    });
  };

  return (
    <Link {...props} href={href} onClick={handleClick}>
      {children}
    </Link>
  );
}
