/**
 * Convert simple standalone DocPages (header + one DemoBlock + PropsTable)
 * into ComponentDocView so doc-revisions apply.
 *
 * Usage: node scripts/convert-simple-doc-pages.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pagesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/pages/components");

/** @type {Record<string, { file: string; component: string; importLine: string; scope: string; knobs: string; live: string; build: string; demosImport: string }>} */
const pages = {
  Alert: {
    file: "AlertDocPage.tsx",
    component: "Alert",
    importLine: 'import { Alert } from "@aviala-design/spiral";',
    scope: "{ Alert }",
    knobs: "alertKnobs",
    live: "alertLiveCode",
    build: "buildAlertCode",
    demosImport: 'import { alertKnobs, alertLiveCode, buildAlertCode } from "../../demos/component-demos";',
  },
  Feedback: {
    file: "FeedbackDocPage.tsx",
    component: "Feedback",
    importLine: 'import { Feedback } from "@aviala-design/spiral";',
    scope: "{ Feedback }",
    knobs: "feedbackKnobs",
    live: "feedbackLiveCode",
    build: "buildFeedbackCode",
    demosImport:
      'import { buildFeedbackCode, feedbackKnobs, feedbackLiveCode } from "../../demos/component-demos";',
  },
  Input: {
    file: "InputDocPage.tsx",
    component: "Input",
    importLine: 'import { Input } from "@aviala-design/spiral";',
    scope: "{ Input }",
    knobs: "inputKnobs",
    live: "inputLiveCode",
    build: "buildInputCode",
    demosImport: 'import { buildInputCode, inputKnobs, inputLiveCode } from "../../demos/component-demos";',
  },
  Switch: {
    file: "SwitchDocPage.tsx",
    component: "Switch",
    importLine: 'import { Switch } from "@aviala-design/spiral";',
    scope: "{ Switch }",
    knobs: "switchKnobs",
    live: "switchLiveCode",
    build: "buildSwitchCode",
    demosImport: 'import { buildSwitchCode, switchKnobs, switchLiveCode } from "../../demos/component-demos";',
  },
  Link: {
    file: "LinkDocPage.tsx",
    component: "Link",
    importLine: 'import { Link } from "@aviala-design/spiral";',
    scope: "{ Link }",
    knobs: "linkKnobs",
    live: "linkLiveCode",
    build: "buildLinkCode",
    demosImport: 'import { buildLinkCode, linkKnobs, linkLiveCode } from "../../demos/component-demos";',
  },
  Textarea: {
    file: "TextareaDocPage.tsx",
    component: "Textarea",
    importLine: 'import { Textarea } from "@aviala-design/spiral";',
    scope: "{ Textarea }",
    knobs: "textareaKnobs",
    live: "textareaLiveCode",
    build: "buildTextareaCode",
    demosImport:
      'import { buildTextareaCode, textareaKnobs, textareaLiveCode } from "../../demos/component-demos";',
  },
  NumberInput: {
    file: "NumberInputDocPage.tsx",
    component: "NumberInput",
    importLine: 'import { NumberInput } from "@aviala-design/spiral";',
    scope: "{ NumberInput }",
    knobs: "numberInputKnobs",
    live: "numberInputLiveCode",
    build: "buildNumberInputCode",
    demosImport:
      'import { buildNumberInputCode, numberInputKnobs, numberInputLiveCode } from "../../demos/component-demos";',
  },
  Checkbox: {
    file: "CheckboxDocPage.tsx",
    component: "Checkbox",
    importLine: 'import { Checkbox } from "@aviala-design/spiral";',
    scope: "{ Checkbox }",
    knobs: "checkboxKnobs",
    live: "checkboxLiveCode",
    build: "buildCheckboxCode",
    demosImport:
      'import { buildCheckboxCode, checkboxKnobs, checkboxLiveCode } from "../../demos/component-demos";',
  },
  RadioGroup: {
    file: "RadioDocPage.tsx",
    component: "RadioGroup",
    importLine: 'import { RadioGroup, RadioGroupItem } from "@aviala-design/spiral";',
    scope: "{ RadioGroup, RadioGroupItem }",
    knobs: "radioKnobs",
    live: "radioLiveCode",
    build: "buildRadioCode",
    demosImport: 'import { buildRadioCode, radioKnobs, radioLiveCode } from "../../demos/component-demos";',
  },
  Typography: {
    file: "TypographyDocPage.tsx",
    component: "Typography",
    importLine: 'import { Typography } from "@aviala-design/spiral";',
    scope: "{ Typography }",
    knobs: "typographyKnobs",
    live: "typographyLiveCode",
    build: "buildTypographyCode",
    demosImport:
      'import { buildTypographyCode, typographyKnobs, typographyLiveCode } from "../../demos/component-demos";',
  },
  FormField: {
    file: "FormFieldDocPage.tsx",
    component: "FormField",
    importLine: 'import { FormField, Input } from "@aviala-design/spiral";',
    scope: "{ FormField, Input }",
    knobs: "formFieldKnobs",
    live: "formFieldLiveCode",
    build: "buildFormFieldCode",
    demosImport:
      'import { buildFormFieldCode, formFieldKnobs, formFieldLiveCode } from "../../demos/component-demos";',
  },
  Anchor: {
    file: "AnchorDocPage.tsx",
    component: "Anchor",
    importLine: 'import { Anchor, AnchorItem } from "@aviala-design/spiral";',
    scope: "{ Anchor, AnchorItem }",
    knobs: "anchorKnobs",
    live: "anchorLiveCode",
    build: "buildAnchorCode",
    demosImport: 'import { anchorKnobs, anchorLiveCode, buildAnchorCode } from "../../demos/component-demos";',
  },
  Loading: {
    file: "LoadingDocPage.tsx",
    component: "Loading",
    importLine: 'import { Loading } from "@aviala-design/spiral";',
    scope: "{ Loading }",
    knobs: "loadingKnobs",
    live: "loadingLiveCode",
    build: "buildLoadingCode",
    demosImport:
      'import { buildLoadingCode, loadingKnobs, loadingLiveCode } from "../../demos/component-demos";',
  },
};

function extractFallback(text) {
  const title =
    text.match(/title="([^"]+)"/)?.[1] ?? text.match(/title:\s*"([^"]+)"/)?.[1];
  const description =
    text.match(/description="([^"]+)"/)?.[1] ??
    text.match(/description:\s*"([^"]+)"/)?.[1];
  const prose = text
    .match(/<div className="docs-prose">[\s\S]*?<Typography[^>]*>\s*([\s\S]*?)\s*<\/Typography>/)?.[1]
    ?.replace(/\s+/g, " ")
    .trim();
  return { title, description, prose };
}

for (const [name, cfg] of Object.entries(pages)) {
  const filePath = path.join(pagesDir, cfg.file);
  const text = readFileSync(filePath, "utf8");
  if (text.includes("ComponentDocView")) {
    console.log(`skip ${cfg.file} (already ComponentDocView)`);
    continue;
  }
  const { title, description, prose } = extractFallback(text);
  if (!title || !description || !prose) {
    console.warn(`cannot extract ${cfg.file}`, { title, description, prose });
    continue;
  }
  const exportName = text.match(/export function (\w+)/)?.[1] ?? `${name}DocPage`;
  const body = `${cfg.importLine}
import { ComponentDocView } from "../../components/ComponentDocView";
${cfg.demosImport}

export function ${exportName}() {
  return (
    <ComponentDocView
      component="${cfg.component}"
      scope={${cfg.scope}}
      fallback={{
        title: "${title.replace(/"/g, '\\"')}",
        description: "${description.replace(/"/g, '\\"')}",
        prose: "${prose.replace(/"/g, '\\"')}",
        liveCode: ${cfg.live},
        knobs: ${cfg.knobs},
        buildCode: ${cfg.build},
      }}
    />
  );
}
`;
  writeFileSync(filePath, body);
  console.log(`converted ${cfg.file}`);
}
