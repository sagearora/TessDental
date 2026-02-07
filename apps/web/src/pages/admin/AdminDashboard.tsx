import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LayoutDashboard } from 'lucide-react'

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your clinic settings and users from this central location.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-blue-600" />
              <CardTitle>Quick Access</CardTitle>
            </div>
            <CardDescription>Navigate to administrative sections</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Use the sidebar to access Clinic Settings and User Management.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
