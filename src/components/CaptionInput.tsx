import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CAPTION_FONTS } from "@/constants/presets"
import type { Adjustments } from "@/hooks/useAdjustments"
import { Slider } from "@/components/ui/slider"
import { MoveIcon } from "lucide-react"

interface CaptionInputProps {
  adjustments: Adjustments
  onChange: (partial: Partial<Adjustments>) => void
}

export function CaptionInput({ adjustments, onChange }: CaptionInputProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Teks Keterangan</Label>
          <span className="text-xs text-muted-foreground">{adjustments.caption.length}/40</span>
        </div>
        <Input
          placeholder="Nama, tanggal, atau pesan…"
          value={adjustments.caption}
          maxLength={40}
          onChange={(e) => onChange({ caption: e.target.value })}
          className="text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Font</Label>
        <div className="grid grid-cols-2 gap-1">
          {CAPTION_FONTS.map((f) => (
            <button
              key={f.value}
              onClick={() => onChange({ captionFont: f.value })}
              className={[
                "px-2 py-1.5 rounded text-left border transition-colors text-[11px] leading-tight",
                adjustments.captionFont === f.value
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40",
              ].join(" ")}
            >
              <span style={{ fontFamily: f.previewFamily }} className="text-xs block truncate">
                {f.preview}
              </span>
              <span className="text-[10px] mt-0.5 block opacity-70">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Ukuran Teks</Label>
          <span className="text-xs font-mono text-muted-foreground">{adjustments.captionSize}px</span>
        </div>
        <Slider
          min={10} max={48} step={1}
          value={[adjustments.captionSize]}
          onValueChange={([v]) => onChange({ captionSize: v })}
        />
      </div>

      {adjustments.caption.trim() && (
        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
          <MoveIcon className="h-3 w-3 shrink-0" />
          Klik atau seret titik putih di preview untuk memindahkan teks
        </p>
      )}
    </div>
  )
}
