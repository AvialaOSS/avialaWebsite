import {
  CommunicateMessages,
  DirectionArrowLeftLight,
  DirectionArrowRightLight,
  GeneralExpandSidebar,
  GeneralMenu,
} from "@aviala-design/icons";
import { Button, List, ListItem } from "@aviala-design/spiral";
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate, useOutlet } from "react-router-dom";
import { getNavItemByPath, getNavPathIndex, navPathToHref } from "../nav";
import { getAdjacentPages, Sidebar } from "./Sidebar";
import { TableOfContents } from "./TableOfContents";
import { ThemeToolbar } from "./ThemeToolbar";

const DOCS_CONTRIB_HREF =
  "https://github.com/AvialaOSS/avialaWebsite/tree/main/apps/spiral-docs";

type DocsNavDirection = "forward" | "back";

const HEAVY_DOC_PATHS = new Set(["/reference/icons"]);

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Later nav index → forward; earlier → back; unknown → forward. */
function getDocsNavDirection(fromPath: string, toPath: string): DocsNavDirection {
  const fromIndex = getNavPathIndex(fromPath);
  const toIndex = getNavPathIndex(toPath);
  if (fromIndex < 0 || toIndex < 0) return "forward";
  return toIndex >= fromIndex ? "forward" : "back";
}

/**
 * Instant route swap + enter-only motion on the new page.
 * Avoids keeping the previous React tree mounted through an exit phase
 * (that delayed heavy pages by 200ms+ before they could even mount).
 */
function DocsPageTransition({
  pathname,
  children,
}: {
  pathname: string;
  children: ReactNode;
}) {
  const prevPathRef = useRef(pathname);
  const directionRef = useRef<DocsNavDirection>("forward");
  const isFirstPathRef = useRef(true);

  if (pathname !== prevPathRef.current) {
    directionRef.current = getDocsNavDirection(prevPathRef.current, pathname);
    prevPathRef.current = pathname;
    isFirstPathRef.current = false;
  }

  const skipMotion =
    isFirstPathRef.current ||
    prefersReducedMotion() ||
    HEAVY_DOC_PATHS.has(pathname);
  const direction = directionRef.current;
  const className = skipMotion
    ? "docs-page-transition docs-page-transition--idle"
    : `docs-page-transition docs-page-transition--enter docs-page-transition--${direction}`;

  return (
    <div key={pathname} className={className}>
      {children}
    </div>
  );
}

export function DocLayout() {
  const contentRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const outlet = useOutlet();
  /** Defer only the page body so chrome can stay responsive while heavy trees render. */
  const deferredOutlet = useDeferredValue(outlet);
  const isOutletPending = deferredOutlet !== outlet;
  const displayedPathRef = useRef(location.pathname);
  if (!isOutletPending) {
    displayedPathRef.current = location.pathname;
  }
  const displayedPath = displayedPathRef.current;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  /** Urgent highlight — updates on click before the route transition commits. */
  const [eagerPath, setEagerPath] = useState(location.pathname);
  const [isMobileNav, setIsMobileNav] = useState(false);
  const [compactToc, setCompactToc] = useState(false);

  const pathname = location.pathname;
  const isContentPending = isOutletPending || eagerPath !== displayedPath;
  const hideToc = displayedPath === "/reference/icons";
  const pageLabel = getNavItemByPath(displayedPath)?.label;
  const { prev, next } = getAdjacentPages(
    getNavPathIndex(pathname) >= 0 ? pathname : "/start/introduction"
  );

  useEffect(() => {
    setEagerPath(pathname);
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const sync = () => {
      const mobile = mq.matches;
      setIsMobileNav(mobile);
      if (!mobile) {
        setMobileOpen(false);
      }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1100px)");
    const sync = () => setCompactToc(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [displayedPath]);

  useEffect(() => {
    const title = pageLabel
      ? `${pageLabel} — Spiral 2 · Aviala Design`
      : "Spiral 2 组件文档 — Aviala Design";
    document.title = title;
  }, [pageLabel]);

  const previewPath = (path: string) => {
    setEagerPath(path);
  };

  const goTo = (path: string) => {
    setEagerPath(path);
    startTransition(() => {
      navigate(navPathToHref(path));
    });
  };

  return (
    <div className={`docs-shell${sidebarCollapsed ? " docs-shell--sidebar-collapsed" : ""}`}>
      <Sidebar
        activePath={eagerPath}
        onPathPreview={previewPath}
        onNavigate={() => setMobileOpen(false)}
        onCollapse={() => setSidebarCollapsed(true)}
      />
      <div className={`docs-mobile-drawer${mobileOpen ? " is-open" : ""}`}>
        <Sidebar
          activePath={eagerPath}
          onPathPreview={previewPath}
          onNavigate={() => setMobileOpen(false)}
        />
      </div>
      {mobileOpen ? (
        <button
          type="button"
          className="docs-mobile-backdrop"
          aria-label="关闭导航"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div ref={mainRef} className="docs-main">
        <div className="docs-floating-controls">
          <div className="docs-floating-controls__left">
            {sidebarCollapsed && !isMobileNav ? (
              <Button
                type="button"
                mode="noBackgroundCustom"
                size="regular"
                iconOnly
                className="docs-float-btn docs-sidebar-expand-btn"
                aria-label="展开侧边栏"
                leftIcon={<GeneralExpandSidebar aria-hidden />}
                onClick={() => setSidebarCollapsed(false)}
              />
            ) : null}
            {isMobileNav ? (
              <Button
                type="button"
                mode="noBackgroundCustom"
                size="regular"
                iconOnly
                className="docs-float-btn docs-mobile-menu-btn"
                aria-label="打开导航"
                leftIcon={<GeneralMenu aria-hidden />}
                onClick={() => setMobileOpen(true)}
              />
            ) : null}
          </div>
          <div className="docs-floating-controls__right">
            {!hideToc && compactToc ? (
              <TableOfContents
                key={`toc-float-${displayedPath}`}
                containerRef={contentRef}
                variant="float"
              />
            ) : null}
            <ThemeToolbar />
          </div>
        </div>

        <div className={`docs-body${hideToc || compactToc ? " docs-body--no-toc" : ""}`}>
          <article
            ref={contentRef}
            className={`docs-content${isContentPending ? " docs-content--pending" : ""}`}
          >
            <DocsPageTransition pathname={displayedPath}>
              {deferredOutlet}
            </DocsPageTransition>
            <a
              className="docs-contrib-list-link"
              href={DOCS_CONTRIB_HREF}
              target="_blank"
              rel="noopener noreferrer"
            >
              <List className="docs-contrib-list">
                <ListItem
                  itemType="action"
                  leading="default"
                  icon={<CommunicateMessages thickness="Medium" mode="fill" aria-hidden />}
                  title="对文档有改进意见吗？"
                  subtitle="欢迎编辑文档，为更多开发者提供帮助"
                  /* Published List hides chevron with trailing={null}; keep chevron only. */
                  trailing={
                    <span className="aviala-list-item__chevron" aria-hidden>
                      <DirectionArrowRightLight width={18} height={18} />
                    </span>
                  }
                  interactive
                />
              </List>
            </a>
            <footer className="docs-pager" aria-label="相邻文档">
              {prev ? (
                <Button
                  type="button"
                  mode="second"
                  size="regular"
                  leftIcon={<DirectionArrowLeftLight aria-hidden />}
                  onClick={() => goTo(prev.path)}
                >
                  {prev.label}
                </Button>
              ) : (
                <span />
              )}
              {next ? (
                <Button
                  type="button"
                  mode="second"
                  size="regular"
                  rightIcon={<DirectionArrowRightLight aria-hidden />}
                  onClick={() => goTo(next.path)}
                >
                  {next.label}
                </Button>
              ) : (
                <span />
              )}
            </footer>
          </article>
          {!hideToc && !compactToc ? (
            <TableOfContents key={`toc-rail-${displayedPath}`} containerRef={contentRef} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
