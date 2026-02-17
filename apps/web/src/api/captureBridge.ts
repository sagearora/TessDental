/**
 * TessDental Capture Bridge client.
 * Connects to the Windows TessCapture over WebSocket: listSources (TWAIN sources),
 * capture with optional direct-upload token/url. C# API uses type-based messages.
 */

const BASE_WS_URL =
  import.meta.env.VITE_CAPTURE_BRIDGE_WS_URL || 'ws://localhost:38732'
const CAPTURE_BRIDGE_WS_URL = BASE_WS_URL.endsWith('/ws') || BASE_WS_URL.endsWith('/ws/')
  ? BASE_WS_URL
  : `${BASE_WS_URL.replace(/\/$/, '')}/ws/`

export interface CaptureBridgeDevice {
  id: string
  name: string
  type?: string
}

export interface CaptureBridgeFile {
  mime: string
  base64?: string
}

export interface CaptureOptions {
  uploadToken: string
  uploadUrl: string
}

/**
 * Check if the Capture Bridge is available (can open a WebSocket).
 */
export function isCaptureBridgeAvailable(): Promise<boolean> {
  return new Promise((resolve) => {
    const ws = new WebSocket(CAPTURE_BRIDGE_WS_URL)
    const t = setTimeout(() => {
      ws.close()
      resolve(false)
    }, 2000)
    ws.onopen = () => {
      clearTimeout(t)
      ws.close()
      resolve(true)
    }
    ws.onerror = () => {
      clearTimeout(t)
      resolve(false)
    }
  })
}

/**
 * Connect, send listSources, return list of TWAIN sources (productName as id/name).
 */
export function scanDevices(): Promise<CaptureBridgeDevice[]> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(CAPTURE_BRIDGE_WS_URL)

    const timeout = setTimeout(() => {
      ws.close()
      reject(new Error('Capture bridge did not respond to listSources in time.'))
    }, 10000)

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'listSources' }))
    }

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string) as { type?: string; sources?: Array<{ productName?: string }> }
        if (msg.type === 'sources' && Array.isArray(msg.sources)) {
          clearTimeout(timeout)
          ws.close()
          const devices: CaptureBridgeDevice[] = msg.sources.map((s) => {
            const raw = s.productName
            const productName = typeof raw === 'string' ? raw : 'Unknown'
            return { id: productName, name: productName, type: 'TWAIN' }
          })
          resolve(devices)
          return
        }
        if (msg.type === 'error') {
          clearTimeout(timeout)
          ws.close()
          reject(new Error((msg as { message?: string }).message ?? 'List sources failed'))
        }
      } catch {
        // ignore non-JSON or unexpected
      }
    }

    ws.onerror = () => {
      clearTimeout(timeout)
      reject(new Error('Cannot connect to Capture Bridge. Make sure it is running on this computer.'))
    }

    ws.onclose = () => {
      clearTimeout(timeout)
    }
  })
}

/**
 * Connect, send capture for the given source (productName). If options (uploadToken, uploadUrl)
 * are provided, C# uploads directly and we resolve with []. Otherwise resolves with File[] if
 * C# sends base64 (legacy). Resolves on captureDone.
 */
export function capture(
  sourceProductName: string,
  options?: CaptureOptions
): Promise<File[]> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(CAPTURE_BRIDGE_WS_URL)
    const collectedFiles: File[] = []

    const timeout = setTimeout(() => {
      ws.close()
      reject(new Error('Capture timed out. Please try again.'))
    }, 120000)

    const finish = (files: File[]) => {
      clearTimeout(timeout)
      ws.close()
      resolve(files)
    }

    ws.onopen = () => {
      const payload: Record<string, string> = {
        type: 'capture',
        source: sourceProductName,
      }
      if (options?.uploadToken) payload.uploadToken = options.uploadToken
      if (options?.uploadUrl) payload.uploadUrl = options.uploadUrl
      ws.send(JSON.stringify(payload))
    }

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string) as {
          type?: string
          message?: string
          files?: CaptureBridgeFile[]
        }
        if (msg.type === 'error') {
          clearTimeout(timeout)
          ws.close()
          reject(new Error(msg.message ?? 'Capture failed'))
          return
        }
        if (msg.type === 'imageSaved' && 'base64' in msg && (msg as { base64?: string }).base64) {
          const f = msg as { base64: string; mime?: string; index?: number }
          const mime = f.mime ?? 'image/jpeg'
          const ext = mime === 'image/png' ? 'png' : mime === 'image/jpeg' ? 'jpg' : 'bin'
          const binary = atob(f.base64)
          const bytes = new Uint8Array(binary.length)
          for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
          collectedFiles.push(
            new File([bytes], `capture-${Date.now()}-${f.index ?? 0}.${ext}`, { type: mime })
          )
          return
        }
        if (msg.type === 'captureDone') {
          finish(collectedFiles)
        }
      } catch {
        // ignore parse errors
      }
    }

    ws.onerror = () => {
      clearTimeout(timeout)
      reject(new Error('Cannot connect to Capture Bridge. Make sure it is running.'))
    }

    ws.onclose = () => {
      clearTimeout(timeout)
    }
  })
}
