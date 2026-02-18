import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import type { DisplayAdjustments } from '@/api/mounts'

export interface ImageAdjustmentsPopoverProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  anchor?: React.ReactNode
  current: DisplayAdjustments
  onSave: (adjustments: DisplayAdjustments | null) => void
  title?: string
}

const defaultAdjustments: DisplayAdjustments = {
  invert: false,
  flip_h: false,
  flip_v: false,
  rotate: 0,
  brightness: 1,
  contrast: 1,
  gamma: 1,
  sharpen: 0,
}

function clamp(num: number, min: number, max: number) {
  return Math.min(max, Math.max(min, num))
}

export function ImageAdjustmentsPopover({
  open,
  onOpenChange,
  anchor: _anchor,
  current,
  onSave,
  title = 'Image adjustments',
}: ImageAdjustmentsPopoverProps) {
  const [local, setLocal] = useState<DisplayAdjustments>({ ...defaultAdjustments, ...current })

  useEffect(() => {
    setLocal((prev) => ({ ...defaultAdjustments, ...current, ...prev }))
  }, [current, open])

  const update = (patch: Partial<DisplayAdjustments>) => {
    setLocal((prev) => {
      const next = { ...prev, ...patch }
      const isEmpty = Object.keys(next).every(
        (k) =>
          next[k as keyof DisplayAdjustments] === undefined ||
          next[k as keyof DisplayAdjustments] === defaultAdjustments[k as keyof DisplayAdjustments]
      )
      return isEmpty ? {} : next
    })
  }

  const handleReset = () => {
    setLocal({})
    onSave(null)
    onOpenChange(false)
  }

  const handleApply = () => {
    const hasAny = Object.keys(local).some(
      (k) => local[k as keyof DisplayAdjustments] !== undefined && local[k as keyof DisplayAdjustments] !== defaultAdjustments[k as keyof DisplayAdjustments]
    )
    onSave(hasAny ? local : null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={local.invert ? 'default' : 'outline'}
              size="sm"
              onClick={() => update({ invert: !local.invert })}
            >
              Invert
            </Button>
            <Button
              variant={local.flip_h ? 'default' : 'outline'}
              size="sm"
              onClick={() => update({ flip_h: !local.flip_h })}
            >
              Flip H
            </Button>
            <Button
              variant={local.flip_v ? 'default' : 'outline'}
              size="sm"
              onClick={() => update({ flip_v: !local.flip_v })}
            >
              Flip V
            </Button>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Rotate (deg)</Label>
            <Input
              type="number"
              min={-180}
              max={180}
              step={15}
              value={local.rotate ?? 0}
              onChange={(e) => update({ rotate: clamp(Number(e.target.value) || 0, -180, 180) })}
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Brightness</Label>
            <Input
              type="number"
              min={0.2}
              max={2}
              step={0.1}
              value={local.brightness ?? 1}
              onChange={(e) => update({ brightness: clamp(Number(e.target.value) || 1, 0.2, 2) })}
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Contrast</Label>
            <Input
              type="number"
              min={0.2}
              max={2}
              step={0.1}
              value={local.contrast ?? 1}
              onChange={(e) => update({ contrast: clamp(Number(e.target.value) || 1, 0.2, 2) })}
              className="h-8"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset to original
            </Button>
            <Button size="sm" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
