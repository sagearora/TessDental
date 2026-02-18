import { useState, useEffect } from 'react'
import { assignAssetToMountSlot, removeAssetFromMountSlot, type ImagingMount, type ImagingAsset } from '@/api/imaging'
import {
  getMountTemplate,
  getMountLayout,
  getEffectiveSlotOrder,
  type DisplayAdjustments,
} from '@/api/mounts'
import { mergeDisplayAdjustments } from '@/lib/display-adjustments'
import type { MountCanvasSlotAssignment } from './MountCanvas'
import { MountCanvas } from './MountCanvas'

interface MountViewProps {
  mount: ImagingMount
  availableAssets?: ImagingAsset[]
  onMountUpdate?: () => void
  onSlotClick?: (slotId: string, currentAssetId: number | null) => void
  onSlotDoubleClick?: (slotId: string, asset: ImagingAsset | null) => void
  onSlotRightClick?: (slotId: string, event: React.MouseEvent) => void
}

const IMAGING_ASSET_DROP_TYPE = 'application/x-tess-imaging-asset'

export function MountView({ mount, availableAssets = [], onMountUpdate, onSlotClick, onSlotDoubleClick, onSlotRightClick }: MountViewProps) {
  const [slotAssignments, setSlotAssignments] = useState<Map<string, ImagingAsset | null>>(new Map())
  const [isAssigning, setIsAssigning] = useState(false)
  const [dragOverSlotId, setDragOverSlotId] = useState<string | null>(null)

  const template = getMountTemplate(mount)
  const layout = getMountLayout(template)
  const slotOrder = template ? getEffectiveSlotOrder(template, null) : []
  const defaultTransforms = (template?.default_slot_transformations ?? {}) as Record<string, DisplayAdjustments>
  const slotsData = mount.mount_slots ?? mount.slots ?? []

  useEffect(() => {
    const templateFromMount = getMountTemplate(mount)
    const layoutFromMount = getMountLayout(templateFromMount)
    const slotsFromMount = mount.mount_slots ?? mount.slots ?? []
    if (!layoutFromMount) return

    const assignments = new Map<string, ImagingAsset | null>()
    layoutFromMount.slots.forEach((slot) => {
      assignments.set(slot.slot_id, null)
    })

    slotsFromMount.forEach((slot) => {
      if (slot.asset && slot.asset.id) {
        const asset: ImagingAsset = {
          id: slot.asset.id,
          clinic_id: 0,
          patient_id: 0,
          study_id: null,
          modality: slot.asset.modality || 'PHOTO',
          mime_type: 'image/jpeg',
          size_bytes: 0,
          captured_at: slot.asset.captured_at || new Date().toISOString(),
          source_device: null,
          storage_key: '',
          thumb_key: slot.asset.thumb_key || null,
          web_key: slot.asset.web_key || null,
          name: slot.asset.name || null,
          image_source: (slot.asset.image_source as ImagingAsset['image_source']) || null,
          display_adjustments: slot.asset.display_adjustments ?? undefined,
        }
        assignments.set(slot.slot_id, asset)
      }
    })

    setSlotAssignments(assignments)
  }, [mount])

  const handleSlotClick = async (slotId: string, currentAsset: ImagingAsset | null) => {
    if (onSlotClick) {
      onSlotClick(slotId, currentAsset?.id || null)
      return
    }

    if (currentAsset) {
      if (confirm('Remove this image from the mount?')) {
        setIsAssigning(true)
        try {
          await removeAssetFromMountSlot(mount.id, slotId)
          setSlotAssignments((prev) => {
            const next = new Map(prev)
            next.set(slotId, null)
            return next
          })
          onMountUpdate?.()
        } catch (error) {
          console.error('Failed to remove asset from slot:', error)
        } finally {
          setIsAssigning(false)
        }
      }
    } else {
      if (availableAssets.length > 0) {
        const assetToAssign = availableAssets[0]
        setIsAssigning(true)
        try {
          await assignAssetToMountSlot(mount.id, slotId, assetToAssign.id)
          setSlotAssignments((prev) => {
            const next = new Map(prev)
            next.set(slotId, assetToAssign)
            return next
          })
          onMountUpdate?.()
        } catch (error) {
          console.error('Failed to assign asset to slot:', error)
        } finally {
          setIsAssigning(false)
        }
      }
    }
  }

  const handleSlotDrop = async (slotId: string, e: React.DragEvent) => {
    e.preventDefault()
    setDragOverSlotId(null)
    const raw = e.dataTransfer.getData(IMAGING_ASSET_DROP_TYPE)
    if (!raw) return
    const assetId = Number(raw)
    if (!Number.isFinite(assetId)) return
    setIsAssigning(true)
    try {
      await assignAssetToMountSlot(mount.id, slotId, assetId)
      const asset = availableAssets.find((a) => a.id === assetId)
      setSlotAssignments((prev) => {
        const next = new Map(prev)
        next.set(slotId, asset ?? null)
        return next
      })
      onMountUpdate?.()
    } catch (error) {
      console.error('Failed to assign asset from drop:', error)
    } finally {
      setIsAssigning(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes(IMAGING_ASSET_DROP_TYPE)) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    }
  }

  if (!layout || layout.slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No slot definitions found for this mount template</p>
      </div>
    )
  }

  const canvasSlotAssignments: MountCanvasSlotAssignment[] = layout.slots.map((slot) => {
    const asset = slotAssignments.get(slot.slot_id) ?? null
    const templateDefaults = defaultTransforms[slot.slot_id]
    const slotOverrides = slotsData.find((s) => s.slot_id === slot.slot_id)?.adjustments ?? null
    const adjustments = mergeDisplayAdjustments(templateDefaults, slotOverrides)
    return { slot_id: slot.slot_id, asset, adjustments }
  })

  return (
    <div className="w-full h-full max-w-full max-h-full min-h-0 flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center overflow-hidden p-4">
        <MountCanvas
          width={layout.width}
          height={layout.height}
          slots={layout.slots}
          slotAssignments={canvasSlotAssignments}
          showOrderLabels
          slotOrder={slotOrder}
          interactive
          isAssigning={isAssigning}
          dragOverSlotId={dragOverSlotId}
          onSlotClick={handleSlotClick}
          onSlotDoubleClick={onSlotDoubleClick}
          onSlotRightClick={onSlotRightClick}
          onSlotDragOver={handleDragOver}
          onSlotDragEnter={setDragOverSlotId}
          onSlotDragLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverSlotId(null)
          }}
          onSlotDrop={handleSlotDrop}
        />
      </div>
      <div className="text-xs text-gray-500 flex-shrink-0 py-1">
        <p>
          {Array.from(slotAssignments.values()).filter((a) => a !== null).length} of {layout.slots.length} slots filled
        </p>
      </div>
    </div>
  )
}
