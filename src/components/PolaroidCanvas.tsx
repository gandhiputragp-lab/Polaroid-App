import { useRef, useEffect, useCallback } from "react"
import type { Adjustments } from "@/hooks/useAdjustments"
import { usePolaroidRenderer } from "@/hooks/usePolaroidRenderer"
import { SIZE_PRESETS } from "@/constants/presets"

const PREVIEW_MAX_WIDTH = 320

interface PolaroidCanvasProps {
  image: HTMLImageElement | null
  adjustments: Adjustments
  exportRef: React.RefObject<HTMLCanvasElement | null>
}

export function PolaroidCanvas({ image, adjustments, exportRef }: PolaroidCanvasProps) {
  const previewRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const { render } = usePolaroidRenderer()

  const getScale = useCallback(() => {
    const preset = SIZE_PRESETS.find((p) => p.value === adjustments.preset) ?? SIZE_PRESETS[0]
    return Math.min(1, PREVIEW_MAX_WIDTH / preset.width)
  }, [adjustments.preset])

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const canvas = previewRef.current
      if (!canvas) return
      const scale = getScale()
      render(canvas, image, adjustments, scale)
    })
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [image, adjustments, render, getScale])

  const tiltStyle = {
    transform: `rotate(${adjustments.tilt}deg)`,
    transition: "transform 0.15s ease",
  }

  return (
    <div className="flex items-center justify-center" style={{ padding: "2rem" }}>
      <canvas
        ref={previewRef}
        style={{
          ...tiltStyle,
          boxShadow: "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)",
          maxWidth: "100%",
          display: "block",
        }}
      />
      {/* Hidden full-res export canvas */}
      <canvas
        ref={exportRef as React.RefObject<HTMLCanvasElement>}
        style={{ display: "none" }}
      />
    </div>
  )
}
