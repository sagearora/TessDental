import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Edit, Trash2, X, Check } from 'lucide-react'
import { useGetOperatoriesQuery, useCreateOperatoryMutation, useUpdateOperatoryMutation, useDeleteOperatoryMutation, useGetUserClinicsQuery, useGetUserEffectiveCapabilitiesQuery } from '@/gql/generated'
import { useAuth } from '@/contexts/AuthContext'

interface OperatoryManagementProps {
  clinicId: number
}

interface OperatoryFormData {
  name: string
  isBookable: boolean
  isActive: boolean
  color: string
}

export function OperatoryManagement({ clinicId }: OperatoryManagementProps) {
  const { session } = useAuth()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<OperatoryFormData>({
    name: '',
    isBookable: true,
    isActive: true,
    color: '(128,128,128,1)',
  })

  const { data, loading, refetch } = useGetOperatoriesQuery({
    variables: { clinicId },
    skip: !clinicId,
  })

  const { data: clinicsData } = useGetUserClinicsQuery({
    skip: !session,
  })

  const currentClinicUser = clinicsData?.clinic_user_v?.find(
    (cu) => cu.clinic_id === session?.clinicId && cu.user_id === session?.user?.id
  )

  const { data: capabilitiesData, loading: capabilitiesLoading } = useGetUserEffectiveCapabilitiesQuery({
    variables: { 
      clinicId: session?.clinicId || 0,
      userId: session?.user?.id || '',
    },
    skip: !session?.clinicId || !session?.user?.id,
  })

  const capabilities = new Set(
    capabilitiesData?.clinic_user_effective_capabilities_v
      ?.map((c) => c.capability_key)
      .filter((key): key is string => key !== null && key !== undefined) || []
  )

  const hasClinicManageCapability = !capabilitiesLoading && (capabilities.has('clinic_manage') || capabilities.has('system_admin'))

  const [createOperatory] = useCreateOperatoryMutation()
  const [updateOperatory] = useUpdateOperatoryMutation()
  const [deleteOperatory] = useDeleteOperatoryMutation()

  const operatories = data?.operatory_v || []

  const handleStartAdd = () => {
    setFormData({
      name: '',
      isBookable: true,
      isActive: true,
      color: '(128,128,128,1)',
    })
    setIsAdding(true)
    setEditingId(null)
  }

  const handleStartEdit = (operatory: typeof operatories[0]) => {
    if (!operatory.id) return
    setFormData({
      name: operatory.name || '',
      isBookable: operatory.is_bookable ?? true,
      isActive: operatory.is_active ?? true,
      color: operatory.color || '(128,128,128,1)',
    })
    setEditingId(operatory.id)
    setIsAdding(false)
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({
      name: '',
      isBookable: true,
      isActive: true,
      color: '(128,128,128,1)',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingId) {
        await updateOperatory({
          variables: {
            id: editingId,
            name: formData.name,
            isBookable: formData.isBookable,
            isActive: formData.isActive,
            color: formData.color,
          },
        })
      } else {
        await createOperatory({
          variables: {
            clinicId,
            name: formData.name,
            isBookable: formData.isBookable,
            isActive: formData.isActive,
            color: formData.color,
          },
        })
      }
      await refetch()
      handleCancel()
    } catch (error) {
      console.error('Error saving operatory:', error)
      // TODO: Show error message to user
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this operatory?')) {
      return
    }

    try {
      await deleteOperatory({
        variables: { id },
      })
      await refetch()
    } catch (error) {
      console.error('Error deleting operatory:', error)
      // TODO: Show error message to user
    }
  }

  const parseColor = (colorStr: string): { r: number; g: number; b: number; a: number } => {
    const match = colorStr.match(/\((\d+),(\d+),(\d+),([\d.]+)\)/)
    if (match) {
      return {
        r: parseInt(match[1], 10),
        g: parseInt(match[2], 10),
        b: parseInt(match[3], 10),
        a: parseFloat(match[4]),
      }
    }
    return { r: 128, g: 128, b: 128, a: 1 }
  }

  const formatColor = (r: number, g: number, b: number, a: number): string => {
    return `(${r},${g},${b},${a})`
  }

  const colorToHex = (colorStr: string): string => {
    const { r, g, b } = parseColor(colorStr)
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }

  const hexToColor = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return formatColor(r, g, b, 1)
  }

  if (loading) {
    return <div className="text-sm text-gray-500">Loading operatories...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">Operatories</h4>
        {hasClinicManageCapability && (
          <Button variant="outline" size="sm" onClick={handleStartAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Operatory
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId !== null) && (
        <form onSubmit={handleSubmit} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="operatory-name" className="text-sm font-medium text-gray-700">
                Name *
              </label>
              <Input
                id="operatory-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Operatory name"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="operatory-color" className="text-sm font-medium text-gray-700">
                Color
              </label>
              <div className="flex gap-2">
                <Input
                  id="operatory-color"
                  type="color"
                  value={colorToHex(formData.color)}
                  onChange={(e) => setFormData({ ...formData, color: hexToColor(e.target.value) })}
                  className="h-10 w-20"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="(r,g,b,a)"
                  className="flex-1 font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isBookable}
                onChange={(e) => setFormData({ ...formData, isBookable: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Bookable</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" size="sm">
              <Check className="h-4 w-4 mr-2" />
              {editingId ? 'Save' : 'Create'}
            </Button>
          </div>
        </form>
      )}

      {/* Operatories List */}
      {operatories.length === 0 && !isAdding ? (
        <p className="text-sm text-gray-500">No operatories found. Click "Add Operatory" to create one.</p>
      ) : (
        <div className="space-y-2">
          {operatories.map((operatory) => {
            if (!operatory.id) return null
            const isEditing = editingId === operatory.id
            const colorHex = colorToHex(operatory.color || '(128,128,128,1)')

            if (isEditing) {
              return null // Form is shown above
            }

            return (
              <div
                key={operatory.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: colorHex }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{operatory.name}</p>
                    <div className="flex gap-2 mt-1">
                      {operatory.is_bookable && (
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                          Bookable
                        </span>
                      )}
                      {!operatory.is_active && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-800 rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {hasClinicManageCapability && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartEdit(operatory)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(operatory.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
