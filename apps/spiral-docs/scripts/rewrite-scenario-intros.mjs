/**
 * One-shot: rewrite component description + prose to scenario-only Chinese.
 * Run: node apps/spiral-docs/scripts/rewrite-scenario-intros.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const srcRoot = path.resolve(dirname, "../src");

/** @type {Record<string, { description: string; prose: string }>} */
const COPY = {
  Alert: {
    description: "用于在页面或区块内提示重要状态，需要用户留意时。",
    prose: "适合成功、警告、错误等结果提示，以及需要附带简短说明或后续操作的场景。",
  },
  Anchor: {
    description: "用于长页面内的章节跳转与当前位置提示。",
    prose: "适合文档、帮助中心、设置长页等需要目录侧栏或页内导航的场景。",
  },
  Avatar: {
    description: "用于展示用户或对象的身份形象。",
    prose: "适合列表、评论、个人资料等需要快速辨认是谁的场景。",
  },
  Badge: {
    description: "用于在名称旁标注数量、状态或类别。",
    prose: "适合未读数、新消息、状态角标等需要一眼扫到的轻量标记。",
  },
  Breadcrumb: {
    description: "用于展示当前位置，并支持回到上级路径。",
    prose: "适合多层页面结构，帮助用户理解自己在哪、如何返回。",
  },
  Button: {
    description: "用于提交、确认、取消等需要用户主动触发的操作。",
    prose: "适合表单提交、对话框按钮、工具栏动作等点击完成任务的场景；空间很紧时可用更紧凑的排布。",
  },
  Card: {
    description: "用于把一组相关内容收成可浏览的信息块。",
    prose: "适合首页模块、设置分组、内容摘要等需要标题、正文与操作落在同一视觉区块的场景。",
  },
  CascaderField: {
    description: "用于从多级分类中逐级选出一个结果。",
    prose: "适合地区、类目、组织架构等选项本身有层级关系的选择场景。",
  },
  Checkbox: {
    description: "用于多选或勾选是否同意某项。",
    prose: "适合筛选项、权限勾选、同意条款等可同时选多项或单独开关的场景。",
  },
  ColorPicker: {
    description: "用于让用户挑选或调整颜色。",
    prose: "适合主题定制、标注颜色、设计类设置等需要精确选色的场景。",
  },
  DatePickerField: {
    description: "用于选择日期，或一段日期范围。",
    prose: "适合预约、筛选时间段、填写生日等与日历相关的录入场景；需要精确到时刻时也可一并选择。",
  },
  Feedback: {
    description: "用于在内容旁给出即时、轻量的反馈提示。",
    prose: "适合表单校验说明、操作结果旁注等不必打断整页流程的提示。",
  },
  FormField: {
    description: "用于把标签、说明与输入控件排成完整表单项。",
    prose: "适合设置页、注册登录、资料编辑等需要字段语义与控件一起出现的场景。",
  },
  Input: {
    description: "用于填写一行短文本。",
    prose: "适合姓名、标题、搜索词等单行信息的录入。",
  },
  Link: {
    description: "用于跳转页面或触发内联操作。",
    prose: "适合正文中的导航、次要操作入口等文字链接触达的场景。",
  },
  List: {
    description: "用于展示可点选或可配置的条目列表。",
    prose: "适合设置项、菜单列表、账户选项等一行一项、可继续操作的场景。",
  },
  Loading: {
    description: "用于表示内容或操作仍在进行中。",
    prose: "适合按钮提交中、区块加载中等需要让用户等待的短暂状态。",
  },
  Modal: {
    description: "用于需要用户确认或补充信息的阻断式对话。",
    prose: "适合删除确认、重要协议、必须填完才能继续的表单等不能被忽略的流程。",
  },
  Navigation: {
    description: "用于承载应用的主导航结构。",
    prose: "适合侧边栏、顶栏等需要在多个页面或模块间切换的场景。",
  },
  NumberInput: {
    description: "用于填写或微调数值。",
    prose: "适合数量、金额、比例等需要数字输入或步进调整的场景。",
  },
  Pagehead: {
    description: "用于页面顶部交代标题、上下文与主要操作。",
    prose: "适合详情页、列表页开头，把面包屑、说明和关键按钮收在页眉区域。",
  },
  Pagination: {
    description: "用于在大量数据中翻页浏览。",
    prose: "适合表格、搜索结果、内容列表等一屏装不下、需要按页查看的场景。",
  },
  Popover: {
    description: "用于在触发点旁展开一段临时面板。",
    prose: "适合筛选浮层、快捷菜单、补充说明等不必占满整页的内容。",
  },
  Progress: {
    description: "用于展示任务或流程完成到哪一步。",
    prose: "适合上传进度、加载百分比、流程完成度等需要看得见进展的场景。",
  },
  RadioGroup: {
    description: "用于在多个选项里只选一个。",
    prose: "适合支付方式、排序规则、互斥偏好等必须单选的场景。",
  },
  Scroll: {
    description: "用于在有限区域内滚动查看溢出内容。",
    prose: "适合侧栏、面板、长列表等容器高度固定但仍有更多内容的场景。",
  },
  ScrollPicker: {
    description: "用于通过滚轮点选离散选项。",
    prose: "适合时间、地区代码等选项较多、用滚轮比点选列表更顺手的场景。",
  },
  SegmentatorGroup: {
    description: "用于在少数互斥视图或模式间快速切换。",
    prose: "适合列表/卡片视图切换、筛选维度切换等选项不多、需要一眼切换的场景。",
  },
  Select: {
    description: "用于从预设列表中选出一项。",
    prose: "适合国家、状态、分类等选项固定、占用空间不宜过大的选择场景。",
  },
  Slider: {
    description: "用于在连续范围内拖动选定数值。",
    prose: "适合音量、亮度、价格区间等用拖动比键盘输入更直观的调节场景。",
  },
  Steps: {
    description: "用于展示多步骤流程当前走到哪。",
    prose: "适合注册向导、结账流程、配置向导等需要按阶段推进的场景。",
  },
  Switch: {
    description: "用于立即开关某项设置。",
    prose: "适合通知开关、功能启用等二元偏好，改完即生效的场景。",
  },
  Table: {
    description: "用于行列对照地浏览结构化数据。",
    prose: "适合订单、成员、日志等需要多字段对齐比较的数据场景。",
  },
  Tag: {
    description: "用于标记分类、属性或可移除的关键词。",
    prose: "适合筛选标签、人物标签、已选条件等需要成组展示并可去掉的场景。",
  },
  Textarea: {
    description: "用于填写多行较长文本。",
    prose: "适合备注、描述、反馈内容等需要换行书写的录入场景。",
  },
  TimePickerField: {
    description: "用于选择一天中的具体时刻。",
    prose: "适合预约时段、提醒时间等只关心时与分的场景。",
  },
  Tooltip: {
    description: "用于在悬停或聚焦时补充简短说明。",
    prose: "适合图标按钮、缩略文案等界面空间不够写全、又需要一点提示的场景。",
  },
  Typeface: {
    description: "用于把主标题与辅助说明排成一组文字。",
    prose: "适合卡片标题区、列表主副文案等需要固定层级搭配出现的场景。",
  },
  Typography: {
    description: "用于按语义层级展示标题与正文。",
    prose: "适合页面标题、段落、说明文字等需要统一阅读层级的排版场景。",
  },
  Upload: {
    description: "用于选择并上传本地文件。",
    prose: "适合头像、附件、导入数据等需要把文件交给系统的场景。",
  },
};

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith(".ts") || name.endsWith(".tsx")) out.push(full);
  }
  return out;
}

/** Replace description + prose string fields in a TS/TSX module. */
function patchFile(filePath, description, prose) {
  let src = readFileSync(filePath, "utf8");
  const before = src;

  src = src.replace(
    /(\bdescription\s*[:=]\s*)(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g,
    `$1${JSON.stringify(description)}`,
  );

  src = src.replace(
    /(\bprose\s*[:=]\s*)(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/gs,
    `$1${JSON.stringify(prose)}`,
  );

  if (src === before) return false;
  writeFileSync(filePath, src);
  return true;
}

function componentFromRevisionPath(filePath) {
  // .../doc-revisions/Button/2.1.0.ts
  const parts = filePath.split(path.sep);
  const i = parts.lastIndexOf("doc-revisions");
  return i >= 0 ? parts[i + 1] : null;
}

let revPatched = 0;
let pagePatched = 0;
const missing = new Set();

const revRoot = path.join(srcRoot, "doc-revisions");
for (const file of walk(revRoot)) {
  if (file.endsWith("types.ts") || file.endsWith("index.ts")) continue;
  const component = componentFromRevisionPath(file);
  const copy = component ? COPY[component] : null;
  if (!copy) {
    if (component) missing.add(component);
    continue;
  }
  if (patchFile(file, copy.description, copy.prose)) revPatched += 1;
}

const pagesDir = path.join(srcRoot, "pages", "components");
for (const file of walk(pagesDir)) {
  let src = readFileSync(file, "utf8");
  const before = src;

  // Patch each DocShell within a single self-closing block.
  if (path.basename(file) === "RemainingComponentsDocPages.tsx") {
    src = src.replace(/<DocShell[\s\S]*?\/>/g, (block) => {
      const m = block.match(/componentKey="([^"]+)"/);
      if (!m) return block;
      const copy = COPY[m[1]];
      if (!copy) return block;
      return block
        .replace(/description="[^"]*"/, `description=${JSON.stringify(copy.description)}`)
        .replace(/prose="[^"]*"/, `prose=${JSON.stringify(copy.prose)}`);
    });
  } else {
    // Dedicated DocPage: map filename → component
    const base = path.basename(file);
    const map = {
      "AlertDocPage.tsx": "Alert",
      "AnchorDocPage.tsx": "Anchor",
      "ButtonDocPage.tsx": "Button",
      "CascaderDocPage.tsx": "CascaderField",
      "CheckboxDocPage.tsx": "Checkbox",
      "ColorPickerDocPage.tsx": "ColorPicker",
      "DatePickerDocPage.tsx": "DatePickerField",
      "FeedbackDocPage.tsx": "Feedback",
      "FormFieldDocPage.tsx": "FormField",
      "InputDocPage.tsx": "Input",
      "LinkDocPage.tsx": "Link",
      "ListDocPage.tsx": "List",
      "LoadingDocPage.tsx": "Loading",
      "ModalDocPage.tsx": "Modal",
      "NavigationDocPage.tsx": "Navigation",
      "NumberInputDocPage.tsx": "NumberInput",
      "PopoverDocPage.tsx": "Popover",
      "RadioDocPage.tsx": "RadioGroup",
      "SegmentatorDocPage.tsx": "SegmentatorGroup",
      "SelectDocPage.tsx": "Select",
      "SwitchDocPage.tsx": "Switch",
      "TextareaDocPage.tsx": "Textarea",
      "TimePickerDocPage.tsx": "TimePickerField",
      "TooltipDocPage.tsx": "Tooltip",
      "TypefaceDocPage.tsx": "Typeface",
      "TypographyDocPage.tsx": "Typography",
    };
    const component = map[base];
    const copy = component ? COPY[component] : null;
    if (copy && patchFile(file, copy.description, copy.prose)) {
      pagePatched += 1;
      continue;
    }
  }

  if (src !== before) {
    writeFileSync(file, src);
    pagePatched += 1;
  }
}

console.log(`Patched ${revPatched} revision files, ${pagePatched} page files.`);
if (missing.size) console.warn("Missing COPY for:", [...missing].sort().join(", "));
