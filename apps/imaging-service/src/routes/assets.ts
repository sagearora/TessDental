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
import { signUploadToken, verifyUploadToken, UPLOAD_TOKEN_EXPIRES_IN_SEC, type UploadTokenClaims } from '../jwt.js'
import { extractToken } from '../middleware/auth.js'

export async function assetsRoutes(fastify: FastifyInstance) {
  // Issue short-lived upload token for bridge (patient-only, no studyId)
  fastify.post<{ Body: { patientId?: number; modality?: string; imageSource?: string } }>(
    '/imaging/assets/upload-token',
    {
      preHandler: [fastify.authenticate],
    },
    async (request: AuthenticatedRequest, reply) => {
      const hasCapability = await requireCapability(request, reply, 'imaging_write')
      if (!hasCapability) return

      const body = (request.body || {}) as { patientId?: number; modality?: string; imageSource?: string }
      const patientId = body.patientId
      if (patientId == null || typeof patientId !== 'number') {
        return reply.status(400).send({ error: 'Missing or invalid patientId' })
      }
      const modality = body.modality ?? 'PHOTO'
      const imageSource = body.imageSource ?? null

      const auditContext = request.auditContext!
      const uploadToken = signUploadToken({
        userId: auditContext.actorUserId,
        clinicId: Number(auditContext.clinicId),
        patientId,
        modality: String(modality),
        imageSource: imageSource != null ? String(imageSource) : null,
      })
      return {
        uploadToken,
        expiresIn: UPLOAD_TOKEN_EXPIRES_IN_SEC,
        uploadUrl: env.IMAGING_PUBLIC_URL,
      }
    }
  )

  // Bridge upload: auth by upload token only; asset created with study_id = null
  fastify.post('/imaging/assets/upload-bridge', async (request, reply) => {
    const token = extractToken(request)
    if (!token) {
      return reply.status(401).send({ error: 'Missing or invalid authorization header' })
    }
    let claims: UploadTokenClaims
    try {
      claims = verifyUploadToken(token)
    } catch {
      return reply.status(401).send({ error: 'Invalid or expired token' })
    }

    const clinicId = claims.clinicId
    const userId = claims.sub
    const patientIdNum = claims.patientId
    const modalityStr = claims.modality
    const imageSourceStr = claims.imageSource

    const data = await request.file()
    if (!data) {
      return reply.status(400).send({ error: 'No file provided' })
    }

    const fields = data.fields as Record<string, { value: string }>
    const capturedAt = fields.capturedAt
    const sourceDevice = fields.sourceDevice
    const name = fields.name

    const capturedAtDate = capturedAt?.value ? new Date(capturedAt.value) : new Date()
    const sourceDeviceStr = sourceDevice?.value ? String(sourceDevice.value) : null
    const nameStr = name?.value ? String(name.value).trim() || null : null

    const maxBytes = env.IMAGING_MAX_UPLOAD_MB * 1024 * 1024
    const chunks: Buffer[] = []
    for await (const chunk of data.file) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    }
    const fileBuffer = Buffer.concat(chunks)
    if (fileBuffer.length > maxBytes) {
      return reply.status(400).send({ error: `File too large. Maximum size: ${env.IMAGING_MAX_UPLOAD_MB}MB` })
    }

    const sha256 = computeSha256FromBuffer(fileBuffer)
    let mimeType = data.mimetype || 'application/octet-stream'
    if (mimeType === 'application/octet-stream' && data.filename) {
      const ext = data.filename.split('.').pop()?.toLowerCase()
      if (ext === 'jpg' || ext === 'jpeg') mimeType = 'image/jpeg'
      else if (ext === 'png') mimeType = 'image/png'
    }

    const pool = getPool()
    const client = await pool.connect()
    const storage = getStorageAdapter()

    try {
      await client.query('BEGIN')
      const studyIdNum = null

      const assetResult = await client.query(
        `INSERT INTO public.imaging_asset 
         (clinic_id, patient_id, study_id, modality, mime_type, size_bytes, sha256, 
          storage_backend, storage_key, captured_at, source_device, name, image_source, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
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
          '',
          capturedAtDate,
          sourceDeviceStr,
          nameStr,
          imageSourceStr,
          userId,
        ]
      )
      const assetId = assetResult.rows[0].id

      const extension = mimeType.split('/')[1] || 'bin'
      const storageKey = generateStorageKey(
        clinicId,
        patientIdNum,
        0,
        'originals',
        assetId,
        capturedAtDate,
        extension
      )
      await client.query(`UPDATE public.imaging_asset SET storage_key = $1 WHERE id = $2`, [storageKey, assetId])

      const originalStream = Readable.from(fileBuffer)
      await storage.put(storageKey, originalStream, mimeType)

      let thumbKey: string | null = null
      let webKey: string | null = null
      if (env.IMAGING_THUMBS_ENABLED && mimeType.startsWith('image/')) {
        try {
          const thumbBuffer = await generateThumb(fileBuffer)
          thumbKey = generateThumbKey(clinicId, patientIdNum, 0, assetId)
          const thumbStream = Readable.from(thumbBuffer)
          await storage.put(thumbKey, thumbStream, 'image/webp')
          const webBuffer = await generateWebVersion(fileBuffer)
          webKey = generateWebKey(clinicId, patientIdNum, 0, assetId, capturedAtDate)
          const webStream = Readable.from(webBuffer)
          await storage.put(webKey, webStream, 'image/webp')
          await client.query(`UPDATE public.imaging_asset SET thumb_key = $1, web_key = $2 WHERE id = $3`, [
            thumbKey,
            webKey,
            assetId,
          ])
        } catch (thumbError) {
          console.error('Thumbnail generation error:', thumbError)
        }
      }

      await client.query('COMMIT')
      return reply.send({ assetId })
    } catch (error: any) {
      await client.query('ROLLBACK')
      console.error('Upload bridge error:', error)
      return reply.status(500).send({ error: 'Internal server error', details: error?.message })
    } finally {
      client.release()
    }
  })

  // Bulk upload endpoint
  fastify.post(
    '/imaging/assets/upload-batch',
    {
      preHandler: [fastify.authenticate],
    },
    async (request: AuthenticatedRequest, reply) => {
      // Check capability
      const hasCapability = await requireCapability(request, reply, 'imaging_write')
      if (!hasCapability) {
        return
      }

      const auditContext = request.auditContext!
      const clinicId = Number(auditContext.clinicId)
      const userId = auditContext.actorUserId

      const results: Array<{
        assetId?: number
        success: boolean
        error?: string
        fileName?: string
      }> = []

      let patientIdNum: number | null = null
      let studyIdNum: number | null = null
      let modalityStr: string | null = null
      let imageSourceStr: string | null = null
      const names: (string | null)[] = []
      const capturedAts: (Date | null)[] = []
      const files: Array<{ 
        buffer: Buffer
        fileName: string
        mimeType: string
        index: number
      }> = []

      // Parse all parts of the multipart request
      try {
        const parts = request.parts()
        
        for await (const part of parts) {
          if (part.type === 'file') {
            const fileData = part as any
            const fileName = fileData.filename || `file_${files.length}`
            
            // Read file into buffer immediately (can't read stream twice)
            const chunks: Buffer[] = []
            for await (const chunk of fileData.file) {
              chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
            }
            const buffer = Buffer.concat(chunks)
            
            files.push({
              buffer,
              fileName,
              mimeType: fileData.mimetype || 'application/octet-stream',
              index: files.length,
            })
          } else {
            // Handle form fields
            const field = part as any
            const fieldName = field.fieldname
            const fieldValue = field.value

            if (fieldName === 'patientId') {
              patientIdNum = Number(fieldValue)
            } else if (fieldName === 'studyId') {
              studyIdNum = fieldValue ? Number(fieldValue) : null
            } else if (fieldName === 'modality') {
              modalityStr = String(fieldValue)
            } else if (fieldName === 'imageSource') {
              imageSourceStr = String(fieldValue)
            } else if (fieldName === 'names[]') {
              names.push(fieldValue ? String(fieldValue).trim() || null : null)
            } else if (fieldName === 'capturedAt[]') {
              capturedAts.push(fieldValue ? new Date(fieldValue) : null)
            }
          }
        }
      } catch (error: any) {
        return reply.status(400).send({ error: 'Failed to parse multipart request', details: error.message })
      }

      // Validate required fields
      if (!patientIdNum || !modalityStr) {
        return reply.status(400).send({ error: 'Missing required fields: patientId, modality' })
      }

      if (files.length === 0) {
        return reply.status(400).send({ error: 'No files provided' })
      }

      const pool = getPool()
      const storage = getStorageAdapter()
      const maxBytes = env.IMAGING_MAX_UPLOAD_MB * 1024 * 1024

      // Process each file
      for (let i = 0; i < files.length; i++) {
        const { buffer: fileBuffer, fileName, mimeType } = files[i]
        const name = names[i] !== undefined ? names[i] : null
        const capturedAt = capturedAts[i] !== undefined ? capturedAts[i] : new Date()

        try {
          // Validate file size
          if (fileBuffer.length > maxBytes) {
            results.push({
              success: false,
              error: `File too large. Maximum size: ${env.IMAGING_MAX_UPLOAD_MB}MB`,
              fileName,
            })
            continue
          }

          // Compute SHA256
          const sha256 = computeSha256FromBuffer(fileBuffer)

          const client = await pool.connect()

          try {
            await client.query('BEGIN')

            // Verify study belongs to clinic and patient (if studyId provided)
            if (studyIdNum !== null) {
              const studyCheck = await client.query(
                `SELECT id, clinic_id, patient_id FROM public.imaging_study 
                 WHERE id = $1 AND clinic_id = $2 AND patient_id = $3 AND is_active = true`,
                [studyIdNum, clinicId, patientIdNum]
              )

              if (studyCheck.rows.length === 0) {
                await client.query('ROLLBACK')
                results.push({
                  success: false,
                  error: 'Study not found or access denied',
                  fileName,
                })
                continue
              }
            }

            // Insert asset row first to get assetId
            const assetResult = await client.query(
              `INSERT INTO public.imaging_asset 
               (clinic_id, patient_id, study_id, modality, mime_type, size_bytes, sha256, 
                storage_backend, storage_key, captured_at, source_device, name, image_source, created_by)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
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
                capturedAt,
                null, // sourceDevice
                name,
                imageSourceStr,
                userId,
              ]
            )

            const assetId = assetResult.rows[0].id

            // Generate storage key
            const extension = mimeType.split('/')[1] || 'bin'
            const storageKey = generateStorageKey(
              clinicId,
              patientIdNum,
              studyIdNum || 0,
              'originals',
              assetId,
              capturedAt || new Date(),
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
                thumbKey = generateThumbKey(clinicId, patientIdNum, studyIdNum || 0, assetId)
                const thumbStream = Readable.from(thumbBuffer)
                await storage.put(thumbKey, thumbStream, 'image/webp')

                // Generate web version
                const webBuffer = await generateWebVersion(fileBuffer)
                webKey = generateWebKey(clinicId, patientIdNum, studyIdNum || 0, assetId, capturedAt || new Date())
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

            results.push({
              assetId,
              success: true,
              fileName,
            })
          } catch (error: any) {
            await client.query('ROLLBACK').catch(() => {})
            console.error(`Upload error for file ${fileName}:`, error)
            results.push({
              success: false,
              error: error?.message || 'Internal server error',
              fileName,
            })
          } finally {
            client.release()
          }
        } catch (error: any) {
          console.error(`Error processing file ${fileName}:`, error)
          results.push({
            success: false,
            error: error?.message || 'Failed to process file',
            fileName,
          })
        }
      }

      // Calculate summary
      const summary = {
        total: results.length,
        succeeded: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
      }

      return {
        results,
        summary,
      }
    }
  )

  // Upload endpoint
  fastify.post(
    '/imaging/assets/upload',
    {
      preHandler: [fastify.authenticate],
    },
    async (request: AuthenticatedRequest, reply) => {
      // Check capability
      const hasCapability = await requireCapability(request, reply, 'imaging_write')
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
      const name = fields.name
      const imageSource = fields.imageSource

      if (!patientId || !modality) {
        return reply.status(400).send({ error: 'Missing required fields: patientId, modality' })
      }

      const patientIdNum = Number(patientId.value)
      const studyIdNum = studyId ? Number(studyId.value) : null
      const modalityStr = String(modality.value)
      const capturedAtDate = capturedAt ? new Date(capturedAt.value) : new Date()
      const sourceDeviceStr = sourceDevice ? String(sourceDevice.value) : null
      const nameStr = name ? String(name.value).trim() || null : null
      const imageSourceStr = imageSource ? String(imageSource.value) : null

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

        // Verify study belongs to clinic and patient (if studyId provided)
        if (studyIdNum !== null) {
          const studyCheck = await client.query(
            `SELECT id, clinic_id, patient_id FROM public.imaging_study 
             WHERE id = $1 AND clinic_id = $2 AND patient_id = $3 AND is_active = true`,
            [studyIdNum, clinicId, patientIdNum]
          )

          if (studyCheck.rows.length === 0) {
            await client.query('ROLLBACK')
            return reply.status(404).send({ error: 'Study not found or access denied' })
          }
        }

        // Insert asset row first to get assetId
        const assetResult = await client.query(
          `INSERT INTO public.imaging_asset 
           (clinic_id, patient_id, study_id, modality, mime_type, size_bytes, sha256, 
            storage_backend, storage_key, captured_at, source_device, name, image_source, created_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
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
            nameStr,
            imageSourceStr,
            userId,
          ]
        )

        const assetId = assetResult.rows[0].id

        // Generate storage key (use studyId if available, otherwise use 0 as placeholder)
        const extension = mimeType.split('/')[1] || 'bin'
        const storageKey = generateStorageKey(
          clinicId,
          patientIdNum,
          studyIdNum || 0, // Use 0 as placeholder if no study
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
            thumbKey = generateThumbKey(clinicId, patientIdNum, studyIdNum || 0, assetId)
            const thumbStream = Readable.from(thumbBuffer)
            await storage.put(thumbKey, thumbStream, 'image/webp')

            // Generate web version
            const webBuffer = await generateWebVersion(fileBuffer)
            webKey = generateWebKey(clinicId, patientIdNum, studyIdNum || 0, assetId, capturedAtDate)
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
      const hasCapability = await requireCapability(request, reply, 'imaging_read')
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
            size_bytes, captured_at, source_device, storage_key, thumb_key, web_key,
            name, image_source
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
      const hasCapability = await requireCapability(request, reply, 'imaging_read')
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
      const hasCapability = await requireCapability(request, reply, 'imaging_write')
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

  // Update asset endpoint (name, image_source, captured_at)
  fastify.patch<{
    Params: { assetId: string }
    Body: { name?: string; imageSource?: string; capturedAt?: string }
  }>(
    '/imaging/assets/:assetId',
    {
      preHandler: [fastify.authenticate],
    },
    async (
      request: AuthenticatedRequest & {
        params: { assetId: string }
        body: { name?: string; imageSource?: string; capturedAt?: string }
      },
      reply
    ) => {
      // Check capability
      const hasCapability = await requireCapability(request, reply, 'imaging_write')
      if (!hasCapability) {
        return
      }

      const assetId = Number(request.params.assetId)
      const auditContext = request.auditContext!
      const clinicId = Number(auditContext.clinicId)
      const { name, imageSource, capturedAt } = request.body

      const hasName = name !== undefined
      const hasImageSource = imageSource !== undefined
      const hasCapturedAt = capturedAt !== undefined && capturedAt !== null && capturedAt !== ''
      if (!hasName && !hasImageSource && !hasCapturedAt) {
        return reply.status(400).send({
          error: 'At least one field (name, imageSource, or capturedAt) must be provided',
        })
      }

      let capturedAtDate: Date | null = null
      if (hasCapturedAt && capturedAt) {
        const parsed = new Date(capturedAt)
        if (Number.isNaN(parsed.getTime())) {
          return reply.status(400).send({ error: 'Invalid capturedAt; must be a valid ISO date or date-time' })
        }
        capturedAtDate = parsed
      }

      const pool = getPool()
      const client = await pool.connect()

      try {
        await client.query('BEGIN')

        // Verify asset belongs to clinic
        const assetCheck = await client.query(
          `SELECT id, clinic_id FROM public.imaging_asset
           WHERE id = $1 AND clinic_id = $2 AND is_active = true`,
          [assetId, clinicId]
        )

        if (assetCheck.rows.length === 0) {
          await client.query('ROLLBACK')
          return reply.status(404).send({ error: 'Asset not found or access denied' })
        }

        // Build update query dynamically
        const updates: string[] = []
        const params: any[] = []
        let paramIndex = 1

        if (name !== undefined) {
          updates.push(`name = $${paramIndex++}`)
          params.push(typeof name === 'string' ? name.trim() || null : null)
        }

        if (imageSource !== undefined) {
          const validSources = ['intraoral', 'panoramic', 'webcam', 'scanner', 'photo']
          if (!validSources.includes(imageSource)) {
            await client.query('ROLLBACK')
            return reply.status(400).send({ error: `Invalid imageSource. Must be one of: ${validSources.join(', ')}` })
          }
          updates.push(`image_source = $${paramIndex++}`)
          params.push(imageSource)
        }

        if (capturedAtDate !== null) {
          updates.push(`captured_at = $${paramIndex++}`)
          params.push(capturedAtDate)
        }

        updates.push(`updated_by = $${paramIndex++}`)
        params.push(auditContext.actorUserId)

        params.push(assetId)

        await client.query(
          `UPDATE public.imaging_asset 
           SET ${updates.join(', ')}
           WHERE id = $${paramIndex}`,
          params
        )

        await client.query('COMMIT')

        // Get updated asset including captured_at for client
        const result = await client.query(
          `SELECT id, name, image_source, captured_at, updated_at, updated_by
           FROM public.imaging_asset
           WHERE id = $1`,
          [assetId]
        )

        const row = result.rows[0]
        if (row && row.captured_at instanceof Date) {
          row.captured_at = row.captured_at.toISOString()
        }

        await logAuditEvent(auditContext, {
          action: 'imaging.asset.update',
          entityTable: 'imaging_asset',
          entityId: assetId,
          payload: { name, image_source: imageSource, captured_at: capturedAt ?? undefined },
        })

        return row
      } catch (error) {
        await client.query('ROLLBACK')
        console.error('Update asset error:', error)
        reply.status(500).send({ error: 'Internal server error' })
      } finally {
        client.release()
      }
    }
  )
}
