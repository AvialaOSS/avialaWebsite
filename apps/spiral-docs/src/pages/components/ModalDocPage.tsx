import { SymbolInformationCircle } from "@aviala-design/icons";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeaderText,
  ModalTrigger,
} from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import { buildModalCode, modalKnobs, modalLiveCode } from "../../demos/component-demos";

export function ModalDocPage() {
  return (
    <ComponentDocView
      component="Modal"
      scope={{
        Modal,
        ModalTrigger,
        ModalContent,
        ModalHeaderText,
        ModalBody,
        ModalFooter,
        Button,
        SymbolInformationCircle,
      }}
      fallback={{
        title: "Modal 模态框",
        description: "用于需要用户确认或补充信息的阻断式对话。",
        prose: "适合删除确认、重要协议、必须填完才能继续的表单等不能被忽略的流程。",
        liveCode: modalLiveCode,
        knobs: modalKnobs,
        buildCode: buildModalCode,
      }}
    />
  );
}
