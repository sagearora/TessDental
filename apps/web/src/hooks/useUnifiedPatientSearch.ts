import { useState, useEffect, useMemo, useRef } from 'react'
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
            kind: { _in: ['cell_phone' as const, 'home_phone' as const, 'work_phone' as const] },
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
            kind: { _in: ['cell_phone' as const, 'home_phone' as const, 'work_phone' as const] },
            is_active: { _eq: true },
            value_norm: { _like: `%${digits}%` },
          },
        },
      }
    }

    // D) Name / chart_no typeahead
    const tokens = cleaned.split(/\s+/).filter(Boolean)
    const prefix = cleaned.toLowerCase() + '%'
    const contains = '%' + cleaned.toLowerCase() + '%'
    
    // For single token, use prefix matching (fast with existing indexes) 
    // and contains matching (fast with trigram indexes) for compound names
    if (tokens.length === 1) {
      return {
        mode: 'name' as const,
        where: {
          clinic_id: { _eq: clinicId },
          is_active: { _eq: true },
          _or: [
            // Prefix matches (uses text_pattern_ops indexes)
            { first_name: { _ilike: prefix } },
            { last_name: { _ilike: prefix } },
            { middle_name: { _ilike: prefix } },
            { preferred_name: { _ilike: prefix } },
            { patient: { chart_no: { _ilike: prefix } } },
            // Contains matches (uses trigram GIN indexes)
            // Allows "lawrence" to find "St Lawrence"
            { first_name: { _ilike: contains } },
            { last_name: { _ilike: contains } },
            { middle_name: { _ilike: contains } },
            { preferred_name: { _ilike: contains } },
          ],
        },
      }
    }
    
    // For multi-word queries, use enhanced matching
    const first = tokens[0].toLowerCase()
    const last = tokens[tokens.length - 1].toLowerCase()
    
    // Token-all-match: every token must match at least one name field
    // Use both prefix and contains matching for each token
    const tokenAllMatch = {
      _and: tokens.map((t) => {
        const tokenLower = t.toLowerCase()
        const tokenPrefix = `${tokenLower}%`
        const tokenContains = `%${tokenLower}%`
        return {
          _or: [
            // Prefix matches (uses text_pattern_ops indexes)
            { first_name: { _ilike: tokenPrefix } },
            { last_name: { _ilike: tokenPrefix } },
            { middle_name: { _ilike: tokenPrefix } },
            { preferred_name: { _ilike: tokenPrefix } },
            // Contains matches (uses trigram GIN indexes)
            { first_name: { _ilike: tokenContains } },
            { last_name: { _ilike: tokenContains } },
            { middle_name: { _ilike: tokenContains } },
            { preferred_name: { _ilike: tokenContains } },
          ],
        }
      }),
    }
    
    // First+Last: common "John Smith" pattern
    const firstLast = {
      _and: [
        { first_name: { _ilike: `${first}%` } },
        { last_name: { _ilike: `${last}%` } },
      ],
    }
    
    // Last+First: handles "Smith John" pattern
    const lastFirst = {
      _and: [
        { first_name: { _ilike: `${last}%` } },
        { last_name: { _ilike: `${first}%` } },
      ],
    }
    
    return {
      mode: 'name' as const,
      where: {
        clinic_id: { _eq: clinicId },
        is_active: { _eq: true },
        _or: [
          firstLast,
          lastFirst,
          tokenAllMatch,
          // Keep existing single-string prefix matches for backward compatibility
          { first_name: { _ilike: prefix } },
          { last_name: { _ilike: prefix } },
          { middle_name: { _ilike: prefix } },
          { preferred_name: { _ilike: prefix } },
          { patient: { chart_no: { _ilike: prefix } } },
          // Add contains matches for the full query string
          { first_name: { _ilike: contains } },
          { last_name: { _ilike: contains } },
          { middle_name: { _ilike: contains } },
          { preferred_name: { _ilike: contains } },
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
    fetchPolicy: 'cache-and-network',
  })

  const [results, setResults] = useState<UnifiedSearchResult[]>([])
  const previousResultIdsRef = useRef<string>('')

  // Update results only when data actually changes
  useEffect(() => {
    if (!data?.person) {
      if (previousResultIdsRef.current !== '') {
        setResults([])
        previousResultIdsRef.current = ''
      }
      return
    }

    // Extract search digits for phone matching
    const searchDigits = mode === 'phone_exact' || mode === 'phone_partial' 
      ? debounced.replace(/\D/g, '') 
      : null
    const searchLast10 = mode === 'phone_exact' && searchDigits && searchDigits.length >= 10
      ? searchDigits.slice(-10)
      : null

    const newResults: UnifiedSearchResult[] = data.person.map((p) => {
      const dob = p.dob as string | null | undefined
      const status = p.patient?.status ?? null
      const chartNo = p.patient?.chart_no ?? null
      
      // Find the matching phone contact point when searching by phone
      let phone: string | null | undefined = null
      if (p.person_contact_point && p.person_contact_point.length > 0) {
        if (mode === 'phone_exact' && searchLast10) {
          // Find contact point that matches the exact phone search
          const matching = p.person_contact_point.find(
            cp => cp.phone_last10 === searchLast10
          )
          phone = matching?.value as string | null | undefined || p.person_contact_point[0]?.value as string | null | undefined
        } else if (mode === 'phone_partial' && searchDigits) {
          // Find contact point that matches the partial phone search
          const matching = p.person_contact_point.find(
            cp => cp.value_norm?.includes(searchDigits)
          )
          phone = matching?.value as string | null | undefined || p.person_contact_point[0]?.value as string | null | undefined
        } else {
          // For non-phone searches, use the first (primary) contact point
          phone = p.person_contact_point[0]?.value as string | null | undefined
        }
      }
      
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

    // Only update if result IDs actually changed
    const newResultIds = newResults.map(r => r.id).sort().join(',')
    if (previousResultIdsRef.current !== newResultIds) {
      setResults(newResults)
      previousResultIdsRef.current = newResultIds
    }
  }, [data, mode, debounced])

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

