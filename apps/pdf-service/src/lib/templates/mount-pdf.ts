import type PDFDocument from 'pdfkit'
import type { MountTemplateShape, MountSlotDefinition, MountLayoutConfig } from '../imaging.js'

const MOUNT_CANVAS_WIDTH = 2000
const MOUNT_CANVAS_HEIGHT = 1000

export interface NormalizedSlot {
  slot_id: string
  x: number
  y: number
  width: number
  height: number
}

export interface MountLayout {
  width: number
  height: number
  slots: NormalizedSlot[]
}

/**
 * Normalize template to canvas layout (same logic as frontend getMountLayout).
 * Returns { width, height, slots } with slot rects in canvas pixels.
 */
export function getMountLayoutFromTemplate(template: MountTemplateShape | null): MountLayout | null {
  if (!template) return null
  const raw = template.slot_definitions
  const defs = Array.isArray(raw) ? (raw as MountSlotDefinition[]) : []
  if (defs.length === 0) return null

  const layout = template.layout_config as MountLayoutConfig | undefined
  const isCanvas =
    layout?.type === 'canvas' &&
    defs.every(
      (s) =>
        typeof s.x === 'number' &&
        typeof s.y === 'number' &&
        typeof s.width === 'number' &&
        typeof s.height === 'number'
    )

  if (isCanvas) {
    return {
      width: layout?.width ?? MOUNT_CANVAS_WIDTH,
      height: layout?.height ?? MOUNT_CANVAS_HEIGHT,
      slots: defs.map((s) => ({
        slot_id: s.slot_id,
        x: s.x!,
        y: s.y!,
        width: s.width!,
        height: s.height!,
      })),
    }
  }

  const rows = layout?.rows ?? Math.max(0, ...defs.map((s) => (s.row ?? 0) + (s.row_span ?? 1))) + 1
  const cols = layout?.cols ?? Math.max(0, ...defs.map((s) => (s.col ?? 0) + (s.col_span ?? 1))) + 1
  const cellW = MOUNT_CANVAS_WIDTH / cols
  const cellH = MOUNT_CANVAS_HEIGHT / rows
  return {
    width: MOUNT_CANVAS_WIDTH,
    height: MOUNT_CANVAS_HEIGHT,
    slots: defs.map((s) => ({
      slot_id: s.slot_id,
      x: (s.col ?? 0) * cellW,
      y: (s.row ?? 0) * cellH,
      width: (s.col_span ?? 1) * cellW,
      height: (s.row_span ?? 1) * cellH,
    })),
  }
}

export interface BuildMountPdfOptions {
  layout: MountLayout
  slotImages: Map<string, Buffer>
}

/**
 * Draw a single landscape page with the mount canvas: 2000×1000 layout scaled to fit
 * with margins; each slot that has an image gets it drawn in the correct rect (fit + center).
 */
export function buildMountPdf(
  doc: InstanceType<typeof PDFDocument>,
  options: BuildMountPdfOptions
): void {
  const { layout, slotImages } = options
  const margin = 50
  const pageWidth = doc.page.width
  const pageHeight = doc.page.height
  const scale = Math.min(
    (pageWidth - 2 * margin) / layout.width,
    (pageHeight - 2 * margin) / layout.height
  )
  const offsetX = margin
  const offsetY = margin

  for (const slot of layout.slots) {
    const buffer = slotImages.get(slot.slot_id)
    if (!buffer || buffer.length === 0) continue

    const xPdf = offsetX + slot.x * scale
    const yPdf = offsetY + slot.y * scale
    const wPdf = slot.width * scale
    const hPdf = slot.height * scale

    ;(doc as any).image(buffer, xPdf, yPdf, {
      fit: [wPdf, hPdf],
      align: 'center',
      valign: 'center',
    })
  }
}
