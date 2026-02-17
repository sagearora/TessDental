import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileText, Download, Calendar } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { refreshTokensIfNeeded } from '@/lib/authTokens'
import { authFetch } from '@/lib/onUnauthorized'

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:4000'

export function AuditExport() {
  const { session } = useAuth()
  const [format, setFormat] = useState<'csv' | 'jsonl'>('csv')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [action, setAction] = useState('')
  const [entityType, setEntityType] = useState('')
  const [actorUserId, setActorUserId] = useState('')
  const [success, setSuccess] = useState<string>('')
  const [limit, setLimit] = useState('100000')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (!session) {
      alert('Not authenticated')
      return
    }

    setIsExporting(true)

    try {
      await refreshTokensIfNeeded()

      const token = localStorage.getItem('accessToken')
      if (!token) {
        alert('No access token found')
        setIsExporting(false)
        return
      }

      // Build query params
      const params = new URLSearchParams()
      params.append('format', format)
      if (fromDate) params.append('from', fromDate)
      if (toDate) params.append('to', toDate)
      if (action) params.append('action', action)
      if (entityType) params.append('entityType', entityType)
      if (actorUserId) params.append('actorUserId', actorUserId)
      if (success !== '') params.append('success', success)
      params.append('limit', limit)
      params.append('order', order)

      const url = `${AUTH_API_URL}/auth/audit/export?${params.toString()}`

      const response = await authFetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to export' }))
        throw new Error(error.error || 'Failed to export audit logs')
      }

      // Get filename from Content-Disposition header or generate one
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = `audit-export-${new Date().toISOString().split('T')[0]}.${format}`
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/)
        if (match) {
          filename = match[1]
        }
      }

      // Download file
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error: any) {
      console.error('Export error:', error)
      alert(error.message || 'Failed to export audit logs')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Audit Export</h1>
        <p className="mt-2 text-sm text-gray-600">
          Export audit logs for your clinic in CSV or JSONL format.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <CardTitle>Export Configuration</CardTitle>
          </div>
          <CardDescription>Configure your audit log export</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Export Format</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={format === 'csv'}
                  onChange={(e) => setFormat(e.target.value as 'csv')}
                />
                <span className="text-sm text-gray-700">CSV</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="jsonl"
                  checked={format === 'jsonl'}
                  onChange={(e) => setFormat(e.target.value as 'jsonl')}
                />
                <span className="text-sm text-gray-700">JSONL</span>
              </label>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="from-date" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                From Date
              </label>
              <Input
                id="from-date"
                type="datetime-local"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                placeholder="YYYY-MM-DDTHH:mm"
              />
              <p className="text-xs text-gray-500">Leave empty for no start date</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="to-date" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                To Date
              </label>
              <Input
                id="to-date"
                type="datetime-local"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                placeholder="YYYY-MM-DDTHH:mm"
              />
              <p className="text-xs text-gray-500">Leave empty for no end date</p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="action" className="text-sm font-medium text-gray-700">
                Action
              </label>
              <Input
                id="action"
                value={action}
                onChange={(e) => setAction(e.target.value)}
                placeholder="e.g., user.create"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="entity-type" className="text-sm font-medium text-gray-700">
                Entity Type
              </label>
              <Input
                id="entity-type"
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
                placeholder="e.g., app_user"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="actor-user-id" className="text-sm font-medium text-gray-700">
                Actor User ID
              </label>
              <Input
                id="actor-user-id"
                value={actorUserId}
                onChange={(e) => setActorUserId(e.target.value)}
                placeholder="UUID"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="success" className="text-sm font-medium text-gray-700">
                Success
              </label>
              <select
                id="success"
                value={success}
                onChange={(e) => setSuccess(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="true">Success only</option>
                <option value="false">Failed only</option>
              </select>
            </div>
          </div>

          {/* Limit and Order */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="limit" className="text-sm font-medium text-gray-700">
                Limit
              </label>
              <Input
                id="limit"
                type="number"
                min="1"
                max="500000"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
              />
              <p className="text-xs text-gray-500">Max: 500,000</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="order" className="text-sm font-medium text-gray-700">
                Order
              </label>
              <select
                id="order"
                value={order}
                onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleExport} disabled={isExporting} size="lg">
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export Audit Logs'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
