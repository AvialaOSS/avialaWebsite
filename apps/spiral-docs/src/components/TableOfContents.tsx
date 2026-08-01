import { GeneralHistory, GeneralTodoList } from "@aviala-design/icons";
import {
  Alert,
  Anchor,
  AnchorItem,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Typography,
} from "@aviala-design/spiral";
import { useEffect, useState, type RefObject } from "react";
import { useLocation } from "react-router-dom";
import { useDocsStaleInfo } from "../lib/docs-stale";
import { getNavItemByPath } from "../nav";
import { DocsUpdatesModal } from "./DocsUpdatesModal";
import { DocsVersionSwitcher } from "./DocsVersionSwitcher";

type Heading = {
  id: string;
  text: string;
  level: 2 | 3;
};

type TableOfContentsProps = {
  containerRef: RefObject<HTMLElement | null>;
  /** `rail` = sticky side column; `float` = compact popover trigger. */
  variant?: "rail" | "float";
};

function headingIndentLevel(level: Heading["level"]): 0 | 1 {
  return level === 2 ? 0 : 1;
}

function usePageHeadings(containerRef: RefObject<HTMLElement | null>) {
  const location = useLocation();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const nodes = container.querySelectorAll("h2, h3");
    const next: Heading[] = [];

    nodes.forEach((node) => {
      const level = node.tagName === "H2" ? 2 : 3;
      const text = node.textContent?.trim() ?? "";
      if (!text) return;

      let id = node.id;
      if (!id) {
        id = text
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w\u4e00-\u9fff-]+/g, "");
        node.id = id;
      }

      next.push({ id, text, level });
    });

    setHeadings(next);
    setActiveId(next[0]?.id ?? null);
  }, [containerRef, location.pathname]);

  useEffect(() => {
    if (headings.length === 0) return;

    const headingElements = headings
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element != null);

    if (headingElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-72px 0px -70% 0px",
        threshold: 0,
      }
    );

    headingElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  return { headings, activeId, setActiveId };
}

function TocAnchorList({
  headings,
  activeId,
  onNavigate,
}: {
  headings: Heading[];
  activeId: string | null;
  onNavigate?: () => void;
}) {
  return (
    <Anchor aria-label="本页目录">
      {headings.map((heading) => (
        <AnchorItem
          key={heading.id}
          href={`#${heading.id}`}
          activated={heading.id === activeId}
          indentLevel={headingIndentLevel(heading.level)}
          onClick={() => onNavigate?.()}
        >
          {heading.text}
        </AnchorItem>
      ))}
    </Anchor>
  );
}

export function TableOfContents({
  containerRef,
  variant = "rail",
}: TableOfContentsProps) {
  const { headings, activeId } = usePageHeadings(containerRef);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [variant]);

  if (headings.length === 0) return null;

  if (variant === "float") {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            mode="noBackgroundCustom"
            size="regular"
            iconOnly
            className="docs-float-btn docs-toc-float-btn"
            aria-label="本页目录"
            leftIcon={<GeneralTodoList aria-hidden />}
          />
        </PopoverTrigger>
        <PopoverContent align="end" className="docs-toc-float-panel">
          <Typography level="caption" as="p" className="docs-toc-float-title">
            本页目录
          </Typography>
          <TocAnchorList
            headings={headings}
            activeId={activeId}
            onNavigate={() => setOpen(false)}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <aside className="docs-toc" aria-label="本页目录">
      <Typography level="caption" as="p" className="docs-toc-title">
        本页目录
      </Typography>
      <TocAnchorList headings={headings} activeId={activeId} />
    </aside>
  );
}

type DocPageHeaderProps = {
  title: string;
  description?: string;
  /**
   * Version switcher + changelog history — only for component doc pages.
   * Guides / reference tools leave this off.
   */
  showVersionControls?: boolean;
};

export function DocPageHeader({
  title,
  description,
  showVersionControls = false,
}: DocPageHeaderProps) {
  const [updatesOpen, setUpdatesOpen] = useState(false);
  const { pathname } = useLocation();
  const component = getNavItemByPath(pathname)?.component;
  const stale = useDocsStaleInfo(component, showVersionControls);

  return (
    <header className="docs-page-header">
      <div className="docs-page-header__title-row">
        <Typography level="headline1" as="h1" className="docs-page-header__title">
          {title}
        </Typography>
        {showVersionControls ? (
          <div className="docs-page-header__actions">
            <DocsVersionSwitcher variant="header" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    mode="defaultCustom"
                    size="regular"
                    iconOnly
                    className="docs-page-header__updates-btn"
                    aria-label="更新历史记录"
                    leftIcon={<GeneralHistory aria-hidden />}
                    onClick={() => setUpdatesOpen(true)}
                  />
                </TooltipTrigger>
                <TooltipContent side="bottom">更新历史记录</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : null}
      </div>
      {description ? (
        <Typography level="text" as="p" className="docs-page-description">
          {description}
        </Typography>
      ) : null}
      {stale ? (
        <Alert
          className="docs-page-header__stale"
          type="warning"
          appearance="light"
          title="内容可能过时。"
          description={
            <>
              组件 <code>{stale.component}</code> 在文档覆盖版{" "}
              <code>{stale.docsVersion}</code> 之后仍有变更（npm 最新{" "}
              <code>{stale.latest}</code>）。
            </>
          }
          dismissible={false}
        />
      ) : null}
      {showVersionControls ? (
        <DocsUpdatesModal open={updatesOpen} onOpenChange={setUpdatesOpen} />
      ) : null}
    </header>
  );
}
