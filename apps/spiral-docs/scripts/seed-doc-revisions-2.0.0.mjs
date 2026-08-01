import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pagesDir = path.join(root, "src/pages/components");
const revisionsRoot = path.join(root, "src/doc-revisions");

/** @type {Record<string, { title: string; description: string; prose: string }>} */
const metas = {
  // Already-have later revisions: seed a pre-change 2.0.0 baseline
  Button: {
    title: "Button 按钮",
    description: "Figma Basic Input → Button。支持多种 mode、尺寸与图标组合。",
    prose:
      "用于触发操作的主交互控件。可在下方实时编辑代码，或通过 API 调参面板切换 props、左右图标与 iconOnly。",
  },
  Popover: {
    title: "Popover 弹出层",
    description: "Figma System Composition → Popover。用于富内容浮层面板。",
    prose: "基于 Radix Popover，支持四向 placement、箭头与自定义 anchor 元素。",
  },
  Tooltip: {
    title: "Tooltip 工具提示",
    description: "Figma System Composition → Tooltip。用于悬停时的轻量说明。",
    prose: "需在 TooltipProvider 内使用，支持四向 placement 与可选箭头。",
  },
  Navigation: {
    title: "Navigation 导航",
    description: "Figma Structure Navigation → Navigation。用于侧边栏或顶栏导航结构。",
    prose:
      "支持 vertical / horizontal、default / none 背景与 dividingLine。调参可编辑 Brand、Group items（vertical 下连续 child 会包进 NavigationItemGroup；horizontal 会展平为顶栏 Tab）与 Actions。",
  },
  SegmentatorGroup: {
    title: "Segmentator 分段器",
    description: "在互斥选项间切换，带滑动指示器动画。",
    prose:
      "支持 nested / tiled 模式与 allRound。开启 equalWidth 时分组占满容器宽度，各选项均分宽度。移动端横向拖拽会在松手后吸附到最近选项，并提供按压反馈。编辑器内可编写含 useState 的示例代码。",
  },
  Pagination: {
    title: "Pagination 分页",
    description: "Figma Structure Navigation → Pagination。",
    prose: "受控页码切换，可选跳转输入。",
  },
  // Standalone DocPageHeader pages
  Alert: {
    title: "Alert 提示",
    description: "Figma Response And Feedback → Alert。用于页面级或区块级状态提示。",
    prose: "支持 info、warning、error、success、neutral 等类型，以及 default / light 外观与可选操作区。",
  },
  Feedback: {
    title: "Feedback 反馈",
    description: "Figma Response And Feedback → Feedback。用于轻量 inline 反馈条。",
    prose: "用于短时状态反馈，支持 information / warning / wrong / success / normal 与 default / primary 模式。",
  },
  Input: {
    title: "Input 输入框",
    description: "单行文本输入，支持 regular / big 尺寸。",
    prose: "可组合前后缀、清除与密码可见切换；与 FormField 搭配可展示标签与校验信息。",
  },
  Switch: {
    title: "Switch 开关",
    description: "Figma Basic Input → Switch。用于二元状态切换。",
    prose: "受控或非受控开关，支持 disabled 与尺寸变体。",
  },
  Link: {
    title: "Link 链接",
    description: "Figma Basic Input → Link。用于导航或内联操作链接。",
    prose: "支持多种强调级别与图标组合，可用于页面跳转或触发操作。",
  },
  Select: {
    title: "Select 选择器",
    description: "下拉选择，支持分组、多种 item 功能变体（radio、form-radio 等）。",
    prose: "基于 Radix Select，支持占位、禁用、分组与自定义触发器内容。",
  },
  TimePickerField: {
    title: "TimePicker 时间选择",
    description: "Figma Information Collect → TimePicker。仅选择小时与分钟，采用滚轮交互。",
    prose: "表单字段封装与组合式 API 均可；滚轮停止后吸附到最近选项。",
  },
  Textarea: {
    title: "Textarea 多行输入",
    description: "Figma Information Collect → Textarea。用于多行文本采集。",
    prose: "支持尺寸、禁用与占位；可与 FormField 组合展示标签与描述。",
  },
  NumberInput: {
    title: "NumberInput 数字输入",
    description: "Figma Information Collect → NumberInput。用于采集数值，可选步进控件。",
    prose: "支持步进加减、禁用与尺寸；可限制最小/最大值。",
  },
  Checkbox: {
    title: "Checkbox 复选框",
    description: "Figma Information Collect → Checkbox。用于多选或布尔开关。",
    prose: "支持单独复选与 CheckboxGroup；可选中间态。",
  },
  RadioGroup: {
    title: "RadioGroup 单选组",
    description: "Figma Information Collect → Radio。用于互斥选项选择。",
    prose: "一组互斥单选项，支持水平 / 垂直排列与禁用。",
  },
  ColorPicker: {
    title: "ColorPicker 颜色选择",
    description: "Figma Information Collect → ColorPicker。用于颜色选取与预设管理。",
    prose: "支持色板、输入与预设色；可作表单字段或面板组合使用。",
  },
  List: {
    title: "List 列表",
    description: "Figma Structure Navigation → List。用于设置项或表单分组列表。",
    prose: "列表项可带图标、描述与尾部操作；适合设置页与选择列表。",
  },
  Typography: {
    title: "Typography 排版",
    description: "Figma System Composition → Typography。用于语义化文字层级。",
    prose: "按 level 映射标题与正文样式，可切换语义标签与语气。",
  },
  FormField: {
    title: "FormField 表单字段",
    description: "Figma System Composition → FormField。用于标签、描述与控件组合。",
    prose: "将 Label、描述、校验与控件排成纵向或横向表单字段。",
  },
  Anchor: {
    title: "Anchor 锚点",
    description: "Figma System Composition → Anchor。用于页面内章节导航。",
    prose: "根据标题生成页面内锚点目录，支持缩进层级。",
  },
  Loading: {
    title: "Loading 加载",
    description: "Figma System Composition → Loading Icon。用于加载状态指示。",
    prose: "多种尺寸与模式的加载指示，可用于按钮内或独立展示。",
  },
};

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

function writeRev(component, meta) {
  const dir = path.join(revisionsRoot, component);
  const file = path.join(dir, "2.0.0.ts");
  if (existsSync(file)) {
    console.log(`skip ${component}/2.0.0.ts`);
    return false;
  }
  mkdirSync(dir, { recursive: true });
  const prose =
    meta.prose.length > 60
      ? `prose:\n    \`${esc(meta.prose)}\`,`
      : `prose: "${meta.prose.replace(/"/g, '\\"')}",`;
  writeFileSync(
    file,
    `import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  revision: "2.0.0",
  title: "${meta.title.replace(/"/g, '\\"')}",
  description: "${meta.description.replace(/"/g, '\\"')}",
  ${prose}
};

export default revision;
`,
  );
  console.log(`wrote ${component}/2.0.0.ts`);
  return true;
}

// Pull DocShell blocks from RemainingComponentsDocPages
const remaining = readFileSync(path.join(pagesDir, "RemainingComponentsDocPages.tsx"), "utf8");
const shellRe =
  /<DocShell\s+title="([^"]+)"\s+description="([^"]+)"\s+prose="([^"]+)"\s+componentKey="([^"]+)"/g;
let match;
while ((match = shellRe.exec(remaining))) {
  const [, title, description, prose, componentKey] = match;
  // Prefer explicit early baseline for Pagination; otherwise fill gaps
  if (componentKey === "Pagination") continue;
  if (!metas[componentKey]) {
    metas[componentKey] = { title, description, prose };
  }
}

// ComponentDocView fallbacks from dedicated pages
for (const name of [
  "DatePickerDocPage.tsx",
  "CascaderDocPage.tsx",
  "ModalDocPage.tsx",
  "TypefaceDocPage.tsx",
]) {
  const text = readFileSync(path.join(pagesDir, name), "utf8");
  const component = text.match(/component="([^"]+)"/)?.[1];
  if (!component || metas[component] || existsSync(path.join(revisionsRoot, component, "2.0.0.ts"))) {
    continue;
  }
  const title = text.match(/title:\s*"([^"]+)"/)?.[1];
  const description = text.match(/description:\s*"([^"]+)"/)?.[1];
  const prose = text.match(/prose:\s*"([^"]+)"/)?.[1];
  if (title && description && prose) {
    metas[component] = { title, description, prose };
  }
}

let created = 0;
for (const [name, meta] of Object.entries(metas)) {
  if (writeRev(name, meta)) created += 1;
}

console.log(`created=${created}`);
