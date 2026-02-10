import { FastifyInstance } from 'fastify'
import { Readable } from 'stream'
import { getPool } from '../db.js'
import { AuthenticatedRequest } from '../middleware/auth.js'
import { requireCapability } from '../middleware/capability.js'
import { logAuditEvent } from '../lib/audit.js'
import { getStorageAdapter } from '../storage/index.js'
import { generateStorageKey, generateThumbKey, generateWebKey } from '../lib/storage-key.js'
import { generateThumb, generateWebVersion } from '../lib/thumbnails.js'
import { computeSha256, computeSha256FromBuffer } from '../lib/sha256.js'
import { env } from '../env.js'

export async function assetsRoutes(fastify: FastifyInstance) {
  // Upload endpoint
  fastify.post(
    '/imaging/assets/upload',
    {
      preHandler: [fastify.authenticate],
    },
    async (request: AuthenticatedRequest, reply) => {
      // Check capability
      const hasCapability = await requireCapability(request, reply, 'imaging.write')
      if (!hasCapability) {
        return
      }

      const auditContext = request.auditContext!
      const clinicId = Number(auditContext.clinicId)
      const userId = auditContext.actorUserId

      const data = await request.file()
      if (!data) {
        return reply.status(400).send({ error: 'No file provided' })
      }

      // Extract form fields
      const fields = data.fields as Record<string, { value: string }>
      const patientId = fields.patientId
      const studyId = fields.studyId
      const modality = fields.modality
      const capturedAt = fields.capturedAt
      const sourceDevice = fields.sourceDevice

      if (!patientId || !studyId || !modality) {
        return reply.status(400).send({ error: 'Missing required fields: patientId, studyId, modality' })
      }

      const patientIdNum = Number(patientId.value)
      const studyIdNum = Number(studyId.value)
      const modalityStr = String(modality.value)
      const capturedAtDate = capturedAt ? new Date(capturedAt.value) : new Date()
      const sourceDeviceStr = sourceDevice ? String(sourceDevice.value) : null

      // Validate file size
      const maxBytes = env.IMAGING_MAX_UPLOAD_MB * 1024 * 1024
      if (data.file.bytesRead > maxBytes) {
        return reply.status(400).send({ error: `File too large. Maximum size: ${env.IMAGING_MAX_UPLOAD_MB}MB` })
      }

      // Read file into buffer
      const chunks: Buffer[] = []
      for await (const chunk of data.file) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
      }
      const fileBuffer = Buffer.concat(chunks)

      // Compute SHA256
      const sha256 = computeSha256FromBuffer(fileBuffer)

      // Get mime type
      const mimeType = data.mimetype || 'application/octet-stream'

      const pool = getPool()
      const client = await pool.connect()
      const storage = getStorageAdapter()

      try {
        await client.query('BEGIN')

        // Verify study belongs to clinic and patient
        const studyCheck = await client.query(
          `SELECT id, clinic_id, patient_id FROM public.imaging_study 
           WHERE id = $1 AND clinic_id = $2 AND patient_id = $3 AND is_active = true`,
          [studyIdNum, clinicId, patientIdNum]
        )

        if (studyCheck.rows.length === 0) {
          await client.query('ROLLBACK')
          return reply.status(404).send({ error: 'Study not found or access denied' })
        }

        // Insert asset row first to get assetId
        const assetResult = await client.query(
          `INSERT INTO public.imaging_asset 
           (clinic_id, patient_id, study_id, modality, mime_type, size_bytes, sha256, 
            storage_backend, storage_key, captured_at, source_device, created_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           RETURNING id`,
          [
            clinicId,
            patientIdNum,
            studyIdNum,
            modalityStr,
            mimeType,
            fileBuffer.length,
            sha256,
            env.IMAGING_STORAGE_BACKEND,
            '', // Will update after we generate the key
            capturedAtDate,
            sourceDeviceStr,
            userId,
          ]
        )

        const assetId = assetResult.rows[0].id

        // Generate storage key
        const extension = mimeType.split('/')[1] || 'bin'
        const storageKey = generateStorageKey(
          clinicId,
          patientIdNum,
          studyIdNum,
          'originals',
          assetId,
          capturedAtDate,
          extension
        )

        // Update asset with storage key
        await client.query(
          `UPDATE public.imaging_asset SET storage_key = $1 WHERE id = $2`,
          [storageKey, assetId]
        )

        // Store original file
        const originalStream = Readable.from(fileBuffer)
        await storage.put(storageKey, originalStream, mimeType)

        let thumbKey: string | null = null
        let webKey: string | null = null

        // Generate thumbnail and web version if enabled
        if (env.IMAGING_THUMBS_ENABLED && mimeType.startsWith('image/')) {
          try {
            // Generate thumbnail
            const thumbBuffer = await generateThumb(fileBuffer)
            thumbKey = generateThumbKey(clinicId, patientIdNum, studyIdNum, assetId)
            const thumbStream = Readable.from(thumbBuffer)
            await storage.put(thumbKey, thumbStream, 'image/webp')

            // Generate web version
            const webBuffer = await generateWebVersion(fileBuffer)
            webKey = generateWebKey(clinicId, patientIdNum, studyIdNum, assetId, capturedAtDate)
            const webStream = Readable.from(webBuffer)
            await storage.put(webKey, webStream, 'image/webp')

            // Update asset with thumb and web keys
            await client.query(
              `UPDATE public.imaging_asset SET thumb_key = $1, web_key = $2 WHERE id = $3`,
              [thumbKey, webKey, assetId]
            )

            // Log thumbnail generation
            await logAuditEvent(auditContext, {
              action: 'imaging.asset.thumb_generated',
              entityTable: 'imaging_asset',
              entityId: assetId,
            })
          } catch (thumbError) {
            console.error('Thumbnail generation error:', thumbError)
            // Continue even if thumbnail generation fails
          }
        }

        await client.query('COMMIT')

        // Log asset creation
        await logAuditEvent(auditContext, {
          action: 'imaging.asset.create',
          entityTable: 'imaging_asset',
          entityId: assetId,
          payload: {
            clinic_id: clinicId,
            patient_id: patientIdNum,
            study_id: studyIdNum,
            modality: modalityStr,
            size_bytes: fileBuffer.length,
            sha256,
            storage_backend: env.IMAGING_STORAGE_BACKEND,
          },
        })

        return { assetId }
      } catch (error: any) {
        await client.query('ROLLBACK')
        console.error('Upload error:', error)
        const errorMessage = error?.message || 'Internal server error'
        reply.status(500).send({ 
          error: 'Internal server error',
          details: errorMessage,
          code: error?.code
        })
      } finally {
        client.release()
      }
    }
  )

  // List assets endpoint (MUST come before /imaging/assets/:assetId to avoid route conflict)
  fastify.get<{ Querystring: { patientId?: string; studyId?: string } }>(
    '/imaging/assets',
    {
      preHandler: [fastify.authenticate],
    },
    async (request: AuthenticatedRequest & { query: { patientId?: string; studyId?: string } }, reply) => {
      // Check capability
      const hasCapability = await requireCapability(request, reply, 'imaging.read')
      if (!hasCapability) {
        return
      }

      const auditContext = request.auditContext!
      const clinicId = Number(auditContext.clinicId)
      const patientId = request.query.patientId ? Number(request.query.patientId) : null
      const studyId = request.query.studyId ? Number(request.query.studyId) : null

      const pool = getPool()

      try {
        let query = `
          SELECT 
            id, clinic_id, patient_id, study_id, modality, mime_type, 
            size_bytes, captured_at, source_device, storage_key, thumb_key, web_key
          FROM public.imaging_asset
          WHERE clinic_id = $1 AND is_active = true
        `
        const params: any[] = [clinicId]

        if (patientId) {
          query += ` AND patient_id = $${params.length + 1}`
          params.push(patientId)
        }

        if (studyId) {
          query += ` AND study_id = $${params.length + 1}`
          params.push(studyId)
        }

        query += ` ORDER BY captured_at DESC LIMIT 100`

        const result = await pool.query(query, params)

        return result.rows
      } catch (error) {
        console.error('List assets error:', error)
        reply.status(500).send({ error: 'Internal server error' })
      }
    }
  )

  // View endpoint (MUST come after /imaging/assets to avoid route conflict)
  fastify.get<{ Params: { assetId: string }; Querystring: { variant?: string } }>(
    '/imaging/assets/:assetId',
    {
      preHandler: [fastify.authenticate],
    },
    async (request: AuthenticatedRequest & { params: { assetId: string }; query: { variant?: string } }, reply) => {
      // Check capability
      const hasCapability = await requireCapability(request, reply, 'imaging.read')
      if (!hasCapability) {
        return
      }

      const assetId = Number(request.params.assetId)
      const variant = (request.query.variant || 'web') as 'original' | 'web' | 'thumb'
      const auditContext = request.auditContext!
      const clinicId = Number(auditContext.clinicId)

      const pool = getPool()
      const storage = getStorageAdapter()

      try {
        // Get asset
        const result = await pool.query(
          `SELECT id, clinic_id, patient_id, study_id, storage_backend, storage_key, thumb_key, web_key, mime_type
           FROM public.imaging_asset
           WHERE id = $1 AND clinic_id = $2 AND is_active = true`,
          [assetId, clinicId]
        )

        if (result.rows.length === 0) {
          return reply.status(404).send({ error: 'Asset not found or access denied' })
        }

        const asset = result.rows[0]

        // Determine which key to use
        let key: string
        let contentType: string

        if (variant === 'thumb' && asset.thumb_key) {
          key = asset.thumb_key
          contentType = 'image/webp'
        } else if (variant === 'web' && asset.web_key) {
          key = asset.web_key
          contentType = 'image/webp'
        } else if (variant === 'original') {
          key = asset.storage_key
          contentType = asset.mime_type
        } else {
          // Fallback to original if web/thumb not available
          key = asset.storage_key
          contentType = asset.mime_type
        }

        // Stream file
        const stream = await storage.get(key)

        reply.header('Content-Type', contentType)
        reply.header('Cache-Control', 'private, max-age=3600')
        return reply.send(stream)
      } catch (error) {
        console.error('View asset error:', error)
        reply.status(500).send({ error: 'Internal server error' })
      }
    }
  )

  // Delete endpoint (soft delete)
  fastify.delete<{ Params: { assetId: string } }>(
    '/imaging/assets/:assetId',
    {
      preHandler: [fastify.authenticate],
    },
    async (request: AuthenticatedRequest & { params: { assetId: string } }, reply) => {
      // Check capability
      const hasCapability = await requireCapability(request, reply, 'imaging.write')
      if (!hasCapability) {
        return
      }

      const assetId = Number(request.params.assetId)
      const auditContext = request.auditContext!
      const clinicId = Number(auditContext.clinicId)

      const pool = getPool()
      const client = await pool.connect()

      try {
        await client.query('BEGIN')

        // Get asset
        const result = await client.query(
          `SELECT id, clinic_id FROM public.imaging_asset
           WHERE id = $1 AND clinic_id = $2 AND is_active = true`,
          [assetId, clinicId]
        )

        if (result.rows.length === 0) {
          await client.query('ROLLBACK')
          return reply.status(404).send({ error: 'Asset not found or access denied' })
        }

        // Soft delete
        await client.query(
          `UPDATE public.imaging_asset SET is_active = false, updated_by = $1 WHERE id = $2`,
          [auditContext.actorUserId, assetId]
        )

        await client.query('COMMIT')

        // Log deletion
        await logAuditEvent(auditContext, {
          action: 'imaging.asset.delete',
          entityTable: 'imaging_asset',
          entityId: assetId,
        })

        return { success: true }
      } catch (error) {
        await client.query('ROLLBACK')
        console.error('Delete asset error:', error)
        reply.status(500).send({ error: 'Internal server error' })
      } finally {
        client.release()
      }
    }
  )
}
