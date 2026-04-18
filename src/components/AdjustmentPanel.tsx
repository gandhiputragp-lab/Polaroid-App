import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { Adjustments } from "@/hooks/useAdjustments"

interface SliderRowProps {
  label: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
}

function SliderRow({ label, value, min, max, onChange }: SliderRowProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <span className="text-xs font-mono text-muted-foreground w-8 text-right">
          {value > 0 ? `+${value}` : value}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={1}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
      />
    </div>
  )
}

interface AdjustmentPanelProps {
  adjustments: Adjustments
  onChange: (partial: Partial<Adjustments>) => void
  onReset: () => void
}

export function AdjustmentPanel({ adjustments, onChange, onReset }: AdjustmentPanelProps) {
  const isModified =
    adjustments.brightness !== 0 ||
    adjustments.contrast !== 0 ||
    adjustments.saturation !== 0 ||
    adjustments.warmth !== 0 ||
    adjustments.vignette !== 30 ||
    adjustments.grain !== 0 ||
    adjustments.fade !== 0

  return (
    <div className="space-y-3">
      {isModified && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-6 px-2 text-xs text-muted-foreground w-full justify-end"
        >
          Reset semua
        </Button>
      )}
      <SliderRow
        label="Kecerahan"
        value={adjustments.brightness}
        min={-100}
        max={100}
        onChange={(v) => onChange({ brightness: v })}
      />
      <SliderRow
        label="Kontras"
        value={adjustments.contrast}
        min={-100}
        max={100}
        onChange={(v) => onChange({ contrast: v })}
      />
      <SliderRow
        label="Saturasi"
        value={adjustments.saturation}
        min={-100}
        max={100}
        onChange={(v) => onChange({ saturation: v })}
      />
      <SliderRow
        label="Kehangatan"
        value={adjustments.warmth}
        min={-100}
        max={100}
        onChange={(v) => onChange({ warmth: v })}
      />
      <SliderRow
        label="Vignette"
        value={adjustments.vignette}
        min={0}
        max={100}
        onChange={(v) => onChange({ vignette: v })}
      />
      <SliderRow
        label="Film Grain"
        value={adjustments.grain}
        min={0}
        max={60}
        onChange={(v) => onChange({ grain: v })}
      />
      <SliderRow
        label="Fade"
        value={adjustments.fade}
        min={0}
        max={100}
        onChange={(v) => onChange({ fade: v })}
      />
    </div>
  )
}
