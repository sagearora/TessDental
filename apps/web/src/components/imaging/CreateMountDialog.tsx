import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { listMountTemplates, createMount, getMount, type SystemMountTemplate, type ClinicMountTemplate } from '@/api/mounts'
import type { ImagingMount } from '@/api/imaging'

interface SlotDef {
  slot_id: string
  label: string
  row: number
  col: number
  row_span?: number
  col_span?: number
}

interface LayoutConfig {
  rows?: number
  cols?: number
  aspectRatio?: string
}

type TemplateOption = (SystemMountTemplate & { source: 'system' }) | (ClinicMountTemplate & { source: 'clinic' })

interface CreateMountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId: number
  clinicId: number
  onCreated: (mount: ImagingMount) => void
}

function parseSlotDefs(raw: unknown): SlotDef[] {
  if (!Array.isArray(raw)) return []
  return raw.filter(
    (s): s is SlotDef =>
      s != null &&
      typeof s === 'object' &&
      typeof (s as SlotDef).slot_id === 'string' &&
      typeof (s as SlotDef).row === 'number' &&
      typeof (s as SlotDef).col === 'number'
  ) as SlotDef[]
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

function TemplatePreview({
  slotDefs,
  layoutConfig,
  className,
}: {
  slotDefs: SlotDef[]
  layoutConfig: LayoutConfig
  className?: string
}) {
  const rows = layoutConfig.rows ?? Math.max(0, ...slotDefs.map((s) => s.row)) + 1
  const cols = layoutConfig.cols ?? Math.max(0, ...slotDefs.map((s) => s.col)) + 1
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gap: 2,
    aspectRatio: layoutConfig.aspectRatio ?? `${cols}:${rows}`,
    minHeight: 48,
  }
  return (
    <div
      className={className}
      style={{
        border: '2px solid #ea580c',
        borderRadius: 6,
        overflow: 'hidden',
        background: '#fff',
      }}
    >
      <div style={gridStyle} className="w-full h-full">
        {slotDefs.map((slot) => (
          <div
            key={slot.slot_id}
            style={{
              gridRow: `${slot.row + 1} / span ${slot.row_span ?? 1}`,
              gridColumn: `${slot.col + 1} / span ${slot.col_span ?? 1}`,
              background: '#f5f5f5',
              border: '1px solid #e5e5e5',
              borderRadius: 2,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export function CreateMountDialog({
  open,
  onOpenChange,
  patientId,
  clinicId,
  onCreated,
}: CreateMountDialogProps) {
  const [templates, setTemplates] = useState<TemplateOption[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !clinicId) return
    setError(null)
    setLoading(true)
    listMountTemplates(clinicId)
      .then(({ system, clinic }) => {
        setTemplates([
          ...system.map((t) => ({ ...t, source: 'system' as const })),
          ...clinic.map((t) => ({ ...t, source: 'clinic' as const })),
        ])
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load templates')
      })
      .finally(() => setLoading(false))
  }, [open, clinicId])

  const handleSelect = async (template: TemplateOption) => {
    setCreating(true)
    setError(null)
    try {
      const newMount = await createMount({
        patientId,
        clinicId,
        ...(template.source === 'system'
          ? { templateId: template.id }
          : { clinicTemplateId: template.id }),
        name: `New Mount - ${new Date().toLocaleDateString()}`,
      })
      const fullMount = await getMount(newMount.id)
      onCreated(fullMount)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create mount')
    } finally {
      setCreating(false)
    }
  }

  const slotDefs = (t: TemplateOption) => parseSlotDefs(t.slot_definitions)
  const layoutConfig = (t: TemplateOption) => parseLayout(t.layout_config)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        onClose={() => onOpenChange(false)}
      >
        <DialogHeader>
          <DialogTitle>Create a Mount</DialogTitle>
        </DialogHeader>
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
            {error}
          </div>
        )}
        {loading ? (
          <div className="py-8 text-center text-gray-500">Loading templates...</div>
        ) : templates.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No mount templates available.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-2">
            {templates.map((template) => {
              const slots = slotDefs(template)
              const layout = layoutConfig(template)
              return (
                <Button
                  key={template.source === 'system' ? `s-${template.id}` : `c-${template.id}`}
                  variant="outline"
                  className="h-auto flex flex-col items-stretch p-3 text-left"
                  onClick={() => handleSelect(template)}
                  disabled={creating}
                >
                  <TemplatePreview
                    slotDefs={slots}
                    layoutConfig={layout}
                    className="w-full mb-2"
                  />
                  <span className="font-medium truncate">{template.name}</span>
                  <span className="text-xs text-gray-500">
                    {slots.length} slot{slots.length !== 1 ? 's' : ''}
                  </span>
                </Button>
              )
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
