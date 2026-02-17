import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  useGetPatientFieldConfigQuery,
  useUpdatePatientFieldConfigOrderMutation,
  useUpdatePatientFieldConfigDisplayMutation,
  useUpdatePatientFieldConfigRequiredMutation,
  useCreatePatientFieldConfigMutation,
} from '@/gql/generated'
import { useAuth } from '@/contexts/AuthContext'
import { GripVertical } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface FieldRow {
  field_config_id: number
  field_config: {
    id: number
    key: string
    label: string
    is_active: boolean
  }
  patient_field_config_id?: number
  display_order: number
  is_displayed: boolean
  is_required: boolean
}

interface SortableFieldRowProps {
  field: FieldRow
  onToggleDisplay: (field: FieldRow) => void
  onToggleRequired: (field: FieldRow) => void
}

function SortableFieldRow({ field, onToggleDisplay, onToggleRequired }: SortableFieldRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.field_config_id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isUnconfigured = field.patient_field_config_id === undefined

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b hover:bg-gray-50 transition-colors ${
        isUnconfigured ? 'bg-gray-50 opacity-75' : 'bg-white'
      }`}
    >
      <td className="py-3 px-4">
        <div
          {...attributes}
          {...listeners}
          className="flex items-center cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm text-gray-900">
          {field.field_config?.label}
          {isUnconfigured && (
            <span className="ml-2 text-xs text-gray-400 italic">(not configured)</span>
          )}
        </span>
      </td>
      <td className="py-3 px-4 text-center">
        {field.field_config?.key === 'first_name' || field.field_config?.key === 'last_name' ? (
          <span className="text-xs text-gray-400">Always shown</span>
        ) : (
          <input
            type="checkbox"
            checked={field.is_displayed}
            onChange={() => onToggleDisplay(field)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </td>
      <td className="py-3 px-4 text-center">
        {field.field_config?.key === 'first_name' || field.field_config?.key === 'last_name' ? (
          <span className="text-xs text-gray-400">Always required</span>
        ) : (
          <input
            type="checkbox"
            checked={field.is_required}
            onChange={() => onToggleRequired(field)}
            disabled={!field.is_displayed}
            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </td>
    </tr>
  )
}

export function PatientFieldConfig() {
  const { session } = useAuth()
  const [_isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data, loading, refetch } = useGetPatientFieldConfigQuery({
    variables: { clinicId: session?.clinicId || 0 },
    skip: !session?.clinicId,
  })

  const [updateFieldConfigOrder] = useUpdatePatientFieldConfigOrderMutation()
  const [updateFieldConfigDisplay] = useUpdatePatientFieldConfigDisplayMutation()
  const [updateFieldConfigRequired] = useUpdatePatientFieldConfigRequiredMutation()
  const [createPatientFieldConfig] = useCreatePatientFieldConfigMutation()

  // Merge all field_config entries with existing patient_field_config entries
  const allFieldConfigs = data?.field_config || []
  const existingPatientConfigs = data?.patient_field_config || []
  
  // Create a map of field_config_id -> patient_field_config for quick lookup
  const patientConfigMap = new Map(
    existingPatientConfigs.map((pfc) => [pfc.field_config_id, pfc])
  )

  // Merge: for each field_config, create a row with patient_field_config data if it exists
  const fields: FieldRow[] = allFieldConfigs.map((fc) => {
    const patientConfig = patientConfigMap.get(fc.id)
    if (patientConfig) {
      return {
        field_config_id: fc.id,
        field_config: fc,
        patient_field_config_id: patientConfig.id,
        display_order: patientConfig.display_order,
        is_displayed: patientConfig.is_displayed,
        is_required: patientConfig.is_required,
      }
    } else {
      // Field doesn't have a patient_field_config entry yet - default values
      return {
        field_config_id: fc.id,
        field_config: fc,
        display_order: 9999, // Put unconfigured fields at the end
        is_displayed: false,
        is_required: false,
      }
    }
  })

  // Sort: configured fields first (by display_order), then unconfigured (by label)
  const sortedFields = [...fields].sort((a, b) => {
    const aHasConfig = a.patient_field_config_id !== undefined
    const bHasConfig = b.patient_field_config_id !== undefined
    
    if (aHasConfig && bHasConfig) {
      return a.display_order - b.display_order
    } else if (aHasConfig && !bHasConfig) {
      return -1
    } else if (!aHasConfig && bHasConfig) {
      return 1
    } else {
      return a.field_config.label.localeCompare(b.field_config.label)
    }
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: { active: { id: number | string }; over: { id: number | string } | null }) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = sortedFields.findIndex((f) => f.field_config_id === active.id)
    const newIndex = sortedFields.findIndex((f) => f.field_config_id === over.id)

    if (oldIndex === -1 || newIndex === -1) {
      return
    }

    const reorderedFields = arrayMove(sortedFields, oldIndex, newIndex)

    try {
      setIsSaving(true)
      setError(null)

      // Process all fields - create entries for unconfigured ones, update order for existing ones
      const updates = reorderedFields.map((field, index) => ({
        field,
        displayOrder: index * 10, // Use increments of 10 for easier reordering
      }))

      // Create entries for fields that don't have patient_field_config yet
      const fieldsToCreate = updates.filter(
        ({ field }) => field.patient_field_config_id === undefined
      )

      await Promise.all(
        fieldsToCreate.map(({ field, displayOrder }) =>
          createPatientFieldConfig({
            variables: {
              clinicId: session?.clinicId || 0,
              fieldConfigId: field.field_config_id,
              displayOrder,
              isDisplayed: true,
              isRequired: false,
            },
          })
        )
      )

      // Update display_order for fields that already have patient_field_config entries
      const fieldsToUpdate = updates.filter(
        ({ field }) => field.patient_field_config_id !== undefined
      )

      await Promise.all(
        fieldsToUpdate.map(({ field, displayOrder }) =>
          updateFieldConfigOrder({
            variables: {
              id: field.patient_field_config_id!,
              displayOrder,
            },
          })
        )
      )

      await refetch()
    } catch (err: any) {
      setError(err.message || 'Failed to reorder fields')
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleDisplay = async (field: FieldRow) => {
    try {
      if (field.patient_field_config_id) {
        // Update existing entry
        await updateFieldConfigDisplay({
          variables: {
            id: field.patient_field_config_id,
            isDisplayed: !field.is_displayed,
          },
        })
      } else {
        // Create new entry - find the max display_order for this clinic
        const maxOrder = Math.max(
          ...sortedFields
            .filter((f) => f.patient_field_config_id !== undefined)
            .map((f) => f.display_order),
          0
        )
        
        await createPatientFieldConfig({
          variables: {
            clinicId: session?.clinicId || 0,
            fieldConfigId: field.field_config_id,
            displayOrder: maxOrder + 10,
            isDisplayed: true,
            isRequired: false,
          },
        })
      }
      await refetch()
    } catch (err: any) {
      setError(err.message || 'Failed to update field')
    }
  }

  const handleToggleRequired = async (field: FieldRow) => {
    try {
      if (!field.patient_field_config_id) {
        // Can't set required if not displayed - create entry first
        const maxOrder = Math.max(
          ...sortedFields
            .filter((f) => f.patient_field_config_id !== undefined)
            .map((f) => f.display_order),
          0
        )
        
        await createPatientFieldConfig({
          variables: {
            clinicId: session?.clinicId || 0,
            fieldConfigId: field.field_config_id,
            displayOrder: maxOrder + 10,
            isDisplayed: true,
            isRequired: !field.is_required,
          },
        })
      } else {
        // Update existing entry
        await updateFieldConfigRequired({
          variables: {
            id: field.patient_field_config_id,
            isRequired: !field.is_required,
          },
        })
      }
      await refetch()
    } catch (err: any) {
      setError(err.message || 'Failed to update field')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8 text-gray-500">Loading patient field configuration...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Data Fields</h1>
        <p className="mt-2 text-sm text-gray-600">
          Configure which fields are displayed and required when creating or editing patients.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Profile Data Fields</CardTitle>
          <CardDescription>
            Configure the fields shown in patient creation and editing forms. Drag and drop to reorder.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 w-12"></th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Profile Data Field
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 w-32">
                      Display
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 w-32">
                      Required
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <SortableContext items={sortedFields.map((f) => f.field_config_id)} strategy={verticalListSortingStrategy}>
                    {sortedFields.map((field) => (
                      <SortableFieldRow
                        key={field.field_config_id}
                        field={field}
                        onToggleDisplay={handleToggleDisplay}
                        onToggleRequired={handleToggleRequired}
                      />
                    ))}
                  </SortableContext>
                </tbody>
              </table>
            </DndContext>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
