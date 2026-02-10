import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Edit, Trash2, X } from 'lucide-react'
import {
  useGetReferralSourcesQuery,
  useCreateReferralSourceMutation,
  useUpdateReferralSourceMutation,
  useDeleteReferralSourceMutation,
} from '@/gql/generated'
import { useAuth } from '@/contexts/AuthContext'

export function ReferralSourceManagement() {
  const { session } = useAuth()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [newName, setNewName] = useState('')
  const [editName, setEditName] = useState('')

  const { data, loading, refetch } = useGetReferralSourcesQuery({
    variables: { clinicId: session?.clinicId || 0 },
    skip: !session?.clinicId,
  })

  const [createReferralSource] = useCreateReferralSourceMutation()
  const [updateReferralSource] = useUpdateReferralSourceMutation()
  const [deleteReferralSource] = useDeleteReferralSourceMutation()

  const referralSources = data?.referral_source || []

  const handleAdd = async () => {
    if (!newName.trim() || !session?.clinicId) return

    try {
      await createReferralSource({
        variables: {
          clinicId: session.clinicId,
          name: newName.trim(),
        },
      })
      setNewName('')
      setIsAdding(false)
      await refetch()
    } catch (err: any) {
      console.error('Failed to create referral source:', err)
      alert(err.message || 'Failed to create referral source')
    }
  }

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return

    try {
      await updateReferralSource({
        variables: {
          id,
          name: editName.trim(),
        },
      })
      setEditingId(null)
      setEditName('')
      await refetch()
    } catch (err: any) {
      console.error('Failed to update referral source:', err)
      alert(err.message || 'Failed to update referral source')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this referral source?')) return

    try {
      await deleteReferralSource({
        variables: { id },
      })
      await refetch()
    } catch (err: any) {
      console.error('Failed to delete referral source:', err)
      alert(err.message || 'Failed to delete referral source')
    }
  }

  const startEdit = (id: number, name: string) => {
    setEditingId(id)
    setEditName(name)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
  }

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Loading referral sources...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Referral Sources</CardTitle>
            <CardDescription>
              Manage referral sources that can be selected when creating patients (e.g., "Facebook Ad", "Google Ad")
            </CardDescription>
          </div>
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Source
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex gap-2">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter referral source name (e.g., Facebook Ad)"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAdd()
                  if (e.key === 'Escape') {
                    setIsAdding(false)
                    setNewName('')
                  }
                }}
                className="flex-1"
                autoFocus
              />
              <Button onClick={handleAdd} disabled={!newName.trim()}>
                Add
              </Button>
              <Button variant="outline" onClick={() => {
                setIsAdding(false)
                setNewName('')
              }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {referralSources.length === 0 && !isAdding ? (
          <div className="text-center py-8 text-gray-500">
            <p>No referral sources yet.</p>
            <Button onClick={() => setIsAdding(true)} className="mt-4" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add First Source
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {referralSources.map((source) => (
              <div
                key={source.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                {editingId === source.id ? (
                  <div className="flex gap-2 flex-1">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleUpdate(source.id)
                        if (e.key === 'Escape') cancelEdit()
                      }}
                      className="flex-1"
                      autoFocus
                    />
                    <Button onClick={() => handleUpdate(source.id)} size="sm" disabled={!editName.trim()}>
                      Save
                    </Button>
                    <Button variant="outline" onClick={cancelEdit} size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm text-gray-900">{source.name}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(source.id, source.name)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(source.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
