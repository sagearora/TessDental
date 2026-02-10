import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Search, Loader2 } from 'lucide-react'
import { formatPhoneNumber } from '@/utils/phone'
import { useUnifiedPatientSearch } from '@/hooks/useUnifiedPatientSearch'

interface PatientSearchResult {
  id: number
  displayName: string
  dob?: string | null
  chartNo?: string | null
  status?: string | null
  phone?: string | null
}

interface PatientSearchProps {
  onSelect?: (result: PatientSearchResult) => void
  placeholder?: string
  limit?: number
  className?: string
  showResults?: boolean
}

export function PatientSearch({
  onSelect,
  placeholder = 'Search by name, phone, or chart number...',
  limit = 25,
  className = '',
  showResults = true,
}: PatientSearchProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    results,
    loading,
    error,
    hasQuery,
    setQuery: setUnifiedQuery,
    debounced,
  } = useUnifiedPatientSearch({
    limit: limit || 25,
  })

  const formatResult = (result: PatientSearchResult) => {
    return result.displayName || 'Unknown'
  }

  const getMatchedOnLabel = (_result: PatientSearchResult, _query: string) => {
    // person_search_v doesn't have separate search fields, so we can't determine match type
    return ''
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
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
          className="pl-10 pr-10"
          onBlur={(e) => {
            // Don't blur if clicking on a result
            const relatedTarget = e.relatedTarget as HTMLElement
            if (relatedTarget?.closest('.patient-search-results')) {
              e.preventDefault()
              inputRef.current?.focus()
            }
          }}
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
        )}
      </div>

      {showResults && hasQuery && (
        <div 
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto patient-search-results"
          onMouseDown={(e) => {
            // Prevent input from losing focus when clicking on dropdown
            e.preventDefault()
          }}
        >
          {loading && (
            <div className="p-4 text-center text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
              Searching...
            </div>
          )}

          {error && (
            <div className="p-4 text-center text-sm text-red-600">
              Error: {error.message}
            </div>
          )}

          {!loading && !error && results.length === 0 && (
            <div className="p-4 text-center text-sm text-gray-500">
              No patients found
            </div>
          )}

          {!loading && !error && results.length > 0 && (
            <div className="py-1">
              {results.map((result) => {
                const phone = formatPhoneNumber(result.phone || null)
                const dob = result.dob ? new Date(result.dob) : null
                const age = dob ? Math.floor((new Date().getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null
                const status = result.status || null
                
                return (
                  <button
                    key={result.id}
                    onClick={() => {
                      if (onSelect) {
                        onSelect(result)
                      }
                      setQuery('')
                      setUnifiedQuery('')
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none text-sm"
                  >
                    <div className="font-medium">{formatResult(result)}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {dob && age !== null && (
                        <span>{dob.toLocaleDateString()} ({age})</span>
                      )}
                      {dob && age !== null && status && <span> · </span>}
                      {status && <span className="capitalize">{status}</span>}
                    </div>
                    {phone && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        📞 {phone}
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
          )}
        </div>
      )}
    </div>
  )
}
