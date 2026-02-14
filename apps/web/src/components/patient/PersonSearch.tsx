import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Search, Loader2, X } from 'lucide-react'
import { formatPhoneNumber } from '@/utils/phone'
import { useUnifiedPatientSearch } from '@/hooks/useUnifiedPatientSearch'
import { Popover, PopoverContent } from '@/components/ui/popover'
import { highlightText, highlightPhone } from '@/utils/highlight'
import { useMutation } from '@apollo/client/react'
import { gql } from '@apollo/client'

const UPDATE_CURRENT_PERSON = gql`
  mutation UpdateCurrentPerson($personId: bigint) {
    update_clinic_user(
      where: { 
        is_active: { _eq: true }
      }
      _set: { current_person_id: $personId }
    ) {
      affected_rows
      returning {
        id
        clinic_id
        user_id
        current_person_id
      }
    }
  }
`

interface PersonSearchResult {
  id: number
  displayName: string
  dob?: string | null
  chartNo?: string | null
  status?: string | null
  phone?: string | null
}

interface PersonSearchProps {
  onSelect?: (result: PersonSearchResult) => void
  placeholder?: string
  limit?: number
  className?: string
  showResults?: boolean
  showClearButton?: boolean
  navigateToProfile?: boolean
  inputWidth?: string
}

export function PersonSearch({
  onSelect,
  placeholder = 'Search by name, phone, or chart number...',
  limit = 25,
  className = '',
  showResults = true,
  showClearButton = false,
  navigateToProfile = false,
  inputWidth,
}: PersonSearchProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [updateCurrentPerson] = useMutation(UPDATE_CURRENT_PERSON)

  const {
    results,
    loading,
    error,
    setQuery: setUnifiedQuery,
    debounced,
    mode,
  } = useUnifiedPatientSearch({
    limit: limit || 25,
  })

  // Manage open state based on query - open as soon as there's any query
  useEffect(() => {
    setIsPopoverOpen(query.trim().length > 0)
  }, [query])

  const formatResult = (result: PersonSearchResult) => {
    return result.displayName || 'Unknown'
  }

  const getMatchedOnLabel = (_result: PersonSearchResult, _query: string) => {
    // person_search_v doesn't have separate search fields, so we can't determine match type
    return ''
  }

  const handleSelect = async (result: PersonSearchResult) => {
    if (navigateToProfile) {
      // Update current_person_id before navigating
      try {
        await updateCurrentPerson({
          variables: {
            personId: result.id,
          },
          // Refetch queries that depend on current person
          refetchQueries: ['GetCurrentPerson'],
        })
      } catch (error) {
        // Log error but don't block navigation
        console.error('Failed to update current person:', error)
      }
      navigate(`/profile/${result.id}`)
    } else if (onSelect) {
      onSelect(result)
    }
    setQuery('')
    setUnifiedQuery('')
    setIsPopoverOpen(false)
  }

  const handleClear = () => {
    setQuery('')
    setUnifiedQuery('')
    setIsPopoverOpen(false)
    inputRef.current?.focus()
  }

  const shouldShowResults = showResults && query.trim().length > 0

  const inputPaddingRight = showClearButton && query ? 'pr-8' : loading ? 'pr-10' : 'pr-10'

  const renderResults = () => {
    if (error) {
      return (
        <div className="p-4 text-center text-sm text-red-600">
          Error: {error.message}
        </div>
      )
    }

    if (!loading && !error && results.length === 0) {
      return (
        <div className="p-4 text-center text-sm text-gray-500">
          No persons found
        </div>
      )
    }

    if (results.length > 0) {
      return (
        <div className="py-1">
          {results.map((result) => {
            const phone = formatPhoneNumber(result.phone || null)
            const dob = result.dob ? new Date(result.dob) : null
            const age = dob ? Math.floor((new Date().getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null
            const status = result.status || null

            // Determine what to highlight based on search mode
            const shouldHighlightName = mode === 'name' || mode === 'idle'
            const shouldHighlightPhone = mode === 'phone_exact' || mode === 'phone_partial'
            const shouldHighlightChart = mode === 'name' || mode === 'idle'

            return (
              <button
                key={result.id}
                onClick={() => handleSelect(result)}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none text-sm"
              >
                <div className="font-medium">
                  {shouldHighlightName && debounced
                    ? highlightText(formatResult(result), debounced)
                    : formatResult(result)}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {dob && age !== null && (
                    <span>{dob.toLocaleDateString()} ({age})</span>
                  )}
                  {dob && age !== null && status && <span> · </span>}
                  {status && <span className="capitalize">{status}</span>}
                  {result.chartNo && (
                    <>
                      {status && <span> · </span>}
                      <span>
                        Chart:{' '}
                        {shouldHighlightChart && debounced
                          ? highlightText(result.chartNo, debounced)
                          : result.chartNo}
                      </span>
                    </>
                  )}
                </div>
                {phone && (
                  <div className="text-xs text-gray-500 mt-0.5">
                    📞{' '}
                    {shouldHighlightPhone && debounced
                      ? highlightPhone(phone, debounced)
                      : phone}
                  </div>
                )}
                {getMatchedOnLabel(result, debounced) && (
                  <div className="text-xs text-gray-400 mt-0.5">
                    {getMatchedOnLabel(result, debounced)}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )
    }

    return null
  }

  const inputElement = (
    <div className={`relative ${inputWidth || ''}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setUnifiedQuery(e.target.value)
        }}
        className={`pl-10 ${inputPaddingRight}`}
        onBlur={(e) => {
          // Don't blur if clicking on a result
          const relatedTarget = e.relatedTarget as HTMLElement
          if (relatedTarget?.closest('.person-search-results')) {
            e.preventDefault()
            inputRef.current?.focus()
          }
        }}
        onFocus={() => {
          if (query.trim().length > 0) {
            setIsPopoverOpen(true)
          }
        }}
      />
      {loading && (
        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
      )}
      {showClearButton && query && !loading && (
        <button
          onClick={handleClear}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )

  return (
    <div className={`relative ${className}`}>
      <Popover open={isPopoverOpen && shouldShowResults} onOpenChange={setIsPopoverOpen}>
        {inputElement}
        <PopoverContent triggerRef={inputRef} className="max-h-80 overflow-y-auto p-0">
          {renderResults()}
        </PopoverContent>
      </Popover>
    </div>
  )
}
