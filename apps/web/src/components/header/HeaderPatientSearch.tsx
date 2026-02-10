import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent } from '@/components/ui/popover'
import { useUnifiedPatientSearch } from '@/hooks/useUnifiedPatientSearch'
import { formatPhoneNumber } from '@/utils/phone'

export function HeaderPatientSearch() {
  const navigate = useNavigate()

  const { query, setQuery, results, loading, hasQuery } = useUnifiedPatientSearch({
    limit: 10,
  })

  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSelect = (personId: number) => {
    setQuery('')
    setIsPopoverOpen(false)
    navigate(`/profile/${personId}`)
  }

  return (
    <div className="relative">
      <Popover open={isPopoverOpen && hasQuery} onOpenChange={setIsPopoverOpen}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search patients..."
            value={query}
            onChange={(e) => {
              const v = e.target.value
              setQuery(v)
              setIsPopoverOpen(v.trim().length >= 2)
            }}
            onFocus={() => {
              if (hasQuery) setIsPopoverOpen(true)
            }}
            className="pl-9 pr-8 w-64"
          />

          {query && (
            <button
              onClick={() => {
                setQuery('')
                setIsPopoverOpen(false)
                inputRef.current?.focus()
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <PopoverContent triggerRef={inputRef} className="max-h-80 overflow-y-auto p-0">
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          ) : results.length === 0 && hasQuery ? (
            <div className="p-4 text-sm text-gray-500 text-center">No patients found</div>
          ) : (
            <div className="py-1">
              {results.map((r) => {
                const phone = formatPhoneNumber(r.phone || null)
                const dobDate = r.dob ? new Date(r.dob) : null
                const age =
                  dobDate
                    ? Math.floor(
                        (new Date().getTime() - dobDate.getTime()) /
                          (365.25 * 24 * 60 * 60 * 1000),
                      )
                    : null
                const status = r.status || null

                return (
                  <button
                    key={r.id}
                    onClick={() => handleSelect(r.id)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  >
                    <div className="font-medium text-gray-900">
                      {r.displayName || 'Unknown'}
                    </div>
                    {(dobDate || status) && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {dobDate && age !== null && (
                          <span>
                            {dobDate.toLocaleDateString()} ({age})
                          </span>
                        )}
                        {dobDate && age !== null && status && <span> · </span>}
                        {status && <span className="capitalize">{status}</span>}
                      </div>
                    )}
                    {phone && (
                      <div className="text-xs text-gray-500 mt-0.5">{phone}</div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
