import type { FastifyInstance } from 'fastify'
import PDFDocument from 'pdfkit'
import { z } from 'zod'
import type { AuthenticatedRequest } from '../middleware/auth.js'
import { buildImagePdf } from '../lib/templates/image-pdf.js'
import { getMountLayoutFromTemplate, buildMountPdf } from '../lib/templates/mount-pdf.js'
import { getAssetMeta, getMountMeta, getClinic, getPatientDisplay } from '../lib/hasura.js'
import { fetchAssetImage, fetchMount, type MountSlot } from '../lib/imaging.js'
import { imageToJpegForPdf } from '../lib/image-for-pdf.js'
import { PassThrough } from 'node:stream'
import { env } from '../env.js'

function logPdfError(
  request: AuthenticatedRequest,
  route: string,
  step: string,
  err: unknown
): { message: string; stack?: string } {
  const message = err instanceof Error ? err.message : String(err)
  const stack = err instanceof Error ? err.stack : undefined
  request.log.error({ err, step, route }, `${route} failed at step "${step}": ${message}`)
  return { message, stack }
}

function pdfErrorBody(route: string, step: string, err: unknown): { error: string; step?: string; detail?: string } {
  const message = err instanceof Error ? err.message : String(err)
  const body: { error: string; step?: string; detail?: string } = {
    error: 'PDF generation failed',
    step,
  }
  if (env.NODE_ENV === 'development') {
    body.detail = message
  }
  return body
}

function corsHeaders(origin: string | undefined): Record<string, string> {
  const h: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
  if (origin) {
    h['Access-Control-Allow-Origin'] = origin
    h['Access-Control-Allow-Credentials'] = 'true'
  } else {
    h['Access-Control-Allow-Origin'] = '*'
  }
  return h
}

const assetIdQuerySchema = z.object({ assetId: z.coerce.number().int().positive() })
const mountIdQuerySchema = z.object({ mountId: z.coerce.number().int().positive() })

function formatCapturedAt(iso: string | null): string {
  if (!iso) return new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
  return new Date(iso).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
}

export async function pdfRoutes(fastify: FastifyInstance) {
  // --- OPTIONS for /pdf/test ---
  fastify.options('/pdf/test', async (request, reply) => {
    return reply.status(204).headers(corsHeaders(request.headers.origin)).send()
  })

  // --- Minimal test PDF route (no external deps) ---
  fastify.get(
    '/pdf/test',
    { preHandler: [fastify.authenticate] },
    async (request: AuthenticatedRequest, reply) => {
      const doc = new PDFDocument({ size: 'LETTER', margin: 50 })
      const out = new PassThrough()

      doc.pipe(out)

      request.raw.on('close', () => {
        try {
          ;(doc as unknown as { destroy?: (err?: Error) => void }).destroy?.()
        } catch {
          /* ignore */
        }
        out.destroy()
      })

      doc.on('error', (err) => {
        request.log.error(err, 'PDFKit error')
        out.destroy(err as Error)
      })

      out.on('error', (err) => {
        request.log.error(err, 'PDF output stream error')
        reply.raw.destroy()
      })

      doc.fontSize(24).text('Hello PDF', { align: 'left' })
      doc.moveDown()
      doc.fontSize(12).text(`Generated at: ${new Date().toISOString()}`)
      doc.end()

      reply
        .code(200)
        .type('application/pdf')
        .header('Content-Disposition', 'inline; filename="test.pdf"')

      const ch = corsHeaders(request.headers.origin)
      for (const [k, v] of Object.entries(ch)) reply.header(k, v as string)

      return reply.send(out)
    }
  )

  // --- OPTIONS for /pdf/printimage ---
  fastify.options('/pdf/printimage', async (request, reply) => {
    return reply.status(204).headers(corsHeaders(request.headers.origin)).send()
  })

  // --- GET /pdf/printimage: validate first, build then send, never JSON after stream ---
  fastify.get<{ Querystring: unknown }>(
    '/pdf/printimage',
    { preHandler: [fastify.authenticate] },
    async (request: AuthenticatedRequest, reply) => {
      const parse = assetIdQuerySchema.safeParse(request.query)
      if (!parse.success) {
        return reply.status(400).send({ error: 'Missing or invalid assetId', details: parse.error.flatten() })
      }

      const { assetId } = parse.data
      const authHeader = request.headers.authorization as string | undefined
      let step = 'fetch_asset_meta'

      try {
        const meta = await getAssetMeta(assetId, authHeader)
        if (!meta) return reply.status(404).send({ error: 'Asset not found or access denied' })

        step = 'fetch_clinic_patient_image'
        const [clinic, patient, imageBuffer] = await Promise.all([
          getClinic(meta.clinic_id, authHeader),
          getPatientDisplay(meta.clinic_id, meta.patient_id, authHeader),
          fetchAssetImage(assetId, authHeader, 'web'),
        ])

        if (!clinic || !patient) return reply.status(404).send({ error: 'Clinic or patient not found' })
        if (!imageBuffer || imageBuffer.length === 0) return reply.status(404).send({ error: 'Image data not available' })

        step = 'convert_image'
        const imageForPdf = await imageToJpegForPdf(imageBuffer)

        const capturedAt = formatCapturedAt(meta.captured_at)
        const printedAt = new Date().toISOString()

        const doc = new PDFDocument({ margin: 0, size: 'LETTER' })
        const out = new PassThrough()

        request.raw.on('close', () => {
          try {
            ;(doc as unknown as { destroy: (err?: Error) => void }).destroy()
          } catch {
            /* ignore */
          }
          out.destroy()
        })

        doc.on('error', (err) => {
          request.log.error(err, 'PDFKit error')
          out.destroy(err as Error)
        })

        out.on('error', (err) => {
          request.log.error(err, 'PDF output stream error')
          reply.raw.destroy()
        })

        doc.pipe(out)

        step = 'build_pdf'
        try {
          buildImagePdf(doc as Parameters<typeof buildImagePdf>[0], {
            clinic,
            patient,
            image: imageForPdf,
            capturedAt,
            associatedTeeth: null,
            pageIndex: 1,
            totalPages: 1,
            printedAt,
          })
          doc.end()
        } catch (err) {
          logPdfError(request, 'printimage', step, err)
          ;(doc as unknown as { destroy: (err?: Error) => void }).destroy()
          out.destroy()
          if (!reply.sent) {
            return reply.status(500).send(pdfErrorBody('printimage', step, err))
          }
          return
        }

        reply
          .code(200)
          .type('application/pdf')
          .header('Content-Disposition', 'inline; filename="image.pdf"')

        const ch = corsHeaders(request.headers.origin)
        for (const [k, v] of Object.entries(ch)) reply.header(k, v as string)

        return reply.send(out)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        if (message.includes('not found') || message.includes('access denied') || message.includes('404')) {
          return reply.status(404).send({ error: message })
        }
        logPdfError(request, 'printimage', step, err)
        return reply.status(500).send(pdfErrorBody('printimage', step, err))
      }
    }
  )

  // --- OPTIONS for /pdf/printmount and /pdf/printnotes ---
  fastify.options('/pdf/printmount', async (request, reply) => {
    return reply.status(204).headers(corsHeaders(request.headers.origin)).send()
  })
  fastify.options('/pdf/printnotes', async (request, reply) => {
    return reply.status(204).headers(corsHeaders(request.headers.origin)).send()
  })

  // --- GET /pdf/printmount: validate first, build then send, never JSON after stream ---
  fastify.get<{ Querystring: unknown }>(
    '/pdf/printmount',
    { preHandler: [fastify.authenticate] },
    async (request: AuthenticatedRequest, reply) => {
      const parse = mountIdQuerySchema.safeParse(request.query)
      if (!parse.success) {
        return reply.status(400).send({ error: 'Missing or invalid mountId', details: parse.error.flatten() })
      }
      const { mountId } = parse.data
      const authHeader = request.headers.authorization as string | undefined

      try {
        const [mountMeta, mount] = await Promise.all([
          getMountMeta(mountId, authHeader),
          fetchMount(mountId, authHeader),
        ])
        if (!mountMeta || !mount) {
          return reply.status(404).send({ error: 'Mount not found or access denied' })
        }
        const slotsWithAssets = (mount.slots || []).filter((s: MountSlot) => s.asset_id != null) as MountSlot[]
        if (slotsWithAssets.length === 0) {
          return reply.status(400).send({ error: 'Mount has no images to print' })
        }

        const [clinic, patient] = await Promise.all([
          getClinic(mount.clinic_id, authHeader),
          getPatientDisplay(mount.clinic_id, mount.patient_id, authHeader),
        ])
        if (!clinic || !patient) {
          return reply.status(404).send({ error: 'Clinic or patient not found' })
        }

        const imageBuffers: Buffer[] = []
        for (const slot of slotsWithAssets) {
          if (slot.asset_id == null) continue
          const buf = await fetchAssetImage(slot.asset_id, authHeader, 'web')
          imageBuffers.push(buf)
        }
        if (imageBuffers.length === 0) {
          return reply.status(404).send({ error: 'Could not fetch mount images' })
        }

        const imageForPdfBuffers = await Promise.all(imageBuffers.map((buf) => imageToJpegForPdf(buf)))

        const layout = getMountLayoutFromTemplate(mount.template)
        if (!layout || layout.slots.length === 0) {
          return reply.status(400).send({ error: 'Mount template has no layout' })
        }

        const slotImages = new Map<string, Buffer>()
        slotsWithAssets.forEach((slot, i) => {
          if (slot.slot_id != null && imageForPdfBuffers[i] != null) {
            slotImages.set(slot.slot_id, imageForPdfBuffers[i])
          }
        })

        const doc = new PDFDocument({ margin: 0, size: [792, 612] })
        const out = new PassThrough()

        request.raw.on('close', () => {
          try {
            ;(doc as unknown as { destroy: (err?: Error) => void }).destroy()
          } catch {
            /* ignore */
          }
          out.destroy()
        })

        doc.on('error', (err) => {
          request.log.error(err, 'PDFKit error')
          out.destroy(err as Error)
        })

        out.on('error', (err) => {
          request.log.error(err, 'PDF output stream error')
          reply.raw.destroy()
        })

        doc.pipe(out)

        try {
          buildMountPdf(doc as Parameters<typeof buildMountPdf>[0], { layout, slotImages })
          doc.end()
        } catch (err) {
          request.log.error(err, 'printmount PDF build failed')
          ;(doc as unknown as { destroy: (err?: Error) => void }).destroy()
          out.destroy()
          if (!reply.sent) {
            return reply.status(500).send({ error: 'PDF generation failed' })
          }
          return
        }

        reply
          .code(200)
          .type('application/pdf')
          .header('Content-Disposition', 'inline; filename="mount.pdf"')

        const ch = corsHeaders(request.headers.origin)
        for (const [k, v] of Object.entries(ch)) reply.header(k, v as string)

        return reply.send(out)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        if (message.includes('not found') || message.includes('access denied') || message.includes('404')) {
          return reply.status(404).send({ error: message })
        }
        request.log.error(err, 'printmount failed')
        return reply.status(500).send({ error: 'PDF generation failed' })
      }
    }
  )

  // --- GET /pdf/printnotes (stub) ---
  fastify.get('/pdf/printnotes', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    return reply.status(501).send({ error: 'Not implemented' })
  })
}
