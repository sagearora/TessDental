import type { ClinicPayload, PatientPayload } from './types.js'

/** Minimal PDF doc interface used by layout (PDFKit document) */
export interface LayoutDoc {
  fontSize(size: number): void
  text(text: string, x: number, y: number, options?: { width?: number; align?: string }): void
  image(src: Buffer | Uint8Array, x: number, y: number, options?: { fit?: [number, number] }): void
  y: number
  page: { height: number; width: number }
}

const MARGIN = 50
const LINE_HEIGHT = 14
const FOOTER_LINE_HEIGHT = 12

function formatPrintedAt(iso?: string | null): string {
  if (!iso) {
    const d = new Date()
    return d.toLocaleString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }
  const d = new Date(iso)
  return d.toLocaleString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function addClinicHeader(
  doc: LayoutDoc,
  options: {
    title: string
    clinic: ClinicPayload
    printedAt?: string | null
    pageIndex?: number
    totalPages?: number
  }
): void {
  const { title, clinic, printedAt, pageIndex, totalPages } = options
  doc.fontSize(12)
  const pageText =
    pageIndex != null && totalPages != null ? ` Page ${pageIndex} of ${totalPages}` : ''
  doc.text(title + pageText, MARGIN, MARGIN)
  const printed = formatPrintedAt(printedAt)
  const website = clinic.website ? ` ${clinic.website}` : ''
  doc.fontSize(9)
  doc.text(`Printed on ${printed}${website}`, MARGIN, MARGIN + LINE_HEIGHT)
  doc.y = MARGIN + LINE_HEIGHT * 2 + 8
}

export function addClinicBlock(doc: LayoutDoc, clinic: ClinicPayload): void {
  doc.fontSize(10)
  const lines: string[] = []
  if (clinic.name) lines.push(clinic.name)
  if (clinic.doctorName) lines.push(clinic.doctorName)
  const addressParts: string[] = []
  if (clinic.addressStreet) addressParts.push(clinic.addressStreet)
  if (clinic.addressUnit) addressParts.push(clinic.addressUnit)
  if (addressParts.length) lines.push(addressParts.join(', '))
  const cityLine: string[] = []
  if (clinic.addressCity) cityLine.push(clinic.addressCity)
  if (clinic.addressProvince) cityLine.push(clinic.addressProvince)
  if (clinic.addressPostal) cityLine.push(clinic.addressPostal)
  if (cityLine.length) lines.push(cityLine.join(', '))
  if (clinic.country) lines.push(clinic.country)
  if (clinic.phone) lines.push(`Tel: ${clinic.phone}`)
  if (clinic.fax) lines.push(`Fax: ${clinic.fax}`)
  if (clinic.website) lines.push(clinic.website)
  if (clinic.email) lines.push(clinic.email)

  lines.forEach((line) => {
    doc.text(line, MARGIN, doc.y)
    doc.y += LINE_HEIGHT
  })
  doc.y += 12
}

export function addStandardFooter(
  doc: LayoutDoc,
  options: {
    patient?: PatientPayload | null
    pageIndex?: number
    totalPages?: number
    extraLines?: string[]
  }
): void {
  const { patient, pageIndex, totalPages, extraLines = [] } = options
  const pageHeight = doc.page.height
  let y = pageHeight - MARGIN - FOOTER_LINE_HEIGHT * (extraLines.length + 2)
  if (pageIndex != null && totalPages != null) {
    y -= FOOTER_LINE_HEIGHT
  }
  doc.fontSize(9)
  if (patient?.displayName) {
    doc.text(patient.displayName, MARGIN, y)
    y += FOOTER_LINE_HEIGHT
  }
  if (patient?.birthdate) {
    doc.text(`Birthdate: ${patient.birthdate}`, MARGIN, y)
    y += FOOTER_LINE_HEIGHT
  }
  extraLines.forEach((line) => {
    doc.text(line, MARGIN, y)
    y += FOOTER_LINE_HEIGHT
  })
  if (pageIndex != null && totalPages != null) {
    doc.text(`-- ${pageIndex} of ${totalPages} --`, MARGIN, pageHeight - MARGIN - FOOTER_LINE_HEIGHT)
  }
}
