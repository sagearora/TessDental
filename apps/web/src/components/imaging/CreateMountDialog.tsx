import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { listMountTemplates, createMount, getMount, getMountLayout, type SystemMountTemplate, type ClinicMountTemplate } from '@/api/mounts'
import type { ImagingMount, ImagingAsset } from '@/api/imaging'
import type { DisplayAdjustments } from '@/api/mounts'
import { MountCanvas } from './MountCanvas'

type TemplateOption = (SystemMountTemplate & { source: 'system' }) | (ClinicMountTemplate & { source: 'clinic' })

interface CreateMountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId: number
  clinicId: number
  onCreated: (mount: ImagingMount) => void
}

function TemplatePreview({ template, className }: { template: TemplateOption; className?: string }) {
  const layout = getMountLayout(template)
  if (!layout || layout.slots.length === 0) {
    return <div className={className} style={{ minHeight: 48, background: '#f5f5f5', borderRadius: 6 }} />
  }
  const slotAssignments = layout.slots.map((slot) => ({
    slot_id: slot.slot_id,
    asset: null as ImagingAsset | null,
    adjustments: {} as DisplayAdjustments,
  }))
  return (
    <div
      className={className}
      style={{
        border: '2px solid #ea580c',
        borderRadius: 6,
        overflow: 'hidden',
        background: '#fff',
        minHeight: 48,
      }}
    >
      <MountCanvas
        width={layout.width}
        height={layout.height}
        slots={layout.slots}
        slotAssignments={slotAssignments}
        showOrderLabels={false}
        interactive={false}
      />
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
              const slotCount = Array.isArray(template.slot_definitions) ? template.slot_definitions.length : 0
              return (
                <Button
                  key={template.source === 'system' ? `s-${template.id}` : `c-${template.id}`}
                  variant="outline"
                  className="h-auto flex flex-col items-stretch p-3 text-left"
                  onClick={() => handleSelect(template)}
                  disabled={creating}
                >
                  <TemplatePreview template={template} className="w-full mb-2 min-h-[60px]" />
                  <span className="font-medium truncate">{template.name}</span>
                  <span className="text-xs text-gray-500">
                    {slotCount} slot{slotCount !== 1 ? 's' : ''}
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
