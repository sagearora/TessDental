import React from 'react'

/**
 * Highlights matching text in a string by wrapping matches in a <mark> element
 * @param text - The text to search in
 * @param query - The search query to highlight
 * @param caseSensitive - Whether the search should be case sensitive (default: false)
 * @returns React element with highlighted matches
 */
export function highlightText(
  text: string,
  query: string,
  caseSensitive: boolean = false
): React.ReactNode {
  if (!query.trim() || !text) {
    return text
  }

  const flags = caseSensitive ? 'g' : 'gi'
  const escapedQuery = escapeRegex(query)
  const regex = new RegExp(`(${escapedQuery})`, flags)
  const parts = text.split(regex)

  if (parts.length === 1) {
    // No matches found
    return text
  }

  return (
    <>
      {parts.map((part, index) => {
        // Check if this part matches the query (case-insensitive)
        const isMatch = caseSensitive
          ? part === query
          : part.toLowerCase() === query.toLowerCase()
        
        if (isMatch) {
          return (
            <mark key={`match-${index}`} className="bg-yellow-200 font-semibold">
              {part}
            </mark>
          )
        }
        return <React.Fragment key={`part-${index}`}>{part}</React.Fragment>
      })}
    </>
  )
}

/**
 * Escapes special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Highlights matching text in a string for phone numbers (handles formatting)
 * @param text - The formatted phone number text
 * @param query - The search query (may contain digits only or formatted)
 * @returns React element with highlighted matches
 */
export function highlightPhone(
  text: string,
  query: string
): React.ReactNode {
  if (!query.trim() || !text) {
    return text
  }

  // Extract digits from both text and query
  const textDigits = text.replace(/\D/g, '')
  const queryDigits = query.replace(/\D/g, '')

  if (!queryDigits || !textDigits.includes(queryDigits)) {
    return text
  }

  // Find the position of the match in the digit string
  const matchIndex = textDigits.indexOf(queryDigits)
  if (matchIndex === -1) {
    return text
  }

  // Find the corresponding position in the formatted string
  let digitCount = 0
  let startPos = -1
  let endPos = -1

  for (let i = 0; i < text.length; i++) {
    if (/\d/.test(text[i])) {
      if (digitCount === matchIndex) {
        startPos = i
      }
      digitCount++
      if (digitCount === matchIndex + queryDigits.length) {
        endPos = i + 1
        break
      }
    }
  }

  if (startPos === -1 || endPos === -1) {
    return text
  }

  const before = text.substring(0, startPos)
  const match = text.substring(startPos, endPos)
  const after = text.substring(endPos)

  return (
    <>
      {before}
      <mark className="bg-yellow-200 font-semibold">{match}</mark>
      {after}
    </>
  )
}
