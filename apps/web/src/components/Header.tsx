import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, LogOut, Building2, Settings } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useGetUserClinicsQuery } from '@/gql/generated'
import { Logo } from '@/components/Logo'

export function Header() {
  const { session, logout, switchClinic } = useAuth()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isClinicMenuOpen, setIsClinicMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const clinicMenuRef = useRef<HTMLDivElement>(null)

  // Fetch user's clinics
  const { data: clinicsData, loading: clinicsLoading } = useGetUserClinicsQuery({
    skip: !session,
    fetchPolicy: 'network-only', // Always fetch fresh data
  })

  // Deduplicate clinics by clinic_id (user might have multiple roles/relationships with same clinic)
  const clinicsRaw = clinicsData?.clinic_user_v || []
  const clinicsMap = new Map<number, typeof clinicsRaw[0]>()
  clinicsRaw.forEach((cu) => {
    if (cu.clinic_id && !clinicsMap.has(cu.clinic_id)) {
      clinicsMap.set(cu.clinic_id, cu)
    }
  })
  const clinics = Array.from(clinicsMap.values())
  const currentClinic = clinics.find((cu) => cu.clinic_id === session?.clinicId)?.clinic

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
      if (clinicMenuRef.current && !clinicMenuRef.current.contains(event.target as Node)) {
        setIsClinicMenuOpen(false)
      }
    }

    if (isUserMenuOpen || isClinicMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen, isClinicMenuOpen])

  const handleClinicSwitch = async (clinicId: number) => {
    setIsClinicMenuOpen(false)
    try {
      await switchClinic(clinicId)
    } catch (error) {
      console.error('Failed to switch clinic:', error)
    }
  }

  const handleLogout = async () => {
    setIsUserMenuOpen(false)
    await logout()
  }

  const userInitials = session?.user.firstName && session?.user.lastName
    ? `${session.user.firstName[0]}${session.user.lastName[0]}`
    : session?.user.email?.[0].toUpperCase() || 'U'

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Logo />
          
          {/* Clinic Selector - Always visible when logged in, shows loading/empty states */}
          {session && (
            <div className="relative" ref={clinicMenuRef}>
              {clinicsLoading ? (
                <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500">
                  <Building2 className="h-4 w-4 animate-pulse" />
                  <span className="hidden sm:inline-block">Loading clinics...</span>
                </div>
              ) : clinics.length > 0 ? (
                <>
                  <button
                    onClick={() => setIsClinicMenuOpen(!isClinicMenuOpen)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border border-gray-200"
                    aria-expanded={isClinicMenuOpen}
                    aria-haspopup="true"
                  >
                    <Building2 className="h-4 w-4" />
                    <span className="hidden sm:inline-block">
                      {currentClinic?.name || 'Select Clinic'}
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 text-gray-500 transition-transform',
                        isClinicMenuOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  {isClinicMenuOpen && (
                    <div className="absolute left-0 mt-2 w-64 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <div className="py-1">
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                          Select Clinic
                        </div>
                        {clinics.map((clinicUser) => {
                          const clinic = clinicUser.clinic
                          const isActive = clinicUser.clinic_id === session?.clinicId
                          return (
                            <button
                              key={clinicUser.id}
                              onClick={() => handleClinicSwitch(clinicUser.clinic_id)}
                              className={cn(
                                'flex w-full items-center justify-between px-4 py-2 text-sm text-left hover:bg-gray-100',
                                isActive && 'bg-blue-50 text-blue-700'
                              )}
                            >
                              <span>{clinic?.name || `Clinic ${clinicUser.clinic_id}`}</span>
                              {isActive && (
                                <span className="text-xs font-medium text-blue-600">Current</span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 border border-gray-200">
                  <Building2 className="h-4 w-4" />
                  <span className="hidden sm:inline-block">No clinics</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-expanded={isUserMenuOpen}
            aria-haspopup="true"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
              {userInitials}
            </div>
            <span className="hidden sm:inline-block">
              {session?.user.firstName && session?.user.lastName
                ? `${session.user.firstName} ${session.user.lastName}`
                : session?.user.email}
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-gray-500 transition-transform',
                isUserMenuOpen && 'rotate-180'
              )}
            />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <div className="py-1">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">
                    {session?.user.firstName && session?.user.lastName
                      ? `${session.user.firstName} ${session.user.lastName}`
                      : 'User'}
                  </p>
                  <p className="truncate text-sm text-gray-500">{session?.user.email}</p>
                </div>
                <Link
                  to="/admin"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="h-4 w-4" />
                  Administrator
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
