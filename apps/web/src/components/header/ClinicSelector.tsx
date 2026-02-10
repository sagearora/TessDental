import { Building2, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useClinicSelector } from '@/hooks/useClinicSelector'
import { useAuth } from '@/contexts/AuthContext'

export function ClinicSelector() {
  const { session } = useAuth()
  const { clinics, currentClinic, loading, isOpen, setIsOpen, menuRef, handleSwitch } = useClinicSelector()

  if (!session) return null

  return (
    <div className="relative" ref={menuRef}>
      {loading ? (
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500">
          <Building2 className="h-4 w-4 animate-pulse" />
          <span className="hidden sm:inline-block">Loading clinics...</span>
        </div>
      ) : clinics.length > 0 ? (
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border border-gray-200"
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline-block">
              {currentClinic?.name || 'Select Clinic'}
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-gray-500 transition-transform',
                isOpen && 'rotate-180'
              )}
            />
          </button>

          {isOpen && (
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
                      onClick={() => {
                        if (clinicUser.clinic_id) {
                          handleSwitch(clinicUser.clinic_id)
                        }
                      }}
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
  )
}
