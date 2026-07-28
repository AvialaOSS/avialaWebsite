import { useMemo, useState } from "react";
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Typography } from "@aviala-design/spiral";
import { EditAddMore, GeneralDownload } from "@aviala-design/icons";
import { AddColorModal } from "./components/AddColorModal";
import { PaletteCard } from "./components/PaletteCard";
import {
  buildExportPayload,
  downloadText,
  generateRampsForItem,
} from "./lib/palette";
import {
  DEFAULT_PALETTES,
  FORMAT_OPTIONS,
  type ColorFormat,
  type PaletteItem,
} from "./types";

export function App() {
  const [format, setFormat] = useState<ColorFormat>("hex");
  const [palettes, setPalettes] = useState<PaletteItem[]>(DEFAULT_PALETTES);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const editing = useMemo(
    () => palettes.find((item) => item.id === editingId) ?? null,
    [editingId, palettes],
  );

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 1600);
  }

  function openEditor(item?: PaletteItem) {
    setEditingId(item ? item.id : "new");
    setEditorOpen(true);
  }

  function handleSave(item: PaletteItem) {
    setPalettes((prev) => {
      if (!prev.some((entry) => entry.id === item.id)) {
        return [...prev, item];
      }
      return prev.map((entry) => (entry.id === item.id ? item : entry));
    });
    // Keep ALD static theme intact — "作为主题色" is palette metadata only.
    showToast("已保存色板");
  }

  function removePalette(id: string) {
    setPalettes((prev) => prev.filter((item) => item.id !== id));
  }

  function handleExport() {
    const items = palettes.map((item) => {
      const ramps = generateRampsForItem(item, format);
      return {
        name: item.name,
        caption: item.caption,
        color: item.color,
        light: ramps.light,
        dark: ramps.dark,
      };
    });
    const { json, css } = buildExportPayload(items, format);
    downloadText("colorcat-palettes.json", json, "application/json");
    downloadText("colorcat-palettes.css", css, "text/css");
    showToast("已导出 JSON 与 CSS");
  }

  return (
    <div className="colorcat">
      <header className="colorcat-header">
        <div className="colorcat-header-inner">
          <Typography level="subtitle" as="h1" className="colorcat-title">
            ColorCat
          </Typography>
          <div className="colorcat-actions">
            <Select
              value={format}
              onValueChange={(value) => setFormat(value as ColorFormat)}
            >
              <SelectTrigger size="regular" className="colorcat-format">
                <SelectValue placeholder="HEX" />
              </SelectTrigger>
              <SelectContent>
                {FORMAT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} itemFunction="radio">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              mode="default"
              size="regular"
              iconOnly
              aria-label="导出色板"
              leftIcon={<GeneralDownload thickness="Light" />}
              onClick={handleExport}
            />
            <Button
              mode="primary"
              size="regular"
              leftIcon={<EditAddMore thickness="Light" mode="fill" />}
              onClick={() => openEditor()}
            >
              添加颜色
            </Button>
          </div>
        </div>
      </header>

      <div className="colorcat-body">
        <div className="colorcat-list">
          {palettes.map((item) => (
            <PaletteCard
              key={item.id}
              item={item}
              format={format}
              onEdit={() => openEditor(item)}
              onDelete={() => removePalette(item.id)}
              onCopied={() => showToast("已复制色值")}
            />
          ))}
        </div>
      </div>

      <AddColorModal
        open={editorOpen}
        editing={editingId === "new" ? null : editing}
        isNew={editingId === "new" || editingId === null}
        format={format}
        onOpenChange={(open) => {
          setEditorOpen(open);
          if (!open) setEditingId(null);
        }}
        onSave={handleSave}
      />

      {toast && <div className="colorcat-toast">{toast}</div>}
    </div>
  );
}
