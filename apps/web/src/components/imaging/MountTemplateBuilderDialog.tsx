import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  updateClinicMountTemplate,
  type ClinicMountTemplate,
  type MountSlotDefinition,
  type LayoutConfig,
} from '@/api/mounts'

interface MountTemplateBuilderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: ClinicMountTemplate | null
  onSaved: () => void
}

function emptySlot(index: number): MountSlotDefinition {
  return {
    slot_id: `slot_${index + 1}`,
    label: `Slot ${index + 1}`,
    row: 0,
    col: 0,
    row_span: 1,
    col_span: 1,
  }
}

function parseSlotDefs(raw: unknown): MountSlotDefinition[] {
  if (!Array.isArray(raw)) return []
  return raw.filter(
    (s): s is MountSlotDefinition =>
      s != null &&
      typeof s === 'object' &&
      typeof (s as MountSlotDefinition).slot_id === 'string' &&
      typeof (s as MountSlotDefinition).row === 'number' &&
      typeof (s as MountSlotDefinition).col === 'number'
  ) as MountSlotDefinition[]
}

function parseLayout(raw: unknown): LayoutConfig {
  if (raw == null || typeof raw !== 'object') return {}
  const o = raw as Record<string, unknown>
  return {
    rows: typeof o.rows === 'number' ? o.rows : undefined,
    cols: typeof o.cols === 'number' ? o.cols : undefined,
    aspectRatio: typeof o.aspectRatio === 'string' ? o.aspectRatio : undefined,
  }
}

export function MountTemplateBuilderDialog({
  open,
  onOpenChange,
  template,
  onSaved,
}: MountTemplateBuilderDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [rows, setRows] = useState(1)
  const [cols, setCols] = useState(1)
  const [slots, setSlots] = useState<MountSlotDefinition[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !template) return
    setName(template.name)
    setDescription(template.description ?? '')
    const defs = parseSlotDefs(template.slot_definitions)
    const layout = parseLayout(template.layout_config)
    setRows(layout.rows ?? Math.max(1, ...defs.map((s) => s.row + (s.row_span ?? 1))))
    setCols(layout.cols ?? Math.max(1, ...defs.map((s) => s.col + (s.col_span ?? 1))))
    setSlots(defs.length > 0 ? defs : [emptySlot(0)])
    setError(null)
  }, [open, template])

  const handleAddSlot = () => {
    const nextIndex = slots.length + 1
    setSlots((prev) => [...prev, emptySlot(nextIndex - 1)])
  }

  const handleRemoveSlot = (index: number) => {
    if (slots.length <= 1) return
    setSlots((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSlotChange = (index: number, field: keyof MountSlotDefinition, value: string | number) => {
    setSlots((prev) => {
      const next = [...prev]
      const s = { ...next[index], [field]: value }
      next[index] = s
      return next
    })
  }

  const handleSave = async () => {
    if (!template) return
    setSaving(true)
    setError(null)
    try {
      const layoutConfig: LayoutConfig = { type: 'grid', rows, cols }
      const slotCaptureOrder = slots.map((s) => s.slot_id)
      await updateClinicMountTemplate(template.id, {
        name: name.trim() || template.name,
        description: description.trim() || null,
        slot_definitions: slots,
        layout_config: layoutConfig,
        slot_capture_order: slotCaptureOrder,
      })
      onSaved()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save template')
    } finally {
      setSaving(false)
    }
  }

  if (!template) return null

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gap: 4,
    aspectRatio: `${cols}:${rows}`,
    minHeight: 120,
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        onClose={() => onOpenChange(false)}
      >
        <DialogHeader>
          <DialogTitle>Edit template: {template.name}</DialogTitle>
        </DialogHeader>
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Template name"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="mt-1"
            />
          </div>
          <div className="flex gap-4">
            <div>
              <Label htmlFor="rows">Grid rows</Label>
              <Input
                id="rows"
                type="number"
                min={1}
                max={10}
                value={rows}
                onChange={(e) => setRows(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="mt-1 w-20"
              />
            </div>
            <div>
              <Label htmlFor="cols">Grid columns</Label>
              <Input
                id="cols"
                type="number"
                min={1}
                max={10}
                value={cols}
                onChange={(e) => setCols(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="mt-1 w-20"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Placeholders (slots)</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddSlot}>
                Add slot
              </Button>
            </div>
            <div
              className="rounded border-2 border-orange-500 bg-white p-2 mb-4"
              style={gridStyle}
            >
              {slots.map((slot) => (
                <div
                  key={slot.slot_id}
                  style={{
                    gridRow: `${slot.row + 1} / span ${slot.row_span ?? 1}`,
                    gridColumn: `${slot.col + 1} / span ${slot.col_span ?? 1}`,
                    background: '#f5f5f5',
                    border: '1px solid #e5e5e5',
                    borderRadius: 4,
                    minHeight: 24,
                  }}
                />
              ))}
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {slots.map((slot, index) => (
                <div
                  key={slot.slot_id}
                  className="flex flex-wrap items-center gap-2 p-2 border rounded bg-gray-50"
                >
                  <Input
                    placeholder="slot_id"
                    value={slot.slot_id}
                    onChange={(e) => handleSlotChange(index, 'slot_id', e.target.value)}
                    className="w-24"
                  />
                  <Input
                    placeholder="label"
                    value={slot.label}
                    onChange={(e) => handleSlotChange(index, 'label', e.target.value)}
                    className="w-24"
                  />
                  <Input
                    type="number"
                    min={0}
                    value={slot.row}
                    onChange={(e) => handleSlotChange(index, 'row', parseInt(e.target.value, 10) || 0)}
                    className="w-14"
                    title="row"
                  />
                  <Input
                    type="number"
                    min={0}
                    value={slot.col}
                    onChange={(e) => handleSlotChange(index, 'col', parseInt(e.target.value, 10) || 0)}
                    className="w-14"
                    title="col"
                  />
                  <Input
                    type="number"
                    min={1}
                    value={slot.row_span ?? 1}
                    onChange={(e) =>
                      handleSlotChange(index, 'row_span', Math.max(1, parseInt(e.target.value, 10) || 1))
                    }
                    className="w-14"
                    title="row_span"
                  />
                  <Input
                    type="number"
                    min={1}
                    value={slot.col_span ?? 1}
                    onChange={(e) =>
                      handleSlotChange(index, 'col_span', Math.max(1, parseInt(e.target.value, 10) || 1))
                    }
                    className="w-14"
                    title="col_span"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSlot(index)}
                    disabled={slots.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
