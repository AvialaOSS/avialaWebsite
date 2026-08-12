import { defaultLiveDemoCode } from "./component-live-api";

export type DesignGuideDemoTemplate = {
  id: string;
  label: string;
  code: string;
  caption?: string;
  verdict?: "good" | "bad";
  align?: "start" | "center" | "end";
};

const genericPlaceholder: DesignGuideDemoTemplate = {
  id: "placeholder",
  label: "占位预览",
  caption: "占位预览",
  code: `render(
  <div>Replace with a scoped component</div>
);`,
};

/** Hand-authored do/don't (and similar) presets per DocPage `component` id. */
const byComponent: Record<string, DesignGuideDemoTemplate[]> = {
  FormField: [
    {
      id: "formfield-anatomy",
      label: "完整字段",
      caption: "一个完整字段",
      code: `render(
  <FormField
    label="邮箱"
    required
    description="用于登录与通知"
    info="不会在个人主页公开"
    className="max-w-sm"
  >
    <Input placeholder="you@aviala.top" />
  </FormField>
);`,
    },
    {
      id: "formfield-required",
      label: "必填字段",
      caption: "星号跟在标签后面",
      verdict: "good",
      code: `render(
  <FormField label="用户名" required className="max-w-sm">
    <Input placeholder="aviala" />
  </FormField>
);`,
    },
    {
      id: "formfield-error",
      label: "校验失败",
      caption: "告诉人怎么改",
      verdict: "good",
      code: `render(
  <FormField
    label="邮箱"
    required
    error="请输入有效邮箱，例如 you@aviala.top"
    className="max-w-sm"
  >
    <Input defaultValue="not-an-email" />
  </FormField>
);`,
    },
    {
      id: "formfield-disabled",
      label: "禁用字段",
      caption: "灰掉，并写明原因",
      code: `render(
  <FormField
    label="账号 ID"
    description="由系统分配，不可修改"
    className="max-w-sm"
  >
    <Input defaultValue="u_1024" disabled />
  </FormField>
);`,
    },
    {
      id: "formfield-group",
      label: "分组与操作",
      caption: "一组字段，保存在左",
      code: `render(
  <Fieldset
    title="账号信息"
    description="登录时用到"
    className="max-w-sm"
    actions={
      <>
        <Button mode="primary">保存</Button>
        <Button mode="second">取消</Button>
      </>
    }
  >
    <FormField label="用户名" required>
      <Input placeholder="aviala" />
    </FormField>
    <FormField label="邮箱" required>
      <Input placeholder="you@aviala.top" />
    </FormField>
  </Fieldset>
);`,
    },
  ],
  Button: [
    {
      id: "button-primary",
      label: "主操作",
      caption: "一页一个主按钮",
      verdict: "good",
      code: `render(
  <Button mode="primary">保存</Button>
);`,
    },
    {
      id: "button-second",
      label: "次要操作",
      caption: "次要用 second / default",
      verdict: "good",
      code: `render(
  <Button mode="second">取消</Button>
);`,
    },
    {
      id: "button-primary-misuse",
      label: "主按钮滥用",
      caption: "次要操作不要用 primary",
      verdict: "bad",
      code: `render(
  <Button mode="primary">取消</Button>
);`,
    },
  ],
  Input: [
    {
      id: "input-basic",
      label: "基础输入",
      caption: "清晰 placeholder",
      verdict: "good",
      code: `render(
  <Input placeholder="请输入内容" className="max-w-sm" />
);`,
    },
    {
      id: "input-disabled",
      label: "禁用",
      caption: "不可编辑态",
      code: `render(
  <Input placeholder="不可编辑" disabled className="max-w-sm" />
);`,
    },
  ],
  Textarea: [
    {
      id: "textarea-basic",
      label: "多行输入",
      caption: "适合较长文案",
      verdict: "good",
      code: `render(
  <Textarea placeholder="请输入说明" className="max-w-md" />
);`,
    },
  ],
  NumberInput: [
    {
      id: "number-basic",
      label: "数字输入",
      caption: "数量 / 金额等",
      verdict: "good",
      code: `render(
  <NumberInput defaultValue={1} className="max-w-xs" />
);`,
    },
  ],
  Switch: [
    {
      id: "switch-on",
      label: "开启",
      caption: "即时生效的开关",
      verdict: "good",
      code: `render(
  <Switch defaultChecked />
);`,
    },
    {
      id: "switch-off",
      label: "关闭",
      caption: "默认关闭",
      code: `render(
  <Switch />
);`,
    },
  ],
  Checkbox: [
    {
      id: "checkbox-basic",
      label: "勾选",
      caption: "多选协议 / 选项",
      verdict: "good",
      code: `render(
  <Checkbox defaultChecked>同意协议</Checkbox>
);`,
    },
  ],
  Link: [
    {
      id: "link-basic",
      label: "文字链接",
      caption: "行内跳转",
      verdict: "good",
      code: `render(
  <Link href="#">查看详情</Link>
);`,
    },
  ],
  Alert: [
    {
      id: "alert-info",
      label: "信息提示",
      caption: "页内说明",
      verdict: "good",
      code: `render(
  <Alert type="info" title="提示" description="补充说明写在这里。" />
);`,
    },
    {
      id: "alert-wrong",
      label: "错误提示",
      caption: "失败反馈",
      code: `render(
  <Alert type="wrong" title="无法保存" description="请检查必填项后重试。" />
);`,
    },
  ],
  Feedback: [
    {
      id: "feedback-info",
      label: "信息",
      caption: "轻量反馈",
      verdict: "good",
      code: `render(
  <Feedback type="information" title="已更新" description="设置已保存。" />
);`,
    },
  ],
  Loading: [
    {
      id: "loading-basic",
      label: "加载中",
      caption: "等待态",
      code: `render(
  <Loading />
);`,
    },
  ],
  Tag: [
    {
      id: "tag-basic",
      label: "标签",
      caption: "状态 / 分类",
      verdict: "good",
      code: `render(
  <Tag>标签</Tag>
);`,
    },
  ],
  Badge: [
    {
      id: "badge-basic",
      label: "徽标",
      caption: "状态标签",
      verdict: "good",
      code: `render(
  <Badge style="theme">Badge</Badge>
);`,
    },
  ],
  Typography: [
    {
      id: "typo-text",
      label: "正文",
      caption: "正文层级",
      verdict: "good",
      code: `render(
  <Typography level="text">正文示例</Typography>
);`,
    },
    {
      id: "typo-title",
      label: "标题",
      caption: "标题层级",
      code: `render(
  <Typography level="title">标题示例</Typography>
);`,
    },
  ],
  SegmentatorGroup: [
    {
      id: "seg-basic",
      label: "分段切换",
      caption: "少量互斥选项",
      verdict: "good",
      code: `render(
  <SegmentatorGroup defaultValue="a">
    <SegmentatorItem value="a">列表</SegmentatorItem>
    <SegmentatorItem value="b">卡片</SegmentatorItem>
  </SegmentatorGroup>
);`,
    },
  ],
  Progress: [
    {
      id: "progress-basic",
      label: "进度",
      caption: "完成度",
      code: `render(
  <Progress value={60} />
);`,
    },
  ],
  Slider: [
    {
      id: "slider-basic",
      label: "滑杆",
      caption: "连续取值",
      code: `render(
  <Slider defaultValue={[40]} className="max-w-sm" />
);`,
    },
  ],
};

export type DesignGuideTemplateOptions = {
  /** Current DocPage live demo source — offered as「开发指南默认示例」. */
  liveCode?: string;
};

/**
 * Templates for the layout editor insert menu.
 * Prefers the shared API live demo so every component has a default, then
 * curated do/don't presets.
 */
export function getDesignGuideTemplates(
  component: string,
  options?: DesignGuideTemplateOptions,
): DesignGuideDemoTemplate[] {
  const curated = byComponent[component] ? [...byComponent[component]!] : [];
  const apiLive = defaultLiveDemoCode(component)?.trim();
  const pageLive = options?.liveCode?.trim();
  const out: DesignGuideDemoTemplate[] = [];

  const pushUnique = (tpl: DesignGuideDemoTemplate) => {
    if (out.some((item) => item.code.trim() === tpl.code.trim())) return;
    out.push(tpl);
  };

  if (apiLive) {
    pushUnique({
      id: "api-default",
      label: "API 默认示例",
      caption: "API 默认示例",
      code: apiLive,
    });
  }
  if (pageLive) {
    pushUnique({
      id: "page-live",
      label: "开发指南默认示例",
      caption: "开发指南默认示例",
      code: pageLive,
    });
  }
  for (const tpl of curated) pushUnique(tpl);

  if (out.length > 0) return out;
  return [genericPlaceholder];
}
