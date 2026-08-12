import { Marked } from "marked";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const marked = new Marked({ gfm: true, breaks: false });

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  emDelimiter: "*",
  strongDelimiter: "**",
});
turndown.use(gfm);
turndown.addRule("underline", {
  filter: ["u"],
  replacement: (content: string) => `<u>${content}</u>`,
});
turndown.addRule("strikethroughKeep", {
  filter: ["s", "del"],
  replacement: (content: string) => `~~${content}~~`,
});

const EMPTY_HTML = /^(<p>(<br\s*\/?>|\s)*<\/p>|<div>(<br\s*\/?>|\s)*<\/div>|<br\s*\/?>|\s)*$/i;
const ATX_LINE = /^(#{1,6})\s+(.+)$/;

export function markdownToHtml(markdown: string): string {
  // Older commits escaped ATX as `\# Title` — treat those as real headings.
  const source = markdown.trim().replace(/^\\(#{1,6}\s)/gm, "$1");
  if (!source) return "";
  return String(marked.parse(source, { async: false }));
}

/**
 * Promote paragraphs / divs that still contain ATX markers (`# Title`) into
 * real heading elements so Turndown emits proper markdown headings.
 */
export function promoteAtxInEditableRoot(root: HTMLElement): boolean {
  let changed = false;
  const blocks = Array.from(root.querySelectorAll("p, div"));
  for (const block of blocks) {
    if (!(block instanceof HTMLElement)) continue;
    if (block.closest("pre, code, li, blockquote, h1, h2, h3, h4, h5, h6")) continue;
    if (!root.contains(block)) continue;
    if (block.querySelector("p, div, ul, ol, h1, h2, h3, h4, pre, table")) continue;
    const raw = (block.textContent ?? "").replace(/\u00a0/g, " ").trim();
    const match = raw.match(ATX_LINE);
    if (!match) continue;
    const level = Math.min(match[1].length, 4);
    const heading = document.createElement(`h${level}`);
    heading.textContent = match[2].trim();
    block.replaceWith(heading);
    changed = true;
  }
  return changed;
}

export function htmlToMarkdown(html: string): string {
  const compact = html.replace(/\u00a0/g, " ").trim();
  if (!compact || EMPTY_HTML.test(compact.replace(/\s+/g, ""))) return "";
  const md = turndown.turndown(html).replace(/\n{3,}/g, "\n\n").trim();
  // contentEditable leaves `# Title` inside <p>; Turndown escapes to `\#`.
  return md.replace(/^\\(#{1,6}\s)/gm, "$1");
}
