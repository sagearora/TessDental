import { useState } from 'react'
import { NavLink, useLocation, Outlet } from 'react-router-dom'
import { Settings, Users, LayoutDashboard, Shield, FileText, ChevronDown, ChevronRight, UserCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Header } from './Header'

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Clinic Settings',
    href: '/admin/clinic-settings',
    icon: Settings,
  },
  {
    name: 'User Management',
    icon: Users,
    children: [
      {
        name: 'Users',
        href: '/admin/users',
      },
      {
        name: 'Roles & Permissions',
        href: '/admin/roles',
      },
    ],
  },
  {
    name: 'Patient Management',
    icon: UserCircle,
    children: [
      {
        name: 'Patient List',
        href: '/admin/patients/persons',
      },
      {
        name: 'Profile Fields',
        href: '/admin/patients/fields',
      },
      {
        name: 'Referral Sources',
        href: '/admin/patients/referral-sources',
      },
    ],
  },
  {
    name: 'Audit My Data',
    href: '/admin/audit',
    icon: FileText,
  },
]

export function AdminLayout() {
  const location = useLocation()
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    // Auto-expand User Management if we're on a user management page
    if (location.pathname.startsWith('/admin/users') || location.pathname.startsWith('/admin/roles')) {
      return ['User Management']
    }
    // Auto-expand Patient Management if we're on a patient management page
    if (location.pathname.startsWith('/admin/patients')) {
      return ['Patient Management']
    }
    return []
  })

  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionName) ? prev.filter((s) => s !== sectionName) : [...prev, sectionName]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 min-h-[calc(100vh-4rem)] bg-white border-r border-gray-200">
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              if (item.children) {
                const isExpanded = expandedSections.includes(item.name)
                const isActive = item.children.some((child) => location.pathname === child.href || location.pathname.startsWith(child.href))
                const Icon = item.icon

                return (
                  <div key={item.name}>
                    <button
                      onClick={() => toggleSection(item.name)}
                      className={cn(
                        'w-full flex items-center justify-between gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 flex-shrink-0" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <NavLink
                            key={child.href}
                            to={child.href}
                            className={({ isActive }) =>
                              cn(
                                'flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                                isActive
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                              )
                            }
                          >
                            {child.name}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              const Icon = item.icon
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.href === '/admin'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    )
                  }
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </NavLink>
              )
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
