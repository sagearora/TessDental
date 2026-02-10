/**
 * Generate storage key for an asset
 * Format: clinic_<clinicId>/patients/<patientId>/studies/<studyId>/<kind>/<assetId>_<utcTimestamp>.<ext>
 */
export function generateStorageKey(
  clinicId: number,
  patientId: number,
  studyId: number,
  kind: 'originals' | 'thumbs' | 'web',
  assetId: number,
  timestamp: Date,
  extension: string
): string {
  const utcTimestamp = timestamp.toISOString().replace(/[:.]/g, '').replace('T', 'T').replace('Z', 'Z')
  return `clinic_${clinicId}/patients/${patientId}/studies/${studyId}/${kind}/${assetId}_${utcTimestamp}.${extension}`
}

/**
 * Generate thumbnail key
 */
export function generateThumbKey(
  clinicId: number,
  patientId: number,
  studyId: number,
  assetId: number
): string {
  return `clinic_${clinicId}/patients/${patientId}/studies/${studyId}/thumbs/${assetId}_thumb.webp`
}

/**
 * Generate web-optimized key
 */
export function generateWebKey(
  clinicId: number,
  patientId: number,
  studyId: number,
  assetId: number,
  timestamp: Date
): string {
  const utcTimestamp = timestamp.toISOString().replace(/[:.]/g, '').replace('T', 'T').replace('Z', 'Z')
  return `clinic_${clinicId}/patients/${patientId}/studies/${studyId}/web/${assetId}_${utcTimestamp}_web.webp`
}
