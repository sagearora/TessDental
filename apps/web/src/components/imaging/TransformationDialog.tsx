import { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { DisplayAdjustments } from '@/api/mounts'
import { mergeDisplayAdjustments } from '@/lib/display-adjustments'
import { cn } from '@/lib/utils'
import { X, RotateCcw, RotateCw } from 'lucide-react'

export interface TransformationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  current: DisplayAdjustments
  onSave: (adjustments: DisplayAdjustments | null) => void | Promise<void>
  title?: string
  /** Called with merged (current + local) adjustments for live preview. Used in panel mode. */
  onPreviewChange?: (adj: DisplayAdjustments) => void
  /** When in panel mode, called when user closes without saving (X, etc.). */
  onClose?: () => void
  /** 'dialog' = modal; 'panel' = inline side panel (no Dialog wrapper). */
  variant?: 'dialog' | 'panel'
}

export const defaultAdjustments: DisplayAdjustments = {
  invert: false,
  flip_h: false,
  flip_v: false,
  rotate: 0,
  brightness: 1,
  contrast: 1,
  gamma: 1,
  sharpen: 0,
}

type AdjustmentKey = keyof DisplayAdjustments

const EMPTY_ADJUSTMENTS: DisplayAdjustments = {}

function getActiveAdjustmentsShort(local: DisplayAdjustments): { key: AdjustmentKey; label: string }[] {
  const out: { key: AdjustmentKey; label: string }[] = []
  const keys: AdjustmentKey[] = ['invert', 'flip_h', 'flip_v', 'rotate', 'brightness', 'contrast', 'gamma', 'sharpen']
  for (const k of keys) {
    const val = local[k]
    const def = defaultAdjustments[k]
    if (val === undefined) continue
    if (typeof def === 'number' && typeof val === 'number') {
      if (val === def) continue
    } else if (val === def) continue
    let label = ''
    if (k === 'invert') label = 'Invert'
    else if (k === 'flip_h') label = 'Flip H'
    else if (k === 'flip_v') label = 'Flip V'
    else if (k === 'rotate') label = `${val}°`
    else if (k === 'brightness') label = `B ${Number(val).toFixed(2)}`
    else if (k === 'contrast') label = `C ${Number(val).toFixed(2)}`
    else if (k === 'gamma') label = `Γ ${Number(val).toFixed(2)}`
    else if (k === 'sharpen') label = `S ${Number(val).toFixed(2)}`
    out.push({ key: k, label })
  }
  return out
}

/** Inline switch (no dropdown) */
function InlineSwitch({
  checked,
  onCheckedChange,
  ariaLabel,
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'relative h-5 w-9 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        checked ? 'bg-primary' : 'bg-muted'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
          checked ? 'left-[18px]' : 'left-0.5'
        )}
      />
    </button>
  )
}

/** Label width so all sliders start at same x */
const LABEL_WIDTH = 'min-w-[7rem] w-28'

/** Slider + value inline (used in row, control area has fixed start) */
function InlineSlider({
  value,
  min,
  max,
  step,
  onChange,
}: {
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}) {
  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 min-w-0 h-1.5 appearance-none bg-muted rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0"
      />
      <span className="text-xs text-muted-foreground w-9 shrink-0 tabular-nums text-right">{value.toFixed(2)}</span>
    </>
  )
}

export function TransformationDialog({
  open,
  onOpenChange,
  current,
  onSave,
  title = 'Transform image',
  onPreviewChange,
  onClose,
  variant = 'dialog',
}: TransformationDialogProps) {
  const [local, setLocal] = useState<DisplayAdjustments>({
    ...defaultAdjustments,
    ...current,
  })

  useEffect(() => {
    setLocal((prev) => ({ ...defaultAdjustments, ...current, ...prev }))
  }, [current, open])

  const merged = mergeDisplayAdjustments(current, local)
  const isEmptyLocal = (Object.keys(local) as AdjustmentKey[]).every(
    (k) => local[k] === undefined || local[k] === defaultAdjustments[k]
  )
  const previewAdjustments = isEmptyLocal ? EMPTY_ADJUSTMENTS : merged
  useEffect(() => {
    if (open && onPreviewChange) {
      onPreviewChange(previewAdjustments)
    }
  }, [open, previewAdjustments, onPreviewChange])

  const update = useCallback((patch: Partial<DisplayAdjustments>) => {
    setLocal((prev) => {
      const next = { ...prev, ...patch }
      const isEmpty = (Object.keys(next) as AdjustmentKey[]).every(
        (k) =>
          next[k] === undefined ||
          next[k] === defaultAdjustments[k]
      )
      return isEmpty ? {} : next
    })
  }, [])

  const removeAdjustment = useCallback((key: AdjustmentKey) => {
    const def = defaultAdjustments[key]
    update({ [key]: def } as Partial<DisplayAdjustments>)
  }, [update])

  const handleRotateLeft = useCallback(() => {
    setLocal((prev) => {
      const r = (prev.rotate ?? 0) - 90
      const normalized = ((r % 360) + 360) % 360
      return { ...prev, rotate: normalized === 0 ? 0 : normalized }
    })
  }, [])

  const handleRotateRight = useCallback(() => {
    setLocal((prev) => {
      const r = (prev.rotate ?? 0) + 90
      const normalized = ((r % 360) + 360) % 360
      return { ...prev, rotate: normalized === 0 ? 0 : normalized }
    })
  }, [])

  const handleReset = async () => {
    setLocal({})
    await Promise.resolve(onSave(null))
    // Keep panel open so user can continue editing
  }

  const handleApply = async () => {
    const hasAny = (Object.keys(local) as AdjustmentKey[]).some(
      (k) =>
        local[k] !== undefined &&
        local[k] !== defaultAdjustments[k]
    )
    await Promise.resolve(onSave(hasAny ? local : null))
    // Keep panel open so user can continue editing
  }

  const handleCloseWithoutSave = () => {
    onOpenChange(false)
    onClose?.()
  }

  const activeList = getActiveAdjustmentsShort(local)

  const content = (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
        {variant === 'panel' && (
          <div className="flex items-center justify-between border-b px-3 py-2 flex-shrink-0">
            <h2 className="font-semibold text-sm">{title}</h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleCloseWithoutSave}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="px-3 py-2 flex flex-col gap-0 flex-shrink-0">
        {/* Invert: label + switch (aligned right) */}
        <div className="flex items-center gap-3 py-2 border-b border-border/50">
          <span className={cn('text-sm', LABEL_WIDTH)}>Invert</span>
          <div className="flex-1 flex justify-end">
            <InlineSwitch
              checked={!!local.invert}
              onCheckedChange={(checked) => update({ invert: checked })}
              ariaLabel="Invert colors"
            />
          </div>
        </div>
        {/* Flip H: label + switch */}
        <div className="flex items-center gap-3 py-2 border-b border-border/50">
          <span className={cn('text-sm', LABEL_WIDTH)}>Flip H</span>
          <div className="flex-1 flex justify-end">
            <InlineSwitch
              checked={!!local.flip_h}
              onCheckedChange={(checked) => update({ flip_h: checked })}
              ariaLabel="Flip horizontal"
            />
          </div>
        </div>
        {/* Flip V: label + switch */}
        <div className="flex items-center gap-3 py-2 border-b border-border/50">
          <span className={cn('text-sm', LABEL_WIDTH)}>Flip V</span>
          <div className="flex-1 flex justify-end">
            <InlineSwitch
              checked={!!local.flip_v}
              onCheckedChange={(checked) => update({ flip_v: checked })}
              ariaLabel="Flip vertical"
            />
          </div>
        </div>
        {/* Gamma: label + slider (same x as other sliders) */}
        <div className="flex items-center gap-3 py-2 border-b border-border/50">
          <span className={cn('text-sm', LABEL_WIDTH)}>Gamma</span>
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <InlineSlider
              value={local.gamma ?? 1}
              min={0.2}
              max={2}
              step={0.05}
              onChange={(v) => update({ gamma: v })}
            />
          </div>
        </div>
        {/* Brightness: label + slider */}
        <div className="flex items-center gap-3 py-2 border-b border-border/50">
          <span className={cn('text-sm', LABEL_WIDTH)}>Brightness</span>
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <InlineSlider
              value={local.brightness ?? 1}
              min={0.2}
              max={2}
              step={0.05}
              onChange={(v) => update({ brightness: v })}
            />
          </div>
        </div>
        {/* Contrast: label + slider */}
        <div className="flex items-center gap-3 py-2 border-b border-border/50">
          <span className={cn('text-sm', LABEL_WIDTH)}>Contrast</span>
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <InlineSlider
              value={local.contrast ?? 1}
              min={0.2}
              max={2}
              step={0.05}
              onChange={(v) => update({ contrast: v })}
            />
          </div>
        </div>
        {/* Rotate: label + icon buttons (aligned right) */}
        <div className="flex items-center gap-3 py-2 border-b border-border/50">
          <span className={cn('text-sm', LABEL_WIDTH)}>Rotate</span>
          <div className="flex-1 flex justify-end gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleRotateLeft} aria-label="Rotate counter-clockwise">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleRotateRight} aria-label="Rotate clockwise">
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {/* Sharpen: label + slider */}
        <div className="flex items-center gap-3 py-2 border-b border-border/50">
          <span className={cn('text-sm', LABEL_WIDTH)}>Sharpen</span>
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <InlineSlider
              value={local.sharpen ?? 0}
              min={0}
              max={2}
              step={0.1}
              onChange={(v) => update({ sharpen: v })}
            />
          </div>
        </div>
        </div>
        {/* Active transformations at bottom so controls don't bounce */}
        {activeList.length > 0 && (
          <div className="px-3 py-2 mt-2 border-t flex flex-col gap-1 flex-shrink-0">
            <span className="text-xs font-medium text-muted-foreground">Active</span>
            <ul className="flex flex-col gap-0.5">
              {activeList.map(({ key, label }) => (
                <li
                  key={key}
                  className="flex items-center justify-between gap-2 rounded py-0.5 px-1.5 text-xs bg-muted/50"
                >
                  <span>{label}</span>
                  <button
                    type="button"
                    className="rounded p-0.5 hover:bg-muted"
                    onClick={() => removeAdjustment(key)}
                    aria-label={`Remove ${label}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className={cn('flex-shrink-0 pt-3 flex flex-wrap gap-2', variant === 'panel' ? 'px-3 pb-3' : 'px-0 pb-2')}>
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset
          </Button>
          <Button size="sm" onClick={handleApply}>
            Apply
          </Button>
          <Button variant="outline" size="sm" onClick={handleCloseWithoutSave}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )

  if (variant === 'panel') {
    return (
      <div className="flex flex-col w-full min-w-[280px] max-w-[340px] h-full max-h-full border-l bg-background overflow-hidden">
        {content}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm flex flex-col max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}
