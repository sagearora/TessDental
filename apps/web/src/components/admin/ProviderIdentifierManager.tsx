import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { useGetUserProviderIdentifiersQuery } from '@/gql/generated'
import {
  createProviderIdentifier,
  updateProviderIdentifier,
  deleteProviderIdentifier,
  type CreateProviderIdentifierRequest,
  type UpdateProviderIdentifierRequest,
} from '@/api/userManagement'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface ProviderIdentifierManagerProps {
  userId: string
  onUpdate?: () => void
}

const PROVINCES = [
  { code: 'ON', name: 'Ontario' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'AB', name: 'Alberta' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'QC', name: 'Quebec' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'YT', name: 'Yukon' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'NU', name: 'Nunavut' },
]

const LICENSE_TYPES = [
  'general',
  'specialist_ortho',
  'specialist_oral_surgery',
  'specialist_periodontics',
  'specialist_endodontics',
  'specialist_prosthodontics',
  'specialist_pediatric',
  'specialist_oral_pathology',
  'specialist_oral_medicine',
  'specialist_public_health',
]

export function ProviderIdentifierManager({ userId, onUpdate }: ProviderIdentifierManagerProps) {
  const { data, loading, refetch } = useGetUserProviderIdentifiersQuery({
    variables: { userId },
    skip: !userId,
  })

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const identifiers = data?.user_provider_identifier_v || []

  const handleCreate = async (formData: CreateProviderIdentifierRequest) => {
    try {
      setError(null)
      await createProviderIdentifier(userId, formData)
      setIsCreateDialogOpen(false)
      await refetch()
      onUpdate?.()
    } catch (err: any) {
      setError(err.message || 'Failed to create provider identifier')
    }
  }

  const handleUpdate = async (id: number, formData: UpdateProviderIdentifierRequest) => {
    try {
      setError(null)
      await updateProviderIdentifier(id, formData)
      setEditingId(null)
      await refetch()
      onUpdate?.()
    } catch (err: any) {
      setError(err.message || 'Failed to update provider identifier')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this provider identifier?')) {
      return
    }

    try {
      setError(null)
      await deleteProviderIdentifier(id)
      await refetch()
      onUpdate?.()
    } catch (err: any) {
      setError(err.message || 'Failed to delete provider identifier')
    }
  }

  if (loading) {
    return <div className="text-sm text-gray-500">Loading provider identifiers...</div>
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Provider Identifiers (UINs)</h3>
        <Button variant="outline" size="sm" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Identifier
        </Button>
      </div>

      {identifiers.length === 0 ? (
        <div className="text-sm text-gray-500 py-4">
          No provider identifiers configured. Add one to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {identifiers.map((identifier) => (
            <div
              key={identifier.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-medium text-gray-900">
                      {PROVINCES.find((p) => p.code === identifier.province_code)?.name ||
                        identifier.province_code}
                    </div>
                    <div className="text-sm text-gray-600">
                      {identifier.license_type} • {identifier.identifier_value}
                    </div>
                    {identifier.effective_from || identifier.effective_to ? (
                      <div className="text-xs text-gray-500 mt-1">
                        {identifier.effective_from && `From: ${identifier.effective_from}`}
                        {identifier.effective_from && identifier.effective_to && ' • '}
                        {identifier.effective_to && `To: ${identifier.effective_to}`}
                      </div>
                    ) : null}
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      identifier.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {identifier.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingId(identifier.id!)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(identifier.id!)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <CreateProviderIdentifierDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Edit Dialog */}
      {editingId && (
        <EditProviderIdentifierDialog
          open={editingId !== null}
          identifier={identifiers.find((i) => i.id === editingId)}
          onClose={() => setEditingId(null)}
          onSubmit={(data) => {
            if (editingId) {
              handleUpdate(editingId, data)
            }
          }}
        />
      )}
    </div>
  )
}

interface CreateProviderIdentifierDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateProviderIdentifierRequest) => void
}

function CreateProviderIdentifierDialog({
  open,
  onClose,
  onSubmit,
}: CreateProviderIdentifierDialogProps) {
  const [provinceCode, setProvinceCode] = useState('ON')
  const [licenseType, setLicenseType] = useState('general')
  const [identifierValue, setIdentifierValue] = useState('')
  const [effectiveFrom, setEffectiveFrom] = useState('')
  const [effectiveTo, setEffectiveTo] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await onSubmit({
      identifierKind: 'cda_uin',
      provinceCode,
      licenseType,
      identifierValue,
      effectiveFrom: effectiveFrom || null,
      effectiveTo: effectiveTo || null,
      isActive,
    })
    setIsSubmitting(false)
    // Reset form
    setProvinceCode('ON')
    setLicenseType('general')
    setIdentifierValue('')
    setEffectiveFrom('')
    setEffectiveTo('')
    setIsActive(true)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle>Add Provider Identifier</DialogTitle>
          <DialogDescription>Add a CDA UIN or other provider identifier</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="create-province" className="text-sm font-medium text-gray-700">
                Province *
              </label>
              <select
                id="create-province"
                value={provinceCode}
                onChange={(e) => setProvinceCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {PROVINCES.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="create-license-type" className="text-sm font-medium text-gray-700">
                License Type *
              </label>
              <select
                id="create-license-type"
                value={licenseType}
                onChange={(e) => setLicenseType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {LICENSE_TYPES.map((lt) => (
                  <option key={lt} value={lt}>
                    {lt.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="create-identifier-value" className="text-sm font-medium text-gray-700">
              Identifier Value (UIN) *
            </label>
            <Input
              id="create-identifier-value"
              value={identifierValue}
              onChange={(e) => setIdentifierValue(e.target.value)}
              placeholder="e.g., 12345"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="create-effective-from" className="text-sm font-medium text-gray-700">
                Effective From
              </label>
              <Input
                id="create-effective-from"
                type="date"
                value={effectiveFrom}
                onChange={(e) => setEffectiveFrom(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="create-effective-to" className="text-sm font-medium text-gray-700">
                Effective To
              </label>
              <Input
                id="create-effective-to"
                type="date"
                value={effectiveTo}
                onChange={(e) => setEffectiveTo(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !identifierValue}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface EditProviderIdentifierDialogProps {
  open: boolean
  identifier: any
  onClose: () => void
  onSubmit: (data: UpdateProviderIdentifierRequest) => void
}

function EditProviderIdentifierDialog({
  open,
  identifier,
  onClose,
  onSubmit,
}: EditProviderIdentifierDialogProps) {
  const [provinceCode, setProvinceCode] = useState(identifier?.province_code || 'ON')
  const [licenseType, setLicenseType] = useState(identifier?.license_type || 'general')
  const [identifierValue, setIdentifierValue] = useState(identifier?.identifier_value || '')
  const [effectiveFrom, setEffectiveFrom] = useState(identifier?.effective_from || '')
  const [effectiveTo, setEffectiveTo] = useState(identifier?.effective_to || '')
  const [isActive, setIsActive] = useState(identifier?.is_active !== false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!identifier) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await onSubmit({
      provinceCode,
      licenseType,
      identifierValue,
      effectiveFrom: effectiveFrom || null,
      effectiveTo: effectiveTo || null,
      isActive,
    })
    setIsSubmitting(false)
  }

  const hasChanges =
    provinceCode !== identifier.province_code ||
    licenseType !== identifier.license_type ||
    identifierValue !== identifier.identifier_value ||
    effectiveFrom !== (identifier.effective_from || '') ||
    effectiveTo !== (identifier.effective_to || '') ||
    isActive !== (identifier.is_active !== false)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle>Edit Provider Identifier</DialogTitle>
          <DialogDescription>Update provider identifier details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="edit-province" className="text-sm font-medium text-gray-700">
                Province *
              </label>
              <select
                id="edit-province"
                value={provinceCode}
                onChange={(e) => setProvinceCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {PROVINCES.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-license-type" className="text-sm font-medium text-gray-700">
                License Type *
              </label>
              <select
                id="edit-license-type"
                value={licenseType}
                onChange={(e) => setLicenseType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {LICENSE_TYPES.map((lt) => (
                  <option key={lt} value={lt}>
                    {lt.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-identifier-value" className="text-sm font-medium text-gray-700">
              Identifier Value (UIN) *
            </label>
            <Input
              id="edit-identifier-value"
              value={identifierValue}
              onChange={(e) => setIdentifierValue(e.target.value)}
              placeholder="e.g., 12345"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="edit-effective-from" className="text-sm font-medium text-gray-700">
                Effective From
              </label>
              <Input
                id="edit-effective-from"
                type="date"
                value={effectiveFrom}
                onChange={(e) => setEffectiveFrom(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-effective-to" className="text-sm font-medium text-gray-700">
                Effective To
              </label>
              <Input
                id="edit-effective-to"
                type="date"
                value={effectiveTo}
                onChange={(e) => setEffectiveTo(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !hasChanges}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
