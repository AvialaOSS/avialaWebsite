import { neutral, palette } from "@aviala-design/color";
import { DEFAULT_PALETTE_CONFIG } from "@aviala-design/spiral";
import type { ColorFormat, PaletteItem, PaletteKind } from "../types";
import { SYSTEM_STEPS } from "../types";
import { ALD_SYSTEM_RAMPS } from "./aldRamps";

type GenerateOptions = {
  list?: boolean;
  dark?: boolean;
  steps?: number;
  format?: string;
  index?: number;
  meta?: boolean;
  curveGamma?: number;
  protectHueFamilies?: string[];
  protectHueStrength?: number;
  protectYellow?: boolean;
};

export type RampOptions = {
  kind?: PaletteKind;
  steps?: number;
  curveGamma?: number;
  protectHues?: boolean;
  protectHueStrength?: number;
  format?: ColorFormat;
};

function asStringList(value: string | string[] | object): string[] {
  if (Array.isArray(value)) {
    return value.map(String);
  }
  if (typeof value === "string") {
    return [value];
  }
  if (value && typeof value === "object" && "colors" in value) {
    const colors = (value as { colors?: unknown }).colors;
    if (Array.isArray(colors)) {
      return colors.map(String);
    }
  }
  return [];
}

function clampSteps(steps: number | undefined): number {
  const n = Number(steps) || SYSTEM_STEPS;
  return Math.max(2, Math.min(24, Math.round(n)));
}

function clampGamma(gamma: number | undefined): number {
  const n = Number(gamma);
  if (!Number.isFinite(n)) return 1;
  return Math.max(0.1, Math.min(5, n));
}

function clampProtectStrength(strength: number | undefined): number {
  const n = Number(strength);
  if (!Number.isFinite(n)) return DEFAULT_PALETTE_CONFIG.protectHueStrength;
  return Math.max(0, Math.min(2, n));
}

/** Map UI toggle → @aviala-design/color generate options (no `protectHues` flag). */
function hueProtectionOptions(
  enabled: boolean,
  strength?: number,
): Pick<
  GenerateOptions,
  "protectHueFamilies" | "protectHueStrength" | "protectYellow"
> {
  if (!enabled) {
    return {
      protectHueFamilies: [],
      protectHueStrength: 0,
      protectYellow: false,
    };
  }
  return {
    protectHueFamilies: [...DEFAULT_PALETTE_CONFIG.protectHueFamilies],
    protectHueStrength: clampProtectStrength(
      strength ?? DEFAULT_PALETTE_CONFIG.protectHueStrength,
    ),
    protectYellow: true,
  };
}

export function generateRamps(
  color: string,
  formatOrOptions: ColorFormat | RampOptions = "hex",
  maybeOptions?: RampOptions,
): { light: string[]; dark: string[] } {
  const options: RampOptions =
    typeof formatOrOptions === "string"
      ? { format: formatOrOptions, ...maybeOptions }
      : formatOrOptions;

  const format = options.format ?? "hex";
  const steps = clampSteps(options.steps);
  const curveGamma = clampGamma(options.curveGamma);
  const protectHues = options.protectHues ?? true;
  const kind = options.kind ?? "color";

  if (kind === "neutral") {
    const light = asStringList(
      neutral.generate("#ffffff", "#171717", {
        steps,
        format,
        curveGamma,
        includeEnds: true,
      }),
    );
    const dark = asStringList(
      neutral.generate("#0a0a0a", "#f5f3f3", {
        steps,
        format,
        curveGamma,
        includeEnds: true,
        mixColor: color,
        mixRatio: 0.08,
      }),
    );
    return { light, dark };
  }

  const shared = {
    list: true,
    steps,
    format,
    curveGamma,
    ...hueProtectionOptions(protectHues, options.protectHueStrength),
  } satisfies GenerateOptions;

  const light = asStringList(
    palette.generate(
      color,
      shared as unknown as Parameters<typeof palette.generate>[1],
    ),
  );
  const dark = asStringList(
    palette.generate(color, {
      ...shared,
      dark: true,
    } as unknown as Parameters<typeof palette.generate>[1]),
  );
  return { light, dark };
}

export function generateRampsForItem(
  item: Pick<
    PaletteItem,
    | "color"
    | "name"
    | "kind"
    | "steps"
    | "curveGamma"
    | "protectHues"
    | "protectHueStrength"
    | "useSystemConfig"
    | "useSystemName"
  >,
  format: ColorFormat = "hex",
): { light: string[]; dark: string[] } {
  if (item.useSystemConfig && item.useSystemName) {
    const key = item.name.trim().toLowerCase();
    const ald = ALD_SYSTEM_RAMPS[key];
    if (ald) {
      return { light: [...ald.light], dark: [...ald.dark] };
    }
  }

  return generateRamps(item.color, {
    format,
    kind: item.kind,
    steps: item.useSystemConfig ? SYSTEM_STEPS : item.steps,
    curveGamma: item.curveGamma,
    protectHues: item.protectHues,
    protectHueStrength: item.protectHueStrength,
  });
}

/** Format the seed/base color for the pill label (matches Figma). */
export function formatColorLabel(color: string, format: ColorFormat): string {
  if (format === "hex") {
    const hex = color.startsWith("#") ? color : `#${color}`;
    return hex.replace(/^#/, "").toUpperCase();
  }

  const formatted = asStringList(
    palette.generate(color, {
      list: true,
      steps: 1,
      format,
    } as unknown as Parameters<typeof palette.generate>[1]),
  )[0];

  return formatted ?? color;
}

export function relativeLuminance(color: string): number {
  const hex = color.trim();
  let r = 0;
  let g = 0;
  let b = 0;

  if (hex.startsWith("#")) {
    const raw = hex.slice(1);
    const full =
      raw.length === 3
        ? raw
            .split("")
            .map((c) => c + c)
            .join("")
        : raw.slice(0, 6);
    r = Number.parseInt(full.slice(0, 2), 16);
    g = Number.parseInt(full.slice(2, 4), 16);
    b = Number.parseInt(full.slice(4, 6), 16);
  } else {
    const match = hex.match(/(\d+(\.\d+)?)/g);
    if (match && match.length >= 3) {
      r = Number(match[0]);
      g = Number(match[1]);
      b = Number(match[2]);
    }
  }

  const toLinear = (c: number) => {
    const s = Math.min(Math.max(c > 1 ? c / 255 : c, 0), 1);
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function isLightSwatch(color: string): boolean {
  return relativeLuminance(color) > 0.45;
}

export function toCssVarName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildExportPayload(
  items: {
    name: string;
    caption: string;
    color: string;
    light: string[];
    dark: string[];
  }[],
  format: ColorFormat,
): { json: string; css: string } {
  const json = JSON.stringify(
    {
      format,
      palettes: items.map((item) => ({
        name: item.name,
        caption: item.caption,
        color: item.color,
        light: item.light,
        dark: item.dark,
      })),
    },
    null,
    2,
  );

  const cssLines = [":root {"];
  for (const item of items) {
    const base = toCssVarName(item.name) || "color";
    item.light.forEach((value, index) => {
      cssLines.push(`  --${base}-light-${index + 1}: ${value};`);
    });
    item.dark.forEach((value, index) => {
      cssLines.push(`  --${base}-dark-${index + 1}: ${value};`);
    });
  }
  cssLines.push("}");

  return { json, css: cssLines.join("\n") };
}

export function downloadText(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}
