import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSearchPatientsQuery } from '@/gql/generated'

export interface UnifiedSearchResult {
  id: number
  displayName: string
  dob?: string | null
  chartNo?: string | null
  status?: string | null
  phone?: string | null
  householdHeadId?: number | null
  responsiblePartyId?: number | null
  householdHeadName?: string | null
}

interface UseUnifiedPatientSearchOptions {
  limit?: number
}

export function useUnifiedPatientSearch({ limit = 10 }: UseUnifiedPatientSearchOptions = {}) {
  const { session } = useAuth()
  const [rawQuery, setRawQuery] = useState('')

  // Debounce raw input
  const [debounced, setDebounced] = useState('')
  useEffect(() => {
    const t = setTimeout(() => setDebounced(rawQuery), 150)
    return () => clearTimeout(t)
  }, [rawQuery])

  const clinicId = session?.clinicId || 0

  const { where, mode } = useMemo(() => {
    const qRaw = debounced
    const cleaned = qRaw.trim()
    if (!cleaned || !clinicId) {
      return { where: null as any, mode: 'idle' as const }
    }

    // A) Email: contains '@'
    if (cleaned.includes('@')) {
      const emailNorm = cleaned.toLowerCase()
      return {
        mode: 'email' as const,
        where: {
          clinic_id: { _eq: clinicId },
          is_active: { _eq: true },
          person_contact_point: {
            kind: { _eq: 'email' },
            is_active: { _eq: true },
            value_norm: { _eq: emailNorm },
          },
        },
      }
    }

    // Strip non-digits once
    const digits = cleaned.replace(/\D/g, '')

    // B) Phone exact: digits length >= 10 → use last10
    if (digits.length >= 10) {
      const last10 = digits.slice(-10)
      return {
        mode: 'phone_exact' as const,
        where: {
          clinic_id: { _eq: clinicId },
          is_active: { _eq: true },
          person_contact_point: {
            kind: { _eq: 'phone' },
            is_active: { _eq: true },
            phone_last10: { _eq: last10 },
          },
        },
      }
    }

    // C) Phone partial: 7–9 digits → LIKE on value_norm
    if (digits.length >= 7 && digits.length <= 9) {
      return {
        mode: 'phone_partial' as const,
        where: {
          clinic_id: { _eq: clinicId },
          is_active: { _eq: true },
          person_contact_point: {
            kind: { _eq: 'phone' },
            is_active: { _eq: true },
            value_norm: { _like: `%${digits}%` },
          },
        },
      }
    }

    // D) Name / chart_no typeahead
    const prefix = cleaned.toLowerCase() + '%'
    return {
      mode: 'name' as const,
      where: {
        clinic_id: { _eq: clinicId },
        is_active: { _eq: true },
        _or: [
          { first_name: { _ilike: prefix } },
          { last_name: { _ilike: prefix } },
          { middle_name: { _ilike: prefix } },
          { preferred_name: { _ilike: prefix } },
          { patient: { chart_no: { _ilike: prefix } } },
        ],
      },
    }
  }, [debounced, clinicId])

  const shouldQuery = !!where && !!clinicId

  const { data, loading, error } = useSearchPatientsQuery({
    variables: {
      where: where ?? ({} as any),
      limit,
    },
    skip: !shouldQuery,
    fetchPolicy: 'network-only',
  })

  const results: UnifiedSearchResult[] = useMemo(() => {
    if (!data?.person) return []
    return data.person.map((p) => {
      const dob = p.dob as string | null | undefined
      const status = p.patient?.status ?? null
      const chartNo = p.patient?.chart_no ?? null
      const phone = p.person_contact_point?.[0]?.value as string | null | undefined
      const householdHead = (p as any).household_head || null
      const householdHeadName = householdHead
        ? [
            householdHead.first_name,
            householdHead.preferred_name ?? null,
            householdHead.last_name,
          ]
            .filter(Boolean)
            .join(' ')
        : null
      const displayName = [p.first_name, p.preferred_name ?? null, p.last_name]
        .filter(Boolean)
        .join(' ')

      return {
        id: p.id,
        displayName,
        dob: dob ?? null,
        chartNo,
        status,
        phone: phone ?? null,
        householdHeadId: (p as any).household_head_id ?? null,
        responsiblePartyId: (p as any).responsible_party_id ?? null,
        householdHeadName,
      }
    })
  }, [data])

  return {
    query: rawQuery,
    setQuery: setRawQuery,
    debounced,
    mode,
    loading,
    error,
    results,
    hasQuery: !!debounced.trim(),
  }
}

