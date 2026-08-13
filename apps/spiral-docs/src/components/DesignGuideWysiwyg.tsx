import {
  DevelopTerminal,
  EditBold,
  EditFontItalian,
  EditHeadline1,
  EditHeadline2,
  EditHeadline3,
  EditHeadlineMore,
  EditUnderline,
  SymbolLink,
} from "@aviala-design/icons";
import {
  Button,
  Input,
  ResponsiveTooltip,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TooltipProvider,
} from "@aviala-design/spiral";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  htmlToMarkdown,
  markdownToHtml,
  promoteAtxInEditableRoot,
} from "../lib/design-guide-markdown-html";

const PREFIX_HEADING: Record<string, string> = {
  "#": "h1",
  "##": "h2",
  "###": "h3",
  "####": "h4",
};

type BlockTag = "p" | "h1" | "h2" | "h3";

const BLOCK_OPTIONS: {
  value: BlockTag;
  label: string;
  icon: ReactNode;
}[] = [
  { value: "p", label: "正文", icon: <EditHeadlineMore aria-hidden width={14} height={14} /> },
  { value: "h1", label: "标题 1", icon: <EditHeadline1 aria-hidden width={14} height={14} /> },
  { value: "h2", label: "标题 2", icon: <EditHeadline2 aria-hidden width={14} height={14} /> },
  { value: "h3", label: "标题 3", icon: <EditHeadline3 aria-hidden width={14} height={14} /> },
];

function blockOption(tag: BlockTag) {
  return BLOCK_OPTIONS.find((o) => o.value === tag) ?? BLOCK_OPTIONS[0]!;
}

type FormatState = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  code: boolean;
  link: boolean;
  block: BlockTag;
};

type ToolbarPos = { top: number; left: number; place: "above" | "below" };

function Tip({
  content,
  side = "top",
  children,
}: {
  content: string;
  side?: "top" | "bottom";
  children: ReactElement;
}) {
  return (
    <ResponsiveTooltip
      content={content}
      side={side}
      // Above the format float (z-index 80); default tooltip is 50 and sits under it.
      contentClassName="docs-dge-format-float-tooltip"
    >
      {children}
    </ResponsiveTooltip>
  );
}

function caretBlock(root: HTMLElement): HTMLElement | null {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  let node: Node | null = sel.anchorNode;
  if (!node || !root.contains(node)) return null;
  if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
  while (node && node !== root) {
    if (node instanceof HTMLElement) {
      const tag = node.tagName;
      if (
        tag === "P" ||
        tag === "DIV" ||
        tag === "H1" ||
        tag === "H2" ||
        tag === "H3" ||
        tag === "H4" ||
        tag === "LI" ||
        tag === "BLOCKQUOTE"
      ) {
        return node;
      }
    }
    node = node.parentElement;
  }
  return null;
}

function placeCaretAtEnd(el: HTMLElement) {
  const sel = window.getSelection();
  if (!sel) return;
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}

function selectionInside(root: HTMLElement): Range | null {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  const range = sel.getRangeAt(0);
  if (!root.contains(range.commonAncestorContainer)) return null;
  return range;
}

function readFormatState(root: HTMLElement): FormatState {
  const block = caretBlock(root);
  const tag = (block?.tagName.toLowerCase() ?? "p") as string;
  const blockTag: BlockTag =
    tag === "h1" || tag === "h2" || tag === "h3" ? tag : "p";
  let link = false;
  const sel = window.getSelection();
  if (sel?.anchorNode) {
    const el =
      sel.anchorNode.nodeType === Node.ELEMENT_NODE
        ? (sel.anchorNode as HTMLElement)
        : sel.anchorNode.parentElement;
    link = Boolean(el?.closest?.("a"));
  }
  return {
    bold: document.queryCommandState("bold"),
    italic: document.queryCommandState("italic"),
    underline: document.queryCommandState("underline"),
    code: Boolean(
      sel?.anchorNode &&
        (sel.anchorNode.nodeType === Node.ELEMENT_NODE
          ? (sel.anchorNode as HTMLElement)
          : sel.anchorNode.parentElement
        )?.closest?.("code"),
    ),
    link,
    block: blockTag,
  };
}

function wrapTextBeforeCaret(tag: "strong" | "em" | "code", start: number, end: number, inner: string) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;
  const node = sel.anchorNode;
  if (!node || node.nodeType !== Node.TEXT_NODE) return;
  const text = node.textContent ?? "";
  const after = text.slice(end);
  const before = text.slice(0, start);
  const el = document.createElement(tag);
  el.textContent = inner;
  const parent = node.parentNode;
  if (!parent) return;
  const frag = document.createDocumentFragment();
  if (before) frag.append(before);
  frag.append(el);
  if (after) frag.append(after);
  parent.replaceChild(frag, node);
  const range = document.createRange();
  range.setStartAfter(el);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

function applyInlineMarkdownShortcuts(root: HTMLElement): boolean {
  const sel = window.getSelection();
  if (!sel?.isCollapsed || sel.rangeCount === 0) return false;
  const node = sel.anchorNode;
  if (!node || node.nodeType !== Node.TEXT_NODE || !root.contains(node)) return false;
  const offset = sel.anchorOffset;
  const before = (node.textContent ?? "").slice(0, offset);

  const bold = before.match(/\*\*([^*]+)\*\*$/);
  if (bold && bold.index != null) {
    wrapTextBeforeCaret("strong", bold.index, offset, bold[1]);
    return true;
  }
  const italic = before.match(/(^|[^*])\*([^*]+)\*$/);
  if (italic && italic.index != null) {
    const lead = italic[1] ?? "";
    const start = italic.index + lead.length;
    wrapTextBeforeCaret("em", start, offset, italic[2]);
    return true;
  }
  const code = before.match(/`([^`]+)`$/);
  if (code && code.index != null) {
    wrapTextBeforeCaret("code", code.index, offset, code[1]);
    return true;
  }
  return false;
}

function applyBlockShortcut(root: HTMLElement): boolean {
  const block = caretBlock(root);
  if (!block) return false;
  const text = (block.textContent ?? "").replace(/\u00a0/g, " ").trim();
  const heading = PREFIX_HEADING[text];
  if (heading) {
    const next = document.createElement(heading);
    next.innerHTML = "<br>";
    block.replaceWith(next);
    placeCaretAtEnd(next);
    return true;
  }
  if (text === ">") {
    const next = document.createElement("blockquote");
    const p = document.createElement("p");
    p.innerHTML = "<br>";
    next.append(p);
    block.replaceWith(next);
    placeCaretAtEnd(p);
    return true;
  }
  if (text === "-" || text === "*") {
    block.textContent = "";
    document.execCommand("insertUnorderedList");
    return true;
  }
  if (/^\d+\.$/.test(text)) {
    block.textContent = "";
    document.execCommand("insertOrderedList");
    return true;
  }
  return false;
}

function promoteAtxNearCaret(root: HTMLElement): HTMLElement | null {
  const block = caretBlock(root);
  if (!block) return null;
  if (!/^(P|DIV)$/.test(block.tagName)) return null;
  const raw = (block.textContent ?? "").replace(/\u00a0/g, " ").trim();
  const match = raw.match(/^(#{1,6})\s+(.+)$/);
  if (!match) return null;
  const level = Math.min(match[1].length, 4);
  const heading = document.createElement(`h${level}`);
  heading.textContent = match[2].trim();
  block.replaceWith(heading);
  placeCaretAtEnd(heading);
  return heading;
}

function blocksTouchingSelection(root: HTMLElement): HTMLElement[] {
  const range = selectionInside(root);
  const children = Array.from(root.children).filter(
    (n): n is HTMLElement =>
      n instanceof HTMLElement &&
      /^(P|DIV|H1|H2|H3|H4|BLOCKQUOTE)$/.test(n.tagName),
  );
  if (!range) {
    const one = caretBlock(root);
    return one && one !== root ? [one] : children.slice(0, 1);
  }
  const hit = children.filter((el) => {
    try {
      return range.intersectsNode(el);
    } catch {
      return false;
    }
  });
  if (hit.length > 0) return hit;
  const one = caretBlock(root);
  return one && one !== root ? [one] : [];
}

function setBlockFormat(root: HTMLElement, tag: BlockTag) {
  const blocks = blocksTouchingSelection(root);
  if (blocks.length === 0) {
    document.execCommand("formatBlock", false, tag);
    return;
  }
  const created: HTMLElement[] = [];
  for (const block of blocks) {
    if (block.tagName.toLowerCase() === tag) {
      created.push(block);
      continue;
    }
    const next = document.createElement(tag);
    next.innerHTML = block.innerHTML || "<br>";
    block.replaceWith(next);
    created.push(next);
  }
  const sel = window.getSelection();
  const last = created[created.length - 1];
  if (sel && last) {
    const range = document.createRange();
    range.selectNodeContents(last);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

function toggleInlineCode(root: HTMLElement) {
  const range = selectionInside(root);
  if (!range || range.collapsed) return;
  const sel = window.getSelection();
  const anchor =
    sel?.anchorNode?.nodeType === Node.ELEMENT_NODE
      ? (sel.anchorNode as HTMLElement)
      : sel?.anchorNode?.parentElement;
  const existing = anchor?.closest?.("code");
  if (existing && root.contains(existing)) {
    const text = document.createTextNode(existing.textContent ?? "");
    existing.replaceWith(text);
    return;
  }
  const extracted = range.extractContents();
  const code = document.createElement("code");
  code.append(extracted);
  range.insertNode(code);
  sel?.removeAllRanges();
  const after = document.createRange();
  after.selectNodeContents(code);
  after.collapse(false);
  sel?.addRange(after);
}

type DesignGuideWysiwygProps = {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
};

/** Single-surface markdown: edit the rendered prose, persist GFM. */
export function DesignGuideWysiwyg({
  value,
  onChange,
  placeholder = "输入说明文案，支持 Markdown",
}: DesignGuideWysiwygProps) {
  const ref = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const focusedRef = useRef(false);
  const composingRef = useRef(false);
  const syncedRef = useRef(value);
  const savedRangeRef = useRef<Range | null>(null);

  const [toolbar, setToolbar] = useState<{
    open: boolean;
    pos: ToolbarPos;
    format: FormatState;
  }>({
    open: false,
    pos: { top: 0, left: 0, place: "above" },
    format: {
      bold: false,
      italic: false,
      underline: false,
      code: false,
      link: false,
      block: "p",
    },
  });
  const [linkEditing, setLinkEditing] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");
  const [blockMenuOpen, setBlockMenuOpen] = useState(false);
  const blockMenuOpenRef = useRef(false);
  blockMenuOpenRef.current = blockMenuOpen;
  /** True while the user is still dragging / extending a selection. */
  const selectingRef = useRef(false);
  const toolbarOpenRef = useRef(false);

  const commitFromDom = () => {
    const el = ref.current;
    if (!el) return;
    promoteAtxInEditableRoot(el);
    const next = htmlToMarkdown(el.innerHTML);
    syncedRef.current = next;
    if (next !== value) onChange(next);
  };

  const refreshFromMarkdown = () => {
    const el = ref.current;
    if (!el) return;
    promoteAtxInEditableRoot(el);
    const md = htmlToMarkdown(el.innerHTML);
    el.innerHTML = markdownToHtml(md);
    syncedRef.current = md;
    if (md !== value) onChange(md);
  };

  const rememberSelection = () => {
    const el = ref.current;
    if (!el) return;
    const range = selectionInside(el);
    if (range) savedRangeRef.current = range.cloneRange();
  };

  const restoreSelection = () => {
    const range = savedRangeRef.current;
    const el = ref.current;
    if (!range || !el) return false;
    el.focus();
    const sel = window.getSelection();
    if (!sel) return false;
    sel.removeAllRanges();
    sel.addRange(range);
    return true;
  };

  const updateToolbar = (mode: "reveal" | "sync" = "reveal") => {
    const el = ref.current;
    const inSelectContent = Boolean(
      document.activeElement?.closest?.(
        ".docs-dge-format-float-select, .aviala-select-content",
      ),
    );
    const active =
      focusedRef.current ||
      document.activeElement === el ||
      (el != null && el.contains(document.activeElement)) ||
      (toolbarRef.current != null &&
        toolbarRef.current.contains(document.activeElement)) ||
      blockMenuOpenRef.current ||
      inSelectContent;
    if (!el || !active) {
      toolbarOpenRef.current = false;
      setToolbar((t) => (t.open ? { ...t, open: false } : t));
      setLinkEditing(false);
      setBlockMenuOpen(false);
      return;
    }
    // Keep the open toolbar stable while typing a link URL or picking a block type.
    if (
      blockMenuOpenRef.current ||
      (toolbarRef.current?.contains(document.activeElement) &&
        toolbarRef.current.querySelector("input"))
    ) {
      return;
    }

    // Dragging a range: hide any float and wait until pointer/key selection ends.
    if (selectingRef.current) {
      if (toolbarOpenRef.current) {
        toolbarOpenRef.current = false;
        setToolbar((t) => (t.open ? { ...t, open: false } : t));
        setLinkEditing(false);
      }
      return;
    }

    const range = selectionInside(el);
    if (!range || range.collapsed) {
      toolbarOpenRef.current = false;
      setToolbar((t) => (t.open ? { ...t, open: false } : t));
      setLinkEditing(false);
      return;
    }
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      toolbarOpenRef.current = false;
      setToolbar((t) => (t.open ? { ...t, open: false } : t));
      return;
    }

    // Mid-selection updates (selectionchange / scroll): only refresh an already-open bar.
    if (mode === "sync" && !toolbarOpenRef.current) return;

    savedRangeRef.current = range.cloneRange();
    const format = readFormatState(el);
    const place: "above" | "below" = rect.top < 72 ? "below" : "above";
    const top = place === "above" ? Math.max(8, rect.top - 12) : rect.bottom + 12;
    const left = rect.left + rect.width / 2;
    toolbarOpenRef.current = true;
    setToolbar({
      open: true,
      pos: { top, left, place },
      format,
    });
  };

  const updateToolbarRef = useRef(updateToolbar);
  updateToolbarRef.current = updateToolbar;

  useEffect(() => {
    const el = ref.current;
    if (!el || focusedRef.current) return;
    if (syncedRef.current === value && (el.innerHTML !== "" || !value.trim())) return;
    el.innerHTML = markdownToHtml(value);
    syncedRef.current = value;
  }, [value]);

  useLayoutEffect(() => {
    const onSel = () => updateToolbarRef.current("sync");
    const endPointerSelect = () => {
      if (!selectingRef.current) return;
      selectingRef.current = false;
      updateToolbarRef.current("reveal");
    };
    document.addEventListener("selectionchange", onSel);
    window.addEventListener("scroll", onSel, true);
    window.addEventListener("resize", onSel);
    window.addEventListener("pointerup", endPointerSelect);
    window.addEventListener("pointercancel", endPointerSelect);
    return () => {
      document.removeEventListener("selectionchange", onSel);
      window.removeEventListener("scroll", onSel, true);
      window.removeEventListener("resize", onSel);
      window.removeEventListener("pointerup", endPointerSelect);
      window.removeEventListener("pointercancel", endPointerSelect);
    };
  }, []);

  const runFormat = (fn: () => void) => {
    restoreSelection();
    fn();
    rememberSelection();
    commitFromDom();
    updateToolbar("reveal");
  };

  const applyLink = (url: string) => {
    const href = url.trim();
    if (!href) return;
    runFormat(() => {
      document.execCommand("createLink", false, href);
    });
    setLinkEditing(false);
  };

  const removeLink = () => {
    runFormat(() => {
      document.execCommand("unlink");
    });
    setLinkEditing(false);
  };

  const tipSide = toolbar.pos.place === "above" ? "top" : "bottom";

  const toolbarNode: ReactNode = toolbar.open
    ? createPortal(
        <TooltipProvider>
          <div
            ref={toolbarRef}
            className={`docs-dge-format-float is-${toolbar.pos.place}`}
            style={{
              top: toolbar.pos.top,
              left: toolbar.pos.left,
            }}
            onMouseDown={(e) => {
              // Keep contentEditable selection when pressing toolbar controls.
              if ((e.target as HTMLElement).closest("input, textarea")) return;
              e.preventDefault();
            }}
          >
            <div className="docs-dge-format-float__row" role="toolbar" aria-label="文字格式">
              <Select
                value={toolbar.format.block}
                open={blockMenuOpen}
                onOpenChange={(open) => {
                  rememberSelection();
                  setBlockMenuOpen(open);
                  if (!open) {
                    window.setTimeout(() => {
                      restoreSelection();
                      updateToolbar("reveal");
                    }, 0);
                  }
                }}
                onValueChange={(v) => {
                  const tag = (v === "h1" || v === "h2" || v === "h3" ? v : "p") as BlockTag;
                  runFormat(() => setBlockFormat(ref.current!, tag));
                  setBlockMenuOpen(false);
                }}
              >
                <SelectTrigger
                  className="docs-dge-format-float__block"
                  aria-label="段落样式"
                  leftIcon={blockOption(toolbar.format.block).icon}
                >
                  <SelectValue placeholder="正文" />
                </SelectTrigger>
                <SelectContent
                  className="docs-dge-format-float-select"
                  side={tipSide}
                  align="start"
                >
                  {BLOCK_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      itemFunction="radio"
                      leftIcon={opt.icon}
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <span className="docs-dge-format-float__sep" aria-hidden />

              <Tip content="加粗" side={tipSide}>
                <Button
                  type="button"
                  mode={toolbar.format.bold ? "outlineCustom" : "noBackgroundCustom"}
                  size="tiny"
                  iconOnly
                  allRound
                  aria-label="加粗"
                  aria-pressed={toolbar.format.bold}
                  leftIcon={<EditBold aria-hidden width={14} height={14} />}
                  onClick={() => runFormat(() => document.execCommand("bold"))}
                />
              </Tip>
              <Tip content="斜体" side={tipSide}>
                <Button
                  type="button"
                  mode={toolbar.format.italic ? "outlineCustom" : "noBackgroundCustom"}
                  size="tiny"
                  iconOnly
                  allRound
                  aria-label="斜体"
                  aria-pressed={toolbar.format.italic}
                  leftIcon={<EditFontItalian aria-hidden width={14} height={14} />}
                  onClick={() => runFormat(() => document.execCommand("italic"))}
                />
              </Tip>
              <Tip content="下划线" side={tipSide}>
                <Button
                  type="button"
                  mode={toolbar.format.underline ? "outlineCustom" : "noBackgroundCustom"}
                  size="tiny"
                  iconOnly
                  allRound
                  aria-label="下划线"
                  aria-pressed={toolbar.format.underline}
                  leftIcon={<EditUnderline aria-hidden width={14} height={14} />}
                  onClick={() => runFormat(() => document.execCommand("underline"))}
                />
              </Tip>
              <Tip content="行内代码" side={tipSide}>
                <Button
                  type="button"
                  mode={toolbar.format.code ? "outlineCustom" : "noBackgroundCustom"}
                  size="tiny"
                  iconOnly
                  allRound
                  aria-label="行内代码"
                  aria-pressed={toolbar.format.code}
                  leftIcon={<DevelopTerminal aria-hidden width={14} height={14} />}
                  onClick={() => runFormat(() => toggleInlineCode(ref.current!))}
                />
              </Tip>
              <Tip content="链接" side={tipSide}>
                <Button
                  type="button"
                  mode={toolbar.format.link || linkEditing ? "outlineCustom" : "noBackgroundCustom"}
                  size="tiny"
                  iconOnly
                  allRound
                  aria-label="链接"
                  aria-pressed={toolbar.format.link}
                  leftIcon={<SymbolLink aria-hidden width={14} height={14} />}
                  onClick={() => {
                    rememberSelection();
                    if (toolbar.format.link) {
                      removeLink();
                      return;
                    }
                    setLinkUrl("https://");
                    setLinkEditing(true);
                  }}
                />
              </Tip>
            </div>
            {linkEditing ? (
              <div className="docs-dge-format-float__link">
                <Input
                  size="regular"
                  value={linkUrl}
                  placeholder="https://"
                  aria-label="链接地址"
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applyLink(linkUrl);
                    }
                    if (e.key === "Escape") {
                      e.preventDefault();
                      setLinkEditing(false);
                      restoreSelection();
                    }
                  }}
                />
                <Button
                  type="button"
                  mode="primary"
                  size="tiny"
                  onClick={() => applyLink(linkUrl)}
                >
                  确定
                </Button>
              </div>
            ) : null}
          </div>
        </TooltipProvider>,
        document.body,
      )
    : null;

  return (
    <>
      <div
        ref={ref}
        className={`docs-prose docs-design-guide__md docs-dge-prose__wysiwyg${value.trim() ? "" : " is-empty"}`}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label={placeholder}
        data-placeholder={placeholder}
        onClick={(e) => {
          e.stopPropagation();
          const link = (e.target as HTMLElement | null)?.closest?.("a");
          if (link) e.preventDefault();
        }}
        onPointerDown={() => {
          // Hide float until pointerup; selectionchange only syncs while open.
          selectingRef.current = true;
          if (toolbarOpenRef.current) {
            toolbarOpenRef.current = false;
            setToolbar((t) => (t.open ? { ...t, open: false } : t));
            setLinkEditing(false);
          }
        }}
        onFocus={() => {
          focusedRef.current = true;
          document.execCommand("defaultParagraphSeparator", false, "p");
          // Triple-click / keyboard selection may finish after focus.
          window.requestAnimationFrame(() => updateToolbar("reveal"));
        }}
        onBlur={(e) => {
          const next = e.relatedTarget as Node | null;
          if (next && toolbarRef.current?.contains(next)) return;
          // Allow toolbar mousedown (which preventDefaults) to finish first.
          window.setTimeout(() => {
            if (toolbarRef.current?.contains(document.activeElement)) return;
            if (ref.current && document.activeElement === ref.current) return;
            if (blockMenuOpenRef.current) return;
            if (
              document.activeElement?.closest?.(
                ".docs-dge-format-float-select, .aviala-select-content",
              )
            ) {
              return;
            }
            focusedRef.current = false;
            composingRef.current = false;
            selectingRef.current = false;
            toolbarOpenRef.current = false;
            setToolbar((t) => ({ ...t, open: false }));
            setLinkEditing(false);
            setBlockMenuOpen(false);
            refreshFromMarkdown();
          }, 0);
        }}
        onCompositionStart={() => {
          composingRef.current = true;
        }}
        onCompositionEnd={() => {
          composingRef.current = false;
          const el = ref.current;
          if (el) {
            applyInlineMarkdownShortcuts(el);
            promoteAtxNearCaret(el);
          }
          commitFromDom();
          updateToolbar("sync");
        }}
        onInput={() => {
          if (composingRef.current) return;
          const el = ref.current;
          if (el) {
            applyInlineMarkdownShortcuts(el);
            promoteAtxNearCaret(el);
          }
          commitFromDom();
          updateToolbar("sync");
        }}
        onKeyDown={(e) => {
          if (composingRef.current) return;
          const el = ref.current;
          if (!el) return;
          if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
            e.preventDefault();
            document.execCommand("bold");
            commitFromDom();
            updateToolbar("reveal");
            return;
          }
          if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "i") {
            e.preventDefault();
            document.execCommand("italic");
            commitFromDom();
            updateToolbar("reveal");
            return;
          }
          if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "u") {
            e.preventDefault();
            document.execCommand("underline");
            commitFromDom();
            updateToolbar("reveal");
            return;
          }
          if (e.key === " ") {
            if (applyBlockShortcut(el)) {
              e.preventDefault();
              commitFromDom();
            }
            return;
          }
          if (e.key === "Enter" && !e.shiftKey) {
            const block = caretBlock(el);
            if (promoteAtxNearCaret(el)) {
              commitFromDom();
              return;
            }
            if (block && /^H[1-4]$/.test(block.tagName)) {
              e.preventDefault();
              const p = document.createElement("p");
              p.innerHTML = "<br>";
              block.after(p);
              placeCaretAtEnd(p);
              commitFromDom();
            }
          }
        }}
        onKeyUp={(e) => {
          if (composingRef.current) return;
          if (e.key === " ") {
            const el = ref.current;
            if (el && promoteAtxNearCaret(el)) commitFromDom();
          }
          // Shift / arrows / Home / End / Cmd+A: reveal after selection gesture ends.
          const k = e.key;
          if (
            k === "Shift" ||
            k.startsWith("Arrow") ||
            k === "Home" ||
            k === "End" ||
            k === "PageUp" ||
            k === "PageDown" ||
            ((e.metaKey || e.ctrlKey) && k.toLowerCase() === "a")
          ) {
            updateToolbar("reveal");
            return;
          }
          updateToolbar("sync");
        }}
        onPaste={(e) => {
          const text = e.clipboardData.getData("text/plain");
          if (!text) return;
          if (/[#*_`>\-\[\]|]/m.test(text) || text.includes("\n")) {
            e.preventDefault();
            document.execCommand("insertHTML", false, markdownToHtml(text) || text);
            commitFromDom();
          }
        }}
      />
      {toolbarNode}
    </>
  );
}
