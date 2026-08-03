import { Typeface } from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import {
  buildTypefaceCode,
  typefaceKnobs,
  typefaceLiveCode,
} from "../../demos/component-demos";

export function TypefaceDocPage() {
  return (
    <ComponentDocView
      component="Typeface"
      scope={{ Typeface }}
      fallback={{
        title: "Typeface 字体组合",
        description: "用于把主标题与辅助说明排成一组文字。",
        prose: "适合卡片标题区、列表主副文案等需要固定层级搭配出现的场景。",
        liveCode: typefaceLiveCode,
        knobs: typefaceKnobs,
        buildCode: buildTypefaceCode,
      }}
    />
  );
}
