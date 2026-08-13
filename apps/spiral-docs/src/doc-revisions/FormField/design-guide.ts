import type { DesignGuideDoc } from "../types";

const designGuide: DesignGuideDoc = {
  status: "draft",
  blocks: [
    {
      type: "prose",
      text: "# 什么是 FormField？\n\nFormField 把标签、说明和输入控件收成一个完整字段。设置页、注册登录、资料编辑里，只要字段语义要和控件一起出现，就用它，而不是单独摆一个 Input。",
    },
    {
      type: "prose",
      text: "## 字段结构",
    },
    {
      type: "row",
      columns: [
        {
          type: "demo",
          code: `
          
                    
                              render(
                                <FormField
                                  label="邮箱"
                                  required
                                  description="用于登录与通知"
                                  info="不会在个人主页公开"
                                  className="max-w-sm"
                                >
                                  <Input placeholder="you@aviala.top" />
                                </FormField>
                              );
                            
                  
        `,
          caption: "一个完整字段",
          height: 220,
          markers: [
            {
              id: "ff-label",
              selector: ".aviala-form__label",
              note: "字段标签 `label`。说明这个控件是什么。",
              anchor: "center-start",
              line: true,
            },
            {
              id: "ff-required",
              selector: ".aviala-form__required",
              note: "必填星号 `required`。标在标签旁，不要写进 placeholder。",
              anchor: "top-end",
              line: true,
            },
            {
              id: "ff-description",
              selector: ".aviala-typeface__line:nth-child(2)",
              note: "标签下的说明 `description`。放完成填写需要一直看见的信息。",
              anchor: "bottom-start",
              line: true,
            },
            {
              id: "ff-control",
              selector: ".aviala-input",
              note: "输入控件。FormField 只负责字段外壳，具体录入用 Input、Select 等。",
              anchor: "center-end",
              line: true,
            },
            {
              id: "ff-info",
              selector: ".aviala-form__message--info",
              note: "控件下方补充 `info`。弱提示，不挡住提交。",
              anchor: "bottom-start",
              line: true,
            },
          ],
          markersProse: { blockIndex: 2, columnIndex: 1 },
        },
        {
          type: "prose",
          text: "FormField 用这些 props 对应各块：\n\n<<<design-markers\n1. 字段标签 `label`。说明这个控件是什么。\n2. 必填星号 `required`。标在标签旁，不要写进 placeholder。\n3. 标签下的说明 `description`。放完成填写需要一直看见的信息。\n4. 输入控件。FormField 只负责字段外壳，具体录入用 Input、Select 等。\n5. 控件下方补充 `info`。弱提示，不挡住提交。\n>>>",
        },
      ],
    },
    {
      type: "prose",
      text: "## 标签位置\n\n默认 `direction=\"vertical\"`，标签在控件上方。更适用于长文案、本地化和窄屏场景。垂直空间紧时再用 `horizontal`，把标签放到侧面。",
    },
    {
      type: "row",
      columns: [
        {
          type: "demo",
          code: `
          
                    
                              render(
                                <FormField label="昵称" required className="max-w-sm">
                                  <Input placeholder="Aviala" />
                                </FormField>
                              );
                            
                  
        `,
          caption: "顶部标签（默认）",
          height: 160,
        },
        {
          type: "demo",
          code: `
          
                    
                              render(
                                <FormField label="昵称" required direction="horizontal" className="max-w-md">
                                  <Input placeholder="Aviala" />
                                </FormField>
                              );
                            
                  
        `,
          caption: "侧面标签（垂直空间紧时）",
          height: 160,
        },
      ],
    },
    {
      type: "prose",
      text: "## 必填与选填\n\n必填用 `required` 在标签旁标 `*`。选填字段不要标星；若整页几乎都是必填，只需标出少数选填项。不要把「必填」写进 placeholder——用户一开始输入，提示就没了。",
    },
    {
      type: "row",
      columns: [
        {
          type: "demo",
          code: `
          
                    
                              render(
                                <FormField label="用户名" required className="max-w-sm">
                                  <Input placeholder="aviala" />
                                </FormField>
                              );
                            
                  
        `,
          caption: "必填用 required",
          verdict: "good",
          height: 160,
        },
        {
          type: "demo",
          code: `
          
                    
                              render(
                                <FormField label="用户名" className="max-w-sm">
                                  <Input placeholder="必填" />
                                </FormField>
                              );
                            
                  
        `,
          caption: "不要把必填写进 placeholder",
          verdict: "bad",
          height: 160,
        },
      ],
    },
    {
      type: "prose",
      text: "## 控件宽度\n\n用宽度暗示该填多长、什么格式。验证码、邮编用短控件；邮箱、用户名用中等宽度；简介、地址再拉宽。不要所有字段都拉满一行。",
    },
    {
      type: "demo",
      code: `
      
            
                  render(
                    <div className="flex w-full max-w-lg flex-col gap-4">
                      <FormField label="验证码" required>
                        <Input className="w-24" placeholder="000000" />
                      </FormField>
                      <FormField label="邮箱" required>
                        <Input className="max-w-sm" placeholder="you@aviala.top" />
                      </FormField>
                    </div>
                  );
                
          
    `,
      caption: "短码用短框，邮箱用中等宽度",
      verdict: "good",
      height: 240,
    },
    {
      type: "prose",
      text: "## 禁用字段\n\n不能改的值仍应展示，但把控件设为 `disabled`，对比度降低，用户能看出不可编辑。说明为什么禁用，写在 `description`，不要只靠变灰。",
    },
    {
      type: "demo",
      code: `
      
            
                  render(
                    <FormField
                      label="账号 ID"
                      description="由系统分配，不可修改"
                      className="max-w-sm"
                    >
                      <Input defaultValue="u_1024" disabled />
                    </FormField>
                  );
                
          
    `,
      caption: "禁用控件 + 说明原因",
      height: 180,
    },
    {
      type: "prose",
      text: "## 提供帮助\n\n帮助可以放在三处，重要程度不同：\n\n- `description`：标签下，一直可见。重要说明放这里，尽量短、具体。\n- `info`：控件下，带信息图标。补充或弱提示，不挡住提交。\n- placeholder：框内示例。用户一开始输入就会消失，**不要放必填、格式规则等关键信息**；示例要匿名，无意义的占位可以去掉。",
    },
    {
      type: "row",
      columns: [
        {
          type: "demo",
          code: `
          
                    
                              render(
                                <FormField
                                  label="手机号"
                                  required
                                  description="用于接收验证码"
                                  className="max-w-sm"
                                >
                                  <Input placeholder="138 0000 0000" />
                                </FormField>
                              );
                            
                  
        `,
          caption: "规则放 description，框内只给示例",
          verdict: "good",
          height: 180,
        },
        {
          type: "demo",
          code: `
          
                    
                              render(
                                <FormField label="手机号" className="max-w-sm">
                                  <Input placeholder="必填，请输入 11 位手机号，用于接收验证码" />
                                </FormField>
                              );
                            
                  
        `,
          caption: "关键说明不要只放在 placeholder",
          verdict: "bad",
          height: 180,
        },
      ],
    },
    {
      type: "prose",
      text: "`info` 适合较长补充，或「知道也好、不看也能填」的内容。完成填写所必需的信息不要只藏在悬停提示里——FormField 也没有标签旁 tooltip，需要常显时用 `description`。",
    },
    {
      type: "demo",
      code: `
      
            
                  render(
                    <FormField
                      label="显示名"
                      description="其他人看到的名字"
                      info="之后仍可在设置里修改"
                      className="max-w-sm"
                    >
                      <Input placeholder="Aviala" />
                    </FormField>
                  );
                
          
    `,
      caption: "description 说用途，info 给弱提示",
      height: 220,
    },
    {
      type: "prose",
      text: "## 校验与报错\n\nFormField 只负责展示 `error`；何时写入由业务决定。按时机分：\n\n| 时机 | 适用 |\n| --- | --- |\n| 即时校验 | 键盘输入、值为英文或数字，停键后再查 |\n| 失焦校验 | 中文输入，或校验要打服务端、想减轻请求 |\n| 提交后校验 | 前两种做不了时，点提交再查 |\n\n按内容分：单值校验对一个字段；联合校验对一组相关字段（例如密码与确认密码）。\n\n字段值不对，把原因写在该字段的 `error` 上——下方 tip 会和控件描边一起出现。网络断开、服务端失败不要写进字段 `error`，用页面级提示。\n\n报错要短、说清原因、告诉怎么改。不要用「该字段值不合法」这种空话。不要一聚焦就校验空值，避免还没填就先挨骂。",
    },
    {
      type: "row",
      columns: [
        {
          type: "demo",
          code: `
          
                    
                              render(
                                <FormField
                                  label="邮箱"
                                  required
                                  error="请输入有效邮箱，例如 you@aviala.top"
                                  className="max-w-sm"
                                >
                                  <Input defaultValue="not-an-email" />
                                </FormField>
                              );
                            
                  
        `,
          caption: "说清原因和改法",
          verdict: "good",
          height: 200,
        },
        {
          type: "demo",
          code: `
          
                    
                              render(
                                <FormField label="邮箱" error="该字段值不合法" className="max-w-sm">
                                  <Input defaultValue="not-an-email" />
                                </FormField>
                              );
                            
                  
        `,
          caption: "空泛报错帮不上忙",
          verdict: "bad",
          height: 200,
        },
      ],
    },
    {
      type: "row",
      columns: [
        {
          type: "demo",
          code: `
          
                    
                              render(
                                <FormField
                                  label="邮箱"
                                  required
                                  description="用于登录与通知"
                                  className="max-w-sm"
                                >
                                  <Input />
                                </FormField>
                              );
                            
                  
        `,
          caption: "空字段先给说明，不要先报错",
          verdict: "good",
          height: 180,
        },
        {
          type: "demo",
          code: `
          
                    
                              render(
                                <FormField label="邮箱" error="不能为空" className="max-w-sm">
                                  <Input />
                                </FormField>
                              );
                            
                  
        `,
          caption: "还没填就报错",
          verdict: "bad",
          height: 180,
        },
      ],
    },
    {
      type: "prose",
      text: "## 分组与表单操作\n\n字段多时，用 `Fieldset` 按主题分组，不要一长串平铺。组标题说这组是什么，不必重复每个字段的 label。\n\n对整份表单的操作放在组脚 `actions`：按钮左对齐，主操作在左、次操作在右。",
    },
    {
      type: "demo",
      code: `
      
            
                  render(
                    <Fieldset
                      title="账号信息"
                      description="登录相关字段放在一组"
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
                  );
                
          
    `,
      caption: "分组 + 主操作靠左",
      verdict: "good",
      height: 340,
    },
  ],
};

export default designGuide;
