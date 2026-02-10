import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  useGetPatientFieldConfigQuery,
  useUpdatePatientFieldConfigOrderMutation,
  useUpdatePatientFieldConfigDisplayMutation,
  useUpdatePatientFieldConfigRequiredMutation,
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

interface SortableFieldRowProps {
  field: {
    id: number
    field_key: string
    field_label: string
    display_order: number
    is_displayed: boolean
    is_required: boolean
  }
  onToggleDisplay: (id: number, currentValue: boolean) => void
  onToggleRequired: (id: number, currentValue: boolean) => void
}

function SortableFieldRow({ field, onToggleDisplay, onToggleRequired }: SortableFieldRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="border-b hover:bg-gray-50 transition-colors bg-white"
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
        <span className="text-sm text-gray-900">{field.field_label}</span>
      </td>
      <td className="py-3 px-4 text-center">
        {field.field_key === 'first_name' || field.field_key === 'last_name' ? (
          <span className="text-xs text-gray-400">Always shown</span>
        ) : (
          <input
            type="checkbox"
            checked={field.is_displayed}
            onChange={() => onToggleDisplay(field.id, field.is_displayed)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </td>
      <td className="py-3 px-4 text-center">
        {field.field_key === 'first_name' || field.field_key === 'last_name' ? (
          <span className="text-xs text-gray-400">Always required</span>
        ) : (
          <input
            type="checkbox"
            checked={field.is_required}
            onChange={() => onToggleRequired(field.id, field.is_required)}
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
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data, loading, refetch } = useGetPatientFieldConfigQuery({
    variables: { clinicId: session?.clinicId || 0 },
    skip: !session?.clinicId,
  })

  const [updateFieldConfigOrder] = useUpdatePatientFieldConfigOrderMutation()
  const [updateFieldConfigDisplay] = useUpdatePatientFieldConfigDisplayMutation()
  const [updateFieldConfigRequired] = useUpdatePatientFieldConfigRequiredMutation()

  const fields = data?.patient_field_config || []

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

    const oldIndex = fields.findIndex((f) => f.id === active.id)
    const newIndex = fields.findIndex((f) => f.id === over.id)

    if (oldIndex === -1 || newIndex === -1) {
      return
    }

    const reorderedFields = arrayMove(fields, oldIndex, newIndex)

    try {
      setIsSaving(true)
      setError(null)

      // Update all affected fields' display_order
      const updates = reorderedFields.map((field, index) => ({
        id: field.id,
        displayOrder: index * 10, // Use increments of 10 for easier reordering
      }))

      // Update all fields in parallel
      await Promise.all(
        updates.map((update) =>
          updateFieldConfigOrder({
            variables: {
              id: update.id,
              displayOrder: update.displayOrder,
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

  const handleToggleDisplay = async (id: number, currentValue: boolean) => {
    try {
      await updateFieldConfigDisplay({
        variables: {
          id,
          isDisplayed: !currentValue,
        },
      })
      await refetch()
    } catch (err: any) {
      setError(err.message || 'Failed to update field')
    }
  }

  const handleToggleRequired = async (id: number, currentValue: boolean) => {
    try {
      await updateFieldConfigRequired({
        variables: {
          id,
          isRequired: !currentValue,
        },
      })
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
                  <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                    {fields.map((field) => (
                      <SortableFieldRow
                        key={field.id}
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
