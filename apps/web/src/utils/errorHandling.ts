/**
 * Extracts a user-friendly error message from GraphQL/Apollo errors
 */
export function getErrorMessage(error: any, defaultMessage: string = 'An error occurred'): string {
  // Check for GraphQL errors first
  if (error?.graphQLErrors && error.graphQLErrors.length > 0) {
    const gqlError = error.graphQLErrors[0]
    const message = gqlError.message || ''
    
    // Check for Hasura permission errors
    if (
      message.includes('check constraint') ||
      message.includes('permission') ||
      message.includes('permission denied') ||
      message.includes('row-level security')
    ) {
      // Try to extract more context from the error
      if (message.includes('clinic')) {
        return 'You do not have permission to update clinic information. Please contact your administrator to request the "Manage Clinic" capability.'
      }
      if (message.includes('user')) {
        return 'You do not have permission to manage users. Please contact your administrator to request the "Manage Users" capability.'
      }
      if (message.includes('role')) {
        return 'You do not have permission to manage roles. Please contact your administrator to request the "Manage Users" capability.'
      }
      return 'You do not have permission to perform this action. Please contact your administrator.'
    }
    
    // Return the GraphQL error message if it's not a permission error
    return message
  }
  
  // Check for network errors
  if (error?.networkError) {
    return 'Network error. Please check your connection and try again.'
  }
  
  // Check for standard error message
  if (error?.message) {
    return error.message
  }
  
  return defaultMessage
}

/**
 * Checks if an error is a permission/authorization error
 */
export function isPermissionError(error: any): boolean {
  const message = error?.message || error?.graphQLErrors?.[0]?.message || ''
  return (
    message.includes('check constraint') ||
    message.includes('permission') ||
    message.includes('permission denied') ||
    message.includes('row-level security') ||
    message.includes('unauthorized') ||
    message.includes('forbidden')
  )
}
