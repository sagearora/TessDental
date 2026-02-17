import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import {
  listSystemMountTemplates,
  listClinicMountTemplates,
  copySystemTemplateToClinic,
  createClinicMountTemplate,
  type SystemMountTemplate,
  type ClinicMountTemplate,
} from '@/api/mounts'
import { MountTemplateBuilderDialog } from '@/components/imaging/MountTemplateBuilderDialog'

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

function TemplatePreviewCard({
  name,
  description,
  slotDefs,
  layoutConfig,
  slotCount,
  action,
  actionLabel,
  actionDisabled,
}: {
  name: string
  description?: string | null
  slotDefs: SlotDef[]
  layoutConfig: LayoutConfig
  slotCount: number
  action: () => void
  actionLabel: string
  actionDisabled?: boolean
}) {
  const rows = layoutConfig.rows ?? Math.max(0, ...slotDefs.map((s) => s.row)) + 1
  const cols = layoutConfig.cols ?? Math.max(0, ...slotDefs.map((s) => s.col)) + 1
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gap: 2,
    aspectRatio: layoutConfig.aspectRatio ?? `${cols}:${rows}`,
    minHeight: 64,
  }
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{name}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-3">
        <div
          className="w-full rounded border-2 border-orange-500 overflow-hidden bg-white"
          style={{ minHeight: 80 }}
        >
          <div style={gridStyle} className="w-full h-full p-1">
            {slotDefs.map((slot) => (
              <div
                key={slot.slot_id}
                style={{
                  gridRow: `${slot.row + 1} / span ${slot.row_span ?? 1}`,
                  gridColumn: `${slot.col + 1} / span ${slot.col_span ?? 1}`,
                  background: '#f5f5f5',
                  border: '1px solid #e5e5e5',
                  borderRadius: 4,
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {slotCount} slot{slotCount !== 1 ? 's' : ''}
          </span>
          <Button size="sm" onClick={action} disabled={actionDisabled}>
            {actionLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function ImagingTemplates() {
  const { session } = useAuth()
  const [systemTemplates, setSystemTemplates] = useState<SystemMountTemplate[]>([])
  const [clinicTemplates, setClinicTemplates] = useState<ClinicMountTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copyingId, setCopyingId] = useState<number | null>(null)
  const [editingTemplate, setEditingTemplate] = useState<ClinicMountTemplate | null>(null)
  const [builderOpen, setBuilderOpen] = useState(false)
  const [creating, setCreating] = useState(false)

  const clinicId = session?.clinicId ?? 0

  const load = () => {
    if (!clinicId) return
    setLoading(true)
    setError(null)
    Promise.all([listSystemMountTemplates(), listClinicMountTemplates(clinicId)])
      .then(([system, clinic]) => {
        setSystemTemplates(system)
        setClinicTemplates(clinic)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load templates')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [clinicId])

  const handleCopyToClinic = async (template: SystemMountTemplate) => {
    if (!clinicId) return
    setCopyingId(template.id)
    setError(null)
    try {
      await copySystemTemplateToClinic(clinicId, template)
      await listClinicMountTemplates(clinicId).then(setClinicTemplates)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to copy template')
    } finally {
      setCopyingId(null)
    }
  }

  if (!session) {
    return (
      <div className="text-gray-500">You must be signed in and have a clinic selected.</div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Imaging – Mount Templates</h1>
        <p className="mt-1 text-gray-600">
          Copy system mount templates to your clinic to use them when creating mounts. Clinic
          templates can be edited later (template builder coming soon).
        </p>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-8 text-gray-500">Loading templates...</div>
      ) : (
        <>
          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-4">System templates</h2>
            <p className="text-sm text-gray-600 mb-4">
              Read-only templates. Use &quot;Copy to my clinic&quot; to add a copy to your clinic.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {systemTemplates.map((template) => {
                const slotDefs = parseSlotDefs(template.slot_definitions)
                const layoutConfig = parseLayout(template.layout_config)
                return (
                  <TemplatePreviewCard
                    key={template.id}
                    name={template.name}
                    description={template.description}
                    slotDefs={slotDefs}
                    layoutConfig={layoutConfig}
                    slotCount={slotDefs.length}
                    action={() => handleCopyToClinic(template)}
                    actionLabel="Copy to my clinic"
                    actionDisabled={copyingId === template.id}
                  />
                )
              })}
            </div>
            {systemTemplates.length === 0 && (
              <p className="text-sm text-gray-500">No system templates available.</p>
            )}
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Clinic templates</h2>
            <p className="text-sm text-gray-600 mb-4">
              Templates you have copied or created for this clinic. They appear in the Create a
              Mount dialog on the Imaging page.
            </p>
            <div className="mb-4">
              <Button
                variant="outline"
                onClick={async () => {
                  if (!clinicId) return
                  setCreating(true)
                  setError(null)
                  try {
                    const newTemplate = await createClinicMountTemplate({
                      clinicId,
                      name: 'New template',
                    })
                    setClinicTemplates((prev) => [newTemplate, ...prev])
                    setEditingTemplate(newTemplate)
                    setBuilderOpen(true)
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Failed to create template')
                  } finally {
                    setCreating(false)
                  }
                }}
                disabled={creating || !clinicId}
              >
                New template
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clinicTemplates.map((template) => {
                const slotDefs = parseSlotDefs(template.slot_definitions)
                const layoutConfig = parseLayout(template.layout_config)
                return (
                  <TemplatePreviewCard
                    key={template.id}
                    name={template.name}
                    description={template.description}
                    slotDefs={slotDefs}
                    layoutConfig={layoutConfig}
                    slotCount={slotDefs.length}
                    action={() => {}}
                    actionLabel="Edit (coming soon)"
                    actionDisabled
                  />
                )
              })}
            </div>
            {clinicTemplates.length === 0 && (
              <p className="text-sm text-gray-500">
                No clinic templates yet. Copy a system template above to get started.
              </p>
            )}
          </section>
        </>
      )}

      <MountTemplateBuilderDialog
        open={builderOpen}
        onOpenChange={(open) => {
          setBuilderOpen(open)
          if (!open) setEditingTemplate(null)
        }}
        template={editingTemplate}
        onSaved={() => {
          if (clinicId) listClinicMountTemplates(clinicId).then(setClinicTemplates)
        }}
      />
    </div>
  )
}
