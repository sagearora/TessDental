import type PDFDocument from 'pdfkit'
import type { LayoutDoc } from '../layout.js'
import { addClinicHeader, addClinicBlock, addStandardFooter } from '../layout.js'
import type { ClinicPayload, PatientPayload } from '../types.js'

export interface ImageTemplatePayload {
  clinic: ClinicPayload
  patient: PatientPayload
  image: Buffer // <-- Buffer, not base64
  capturedAt: string
  associatedTeeth?: string | null
  pageIndex: number
  totalPages: number
  printedAt?: string | null
}

/** Adds image template content to the PDF document. Caller must pipe/send doc and call doc.end(). */
export function buildImagePdf(
  doc: InstanceType<typeof PDFDocument>,
  payload: ImageTemplatePayload
): void {
  const layoutDoc = doc as unknown as LayoutDoc
  const {
    clinic,
    patient,
    image,
    capturedAt,
    associatedTeeth,
    pageIndex,
    totalPages,
    printedAt,
  } = payload

  const MARGIN = 50
  const pageWidth = doc.page.width - MARGIN * 2

  // These are your layout rails
  const bodyTop = 220
  const footerTop = doc.page.height - 80
  const maxImageHeight = footerTop - bodyTop - 20

  addClinicHeader(layoutDoc, {
    title: `Images for ${patient.displayName}`,
    clinic,
    printedAt,
    pageIndex,
    totalPages,
  })
  addClinicBlock(layoutDoc, clinic)

  // Force the image area to start where you intended (instead of doc.y drifting)
  const imageY = bodyTop

  ;(doc as any).image(image, MARGIN, imageY, {
    fit: [pageWidth, maxImageHeight],
    align: 'center',
    valign: 'center',
  })

  const extraLines: string[] = []
  extraLines.push(`Captured On: ${capturedAt}`)
  if (associatedTeeth != null && associatedTeeth !== '') {
    extraLines.push(`Associated Teeth: ${associatedTeeth}`)
  } else {
    extraLines.push('Associated Teeth:')
  }
  extraLines.push('* All images have been resized to fit on this page.')

  addStandardFooter(layoutDoc, {
    patient,
    pageIndex,
    totalPages,
    extraLines,
  })
}
