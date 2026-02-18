import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { updateMount } from '@/api/mounts'
import type { ImagingMount } from '@/api/mounts'
import { Loader2 } from 'lucide-react'

interface MountInfoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mount: ImagingMount | null
  /** When 'inspect', fields are read-only and only Close is shown. */
  mode: 'edit' | 'inspect'
  onSave?: () => void
}

export function MountInfoDialog({
  open,
  onOpenChange,
  mount,
  mode,
  onSave,
}: MountInfoDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (mount) {
      setName(mount.name ?? '')
      setDescription(mount.description ?? '')
      setError(null)
    }
  }, [mount, open])

  const handleSave = async () => {
    if (!mount) return
    setSaving(true)
    setError(null)
    try {
      await updateMount(mount.id, {
        name: name.trim() || null,
        description: description.trim() || null,
      })
      onSave?.()
      onOpenChange(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update mount')
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  const isInspect = mode === 'inspect'
  const templateName =
    mount?.template?.name ?? mount?.clinic_template?.name ?? '—'
  const slotDefs = Array.isArray(mount?.template?.slot_definitions)
    ? mount!.template!.slot_definitions
    : Array.isArray(mount?.clinic_template?.slot_definitions)
      ? mount!.clinic_template!.slot_definitions
      : []
  const totalSlots = slotDefs.length
  const filledSlots = (mount?.mount_slots ?? mount?.slots ?? []).filter(
    (s) => s.asset_id != null
  ).length
  const createdAt = mount?.created_at
    ? new Date(mount.created_at).toLocaleString()
    : '—'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby="mount-info-dialog-description">
        <DialogHeader>
          <DialogTitle>Mount details</DialogTitle>
        </DialogHeader>
        <div id="mount-info-dialog-description" className="space-y-4">
          {mount ? (
            <>
              <div>
                <Label htmlFor="mount-info-name">Name</Label>
                <Input
                  id="mount-info-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Mount name"
                  className="mt-1"
                  disabled={isInspect}
                  readOnly={isInspect}
                />
              </div>
              <div>
                <Label htmlFor="mount-info-description">Description</Label>
                <Input
                  id="mount-info-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  className="mt-1"
                  disabled={isInspect}
                  readOnly={isInspect}
                />
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  <span className="font-medium">Template:</span> {templateName}
                </p>
                <p>
                  <span className="font-medium">Created:</span> {createdAt}
                </p>
                <p>
                  <span className="font-medium">Slots:</span> {filledSlots} of{' '}
                  {totalSlots} filled
                </p>
              </div>
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
            </>
          ) : (
            <p className="text-muted-foreground text-sm">No mount selected.</p>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={saving}>
            {isInspect ? 'Close' : 'Cancel'}
          </Button>
          {!isInspect && (
            <Button type="button" onClick={handleSave} disabled={!mount || saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                'Save'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
