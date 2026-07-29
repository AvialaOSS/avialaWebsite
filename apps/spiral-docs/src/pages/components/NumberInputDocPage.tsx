import { NumberInput, Typography } from "@aviala-design/spiral";

import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import { DocPageHeader } from "../../components/TableOfContents";
import {
  buildNumberInputCode,
  numberInputKnobs,
  numberInputLiveCode,
} from "../../demos/component-demos";
import { getComponentProps } from "../../props-registry";

const numberInputScope = { NumberInput };

export function NumberInputDocPage() {
  const doc = getComponentProps("NumberInput");

  return (
    <>
      <DocPageHeader
        title="NumberInput 数字输入"
        description="Figma Information Collect → NumberInput。用于采集数值，可选步进控件。"
      />
      <div className="docs-prose">
        <Typography level="text" as="p">
          复用 Input 外壳（尺寸、圆角、图标、error / disabled），并提供上下步进按钮、
          <code>min</code> / <code>max</code> / <code>step</code>
          约束。样式可选 Default 与 Monospaced（等宽数字排版）。
        </Typography>
      </div>
      <DemoBlock
        initialCode={numberInputLiveCode}
        scope={numberInputScope}
        knobs={numberInputKnobs}
        buildCode={buildNumberInputCode}
      />
      {doc ? <PropsTable props={doc.props} /> : null}
    </>
  );
}
