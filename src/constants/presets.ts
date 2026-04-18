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
    width: 1276,
    height: 2031,
    printLabel: "108×172mm @300dpi",
  },
  {
    label: "Compact",
    value: "compact",
    width: 1110,
    height: 1772,
    printLabel: "94×150mm @300dpi",
  },
  {
    label: "Large",
    value: "large",
    width: 1594,
    height: 2528,
    printLabel: "135×214mm @300dpi",
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
  shadowLift?: number  // 0-60: lifts blacks to warm brownish gray
}

export const FILTER_PRESETS: FilterPreset[] = [
  {
    // No effect
    label: "Original",
    value: "original",
  },
  {
    // Kodak Portra 400 — shadow lift, warm muted tones, fine grain — iconic wedding film
    label: "Portra",
    value: "portra",
    cssFilter: "brightness(1.02) contrast(0.84) saturate(0.80)",
    shadowLift: 28,
    warmShift: 18,
    grain: 12,
    vignette: 32,
  },
  {
    // Polaroid 600 — warm overexposed glow, soft contrast, slight grain
    label: "600",
    value: "p600",
    cssFilter: "brightness(1.08) contrast(0.88) saturate(0.85)",
    warmShift: 32,
    grain: 14,
    fade: 8,
    vignette: 30,
  },
  {
    // Polaroid SX-70 — dreamy warm fade, low contrast, artistic blur feel
    label: "SX-70",
    value: "sx70",
    cssFilter: "brightness(1.06) contrast(0.80) saturate(0.75)",
    warmShift: 22,
    fade: 20,
    grain: 10,
    vignette: 50,
  },
  {
    // Polaroid Now — modern clean look, slight warmth, punchy enough for portraits
    label: "Now",
    value: "now",
    cssFilter: "brightness(1.03) contrast(1.06) saturate(1.12)",
    warmShift: 14,
    grain: 6,
    vignette: 28,
  },
  {
    // Polaroid Go — vivid saturated look, high contrast, party/outdoor feel
    label: "Go",
    value: "go",
    cssFilter: "brightness(0.97) contrast(1.20) saturate(1.38)",
    warmShift: 8,
    grain: 8,
    vignette: 42,
  },
  {
    // Polaroid B&W 600 — classic monochrome with strong grain and vignette
    label: "B&W",
    value: "bw",
    cssFilter: "grayscale(1) brightness(1.06) contrast(1.18)",
    grain: 22,
    vignette: 45,
  },
  {
    // Aged / expired film — heavy sepia cast, faded, nostalgic
    label: "Aged",
    value: "aged",
    cssFilter: "sepia(0.55) brightness(1.08) contrast(0.78) saturate(0.68)",
    warmShift: 38,
    fade: 24,
    grain: 20,
    vignette: 55,
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
