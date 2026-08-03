import { Feedback } from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import { buildFeedbackCode, feedbackKnobs, feedbackLiveCode } from "../../demos/component-demos";

export function FeedbackDocPage() {
  return (
    <ComponentDocView
      component="Feedback"
      scope={{ Feedback }}
      fallback={{
        title: "Feedback 反馈",
        description: "用于在内容旁给出即时、轻量的反馈提示。",
        prose: "适合表单校验说明、操作结果旁注等不必打断整页流程的提示。",
        liveCode: feedbackLiveCode,
        knobs: feedbackKnobs,
        buildCode: buildFeedbackCode,
      }}
    />
  );
}
