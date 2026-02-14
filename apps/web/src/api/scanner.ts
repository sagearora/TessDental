const SCANNER_API_URL = import.meta.env.VITE_SCANNER_API_URL || 'http://localhost:4011'

export interface ScannerDevice {
  id: string
  name: string
  type: 'twain' | 'wia'
}

export interface ScanOptions {
  dpi?: number
  color?: boolean
}

export interface ScanResponse {
  image: Blob
  format: 'jpeg' | 'png'
}

/**
 * Checks if the scanner desktop app is available
 */
export async function checkScannerAppAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${SCANNER_API_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000), // 2 second timeout
    })
    return response.ok
  } catch (error) {
    return false
  }
}

/**
 * Lists available scanner devices
 */
export async function listScannerDevices(): Promise<ScannerDevice[]> {
  try {
    const response = await fetch(`${SCANNER_API_URL}/devices`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })

    if (!response.ok) {
      throw new Error(`Failed to list devices: ${response.statusText}`)
    }

    const data = await response.json()
    return data.devices || []
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Is the scanner app running?')
    }
    if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
      throw new Error('Cannot connect to scanner app. Make sure it is running on your computer.')
    }
    throw error
  }
}

/**
 * Requests a scan from a specific device
 */
export async function requestScan(
  deviceId: string,
  options?: ScanOptions
): Promise<ScanResponse> {
  try {
    const response = await fetch(`${SCANNER_API_URL}/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deviceId,
        options: options || {},
      }),
      signal: AbortSignal.timeout(60000), // 60 second timeout for scan
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(error.error || `Scan failed: ${response.statusText}`)
    }

    // Handle different response formats
    const contentType = response.headers.get('content-type') || ''
    
    if (contentType.includes('application/json')) {
      // JSON response with base64 image
      const data = await response.json()
      if (data.image && data.format) {
        // Convert base64 to blob
        const base64Data = data.image.replace(/^data:image\/\w+;base64,/, '')
        const binaryString = atob(base64Data)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        const blob = new Blob([bytes], { type: `image/${data.format}` })
        return { image: blob, format: data.format }
      }
      throw new Error('Invalid response format from scanner')
    } else {
      // Direct blob response
      const blob = await response.blob()
      const format = contentType.includes('png') ? 'png' : 'jpeg'
      return { image: blob, format }
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Scan timed out. Please try again.')
    }
    if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
      throw new Error('Cannot connect to scanner app. Make sure it is running.')
    }
    throw error
  }
}
