import * as Spiral from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";

const examples = {
  Rate: {
    title: "Rate 评分",
    description: "星形或点赞评分，支持半选。",
    prose:
      "用 value/onValueChange 控制评分，或用 defaultValue 设置初始值。allowHalf 开启半选；readOnly 用于只读结果。RateIcon 用于独立状态图形。",
    code: 'render(<Rate defaultValue={2.5} allowHalf aria-label="评分" />);',
  },
  MultiSelect: {
    title: "MultiSelect 多选",
    description: "用标签展示多个选中项。",
    prose:
      "options 使用 value/label；value 与 onValueChange 控制选中值数组，也可使用 defaultValue。提供 name 时输出隐藏表单字段。原 Select 继续用于单选。",
    code: 'render(<MultiSelect aria-label="团队" defaultValue={["design"]} options={[{value:"design",label:"设计"},{value:"engineering",label:"开发"}]} />);',
  },
  ButtonGroup: {
    title: "ButtonGroup 按钮组",
    description: "组合相关操作与可选说明。",
    prose:
      "按钮作为 children 传入，description 为操作区说明。按钮本身继续使用 Button 的 mode、disabled 等属性。",
    code: 'render(<ButtonGroup description="保存后更新当前草稿"><Button mode="primary">保存</Button><Button mode="tertiary">取消</Button></ButtonGroup>);',
  },
  InputGroup: {
    title: "InputGroup 输入组",
    description: "组合输入框与附加内容。",
    prose:
      "InputGroup 管理排列方向，InputGroupItem 包裹一组输入内容，InputGroupAddon 用于前缀或后缀。仍需为 Input 提供可访问名称。",
    code: 'render(<InputGroup><InputGroupItem><InputGroupAddon>https://</InputGroupAddon><Input aria-label="域名" placeholder="example.com" /></InputGroupItem></InputGroup>);',
  },
};

export function NewComponentsDocPage({
  component,
}: {
  component: keyof typeof examples;
}) {
  const entry = examples[component];
  // Keep namespace interop exports (especially `default`) out of the evaluator's
  // function parameters. Optional lookup also supports older documentation builds.
  const exports = Spiral as unknown as Record<string, unknown>;
  const scope = Object.fromEntries(
    [
      "Rate", "RateIcon", "MultiSelect", "ButtonGroup", "Button",
      "InputGroup", "InputGroupItem", "InputGroupAddon", "Input",
    ].map((name) => [name, exports[name]])
  );
  if (!scope[component])
    return (
      <>
        <h1>{entry.title}</h1>
        <p>
          当前文档对应的组件包未提供此 API，请选择 Spiral 3.1.0 或更高版本。
        </p>
      </>
    );
  return (
    <ComponentDocView
      component={component}
      scope={scope}
      fallback={{
        ...entry,
        liveCode: entry.code,
        knobs: [],
        buildCode: () => entry.code,
      }}
    />
  );
}
