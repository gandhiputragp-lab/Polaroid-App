import { useCallback } from "react"
import type { Adjustments } from "./useAdjustments"
import {
  SIZE_PRESETS,
  FILTER_PRESETS,
  getBorderSizes,
  getFontFamily,
} from "../constants/presets"

function buildCssFilter(adj: Adjustments): string {
  const filterPreset = FILTER_PRESETS.find((f) => f.value === adj.filter)
  const brightness = 1 + adj.brightness / 100
  const contrast = 1 + adj.contrast / 100
  const saturation = Math.max(0, 1 + adj.saturation / 100)

  const presetFilter = filterPreset?.cssFilter ?? ""

  const parts = [
    `brightness(${brightness.toFixed(2)})`,
    `contrast(${contrast.toFixed(2)})`,
    `saturate(${saturation.toFixed(2)})`,
    presetFilter,
  ].filter(Boolean)

  return parts.join(" ")
}

function applyWarmth(
  imageData: ImageData,
  warmth: number,
  extraWarm: number = 0
): void {
  const data = imageData.data
  const total = warmth + extraWarm
  if (total === 0) return
  const rShift = Math.round(total * 0.5)
  const bShift = -Math.round(total * 0.4)
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, data[i] + rShift))
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + bShift))
  }
}

function applyGrain(
  imageData: ImageData,
  amount: number,
  extraGrain: number = 0
): void {
  const data = imageData.data
  const total = amount + extraGrain
  if (total === 0) return
  const intensity = total * 1.5
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * intensity
    data[i] = Math.min(255, Math.max(0, data[i] + noise))
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise))
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise))
  }
}

function applyShadowLift(imageData: ImageData, amount: number): void {
  const data = imageData.data
  if (amount === 0) return
  // Map each channel: output = input * (255-amount)/255 + lift
  // Warm lift: R gets more, B gets less → brownish shadow tone
  const liftR = amount * 0.90
  const liftG = amount * 0.72
  const liftB = amount * 0.52
  const compress = (255 - amount) / 255
  for (let i = 0; i < data.length; i += 4) {
    data[i]     = Math.min(255, data[i]     * compress + liftR)
    data[i + 1] = Math.min(255, data[i + 1] * compress + liftG)
    data[i + 2] = Math.min(255, data[i + 2] * compress + liftB)
  }
}

function applyFrameGrain(imageData: ImageData, amount: number): void {
  const data = imageData.data
  if (amount === 0) return
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 15
    data[i] = Math.min(255, Math.max(0, data[i] + noise))
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise))
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise))
  }
}

export function usePolaroidRenderer() {
  const render = useCallback(
    (
      canvas: HTMLCanvasElement,
      image: HTMLImageElement | null,
      adj: Adjustments,
      scale: number = 1
    ) => {
      const preset = SIZE_PRESETS.find((p) => p.value === adj.preset) ?? SIZE_PRESETS[0]
      const isLandscape = image ? image.naturalWidth > image.naturalHeight : false
      const W = Math.round((isLandscape ? preset.height : preset.width) * scale)
      const H = Math.round((isLandscape ? preset.width : preset.height) * scale)

      canvas.width = W
      canvas.height = H

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const { sideBorder, topBorder, bottomBorder } = getBorderSizes(W, H)
      const photoX = sideBorder
      const photoY = topBorder
      const photoW = W - sideBorder * 2
      const photoH = H - topBorder - bottomBorder

      // Draw frame
      ctx.fillStyle = adj.frameColor
      ctx.fillRect(0, 0, W, H)

      if (adj.frameTexture) {
        const frameImg = ctx.getImageData(0, 0, W, H)
        applyFrameGrain(frameImg, 1)
        ctx.putImageData(frameImg, 0, 0)
      }

      if (image) {
        const filterPreset = FILTER_PRESETS.find((f) => f.value === adj.filter)

        // Offscreen canvas for photo manipulation
        const offscreen = document.createElement("canvas")
        offscreen.width = photoW
        offscreen.height = photoH
        const octx = offscreen.getContext("2d")
        if (!octx) return

        // Apply CSS filters
        octx.filter = buildCssFilter(adj)

        // Draw image with cover + crop offset
        const srcW = image.naturalWidth
        const srcH = image.naturalHeight

        const scaleX = photoW / srcW
        const scaleY = photoH / srcH
        const coverScale = Math.max(scaleX, scaleY)
        const drawW = srcW * coverScale
        const drawH = srcH * coverScale

        const offsetX = ((photoW - drawW) / 2) * (1 + adj.cropX / 50)
        const offsetY = ((photoH - drawH) / 2) * (1 + adj.cropY / 50)

        octx.drawImage(image, offsetX, offsetY, drawW, drawH)

        octx.filter = "none"

        // Pixel-level manipulation
        const imgData = octx.getImageData(0, 0, photoW, photoH)
        applyShadowLift(imgData, filterPreset?.shadowLift ?? 0)
        applyWarmth(imgData, adj.warmth, filterPreset?.warmShift ?? 0)
        applyGrain(imgData, adj.grain, filterPreset?.grain ?? 0)
        octx.putImageData(imgData, 0, 0)

        // Draw photo onto main canvas
        ctx.drawImage(offscreen, photoX, photoY)

        // Vignette
        const vigStrength = Math.max(
          adj.vignette,
          filterPreset?.vignette ?? 0
        )
        if (vigStrength > 0) {
          const cx = photoX + photoW / 2
          const cy = photoY + photoH / 2
          const radius = Math.sqrt(photoW ** 2 + photoH ** 2) / 2
          const gradient = ctx.createRadialGradient(cx, cy, radius * 0.4, cx, cy, radius)
          gradient.addColorStop(0, "rgba(0,0,0,0)")
          gradient.addColorStop(1, `rgba(0,0,0,${vigStrength / 150})`)
          ctx.fillStyle = gradient
          ctx.fillRect(photoX, photoY, photoW, photoH)
        }

        // Fade overlay
        const fadePct = Math.max(adj.fade, filterPreset?.fade ?? 0)
        if (fadePct > 0) {
          ctx.fillStyle = `rgba(255,255,255,${fadePct / 120})`
          ctx.fillRect(photoX, photoY, photoW, photoH)
        }
      } else {
        // Placeholder
        ctx.fillStyle = "#e5e7eb"
        ctx.fillRect(photoX, photoY, photoW, photoH)
        ctx.fillStyle = "#9ca3af"
        ctx.font = `${Math.round(14 * scale)}px system-ui`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText("Upload foto di sini", photoX + photoW / 2, photoY + photoH / 2)
      }

      // Caption
      if (adj.caption.trim()) {
        const captionAreaY = photoY + photoH
        const captionAreaH = bottomBorder
        const fontFamily = getFontFamily(adj.captionFont)
        const isLight = isLightColor(adj.frameColor)
        ctx.fillStyle = isLight ? "#333333" : "#eeeeee"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        let fontSize = Math.round(16 * scale)
        ctx.font = `${fontSize}px ${fontFamily}`
        while (ctx.measureText(adj.caption).width > photoW * 0.85 && fontSize > 8) {
          fontSize -= 1
          ctx.font = `${fontSize}px ${fontFamily}`
        }

        ctx.fillText(
          adj.caption,
          W / 2,
          captionAreaY + captionAreaH / 2
        )
      }

      // Tilt: if needed re-render with rotation (handled by wrapper transform on preview)
    },
    []
  )

  return { render }
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5
}
