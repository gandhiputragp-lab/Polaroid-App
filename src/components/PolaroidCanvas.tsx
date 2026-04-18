import { useRef, useEffect, useCallback, useState } from "react"
import type { Adjustments } from "@/hooks/useAdjustments"
import { usePolaroidRenderer } from "@/hooks/usePolaroidRenderer"
import { SIZE_PRESETS } from "@/constants/presets"

const PREVIEW_MAX_WIDTH = 320

interface PolaroidCanvasProps {
  image: HTMLImageElement | null
  adjustments: Adjustments
  exportRef: React.RefObject<HTMLCanvasElement | null>
  onCaptionMove: (x: number, y: number) => void
}

export function PolaroidCanvas({ image, adjustments, exportRef, onCaptionMove }: PolaroidCanvasProps) {
  const previewRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const draggingRef = useRef(false)
  const [isDragging, setIsDragging] = useState(false)
  const { render } = usePolaroidRenderer()

  const getScale = useCallback(() => {
    const preset = SIZE_PRESETS.find((p) => p.value === adjustments.preset) ?? SIZE_PRESETS[0]
    const isLandscape = image ? image.naturalWidth > image.naturalHeight : false
    const presetW = isLandscape ? preset.height : preset.width
    return Math.min(1, PREVIEW_MAX_WIDTH / presetW)
  }, [adjustments.preset, image])

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const canvas = previewRef.current
      if (!canvas) return
      render(canvas, image, adjustments, getScale())
    })
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [image, adjustments, render, getScale])

  const posFromEvent = useCallback((e: React.MouseEvent | MouseEvent): { x: number; y: number } | null => {
    const canvas = previewRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
    return { x, y }
  }, [])

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (draggingRef.current) return
    if (!adjustments.caption.trim()) return
    const pos = posFromEvent(e)
    if (pos) onCaptionMove(pos.x, pos.y)
  }, [adjustments.caption, onCaptionMove, posFromEvent])

  const handleHandleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    draggingRef.current = true
    setIsDragging(true)

    const onMove = (ev: MouseEvent) => {
      const pos = posFromEvent(ev)
      if (pos) onCaptionMove(pos.x, pos.y)
    }
    const onUp = () => {
      draggingRef.current = false
      setIsDragging(false)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }, [onCaptionMove, posFromEvent])

  const canvas = previewRef.current
  const canvasW = canvas?.clientWidth ?? 0
  const canvasH = canvas?.clientHeight ?? 0

  const handleLeft = (adjustments.captionX / 100) * canvasW
  const handleTop = (adjustments.captionY / 100) * canvasH

  const showHandle = adjustments.caption.trim().length > 0

  return (
    <div className="flex items-center justify-center" style={{ padding: "2rem" }}>
      <div
        ref={wrapperRef}
        className="relative select-none"
        style={{
          transform: `rotate(${adjustments.tilt}deg)`,
          transition: isDragging ? "none" : "transform 0.15s ease",
          display: "inline-block",
        }}
      >
        <canvas
          ref={previewRef}
          onClick={handleCanvasClick}
          style={{
            boxShadow: "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)",
            display: "block",
            cursor: showHandle ? "crosshair" : "default",
          }}
        />

        {/* Draggable text handle */}
        {showHandle && canvasW > 0 && (
          <div
            onMouseDown={handleHandleMouseDown}
            style={{
              position: "absolute",
              left: handleLeft,
              top: handleTop,
              transform: "translate(-50%, -50%)",
              cursor: isDragging ? "grabbing" : "grab",
              zIndex: 10,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: "2px solid white",
                boxShadow: "0 0 0 1.5px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.4)",
                background: isDragging ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)",
                transition: "background 0.1s",
              }}
            />
          </div>
        )}
      </div>

      {/* Hidden full-res export canvas */}
      <canvas ref={exportRef as React.RefObject<HTMLCanvasElement>} style={{ display: "none" }} />
    </div>
  )
}
