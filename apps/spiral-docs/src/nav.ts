export type NavItem = {
  label: string;
  path: string;
  component?: string;
};

export type NavSection = {
  section: string;
  items: NavItem[];
};

/** Sidebar IA — aligned with Aviala Design Components categories. */
export const nav: NavSection[] = [
  {
    section: "开始",
    items: [
      { label: "介绍", path: "/start/introduction" },
      { label: "安装", path: "/start/installation" },
      { label: "主题", path: "/start/theme" },
      { label: "国际化", path: "/start/locale" },
      { label: "更新记录", path: "/start/changelog" },
    ],
  },
  {
    section: "信息展示",
    items: [
      { label: "Avatar 头像", path: "/components/information-display/avatar", component: "Avatar" },
      { label: "Badge 徽章", path: "/components/information-display/badge", component: "Badge" },
      { label: "Modal 模态框", path: "/components/information-display/modal", component: "Modal" },
      { label: "Drawer 抽屉", path: "/components/information-display/drawer", component: "Drawer" },
      {
        label: "Popover 弹出层",
        path: "/components/information-display/popover",
        component: "Popover",
      },
      { label: "Table 表格", path: "/components/information-display/table", component: "Table" },
      { label: "Tag 标签", path: "/components/information-display/tag", component: "Tag" },
      {
        label: "Tooltip 工具提示",
        path: "/components/information-display/tooltip",
        component: "Tooltip",
      },
    ],
  },
  {
    section: "信息采集",
    items: [
      {
        label: "Cascader 级联选择",
        path: "/components/information-collect/cascader",
        component: "CascaderField",
      },
      {
        label: "Checkbox 复选框",
        path: "/components/information-collect/checkbox",
        component: "Checkbox",
      },
      {
        label: "ColorPicker 颜色选择",
        path: "/components/information-collect/color-picker",
        component: "ColorPicker",
      },
      {
        label: "DatePicker 日期选择",
        path: "/components/information-collect/date-picker",
        component: "DatePickerField",
      },
      {
        label: "FormField 表单字段",
        path: "/components/information-collect/form-field",
        component: "FormField",
      },
      { label: "Input 输入框", path: "/components/information-collect/input", component: "Input" },
      {
        label: "NumberInput 数字输入",
        path: "/components/information-collect/number-input",
        component: "NumberInput",
      },
      {
        label: "RadioGroup 单选组",
        path: "/components/information-collect/radio",
        component: "RadioGroup",
      },
      {
        label: "ScrollPicker 滚轮选择",
        path: "/components/information-collect/scroll-picker",
        component: "ScrollPicker",
      },
      { label: "Select 选择器", path: "/components/information-collect/select", component: "Select" },
      { label: "Slider 滑块", path: "/components/information-collect/slider", component: "Slider" },
      {
        label: "Textarea 多行输入",
        path: "/components/information-collect/textarea",
        component: "Textarea",
      },
      {
        label: "TimePicker 时间选择",
        path: "/components/information-collect/time-picker",
        component: "TimePickerField",
      },
      { label: "Upload 上传", path: "/components/information-collect/upload", component: "Upload" },
    ],
  },
  {
    section: "基础输入",
    items: [
      { label: "Button 按钮", path: "/components/basic-input/button", component: "Button" },
      { label: "Link 链接", path: "/components/basic-input/link", component: "Link" },
      {
        label: "Segmentator 分段器",
        path: "/components/basic-input/segmentator",
        component: "SegmentatorGroup",
      },
      { label: "Switch 开关", path: "/components/basic-input/switch", component: "Switch" },
    ],
  },
  {
    section: "响应与反馈",
    items: [
      { label: "Alert 提示", path: "/components/feedback/alert", component: "Alert" },
      { label: "Feedback 反馈", path: "/components/feedback/feedback", component: "Feedback" },
      { label: "Loading 加载", path: "/components/feedback/loading", component: "Loading" },
      { label: "Progress 进度", path: "/components/feedback/progress", component: "Progress" },
    ],
  },
  {
    section: "系统组合",
    items: [
      { label: "Icons 图标", path: "/components/system-composition/icons" },
      {
        label: "Typeface 字体组合",
        path: "/components/system-composition/typeface",
        component: "Typeface",
      },
      { label: "Scroll 滚动条", path: "/components/system-composition/scroll", component: "Scroll" },
      {
        label: "Typography 排版",
        path: "/components/system-composition/typography",
        component: "Typography",
      },
    ],
  },
  {
    section: "结构导航",
    items: [
      { label: "Anchor 锚点", path: "/components/structure-navigation/anchor", component: "Anchor" },
      {
        label: "Breadcrumb 面包屑",
        path: "/components/structure-navigation/breadcrumb",
        component: "Breadcrumb",
      },
      { label: "Card 卡片", path: "/components/structure-navigation/card", component: "Card" },
      { label: "List 列表", path: "/components/structure-navigation/list", component: "List" },
      {
        label: "Navigation 导航",
        path: "/components/structure-navigation/navigation",
        component: "Navigation",
      },
      {
        label: "Pagehead 页头",
        path: "/components/structure-navigation/pagehead",
        component: "Pagehead",
      },
      {
        label: "Pagination 分页",
        path: "/components/structure-navigation/pagination",
        component: "Pagination",
      },
      { label: "Steps 步骤条", path: "/components/structure-navigation/steps", component: "Steps" },
      { label: "Tab 标签页", path: "/components/structure-navigation/tab", component: "Tab" },
    ],
  },
];

let flatNavItemsCache: NavItem[] | null = null;
let navPathIndexCache: Map<string, number> | null = null;

export function flattenNavItems(): NavItem[] {
  if (!flatNavItemsCache) {
    flatNavItemsCache = nav.flatMap((section) => section.items);
  }
  return flatNavItemsCache;
}

/** O(1) nav order lookup for transition direction. */
export function getNavPathIndex(path: string): number {
  if (!navPathIndexCache) {
    navPathIndexCache = new Map(
      flattenNavItems().map((item, index) => [item.path, index]),
    );
  }
  return navPathIndexCache.get(path) ?? -1;
}

export function navPathToHref(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Keep the design-guide tab when moving between component pages.
 * Start / reference pages drop `guide` so the URL stays clean.
 */
export function docsNavSearch(toPath: string, currentSearch: string): string {
  if (!toPath.startsWith("/components/")) return "";
  const guide = new URLSearchParams(currentSearch).get("guide");
  return guide === "design" ? "?guide=design" : "";
}

/** O(1) lookup of a nav item by its path. */
export function getNavItemByPath(path: string): NavItem | undefined {
  return flattenNavItems().find((item) => item.path === path);
}
