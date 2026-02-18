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
  MOUNT_CANVAS_WIDTH,
  MOUNT_CANVAS_HEIGHT,
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
    x: 50 + (index % 3) * 350,
    y: 50 + Math.floor(index / 3) * 300,
    width: 300,
    height: 250,
  }
}

type SlotLike = Record<string, unknown> & { slot_id: string }

function parseSlotDefs(raw: unknown, layout?: LayoutConfig): MountSlotDefinition[] {
  if (!Array.isArray(raw)) return []
  const arr = raw as Record<string, unknown>[]
  const defs = arr.filter(
    (s): s is SlotLike =>
      s != null &&
      typeof s === 'object' &&
      typeof (s as SlotLike).slot_id === 'string'
  )
  const withCanvas = defs.map((slot): MountSlotDefinition => {
    const slotId = String(slot.slot_id)
    const label = slot.label != null ? String(slot.label) : slotId
    if (
      typeof slot.x === 'number' &&
      typeof slot.y === 'number' &&
      typeof slot.width === 'number' &&
      typeof slot.height === 'number'
    ) {
      return { slot_id: slotId, label, x: slot.x, y: slot.y, width: slot.width, height: slot.height }
    }
    const row = Number(slot.row ?? 0)
    const col = Number(slot.col ?? 0)
    const rowSpan = Number(slot.row_span ?? 1)
    const colSpan = Number(slot.col_span ?? 1)
    const rows = layout?.rows ?? Math.max(1, ...defs.map((d) => Number(d.row ?? 0) + Number(d.row_span ?? 1)))
    const cols = layout?.cols ?? Math.max(1, ...defs.map((d) => Number(d.col ?? 0) + Number(d.col_span ?? 1)))
    const cellW = MOUNT_CANVAS_WIDTH / cols
    const cellH = MOUNT_CANVAS_HEIGHT / rows
    return {
      slot_id: slotId,
      label,
      x: col * cellW,
      y: row * cellH,
      width: colSpan * cellW,
      height: rowSpan * cellH,
    }
  })
  return withCanvas
}

function parseLayout(raw: unknown): LayoutConfig {
  if (raw == null || typeof raw !== 'object') return {}
  const o = raw as Record<string, unknown>
  if (o.type === 'canvas' && typeof o.width === 'number' && typeof o.height === 'number') {
    return { type: 'canvas', width: o.width, height: o.height }
  }
  return {
    type: 'grid',
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
  const [slots, setSlots] = useState<MountSlotDefinition[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !template) return
    setName(template.name)
    setDescription(template.description ?? '')
    const layout = parseLayout(template.layout_config)
    const defs = parseSlotDefs(template.slot_definitions, layout)
    setSlots(defs.length > 0 ? defs : [emptySlot(0)])
    setSelectedIndex(null)
    setError(null)
  }, [open, template])

  const handleAddSlot = () => {
    const nextIndex = slots.length
    setSlots((prev) => [...prev, emptySlot(nextIndex)])
    setSelectedIndex(nextIndex)
  }

  const handleRemoveSlot = (index: number) => {
    if (slots.length <= 1) return
    setSlots((prev) => prev.filter((_, i) => i !== index))
    setSelectedIndex(selectedIndex === index ? null : selectedIndex != null && selectedIndex > index ? selectedIndex - 1 : selectedIndex)
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
      const layoutConfig: LayoutConfig = {
        type: 'canvas',
        width: MOUNT_CANVAS_WIDTH,
        height: MOUNT_CANVAS_HEIGHT,
      }
      const slotCaptureOrder = slots.map((s) => s.slot_id)
      const slotDefs = slots.map((s) => ({
        slot_id: s.slot_id,
        label: s.label ?? s.slot_id,
        x: Number(s.x) || 0,
        y: Number(s.y) || 0,
        width: Math.max(10, Number(s.width) || 100),
        height: Math.max(10, Number(s.height) || 100),
      }))
      await updateClinicMountTemplate(template.id, {
        name: name.trim() || template.name,
        description: description.trim() || null,
        slot_definitions: slotDefs,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-y-auto"
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

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Canvas ({MOUNT_CANVAS_WIDTH}×{MOUNT_CANVAS_HEIGHT}) – placeholders</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddSlot}>
                Add placeholder
              </Button>
            </div>
            <div
              className="rounded border-2 border-orange-500 bg-white overflow-hidden"
              style={{
                aspectRatio: `${MOUNT_CANVAS_WIDTH} / ${MOUNT_CANVAS_HEIGHT}`,
                maxHeight: 320,
                position: 'relative',
              }}
            >
              <div className="absolute inset-0" style={{ width: '100%', height: '100%' }}>
                {slots.map((slot, index) => {
                  const leftPct = ((slot.x ?? 0) / MOUNT_CANVAS_WIDTH) * 100
                  const topPct = ((slot.y ?? 0) / MOUNT_CANVAS_HEIGHT) * 100
                  const widthPct = ((slot.width ?? 100) / MOUNT_CANVAS_WIDTH) * 100
                  const heightPct = ((slot.height ?? 100) / MOUNT_CANVAS_HEIGHT) * 100
                  const isSelected = selectedIndex === index
                  return (
                    <div
                      key={slot.slot_id}
                      role="button"
                      tabIndex={0}
                      className="absolute border-2 rounded cursor-pointer transition-all"
                      style={{
                        left: `${leftPct}%`,
                        top: `${topPct}%`,
                        width: `${widthPct}%`,
                        height: `${heightPct}%`,
                        background: isSelected ? '#dbeafe' : '#f5f5f5',
                        borderColor: isSelected ? '#2563eb' : '#e5e5e5',
                      }}
                      onClick={() => setSelectedIndex(index)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setSelectedIndex(index)
                        }
                      }}
                    >
                      <span className="text-xs font-medium text-gray-600 truncate block p-1">
                        {slot.label || slot.slot_id}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto mt-2">
              {slots.map((slot, index) => (
                <div
                  key={slot.slot_id}
                  className={`flex flex-wrap items-center gap-2 p-2 border rounded ${
                    selectedIndex === index ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                  }`}
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
                    max={MOUNT_CANVAS_WIDTH}
                    value={slot.x ?? 0}
                    onChange={(e) => handleSlotChange(index, 'x', parseInt(e.target.value, 10) || 0)}
                    className="w-16"
                    title="x"
                  />
                  <Input
                    type="number"
                    min={0}
                    max={MOUNT_CANVAS_HEIGHT}
                    value={slot.y ?? 0}
                    onChange={(e) => handleSlotChange(index, 'y', parseInt(e.target.value, 10) || 0)}
                    className="w-16"
                    title="y"
                  />
                  <Input
                    type="number"
                    min={10}
                    max={MOUNT_CANVAS_WIDTH}
                    value={slot.width ?? 100}
                    onChange={(e) =>
                      handleSlotChange(index, 'width', Math.max(10, parseInt(e.target.value, 10) || 100))
                    }
                    className="w-16"
                    title="width"
                  />
                  <Input
                    type="number"
                    min={10}
                    max={MOUNT_CANVAS_HEIGHT}
                    value={slot.height ?? 100}
                    onChange={(e) =>
                      handleSlotChange(index, 'height', Math.max(10, parseInt(e.target.value, 10) || 100))
                    }
                    className="w-16"
                    title="height"
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
