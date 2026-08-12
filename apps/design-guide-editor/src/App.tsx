import {
  Button,
  Loading,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeaderText,
  Typography,
} from "@aviala-design/spiral";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DesignGuideEditor } from "@spiral-docs/components/DesignGuideEditor";
import type { DesignGuideDoc } from "@spiral-docs/doc-revisions/types";
import {
  emptyPublishedDesignGuide,
  formatDesignGuideModule,
} from "@spiral-docs/lib/design-guide-serialize";
import { buildEditorDemoScope } from "./lib/editor-scope";
import {
  designGuideRelPath,
  fetchDesignGuideText,
  putDesignGuideText,
} from "./lib/revisions-api";
import { extractDesignGuide } from "./lib/revision-design-guide";

function readQuery(): { component: string } {
  const params = new URLSearchParams(window.location.search);
  return {
    component: params.get("component")?.trim() || "FormField",
  };
}

function docsPreviewUrl(): string {
  const origin =
    import.meta.env.VITE_DOCS_PREVIEW_ORIGIN?.replace(/\/$/, "") ||
    "http://localhost:5175";
  return `${origin}/docs/`;
}

function LoadingModal({ open, fileLabel }: { open: boolean; fileLabel: string }) {
  return (
    <Modal open={open} onOpenChange={() => {}}>
      <ModalContent
        size="default"
        className="docs-dge-loading-modal"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <ModalHeaderText
          title="正在打开设计指南"
          description={fileLabel}
          showClose={false}
        />
        <ModalBody className="docs-dge-loading-modal__body">
          <Loading level="display" mode="theme" label="加载中" />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export function App() {
  const { component } = useMemo(() => readQuery(), []);
  const scope = useMemo(() => buildEditorDemoScope(), []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guide, setGuide] = useState<DesignGuideDoc | null>(null);
  const [saveHint, setSaveHint] = useState<string | null>(null);
  const [editorKey, setEditorKey] = useState(0);

  const fileLabel = designGuideRelPath(component);

  const loadFile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const text = await fetchDesignGuideText(component);
      const extracted = text ? extractDesignGuide(text) : null;
      setGuide(extracted ?? emptyPublishedDesignGuide());
      setEditorKey((k) => k + 1);
    } catch (err) {
      setGuide(null);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [component]);

  useEffect(() => {
    void loadFile();
  }, [loadFile]);

  const handleSave = async (next: DesignGuideDoc) => {
    const updated = formatDesignGuideModule(next);
    await putDesignGuideText(component, updated);
    setGuide(next);
    setSaveHint("已保存到本地文件");
    window.setTimeout(() => setSaveHint(null), 2500);
  };

  if (error || (!guide && !loading)) {
    return (
      <div className="docs-dge-gate">
        <Typography level="title">设计指南编辑器</Typography>
        <Typography level="text">
          目标文件：
          <code>apps/spiral-docs/src/doc-revisions/{fileLabel}</code>
        </Typography>
        {error ? (
          <Typography level="text" className="docs-dge-gate__error">
            {error}
          </Typography>
        ) : null}
        <div className="docs-dge-gate__actions">
          <Button mode="primary" onClick={() => void loadFile()}>
            重试
          </Button>
          <Button mode="defaultCustom" onClick={() => window.open(docsPreviewUrl(), "_blank")}>
            打开 docs 预览
          </Button>
        </div>
        <LoadingModal open={loading} fileLabel={fileLabel} />
      </div>
    );
  }

  return (
    <div className="docs-dge-shell">
      {guide ? (
        <DesignGuideEditor
          key={editorKey}
          component={component}
          repositoryGuide={guide}
          scope={scope}
          fileLabel={fileLabel}
          externalSaveHint={saveHint}
          onSave={handleSave}
          onReloadFromDisk={() => void loadFile()}
          onOpenDocs={() => window.open(docsPreviewUrl(), "_blank")}
        />
      ) : null}
      <LoadingModal open={loading} fileLabel={fileLabel} />
    </div>
  );
}
