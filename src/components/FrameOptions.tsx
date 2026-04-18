import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { FRAME_COLORS } from "@/constants/presets"
import type { Adjustments } from "@/hooks/useAdjustments"

interface FrameOptionsProps {
  adjustments: Adjustments
  onChange: (partial: Partial<Adjustments>) => void
}

export function FrameOptions({ adjustments, onChange }: FrameOptionsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Warna Bingkai</Label>
        <ToggleGroup
          type="single"
          value={adjustments.frameColor}
          onValueChange={(v) => { if (v) onChange({ frameColor: v }) }}
          className="flex gap-2 justify-start"
        >
          {FRAME_COLORS.map((c) => (
            <ToggleGroupItem
              key={c.value}
              value={c.value}
              className="p-0 h-8 w-8 rounded-full border-2 transition-all data-[state=on]:border-primary data-[state=off]:border-border overflow-hidden"
              title={c.label}
            >
              <span
                className="block h-full w-full rounded-full"
                style={{ background: c.value }}
              />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">Tekstur Bingkai</Label>
        <Switch
          checked={adjustments.frameTexture}
          onCheckedChange={(v) => onChange({ frameTexture: v })}
        />
      </div>
    </div>
  )
}
