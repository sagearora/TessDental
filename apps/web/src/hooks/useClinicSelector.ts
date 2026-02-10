import { useState, useRef, useEffect } from 'react'
import { useGetUserClinicsQuery } from '@/gql/generated'
import { useAuth } from '@/contexts/AuthContext'

export function useClinicSelector() {
  const { session, switchClinic } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Fetch user's clinics
  const { data: clinicsData, loading } = useGetUserClinicsQuery({
    skip: !session,
    fetchPolicy: 'network-only',
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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSwitch = async (clinicId: number) => {
    setIsOpen(false)
    try {
      await switchClinic(clinicId)
    } catch (error) {
      console.error('Failed to switch clinic:', error)
    }
  }

  return {
    clinics,
    currentClinic,
    loading,
    isOpen,
    setIsOpen,
    menuRef,
    handleSwitch,
  }
}
