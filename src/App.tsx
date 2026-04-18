import { useRef, useState, useEffect, useCallback } from "react"
import { Toaster, toast } from "sonner"
import { Download, RotateCcw, ImageIcon, SlidersHorizontal, Crop } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { UploadZone } from "@/components/UploadZone"
import { FilterToggle } from "@/components/FilterToggle"
import { AdjustmentPanel } from "@/components/AdjustmentPanel"
import { FrameOptions } from "@/components/FrameOptions"
import { CaptionInput } from "@/components/CaptionInput"
import { PolaroidCanvas } from "@/components/PolaroidCanvas"
import { useAdjustments } from "@/hooks/useAdjustments"
import { usePolaroidRenderer } from "@/hooks/usePolaroidRenderer"
import { SIZE_PRESETS } from "@/constants/presets"

export default function App() {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [phase, setPhase] = useState<"upload" | "edit">("upload")
  const exportRef = useRef<HTMLCanvasElement>(null)
  const { adjustments, update, undo } = useAdjustments()
  const { render } = usePolaroidRenderer()

  const currentPreset =
    SIZE_PRESETS.find((p) => p.value === adjustments.preset) ?? SIZE_PRESETS[0]

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault()
        undo()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [undo])

  const handleImageLoad = useCallback((img: HTMLImageElement) => {
    setImage(img)
    setPhase("edit")
  }, [])

  const triggerDownload = (dataUrl: string) => {
    const a = document.createElement("a")
    a.href = dataUrl
    a.download = "polaroid-wedding.png"
    a.click()
  }

  const handleExport = useCallback(() => {
    const canvas = exportRef.current
    if (!canvas || !image) return

    render(canvas, image, adjustments, 1)

    if (adjustments.tilt !== 0) {
      const angle = (adjustments.tilt * Math.PI) / 180
      const cos = Math.abs(Math.cos(angle))
      const sin = Math.abs(Math.sin(angle))
      const newW = Math.round(canvas.width * cos + canvas.height * sin)
      const newH = Math.round(canvas.width * sin + canvas.height * cos)

      const tilted = document.createElement("canvas")
      tilted.width = newW
      tilted.height = newH
      const tctx = tilted.getContext("2d")!
      tctx.fillStyle = "#ffffff"
      tctx.fillRect(0, 0, newW, newH)
      tctx.translate(newW / 2, newH / 2)
      tctx.rotate(angle)
      tctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2)

      triggerDownload(tilted.toDataURL("image/png"))
    } else {
      triggerDownload(canvas.toDataURL("image/png"))
    }

    toast.success("Foto berhasil diunduh!")
  }, [image, adjustments, render])

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Toaster position="top-center" richColors />

        {/* Header */}
        <header className="border-b bg-card px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <ImageIcon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-semibold leading-tight">Polaroid Wedding Editor</h1>
              <p className="text-xs text-muted-foreground">Buat foto polaroid untuk dekorasi pernikahan</p>
            </div>
          </div>
          {phase === "edit" && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={undo} title="Undo (Ctrl+Z)">
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline ml-1 text-xs">Undo</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => { setImage(null); setPhase("upload") }}
              >
                Ganti Foto
              </Button>
            </div>
          )}
        </header>

        {phase === "upload" ? (
          <div className="flex min-h-[calc(100vh-57px)] items-center justify-center p-6">
            <div className="w-full max-w-md space-y-5">
              <div className="text-center space-y-1.5">
                <div className="flex justify-center mb-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <ImageIcon className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <h2 className="text-2xl font-semibold">Buat Polaroid Pernikahan</h2>
                <p className="text-sm text-muted-foreground">
                  Upload foto lalu sesuaikan tampilan untuk dicetak
                </p>
              </div>
              <UploadZone onImageLoad={handleImageLoad} />
              <p className="text-center text-xs text-muted-foreground">
                Foto portrait & landscape didukung · Landscape akan dirotasi otomatis
              </p>
            </div>
          </div>
        ) : (
          <div className="flex h-[calc(100vh-57px)]">

            {/* Left Controls Panel */}
            <Card className="w-72 shrink-0 rounded-none border-0 border-r overflow-y-auto">

              {/* Preset */}
              <div className="p-4 space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Ukuran Preset
                </Label>
                <Select value={adjustments.preset} onValueChange={(v) => update({ preset: v })}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SIZE_PRESETS.map((p) => (
                      <SelectItem key={p.value} value={p.value} className="text-xs">
                        {p.label} — {p.printLabel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Filters */}
              <div className="p-4 space-y-2.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Filter
                </Label>
                <FilterToggle value={adjustments.filter} onChange={(v) => update({ filter: v })} />
              </div>

              <Separator />

              {/* Adjustments */}
              <div className="p-4 space-y-2.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                  <SlidersHorizontal className="h-3 w-3" /> Penyesuaian
                </Label>
                <AdjustmentPanel adjustments={adjustments} onChange={update} />
              </div>

              <Separator />

              {/* Crop position */}
              <div className="p-4 space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                  <Crop className="h-3 w-3" /> Posisi Foto
                </Label>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Horizontal</Label>
                    <span className="text-xs font-mono text-muted-foreground">{adjustments.cropX}%</span>
                  </div>
                  <Slider min={-50} max={50} step={1} value={[adjustments.cropX]}
                    onValueChange={([v]) => update({ cropX: v })} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Vertikal</Label>
                    <span className="text-xs font-mono text-muted-foreground">{adjustments.cropY}%</span>
                  </div>
                  <Slider min={-50} max={50} step={1} value={[adjustments.cropY]}
                    onValueChange={([v]) => update({ cropY: v })} />
                </div>
              </div>

              <Separator />

              {/* Frame */}
              <div className="p-4 space-y-2.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Bingkai
                </Label>
                <FrameOptions adjustments={adjustments} onChange={update} />
              </div>

              <Separator />

              {/* Caption + Tilt */}
              <div className="p-4 space-y-2.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Keterangan & Kemiringan
                </Label>
                <CaptionInput adjustments={adjustments} onChange={update} />
              </div>

            </Card>

            {/* Right Preview Panel */}
            <div className="flex-1 flex flex-col items-center justify-between bg-muted/20 overflow-auto p-6 gap-4 min-w-0">

              <Badge variant="outline" className="text-[10px] font-mono self-center shrink-0">
                Output: {currentPreset.width}×{currentPreset.height}px · Siap cetak {currentPreset.printLabel} @96dpi
              </Badge>

              <div className="flex-1 flex items-center justify-center w-full min-h-0">
                <PolaroidCanvas
                  image={image}
                  adjustments={adjustments}
                  exportRef={exportRef}
                />
              </div>

              <div className="flex flex-col items-center gap-2 shrink-0 pb-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        size="lg"
                        onClick={handleExport}
                        disabled={!image}
                        className="gap-2 px-8"
                      >
                        <Download className="h-4 w-4" />
                        Unduh Polaroid
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {!image && (
                    <TooltipContent>Upload foto terlebih dahulu</TooltipContent>
                  )}
                </Tooltip>
                <p className="text-xs text-muted-foreground text-center max-w-xs">
                  Cetak di kertas foto glossy · Kirim file ini ke print shop terdekat
                </p>
              </div>

            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
