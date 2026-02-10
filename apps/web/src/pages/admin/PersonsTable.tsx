import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useGetPersonsQuery } from '@/gql/generated'
import { useAuth } from '@/contexts/AuthContext'
import { PatientSearch } from '@/components/patient/PatientSearch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type ColumnKey = 
  | 'id'
  | 'first_name'
  | 'last_name'
  | 'preferred_name'
  | 'dob'
  | 'gender'
  | 'preferred_language'
  | 'is_patient'
  | 'referred_by'
  | 'is_active'
  | 'created_at'
  | 'updated_at'

interface ColumnConfig {
  key: ColumnKey
  label: string
  visible: boolean
}

const defaultColumns: ColumnConfig[] = [
  { key: 'id', label: 'ID', visible: true },
  { key: 'first_name', label: 'First Name', visible: true },
  { key: 'last_name', label: 'Last Name', visible: true },
  { key: 'preferred_name', label: 'Preferred Name', visible: false },
  { key: 'dob', label: 'Date of Birth', visible: true },
  { key: 'gender', label: 'Gender', visible: true },
  { key: 'preferred_language', label: 'Language', visible: false },
  { key: 'is_patient', label: 'Is Patient', visible: true },
  { key: 'referred_by', label: 'Referred By', visible: true },
  { key: 'is_active', label: 'Active', visible: true },
  { key: 'created_at', label: 'Created', visible: false },
  { key: 'updated_at', label: 'Updated', visible: false },
]

const ITEMS_PER_PAGE = 50

export function PersonsTable() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null)
  const [columns, setColumns] = useState<ColumnConfig[]>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('personsTableColumns')
    if (saved) {
      try {
        const savedColumns = JSON.parse(saved) as ColumnConfig[]
        // Merge with defaults to ensure new columns are included
        const savedKeys = new Set(savedColumns.map(c => c.key))
        
        // Add any new columns from defaults that aren't in saved
        const mergedColumns = [...savedColumns]
        defaultColumns.forEach(defaultCol => {
          if (!savedKeys.has(defaultCol.key)) {
            mergedColumns.push(defaultCol)
          }
        })
        
        // Update visibility for existing columns to match defaults if they were added
        return mergedColumns.map(col => {
          const defaultCol = defaultColumns.find(dc => dc.key === col.key)
          return defaultCol ? { ...col, visible: defaultCol.visible } : col
        }).sort((a, b) => {
          // Sort to match default order
          const aIndex = defaultColumns.findIndex(dc => dc.key === a.key)
          const bIndex = defaultColumns.findIndex(dc => dc.key === b.key)
          if (aIndex === -1) return 1
          if (bIndex === -1) return -1
          return aIndex - bIndex
        })
      } catch {
        return defaultColumns
      }
    }
    return defaultColumns
  })
  const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false)

  // Build where clause - filter by selected patient if one is selected
  const whereClause = session?.clinicId ? {
    clinic_id: { _eq: session.clinicId },
    ...(selectedPatientId && {
      id: { _eq: selectedPatientId },
    }),
  } : null

  const { data, loading, error } = useGetPersonsQuery({
    variables: {
      limit: ITEMS_PER_PAGE,
      offset: (page - 1) * ITEMS_PER_PAGE,
      orderBy: [{ last_name: 'asc' }, { first_name: 'asc' }],
      where: whereClause!,
    },
    skip: !session?.clinicId || !whereClause,
  })

  const persons = data?.person || []
  const totalCount = data?.person_aggregate?.aggregate?.count || 0
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const visibleColumns = columns.filter((col) => col.visible)

  const handlePatientSelect = useCallback((result: { person_id?: number | null }) => {
    if (result.person_id) {
      setSelectedPatientId(result.person_id)
    }
    setPage(1) // Reset to first page
  }, [])

  const toggleColumn = (key: ColumnKey) => {
    const newColumns = columns.map((col) =>
      col.key === key ? { ...col, visible: !col.visible } : col
    )
    setColumns(newColumns)
    localStorage.setItem('personsTableColumns', JSON.stringify(newColumns))
  }

  const formatDate = (date: string | null | undefined) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString()
  }

  const formatDateTime = (date: string | null | undefined) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString()
  }

  const getCellValue = (person: typeof persons[0], columnKey: ColumnKey) => {
    switch (columnKey) {
      case 'id':
        return person.id.toString()
      case 'first_name':
        return person.first_name || 'N/A'
      case 'last_name':
        return person.last_name || 'N/A'
      case 'preferred_name':
        return person.preferred_name || 'N/A'
      case 'dob':
        return formatDate(person.dob)
      case 'gender':
        return person.gender ? person.gender.charAt(0).toUpperCase() + person.gender.slice(1) : 'N/A'
      case 'preferred_language':
        return person.preferred_language || 'N/A'
      case 'is_patient':
        return person.patient ? 'Yes' : 'No'
      case 'referred_by':
        const patient = person.patient
        const referrals = patient?.patient_referral
        if (!referrals || referrals.length === 0) return 'N/A'
        
        // Use the first referral
        const referral = referrals[0]
        if (!referral) return 'N/A'
        
        if (referral.referral_kind === 'source' && referral.referral_source) {
          return referral.referral_source.name
        } else if (referral.referral_kind === 'contact' && referral.referral_contact_person) {
          const contact = referral.referral_contact_person
          return `${contact.first_name || ''} ${contact.last_name || ''}`.trim() || `Person ID: ${contact.id}`
        } else if (referral.referral_kind === 'other' && referral.referral_other_text) {
          return referral.referral_other_text
        }
        return 'N/A'
      case 'is_active':
        return person.is_active ? 'Yes' : 'No'
      case 'created_at':
        return formatDateTime(person.created_at)
      case 'updated_at':
        return formatDateTime(person.updated_at)
      default:
        return 'N/A'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8 text-gray-500">Loading persons...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          Error loading persons: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient List</h1>
          <p className="mt-2 text-sm text-gray-600">
            View and manage all persons in the system. {totalCount} total persons.
          </p>
        </div>
        <Button variant="outline" onClick={() => setIsColumnDialogOpen(true)}>
          <Settings2 className="h-4 w-4 mr-2" />
          Columns
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Persons Table</CardTitle>
              <CardDescription>
                Showing {persons.length} of {totalCount} persons
                {selectedPatientId && (
                  <span className="ml-2">
                    {' '}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPatientId(null)}
                      className="h-6 px-2 text-xs"
                    >
                      Clear filter
                    </Button>
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="w-80">
              <PatientSearch
                placeholder="Search by name, phone, or chart number..."
                limit={50}
                onSelect={handlePatientSelect}
                showResults={true}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  {visibleColumns.map((column) => (
                    <th
                      key={column.key}
                      className="text-left py-3 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {persons.length === 0 ? (
                  <tr>
                    <td colSpan={visibleColumns.length} className="py-8 text-center text-gray-500">
                      {selectedPatientId ? 'No person found with selected ID.' : 'No persons found.'}
                    </td>
                  </tr>
                ) : (
                  persons.map((person) => (
                    <tr
                      key={person.id}
                      className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/profile/${person.id}`)}
                    >
                      {visibleColumns.map((column) => (
                        <td key={column.key} className="py-3 px-4 text-sm text-gray-900">
                          {getCellValue(person, column.key)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Column Visibility Dialog */}
      <Dialog open={isColumnDialogOpen} onOpenChange={setIsColumnDialogOpen}>
        <DialogContent onClose={() => setIsColumnDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Column Visibility</DialogTitle>
            <DialogDescription>
              Toggle columns to show or hide in the table
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {columns.map((column) => (
              <label
                key={column.key}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={column.visible}
                  onChange={() => toggleColumn(column.key)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-900">{column.label}</span>
              </label>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
