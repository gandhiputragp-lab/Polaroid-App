import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { FILTER_PRESETS } from "@/constants/presets"

interface FilterToggleProps {
  value: string
  onChange: (value: string) => void
}

export function FilterToggle({ value, onChange }: FilterToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => { if (v) onChange(v) }}
      className="flex flex-wrap gap-1 justify-start"
    >
      {FILTER_PRESETS.map((f) => (
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
  )
}
