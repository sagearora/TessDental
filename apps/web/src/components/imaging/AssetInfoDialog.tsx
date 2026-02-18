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
import { AuthenticatedImage } from './AuthenticatedImage'
import { updateAsset } from '@/api/imaging'
import type { ImagingAsset } from '@/api/imaging'
import { Loader2, AlertCircle } from 'lucide-react'

/** Format ISO string for datetime-local input (local time). */
function toDatetimeLocal(iso: string): string {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day}T${h}:${min}`
}

/** Parse datetime-local value (local time) to ISO string. */
function fromDatetimeLocal(value: string): string {
  if (!value) return ''
  return new Date(value).toISOString()
}

interface AssetInfoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  asset: ImagingAsset | null
  onSave?: () => void
  /** When 'inspect', fields are read-only and only Close is shown. */
  mode?: 'edit' | 'inspect'
}

export function AssetInfoDialog({
  open,
  onOpenChange,
  asset,
  onSave,
  mode = 'edit',
}: AssetInfoDialogProps) {
  const isInspect = mode === 'inspect'
  const [name, setName] = useState('')
  const [capturedAt, setCapturedAt] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (asset) {
      setName(asset.name ?? '')
      setCapturedAt(asset.captured_at ? toDatetimeLocal(asset.captured_at) : '')
      setError(null)
    }
  }, [asset, open])

  const handleSave = async () => {
    if (!asset) return
    setSaving(true)
    setError(null)
    try {
      await updateAsset(asset.id, {
        name: name.trim() || null,
        capturedAt: capturedAt ? fromDatetimeLocal(capturedAt) : null,
      })
      onSave?.()
      onOpenChange(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update asset')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby="asset-info-dialog-description">
        <DialogHeader>
          <DialogTitle>Image details</DialogTitle>
        </DialogHeader>
        <div id="asset-info-dialog-description" className="space-y-4">
          {asset ? (
            <>
              <div className="flex justify-center rounded-md border bg-muted/30 overflow-hidden min-h-[120px]">
                <AuthenticatedImage
                  assetId={asset.id}
                  variant="web"
                  alt={asset.name ?? `Asset ${asset.id}`}
                  className="max-h-48 w-auto object-contain"
                />
              </div>
              <div>
                <Label htmlFor="asset-info-name">Name</Label>
                <Input
                  id="asset-info-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Image name"
                  className="mt-1"
                  disabled={isInspect}
                  readOnly={isInspect}
                />
              </div>
              <div>
                <Label htmlFor="asset-info-captured-at">Acquisition date</Label>
                <Input
                  id="asset-info-captured-at"
                  type="datetime-local"
                  value={capturedAt}
                  onChange={(e) => setCapturedAt(e.target.value)}
                  className="mt-1"
                  disabled={isInspect}
                  readOnly={isInspect}
                />
              </div>
              {error && (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
            </>
          ) : (
            <p className="text-muted-foreground text-sm">No image selected.</p>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel} disabled={saving}>
            {isInspect ? 'Close' : 'Cancel'}
          </Button>
          {!isInspect && (
            <Button type="button" onClick={handleSave} disabled={!asset || saving}>
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
