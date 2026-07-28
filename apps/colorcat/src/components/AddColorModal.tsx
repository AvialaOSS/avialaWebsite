import { useEffect, useMemo, useState } from "react";
import {
  Button,
  ColorPicker,
  ColorPickerContent,
  ColorPickerTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Typeface,
  Typography,
} from "@aviala-design/spiral";
import { DirectionArrowDown, DirectionArrowUp, SymbolInformationCircle, SymbolWrong } from "@aviala-design/icons";
import {
  SegmentatorGroup,
  SegmentatorItem,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../spiral-extra";
import { CurveSlider } from "./CurveSlider";
import { ALD_SYSTEM_RAMPS } from "../lib/aldRamps";
import { generateRampsForItem, isLightSwatch } from "../lib/palette";
import {
  CURVE_GAMMA_MAX,
  CURVE_GAMMA_MIN,
  DEFAULT_CURVE_GAMMA,
  DEFAULT_PALETTE_DRAFT,
  DEFAULT_PROTECT_HUE_STRENGTH,
  PROTECT_HUE_STRENGTH_MAX,
  PROTECT_HUE_STRENGTH_MIN,
  SYSTEM_COLOR_NAMES,
  SYSTEM_NEUTRAL_NAMES,
  SYSTEM_STEPS,
  type ColorFormat,
  type PaletteItem,
  type PaletteKind,
} from "../types";

type AddColorModalProps = {
  open: boolean;
  editing: PaletteItem | null;
  isNew: boolean;
  format: ColorFormat;
  onOpenChange: (open: boolean) => void;
  onSave: (item: PaletteItem) => void;
};

function captionFor(kind: PaletteKind, useSystemName: boolean, name: string): string {
  if (kind === "neutral") return "中性色";
  if (useSystemName) {
    const map: Record<string, string> = {
      success: "表意色 成功",
      warning: "表意色 警告",
      error: "表意色 错误",
      info: "表意色 信息",
      primary: "主题色",
    };
    return map[name.toLowerCase()] ?? "系统色";
  }
  return "自定义色";
}

export function AddColorModal({
  open,
  editing,
  isNew,
  format,
  onOpenChange,
  onSave,
}: AddColorModalProps) {
  const [draft, setDraft] = useState<Omit<PaletteItem, "id">>(DEFAULT_PALETTE_DRAFT);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      const { id, ...rest } = editing;
      setEditId(id);
      setDraft(rest);
      return;
    }
    setEditId(null);
    setDraft({ ...DEFAULT_PALETTE_DRAFT });
  }, [open, editing]);

  const effectiveSteps = draft.useSystemConfig ? SYSTEM_STEPS : draft.steps;
  const preview = useMemo(
    () =>
      generateRampsForItem(
        {
          color: draft.color,
          name: draft.name,
          kind: draft.kind,
          steps: effectiveSteps,
          curveGamma: draft.curveGamma,
          protectHues: draft.protectHues,
          protectHueStrength: draft.protectHueStrength,
          useSystemConfig: draft.useSystemConfig,
          useSystemName: draft.useSystemName,
        },
        format,
      ),
    [
      draft.color,
      draft.name,
      draft.kind,
      draft.curveGamma,
      draft.protectHues,
      draft.protectHueStrength,
      draft.useSystemConfig,
      draft.useSystemName,
      effectiveSteps,
      format,
    ],
  );

  const systemNames =
    draft.kind === "neutral" ? SYSTEM_NEUTRAL_NAMES : SYSTEM_COLOR_NAMES;

  function patch(partial: Partial<Omit<PaletteItem, "id">>) {
    setDraft((prev) => ({ ...prev, ...partial }));
  }

  function handleKindChange(value: string) {
    const kind = value as PaletteKind;
    if (kind === "neutral") {
      patch({
        kind,
        useSystemName: draft.useSystemName,
        name: draft.useSystemName ? "neutral" : draft.name,
        color: draft.kind === "neutral" ? draft.color : "#8B8B8B",
        asTheme: false,
      });
      return;
    }
    patch({
      kind,
      name: draft.useSystemName ? "primary" : draft.name,
      color: draft.kind === "color" ? draft.color : "#FF5532",
    });
  }

  function toggleSystemName() {
    const next = !draft.useSystemName;
    if (next) {
      const fallback =
        draft.kind === "neutral"
          ? "neutral"
          : SYSTEM_COLOR_NAMES.some((item) => item.value === draft.name.toLowerCase())
            ? draft.name.toLowerCase()
            : "primary";
      const ald = ALD_SYSTEM_RAMPS[fallback];
      patch({
        useSystemName: true,
        name: fallback,
        color: ald?.seed ?? draft.color,
      });
      return;
    }
    patch({ useSystemName: false });
  }

  function selectSystemName(value: string) {
    const ald = ALD_SYSTEM_RAMPS[value];
    patch({
      name: value,
      color: ald?.seed ?? draft.color,
    });
  }

  function bumpSteps(delta: number) {
    if (draft.useSystemConfig) return;
    patch({ steps: Math.max(2, Math.min(24, draft.steps + delta)) });
  }

  function handleComplete() {
    const name = draft.name.trim() || (draft.kind === "neutral" ? "neutral" : "primary");
    const item: PaletteItem = {
      id: editId ?? `palette-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ...draft,
      name,
      caption: captionFor(draft.kind, draft.useSystemName, name),
      steps: effectiveSteps,
    };
    onSave(item);
    onOpenChange(false);
  }

  if (!open) return null;

  return (
    <div
      className="colorcat-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onOpenChange(false);
      }}
    >
      <div
        className="colorcat-modal"
        role="dialog"
        aria-modal="true"
        aria-label={isNew ? "添加颜色" : "编辑颜色"}
      >
        <div className="colorcat-modal-header">
          <Typography level="subtitle" as="h2">
            {isNew ? "添加颜色" : "编辑颜色"}
          </Typography>
          <Button
            mode="default"
            size="regular"
            iconOnly
            aria-label="关闭"
            leftIcon={<SymbolWrong thickness="Light" />}
            onClick={() => onOpenChange(false)}
          />
        </div>

        <div className="colorcat-modal-body">
          <SegmentatorGroup
            value={draft.kind}
            onValueChange={handleKindChange}
            className="colorcat-modal-tabs"
          >
            <SegmentatorItem value="color">彩色色卡</SegmentatorItem>
            <SegmentatorItem value="neutral">中性色卡</SegmentatorItem>
          </SegmentatorGroup>

          <div className="colorcat-modal-form">
            <div className="colorcat-field">
              <Typography level="text">名称</Typography>
              <div className="colorcat-name-row">
                {draft.useSystemName ? (
                  <Select
                    value={draft.name}
                    onValueChange={selectSystemName}
                  >
                    <SelectTrigger size="regular" className="colorcat-name-control">
                      <SelectValue placeholder="选择系统色卡名" />
                    </SelectTrigger>
                    <SelectContent>
                      {systemNames.map((option) => (
                        <SelectItem key={option.value} value={option.value} itemFunction="radio">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    className="colorcat-name-control"
                    value={draft.name}
                    onChange={(event) => patch({ name: event.target.value })}
                    placeholder="例如： primary"
                  />
                )}
                {draft.useSystemName ? (
                  <Button mode="default" size="regular" onClick={toggleSystemName}>
                    转为使用自定义名称
                  </Button>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button mode="default" size="regular" onClick={toggleSystemName}>
                          转为使用系统色卡名
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="colorcat-system-name-tooltip">
                        转为使用系统色卡名后，色卡可以自动绑定到 Aviala Design
                        的设计系统上，作为主题自由更换。如果需要让生成的色卡和 Aviala Design
                        系列产品配合使用，建议使用系统色卡名。
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>

            <div className="colorcat-switch-row">
              <Switch
                checked={draft.useSystemConfig}
                onCheckedChange={(checked: boolean) =>
                  patch({
                    useSystemConfig: checked,
                    steps: checked ? SYSTEM_STEPS : draft.steps,
                  })
                }
              />
              <Typeface
                content="textCaption"
                primary="使用系统色卡配置"
                secondary="启用后，将根据选定的 Aviala Design 设计系统色卡配置来配置生成的色阶数。"
              />
            </div>

            <div className="colorcat-field">
              <Typography level="text">基础色</Typography>
              <ColorPicker
                value={draft.color}
                onChange={(color) => patch({ color })}
                format={format}
              >
                <ColorPickerTrigger size="regular" className="colorcat-color-trigger" />
                <ColorPickerContent showEyedropper showPresets />
              </ColorPicker>
            </div>

            <div className="colorcat-field">
              <Typography level="text">色卡阶数</Typography>
              <div
                className={`colorcat-steps ${draft.useSystemConfig ? "is-disabled" : ""}`}
              >
                <input
                  type="number"
                  min={2}
                  max={24}
                  value={effectiveSteps}
                  disabled={draft.useSystemConfig}
                  onChange={(event) =>
                    patch({
                      steps: Math.max(
                        2,
                        Math.min(24, Number(event.target.value) || SYSTEM_STEPS),
                      ),
                    })
                  }
                  aria-label="色卡阶数"
                />
                <div className="colorcat-steps-buttons">
                  <button
                    type="button"
                    aria-label="增加阶数"
                    disabled={draft.useSystemConfig}
                    onClick={() => bumpSteps(1)}
                  >
                    <DirectionArrowUp thickness="Light" />
                  </button>
                  <button
                    type="button"
                    aria-label="减少阶数"
                    disabled={draft.useSystemConfig}
                    onClick={() => bumpSteps(-1)}
                  >
                    <DirectionArrowDown thickness="Light" />
                  </button>
                </div>
              </div>
            </div>

            <div className="colorcat-field">
              <div className="colorcat-field-head">
                <Typography level="text">色卡曲线</Typography>
                <Button
                  mode="noBackground"
                  size="small"
                  className="colorcat-restore"
                  onClick={() => patch({ curveGamma: DEFAULT_CURVE_GAMMA })}
                >
                  还原
                </Button>
              </div>
              <CurveSlider
                value={draft.curveGamma}
                min={CURVE_GAMMA_MIN}
                max={CURVE_GAMMA_MAX}
                onChange={(curveGamma) => patch({ curveGamma })}
              />
              <div className="colorcat-hint">
                <SymbolInformationCircle thickness="Light" />
                <Typography level="caption">
                  值越大，输出的色卡就越激进，相反，就越平均。
                </Typography>
              </div>
            </div>

            <div className="colorcat-field">
              <Typography level="text">其他设置项</Typography>
              <div className="colorcat-switch-stack">
                <div className="colorcat-switch-row">
                  <Switch
                    checked={draft.protectHues}
                    onCheckedChange={(checked: boolean) =>
                      patch({ protectHues: checked })
                    }
                  />
                  <Typeface
                    content="textCaption"
                    primary="自动色相保护"
                    secondary="按色相族对 tone / chroma 做平滑补偿，减少黄橙等颜色在中后段变脏、发灰或发土。"
                  />
                </div>
                {draft.protectHues && (
                  <div className="colorcat-strength">
                    <div className="colorcat-field-head">
                      <Typography level="caption">保护强度</Typography>
                      <div className="colorcat-strength-meta">
                        <Typography level="caption" content="number">
                          {draft.protectHueStrength.toFixed(1)}
                        </Typography>
                        <Button
                          mode="noBackground"
                          size="small"
                          className="colorcat-restore"
                          onClick={() =>
                            patch({
                              protectHueStrength: DEFAULT_PROTECT_HUE_STRENGTH,
                            })
                          }
                        >
                          还原
                        </Button>
                      </div>
                    </div>
                    <CurveSlider
                      value={draft.protectHueStrength}
                      min={PROTECT_HUE_STRENGTH_MIN}
                      max={PROTECT_HUE_STRENGTH_MAX}
                      step={0.1}
                      aria-label="色相保护强度"
                      onChange={(protectHueStrength) =>
                        patch({ protectHueStrength })
                      }
                    />
                  </div>
                )}
                {draft.kind === "color" && (
                  <div className="colorcat-switch-row">
                    <Switch
                      checked={draft.asTheme}
                      onCheckedChange={(checked: boolean) =>
                        patch({ asTheme: checked })
                      }
                    />
                    <Typeface
                      content="textCaption"
                      primary="作为主题色"
                      secondary="勾选后，颜色将作为主题色，允许被混入。"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="colorcat-preview">
            <PreviewRow primary="Light" secondary="亮色模式" colors={preview.light} />
            <PreviewRow primary="Dark" secondary="暗色模式" colors={preview.dark} />
          </div>
        </div>

        <div className="colorcat-modal-footer">
          <Button mode="second" size="regular" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button mode="primary" size="regular" onClick={handleComplete}>
            完成
          </Button>
        </div>
      </div>
    </div>
  );
}

function PreviewRow({
  primary,
  secondary,
  colors,
}: {
  primary: string;
  secondary: string;
  colors: string[];
}) {
  return (
    <div className="colorcat-preview-row">
      <Typeface content="textCaption" primary={primary} secondary={secondary} />
      <div
        className="colorcat-preview-swatches"
        style={{ gridTemplateColumns: `repeat(${Math.max(colors.length, 1)}, minmax(0, 1fr))` }}
      >
        {colors.map((color, index) => {
          const light = isLightSwatch(color);
          return (
            <div
              key={`${primary}-${index}`}
              className="colorcat-preview-swatch"
              style={{ background: color }}
              title={color}
            >
              <span className={light ? "is-dark" : "is-light"}>{index + 1}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
