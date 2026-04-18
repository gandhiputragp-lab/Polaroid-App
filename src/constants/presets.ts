export interface SizePreset {
  label: string
  value: string
  width: number
  height: number
  printLabel: string
}

export const SIZE_PRESETS: SizePreset[] = [
  {
    label: "Instax Mini 2×",
    value: "instax",
    width: 432,
    height: 686,
    printLabel: "108×172mm",
  },
  {
    label: "Compact",
    value: "compact",
    width: 378,
    height: 600,
    printLabel: "94×150mm",
  },
  {
    label: "Large",
    value: "large",
    width: 540,
    height: 858,
    printLabel: "135×214mm",
  },
]

export interface FilterPreset {
  label: string
  value: string
  cssFilter?: string
  warmShift?: number
  fade?: number
  grain?: number
  vignette?: number
  saturate?: number
}

export const FILTER_PRESETS: FilterPreset[] = [
  {
    label: "Original",
    value: "original",
  },
  {
    label: "Vintage",
    value: "vintage",
    cssFilter: "sepia(0.4) contrast(0.92)",
    warmShift: 25,
    fade: 10,
  },
  {
    label: "Film",
    value: "film",
    saturate: -30,
    grain: 35,
    vignette: 65,
  },
  {
    label: "Fade",
    value: "fade",
    cssFilter: "brightness(1.1) saturate(0.65) contrast(0.85)",
    fade: 20,
  },
  {
    label: "Warm",
    value: "warm",
    cssFilter: "sepia(0.15) saturate(1.2)",
    warmShift: 15,
  },
  {
    label: "Cool",
    value: "cool",
    cssFilter: "hue-rotate(200deg) saturate(0.85)",
  },
  {
    label: "B&W",
    value: "bw",
    cssFilter: "grayscale(1) contrast(1.1)",
  },
]

export const FRAME_COLORS = [
  { label: "Putih", value: "#ffffff" },
  { label: "Krim", value: "#f9f6ee" },
  { label: "Hitam", value: "#111111" },
  { label: "Blush", value: "#fce4ec" },
]

export const CAPTION_FONTS = [
  { label: "Monospace", value: "monospace" },
  { label: "Tulisan Tangan", value: "caveat" },
  { label: "Sans-serif", value: "sans" },
]

export function getBorderSizes(width: number, height: number) {
  const sideBorder = Math.round(width * 0.08)
  const topBorder = sideBorder
  const bottomBorder = Math.round(height * 0.18)
  return { sideBorder, topBorder, bottomBorder }
}

export function getFontFamily(font: string): string {
  switch (font) {
    case "caveat":
      return "'Caveat', cursive"
    case "monospace":
      return "'Courier New', Courier, monospace"
    default:
      return "system-ui, -apple-system, sans-serif"
  }
}
