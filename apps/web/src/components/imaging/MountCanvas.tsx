import { AuthenticatedImage } from './AuthenticatedImage'
import type { ImagingAsset } from '@/api/imaging'
import type { NormalizedCanvasSlot, DisplayAdjustments } from '@/api/mounts'
import { displayAdjustmentsToFilter, displayAdjustmentsToTransform } from '@/lib/display-adjustments'

export interface MountCanvasSlotAssignment {
  slot_id: string
  asset: ImagingAsset | null
  /** Merged adjustments for this slot (template default + slot overrides) */
  adjustments: DisplayAdjustments
}

export interface MountCanvasProps {
  width: number
  height: number
  slots: NormalizedCanvasSlot[]
  slotAssignments: MountCanvasSlotAssignment[]
  /** Show slot order labels (1, 2, 3...) */
  showOrderLabels?: boolean
  slotOrder?: string[]
  /** Interactive: click, drag-drop, right-click */
  interactive?: boolean
  isAssigning?: boolean
  dragOverSlotId?: string | null
  onSlotClick?: (slotId: string, asset: ImagingAsset | null) => void
  onSlotDoubleClick?: (slotId: string, asset: ImagingAsset | null) => void
  onSlotRightClick?: (slotId: string, event: React.MouseEvent) => void
  onSlotDragOver?: (e: React.DragEvent) => void
  onSlotDragEnter?: (slotId: string) => void
  onSlotDragLeave?: (e: React.DragEvent) => void
  onSlotDrop?: (slotId: string, e: React.DragEvent) => void
  /** Optional class for the outer wrapper */
  className?: string
}

export function MountCanvas({
  width,
  height,
  slots,
  slotAssignments,
  showOrderLabels = false,
  slotOrder = [],
  interactive = true,
  isAssigning = false,
  dragOverSlotId = null,
  onSlotClick,
  onSlotDoubleClick,
  onSlotRightClick,
  onSlotDragOver,
  onSlotDragEnter,
  onSlotDragLeave,
  onSlotDrop,
  className = '',
}: MountCanvasProps) {
  const assignmentMap = new Map(slotAssignments.map((a) => [a.slot_id, a]))

  const wrapperStyle: React.CSSProperties = {
    aspectRatio: width / height,
    maxWidth: '100%',
    maxHeight: '100%',
    width: '100%',
    height: '100%',
    minHeight: 0,
  }
  const innerStyle: React.CSSProperties = {
    aspectRatio: width / height,
    maxWidth: '100%',
    maxHeight: '100%',
    minHeight: 0,
  }

  return (
    <div
      className={`flex flex-col items-center justify-center overflow-hidden ${className}`}
      style={wrapperStyle}
    >
      <div
        className="relative w-full h-full bg-white rounded-lg border overflow-hidden"
        style={innerStyle}
      >
        <div className="absolute inset-0" style={{ width: '100%', height: '100%' }}>
          {slots.map((slot) => {
            const assignment = assignmentMap.get(slot.slot_id)
            const asset = assignment?.asset ?? null
            const adjustments = assignment?.adjustments ?? {}
            const isEmpty = !asset
            const orderIndex = slotOrder.indexOf(slot.slot_id)
            const orderLabel = showOrderLabels && orderIndex >= 0 ? orderIndex + 1 : null

            const filter = displayAdjustmentsToFilter(adjustments)
            const transform = displayAdjustmentsToTransform(adjustments)
            const hasAdjustments = filter !== 'none' || transform !== 'none'

            const leftPct = (slot.x / width) * 100
            const topPct = (slot.y / height) * 100
            const widthPct = (slot.width / width) * 100
            const heightPct = (slot.height / height) * 100

            const isDragOver = dragOverSlotId === slot.slot_id

            return (
              <div
                key={slot.slot_id}
                className={`
                  absolute border-2 rounded-lg overflow-hidden transition-all
                  ${interactive ? 'cursor-pointer' : ''}
                  ${isEmpty ? 'border-dashed border-gray-300 bg-white hover:border-gray-400' : 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-md'}
                  ${isDragOver ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50' : ''}
                  ${isAssigning ? 'opacity-50 cursor-wait' : ''}
                `}
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  width: `${widthPct}%`,
                  height: `${heightPct}%`,
                }}
                onClick={interactive && onSlotClick ? () => onSlotClick(slot.slot_id, asset) : undefined}
                onDoubleClick={
                  interactive && onSlotDoubleClick && asset
                    ? (e) => {
                        e.stopPropagation()
                        onSlotDoubleClick(slot.slot_id, asset)
                      }
                    : undefined
                }
                onContextMenu={
                  interactive && onSlotRightClick
                    ? (e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onSlotRightClick(slot.slot_id, e)
                      }
                    : undefined
                }
                onDragOver={interactive ? onSlotDragOver : undefined}
                onDragEnter={interactive && onSlotDragEnter ? () => onSlotDragEnter(slot.slot_id) : undefined}
                onDragLeave={interactive ? onSlotDragLeave : undefined}
                onDrop={interactive && onSlotDrop ? (e) => onSlotDrop(slot.slot_id, e) : undefined}
                title={
                  interactive
                    ? isEmpty
                      ? 'Left-click to assign, drag image here, or Right-click for options'
                      : 'Left-click to remove/replace, drag to replace, or Right-click for options'
                    : undefined
                }
              >
                {orderLabel != null && (
                  <span className="absolute top-1 left-1 z-10 rounded bg-black/60 text-white text-xs font-medium px-1.5 py-0.5">
                    {orderLabel}
                  </span>
                )}
                {asset ? (
                  <div className="relative w-full h-full min-h-0 min-w-0 overflow-hidden">
                    <div
                      className="w-full h-full min-h-0 min-w-0"
                      style={{
                        filter: hasAdjustments ? filter : undefined,
                        transform: hasAdjustments ? transform : undefined,
                      }}
                    >
                      <AuthenticatedImage
                        assetId={asset.id}
                        variant="thumb"
                        alt={asset.name || `Asset ${asset.id}`}
                        className="w-full h-full object-contain min-h-0 min-w-0"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-white" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
