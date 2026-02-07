import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import { useUpdateClinicMutation, useGetClinicQuery } from '@/gql/generated'

interface EditClinicDialogProps {
  clinicId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditClinicDialog({ clinicId, open, onOpenChange, onSuccess }: EditClinicDialogProps) {
  const { data, loading } = useGetClinicQuery({
    variables: { clinicId },
    skip: !open || !clinicId,
  })

  const [updateClinic, { loading: isUpdating }] = useUpdateClinicMutation()

  const clinic = data?.clinic_v?.[0]

  const [formData, setFormData] = useState({
    name: '',
    timezone: 'America/Toronto',
    phone: '',
    fax: '',
    website: '',
    email: '',
    addressStreet: '',
    addressUnit: '',
    addressCity: '',
    addressProvince: '',
    addressPostal: '',
    billingNumber: '',
  })

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (clinic) {
      setFormData({
        name: clinic.name || '',
        timezone: clinic.timezone || 'America/Toronto',
        phone: clinic.phone || '',
        fax: clinic.fax || '',
        website: clinic.website || '',
        email: clinic.email || '',
        addressStreet: clinic.address_street || '',
        addressUnit: clinic.address_unit || '',
        addressCity: clinic.address_city || '',
        addressProvince: clinic.address_province || '',
        addressPostal: clinic.address_postal || '',
        billingNumber: clinic.billing_number || '',
      })
      setError(null)
    }
  }, [clinic])

  /**
   * Normalizes a website URL by adding http:// if no protocol is present
   */
  const normalizeWebsiteUrl = (url: string): string | null => {
    if (!url || url.trim() === '') return null
    const trimmed = url.trim()
    // If it already has a protocol, return as is
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed
    }
    // Otherwise, add http://
    return `http://${trimmed}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      // Normalize website URL before submitting
      const normalizedWebsite = normalizeWebsiteUrl(formData.website)

      await updateClinic({
        variables: {
          clinicId,
          name: formData.name || null,
          timezone: formData.timezone || null,
          phone: formData.phone || null,
          fax: formData.fax || null,
          website: normalizedWebsite,
          email: formData.email || null,
          addressStreet: formData.addressStreet || null,
          addressUnit: formData.addressUnit || null,
          addressCity: formData.addressCity || null,
          addressProvince: formData.addressProvince || null,
          addressPostal: formData.addressPostal || null,
          billingNumber: formData.billingNumber || null,
        },
      })
      onSuccess?.()
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || 'Failed to update clinic information')
    }
  }

  const handleCancel = () => {
    if (clinic) {
      setFormData({
        name: clinic.name || '',
        timezone: clinic.timezone || 'America/Toronto',
        phone: clinic.phone || '',
        fax: clinic.fax || '',
        website: clinic.website || '',
        email: clinic.email || '',
        addressStreet: clinic.address_street || '',
        addressUnit: clinic.address_unit || '',
        addressCity: clinic.address_city || '',
        addressProvince: clinic.address_province || '',
        addressPostal: clinic.address_postal || '',
        billingNumber: clinic.billing_number || '',
      })
    }
    setError(null)
    onOpenChange(false)
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent onClose={handleCancel}>
          <div className="py-8 text-center text-gray-500">Loading clinic information...</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={handleCancel} className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Clinic Information</DialogTitle>
          <DialogDescription>Update your clinic's contact and address information</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="clinic-name" className="text-sm font-medium text-gray-700">
              Clinic Name *
            </label>
            <Input
              id="clinic-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter clinic name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="timezone" className="text-sm font-medium text-gray-700">
              Timezone *
            </label>
            <select
              id="timezone"
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="America/Toronto">Eastern Time (America/Toronto)</option>
              <option value="America/Vancouver">Pacific Time (America/Vancouver)</option>
              <option value="America/Edmonton">Mountain Time (America/Edmonton)</option>
              <option value="America/Winnipeg">Central Time (America/Winnipeg)</option>
              <option value="America/Halifax">Atlantic Time (America/Halifax)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Clinic Phone
              </label>
              <PhoneInput
                id="phone"
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: value })}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="fax" className="text-sm font-medium text-gray-700">
                Clinic Fax
              </label>
              <PhoneInput
                id="fax"
                value={formData.fax}
                onChange={(value) => setFormData({ ...formData, fax: value })}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="website" className="text-sm font-medium text-gray-700">
                Clinic Website
              </label>
              <Input
                id="website"
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="example.com or https://example.com"
              />
              <p className="text-xs text-gray-500">
                http:// will be added automatically if no protocol is specified
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Clinic Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="clinic@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="address-street" className="text-sm font-medium text-gray-700">
              Street Address
            </label>
            <Input
              id="address-street"
              value={formData.addressStreet}
              onChange={(e) => setFormData({ ...formData, addressStreet: e.target.value })}
              placeholder="123 Main Street"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="address-unit" className="text-sm font-medium text-gray-700">
              Unit / Apartment
            </label>
            <Input
              id="address-unit"
              value={formData.addressUnit}
              onChange={(e) => setFormData({ ...formData, addressUnit: e.target.value })}
              placeholder="Suite 100"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="address-city" className="text-sm font-medium text-gray-700">
                City
              </label>
              <Input
                id="address-city"
                value={formData.addressCity}
                onChange={(e) => setFormData({ ...formData, addressCity: e.target.value })}
                placeholder="Toronto"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="address-province" className="text-sm font-medium text-gray-700">
                Province
              </label>
              <Input
                id="address-province"
                value={formData.addressProvince}
                onChange={(e) => setFormData({ ...formData, addressProvince: e.target.value })}
                placeholder="ON"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="address-postal" className="text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <Input
                id="address-postal"
                value={formData.addressPostal}
                onChange={(e) => setFormData({ ...formData, addressPostal: e.target.value.toUpperCase() })}
                placeholder="M5H 2N2"
                maxLength={7}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="billing-number" className="text-sm font-medium text-gray-700">
              Billing Number
            </label>
            <Input
              id="billing-number"
              value={formData.billingNumber}
              onChange={(e) => setFormData({ ...formData, billingNumber: e.target.value })}
              placeholder="Enter billing number"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isUpdating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
