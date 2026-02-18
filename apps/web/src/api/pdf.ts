const PDF_API_URL = import.meta.env.VITE_PDF_API_URL || 'http://localhost:4020'

import { authFetch } from '@/lib/onUnauthorized'

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('accessToken')
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

/**
 * Request a single-image PDF from the PDF service by asset ID.
 * The PDF service fetches the image and clinic/patient data itself; returns the PDF blob.
 */
export async function fetchPrintImagePdf(assetId: number): Promise<Blob> {
  const response = await authFetch(`${PDF_API_URL}/pdf/printimage?assetId=${assetId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: response.statusText }))
    throw new Error(err?.error || `PDF request failed: ${response.status}`)
  }
  return response.blob()
}

/**
 * Request a mount PDF from the PDF service by mount ID.
 * The PDF service fetches the mount, all slot images, and clinic/patient data; returns the PDF blob.
 */
export async function fetchPrintMountPdf(mountId: number): Promise<Blob> {
  const response = await authFetch(`${PDF_API_URL}/pdf/printmount?mountId=${mountId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: response.statusText }))
    throw new Error(err?.error || `PDF request failed: ${response.status}`)
  }
  return response.blob()
}
