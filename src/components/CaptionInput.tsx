import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { CAPTION_FONTS } from "@/constants/presets"
import type { Adjustments } from "@/hooks/useAdjustments"
import { Slider } from "@/components/ui/slider"

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
          <span className="text-xs text-muted-foreground">
            {adjustments.caption.length}/40
          </span>
        </div>
        <Input
          placeholder="Nama & Tanggal, atau pesan singkat…"
          value={adjustments.caption}
          maxLength={40}
          onChange={(e) => onChange({ caption: e.target.value })}
          className="text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Font</Label>
        <ToggleGroup
          type="single"
          value={adjustments.captionFont}
          onValueChange={(v) => { if (v) onChange({ captionFont: v }) }}
          className="flex gap-1 justify-start"
        >
          {CAPTION_FONTS.map((f) => (
            <ToggleGroupItem
              key={f.value}
              value={f.value}
              variant="outline"
              size="sm"
              className="text-xs px-2.5 h-7 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary"
            >
              {f.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Kemiringan</Label>
          <span className="text-xs font-mono text-muted-foreground">
            {adjustments.tilt > 0 ? `+${adjustments.tilt}` : adjustments.tilt}°
          </span>
        </div>
        <Slider
          min={-15}
          max={15}
          step={1}
          value={[adjustments.tilt]}
          onValueChange={([v]) => onChange({ tilt: v })}
        />
      </div>
    </div>
  )
}
