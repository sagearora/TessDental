import { useLocation, NavLink } from 'react-router-dom'
import {
  User,
  StickyNote,
  Activity,
  Camera,
  CheckSquare,
  DollarSign,
  Building2,
  Pill,
  Folder,
} from 'lucide-react'
import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

const GET_CURRENT_PERSON = gql`
  query GetCurrentPerson($userId: uuid!) {
    clinic_user_v(
      where: { 
        is_active: { _eq: true }
        user_id: { _eq: $userId }
      }
      limit: 1
    ) {
      id
      current_person_id
      person {
        id
        first_name
        last_name
        preferred_name
        clinic_id
      }
    }
  }
`

const navigationItems = [
  { icon: User, label: 'Profile', path: (personId: number) => `/profile/${personId}` },
  { icon: StickyNote, label: 'Notes', path: (personId: number) => `/notes/${personId}` },
  { icon: Activity, label: 'Odontogram', path: (personId: number) => `/odontogram/${personId}` },
  { icon: Activity, label: 'Perio Charting', path: (personId: number) => `/perio/${personId}` },
  { icon: Camera, label: 'Imaging', path: (personId: number) => `/imaging/${personId}` },
  { icon: CheckSquare, label: 'Forms', path: (personId: number) => `/forms/${personId}` },
  { icon: DollarSign, label: 'Billing', path: (personId: number) => `/billing/${personId}` },
  { icon: Building2, label: 'Insurance', path: (personId: number) => `/insurance/${personId}` },
  { icon: Pill, label: 'Prescriptions', path: (personId: number) => `/prescriptions/${personId}` },
  { icon: Folder, label: 'Documents', path: (personId: number) => `/documents/${personId}` },
]

export function PersonNavigator() {
  const location = useLocation()
  const { session } = useAuth()

  // Hide on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null
  }

  // Don't show if not authenticated
  if (!session) {
    return null
  }

  // Query current person
  const { data, loading } = useQuery(GET_CURRENT_PERSON, {
    variables: {
      userId: session?.user.id || '',
    },
    skip: !session?.user.id,
    fetchPolicy: 'cache-and-network',
  })

  const clinicUser = data?.clinic_user_v?.[0]
  const currentPerson = clinicUser?.person
  const currentPersonId = clinicUser?.current_person_id

  // Don't show if no current person is set
  if (!currentPersonId || !currentPerson) {
    return null
  }

  // Format person name
  const personName = [
    currentPerson.first_name,
    currentPerson.preferred_name,
    currentPerson.last_name,
  ]
    .filter(Boolean)
    .join(' ')

  if (loading) {
    return (
      <div className="fixed top-16 left-0 right-0 z-40 border-b bg-white shadow-sm">
        <div className="mx-auto flex h-12 items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-sm text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed top-16 left-0 right-0 z-40 border-b bg-white shadow-sm">
      <div className="mx-auto flex h-12 items-center justify-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Person Name */}
        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
          <User className="h-4 w-4 text-gray-500" />
          <span>{personName}</span>
        </div>

        {/* Navigation Icons */}
        <div className="flex items-center gap-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const path = item.path(currentPersonId)
            const isActive = location.pathname === path || location.pathname.startsWith(path + '/')

            return (
              <NavLink
                key={item.label}
                to={path}
                title={item.label}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-md transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <Icon className="h-4 w-4" />
              </NavLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}
