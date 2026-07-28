import { useMemo, useState } from "react";
import { Button, Typeface, Typography } from "@aviala-design/spiral";
import { EditDrawEdit, GeneralDelete } from "@aviala-design/icons";
import {
  copyText,
  formatColorLabel,
  generateRampsForItem,
  isLightSwatch,
} from "../lib/palette";
import type { ColorFormat, PaletteItem } from "../types";

type PaletteCardProps = {
  item: PaletteItem;
  format: ColorFormat;
  onEdit: () => void;
  onDelete: () => void;
  onCopied: () => void;
};

export function PaletteCard({
  item,
  format,
  onEdit,
  onDelete,
  onCopied,
}: PaletteCardProps) {
  const ramps = useMemo(
    () => generateRampsForItem(item, format),
    [item, format],
  );
  const [confirmDelete, setConfirmDelete] = useState(false);
  const label = formatColorLabel(item.color, format);
  const previewTint = ramps.light[1] ?? "#f5f3f3";

  async function handleCopy(value: string) {
    const ok = await copyText(value);
    if (ok) {
      onCopied();
    }
  }

  return (
    <article className="palette-card">
      <div className="palette-card-header">
        <div className="palette-pill" title={item.color}>
          <span
            className="palette-pill-swatch"
            style={{ background: item.color }}
          />
          <span
            className="palette-pill-label"
            style={{ background: previewTint }}
          >
            <Typography level="caption" content="number">
              {label}
            </Typography>
          </span>
        </div>
        <Typeface
          className="palette-card-title"
          content="textCaption"
          primary={item.name}
          secondary={item.caption}
        />
        <div className="palette-card-actions">
          <Button
            mode="default"
            size="small"
            iconOnly
            aria-label={`编辑 ${item.name}`}
            leftIcon={<EditDrawEdit thickness="Light" />}
            onClick={onEdit}
          />
          {confirmDelete ? (
            <Button
              mode="destructive"
              size="small"
              onClick={() => {
                onDelete();
                setConfirmDelete(false);
              }}
            >
              确认删除
            </Button>
          ) : (
            <Button
              mode="default"
              size="small"
              iconOnly
              aria-label={`删除 ${item.name}`}
              leftIcon={<GeneralDelete thickness="Light" />}
              onClick={() => setConfirmDelete(true)}
              onBlur={() =>
                window.setTimeout(() => setConfirmDelete(false), 180)
              }
            />
          )}
        </div>
      </div>

      <SwatchRow
        primary="Light"
        secondary="亮色模式"
        colors={ramps.light}
        onCopy={handleCopy}
      />
      <SwatchRow
        primary="Dark"
        secondary="暗色模式"
        colors={ramps.dark}
        onCopy={handleCopy}
      />
    </article>
  );
}

function SwatchRow({
  primary,
  secondary,
  colors,
  onCopy,
}: {
  primary: string;
  secondary: string;
  colors: string[];
  onCopy: (value: string) => void;
}) {
  return (
    <div className="swatch-row">
      <Typeface
        content="textCaption"
        primary={primary}
        secondary={secondary}
        className="swatch-row-label"
      />
      <div
        className="swatch-row-list"
        style={{
          gridTemplateColumns: `repeat(${Math.max(colors.length, 1)}, minmax(0, 1fr))`,
        }}
      >
        {colors.map((color, index) => {
          const light = isLightSwatch(color);
          return (
            <button
              key={`${primary}-${index}`}
              type="button"
              className="swatch"
              style={{ background: color }}
              title={color}
              aria-label={`${secondary} ${index + 1}: ${color}`}
              onClick={() => onCopy(color)}
            >
              <span
                className={`swatch-index ${light ? "is-dark" : "is-light"}`}
              >
                {index + 1}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
