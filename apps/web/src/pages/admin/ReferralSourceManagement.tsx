import { ReferralSourceManagement as ReferralSourceManagementComponent } from '@/components/admin/ReferralSourceManagement'

export function ReferralSourceManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Referral Sources</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage referral sources that can be selected when creating patients (e.g., "Facebook Ad", "Google Ad")
        </p>
      </div>

      <ReferralSourceManagementComponent />
    </div>
  )
}
