import React, { useState, useCallback } from "react"

export interface Adjustments {
  brightness: number
  contrast: number
  saturation: number
  warmth: number
  vignette: number
  grain: number
  fade: number
  tilt: number
  cropX: number
  cropY: number
  caption: string
  captionFont: string
  captionX: number
  captionY: number
  captionSize: number
  frameColor: string
  frameTexture: boolean
  filter: string
  preset: string
}

export const DEFAULT_ADJUSTMENTS: Adjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  warmth: 0,
  vignette: 30,
  grain: 0,
  fade: 0,
  tilt: 0,
  cropX: 0,
  cropY: 0,
  caption: "",
  captionFont: "sans",
  captionX: 50,
  captionY: 91,
  captionSize: 16,
  frameColor: "#ffffff",
  frameTexture: false,
  filter: "original",
  preset: "instax",
}

const HISTORY_MAX = 10

export function useAdjustments() {
  const [current, setCurrent] = useState<Adjustments>(DEFAULT_ADJUSTMENTS)
  const historyRef = React.useRef<Adjustments[]>([DEFAULT_ADJUSTMENTS])
  const [_historyIndex, setHistoryIndex] = useState(0)

  const update = useCallback((partial: Partial<Adjustments>) => {
    setCurrent((prev) => {
      const next = { ...prev, ...partial }
      setHistoryIndex((idx) => {
        const trimmed = historyRef.current.slice(0, idx + 1)
        historyRef.current = [...trimmed, next].slice(-HISTORY_MAX)
        return historyRef.current.length - 1
      })
      return next
    })
  }, [])

  const undo = useCallback(() => {
    setHistoryIndex((idx) => {
      if (idx <= 0) return idx
      const newIdx = idx - 1
      setCurrent(historyRef.current[newIdx])
      return newIdx
    })
  }, [])

  const resetSliders = useCallback(() => {
    setCurrent((prev) => {
      const next: Adjustments = {
        ...prev,
        brightness: 0,
        contrast: 0,
        saturation: 0,
        warmth: 0,
        vignette: 30,
        grain: 0,
        fade: 0,
        tilt: 0,
        cropX: 0,
        cropY: 0,
        captionX: 50,
        captionY: 91,
        captionSize: 16,
      }
      setHistoryIndex((idx) => {
        const trimmed = historyRef.current.slice(0, idx + 1)
        historyRef.current = [...trimmed, next].slice(-HISTORY_MAX)
        return historyRef.current.length - 1
      })
      return next
    })
  }, [])

  return { adjustments: current, update, undo, resetSliders }
}
