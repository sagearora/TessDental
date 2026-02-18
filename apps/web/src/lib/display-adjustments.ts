import type { DisplayAdjustments } from '@/api/mounts'

/**
 * Build CSS filter string from display adjustments (non-destructive; display-only).
 * Supports: invert, brightness, contrast. Gamma/sharpen approximated or left for canvas if needed.
 */
export function displayAdjustmentsToFilter(adj: DisplayAdjustments | null | undefined): string {
  if (!adj) return 'none'
  const parts: string[] = []
  if (adj.invert) parts.push('invert(1)')
  if (adj.brightness != null && adj.brightness !== 1) parts.push(`brightness(${adj.brightness})`)
  if (adj.contrast != null && adj.contrast !== 1) parts.push(`contrast(${adj.contrast})`)
  if (adj.gamma != null && adj.gamma !== 1) {
    // CSS has no gamma(); approximate with brightness or use filter: url() with SVG feComponentTransfer
    parts.push(`brightness(${Math.pow(adj.gamma, 0.5)})`)
  }
  if (adj.sharpen != null && adj.sharpen > 0) {
    parts.push(`contrast(${1 + adj.sharpen * 0.2})`)
  }
  return parts.length === 0 ? 'none' : parts.join(' ')
}

/**
 * Build CSS transform string for rotate and flip (scaleX/scaleY).
 */
export function displayAdjustmentsToTransform(adj: DisplayAdjustments | null | undefined): string {
  if (!adj) return 'none'
  const rotate = adj.rotate ?? 0
  const scaleX = adj.flip_h ? -1 : 1
  const scaleY = adj.flip_v ? -1 : 1
  if (rotate === 0 && scaleX === 1 && scaleY === 1) return 'none'
  return `rotate(${rotate}deg) scaleX(${scaleX}) scaleY(${scaleY})`
}

export function mergeDisplayAdjustments(
  base: DisplayAdjustments | null | undefined,
  overrides: DisplayAdjustments | null | undefined
): DisplayAdjustments {
  if (!overrides) return base ?? {}
  if (!base) return overrides ?? {}
  return { ...base, ...overrides }
}
