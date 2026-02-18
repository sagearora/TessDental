import sharp from 'sharp'

/**
 * Display adjustments (same shape as web api/mounts DisplayAdjustments).
 * Applied to image buffer before generating thumb/web.
 */
export interface DisplayAdjustments {
  invert?: boolean
  flip_h?: boolean
  flip_v?: boolean
  rotate?: number
  gamma?: number
  brightness?: number
  contrast?: number
  sharpen?: number
}

/**
 * Apply display adjustments to an image buffer using sharp.
 * Order: rotate -> flop/flip -> negate -> brightness/contrast/gamma -> sharpen.
 * Returns a buffer suitable for passing to generateThumb/generateWebVersion.
 */
export async function applyDisplayAdjustments(
  input: Buffer,
  adj: DisplayAdjustments | null | undefined
): Promise<Buffer> {
  if (!adj || Object.keys(adj).length === 0) {
    return input
  }

  const rotate = adj.rotate ?? 0
  const flipH = adj.flip_h === true
  const flipV = adj.flip_v === true
  const invert = adj.invert === true
  const gamma = adj.gamma ?? 1
  const brightness = adj.brightness ?? 1
  const contrast = adj.contrast ?? 1
  const sharpenAmount = adj.sharpen ?? 0

  let pipeline = sharp(input)

  if (rotate !== 0) {
    pipeline = pipeline.rotate(rotate)
  }
  if (flipH) {
    pipeline = pipeline.flop()
  }
  if (flipV) {
    pipeline = pipeline.flip()
  }
  if (invert) {
    pipeline = pipeline.negate()
  }

  if (brightness !== 1) {
    pipeline = pipeline.modulate({ brightness })
  }
  if (gamma !== 1) {
    pipeline = pipeline.gamma(gamma)
  }
  if (contrast !== 1) {
    const a = contrast
    const b = 0.5 * (1 - contrast)
    pipeline = pipeline.linear(a, b)
  }
  if (sharpenAmount > 0) {
    pipeline = pipeline.sharpen({ sigma: Math.min(sharpenAmount, 3) })
  }

  return pipeline.toBuffer()
}
