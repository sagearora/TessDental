import { useState, useEffect } from 'react'
import { AuthenticatedImage } from './AuthenticatedImage'
import { ImageIcon, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { assignAssetToMountSlot, removeAssetFromMountSlot, type ImagingMount, type ImagingAsset } from '@/api/imaging'
import { getMountTemplate } from '@/lib/mount-templates'

interface MountViewProps {
  mount: ImagingMount
  availableAssets?: ImagingAsset[]
  onMountUpdate?: () => void
  onSlotClick?: (slotId: string, currentAssetId: number | null) => void
}

export function MountView({ mount, availableAssets = [], onMountUpdate, onSlotClick }: MountViewProps) {
  const [slotAssignments, setSlotAssignments] = useState<Map<string, ImagingAsset | null>>(new Map())
  const [isAssigning, setIsAssigning] = useState(false)

  // Initialize slot assignments from mount slots
  useEffect(() => {
    const assignments = new Map<string, ImagingAsset | null>()
    const slotDefs = mount.template?.slot_definitions || []
    
    // Initialize all slots as empty
    slotDefs.forEach((slot) => {
      assignments.set(slot.slot_id, null)
    })

    // Fill in assigned assets
    if (mount.slots) {
      mount.slots.forEach((slot) => {
        if (slot.asset && slot.asset.id) {
          // Convert API response to ImagingAsset format if needed
          const asset: ImagingAsset = {
            id: slot.asset.id,
            clinic_id: 0, // Not needed for display
            patient_id: 0, // Not needed for display
            study_id: null,
            modality: slot.asset.modality || 'PHOTO',
            mime_type: 'image/jpeg', // Default
            size_bytes: 0, // Not needed for display
            captured_at: slot.asset.captured_at || new Date().toISOString(),
            source_device: null,
            storage_key: '',
            thumb_key: slot.asset.thumb_key || null,
            web_key: slot.asset.web_key || null,
            name: slot.asset.name || null,
            image_source: slot.asset.image_source || null,
          }
          assignments.set(slot.slot_id, asset)
        }
      })
    }

    setSlotAssignments(assignments)
  }, [mount])

  const handleSlotClick = async (slotId: string, currentAsset: ImagingAsset | null) => {
    if (onSlotClick) {
      onSlotClick(slotId, currentAsset?.id || null)
      return
    }

    // Default behavior: show asset selector or remove asset
    if (currentAsset) {
      // Remove asset from slot
      if (confirm('Remove this image from the mount?')) {
        setIsAssigning(true)
        try {
          await removeAssetFromMountSlot(mount.id, slotId)
          setSlotAssignments((prev) => {
            const next = new Map(prev)
            next.set(slotId, null)
            return next
          })
          if (onMountUpdate) {
            onMountUpdate()
          }
        } catch (error) {
          console.error('Failed to remove asset from slot:', error)
        } finally {
          setIsAssigning(false)
        }
      }
    } else {
      // Assign asset to slot - for now, just use first available asset
      // In a full implementation, this would open a dialog to select an asset
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
          if (onMountUpdate) {
            onMountUpdate()
          }
        } catch (error) {
          console.error('Failed to assign asset to slot:', error)
        } finally {
          setIsAssigning(false)
        }
      }
    }
  }

  const slotDefinitions = mount.template?.slot_definitions || []
  const layoutConfig = mount.template?.layout_config

  if (!slotDefinitions.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No slot definitions found for this mount template</p>
      </div>
    )
  }

  // Calculate grid dimensions
  const maxRow = Math.max(...slotDefinitions.map((s) => s.row))
  const maxCol = Math.max(...slotDefinitions.map((s) => s.col))
  const rows = maxRow + 1
  const cols = maxCol + 1

  // Create grid layout
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gap: '8px',
    aspectRatio: layoutConfig?.aspectRatio || `${cols}:${rows}`,
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border p-4">
        <div style={gridStyle} className="w-full">
          {slotDefinitions.map((slotDef) => {
            const asset = slotAssignments.get(slotDef.slot_id) || null
            const isEmpty = !asset

            return (
              <div
                key={slotDef.slot_id}
                onClick={() => handleSlotClick(slotDef.slot_id, asset)}
                className={`
                  border-2 rounded-lg overflow-hidden cursor-pointer transition-all
                  ${isEmpty 
                    ? 'border-dashed border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100' 
                    : 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-md'
                  }
                  ${isAssigning ? 'opacity-50 cursor-wait' : ''}
                `}
                style={{
                  gridRow: slotDef.row + 1,
                  gridColumn: slotDef.col + 1,
                }}
                title={isEmpty ? `Click to assign image to ${slotDef.label}` : `Click to remove image from ${slotDef.label}`}
              >
                {asset ? (
                  <div className="relative w-full h-full">
                    <AuthenticatedImage
                      assetId={asset.id}
                      variant="thumb"
                      alt={asset.name || `Asset ${asset.id}`}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1">
                      <div className="truncate">{asset.name || 'Untitled'}</div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-2">
                    <div className="text-gray-400 mb-2">
                      {isEmpty ? <Plus className="h-6 w-6" /> : <ImageIcon className="h-6 w-6" />}
                    </div>
                    <div className="text-xs text-gray-500 text-center">{slotDef.label}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Slot Legend */}
      <div className="text-xs text-gray-500">
        <p>
          {Array.from(slotAssignments.values()).filter((a) => a !== null).length} of {slotDefinitions.length} slots filled
        </p>
      </div>
    </div>
  )
}
