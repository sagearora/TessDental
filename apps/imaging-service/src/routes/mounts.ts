import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { getPool } from '../db.js'
import { AuthenticatedRequest } from '../middleware/auth.js'
import { requireCapability } from '../middleware/capability.js'
import { logAuditEvent } from '../lib/audit.js'

const createMountSchema = z.object({
  patientId: z.number().int().positive(),
  templateId: z.number().int().positive(),
  name: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
})

const updateMountSchema = z.object({
  name: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
})

const assignAssetToSlotSchema = z.object({
  assetId: z.number().int().positive(),
})

export async function mountsRoutes(fastify: FastifyInstance) {
  // List mount templates
  fastify.get(
    '/imaging/mount-templates',
    {
      preHandler: [fastify.authenticate],
    },
    async (request: AuthenticatedRequest, reply) => {
      const hasCapability = await requireCapability(request, reply, 'imaging_read')
      if (!hasCapability) {
        return
      }

      const pool = getPool()

      try {
        const result = await pool.query(
          `SELECT id, template_key, name, description, slot_definitions, layout_config, is_active
           FROM public.imaging_mount_template
           WHERE is_active = true
           ORDER BY template_key`
        )

        return result.rows
      } catch (error) {
        console.error('List mount templates error:', error)
        reply.status(500).send({ error: 'Internal server error' })
      }
    }
  )

  // Create mount
  fastify.post<{ Body: z.infer<typeof createMountSchema> }>(
    '/imaging/mounts',
    {
      preHandler: [fastify.authenticate],
    },
    async (request: AuthenticatedRequest, reply) => {
      const hasCapability = await requireCapability(request, reply, 'imaging_write')
      if (!hasCapability) {
        return
      }

      const body = createMountSchema.parse(request.body)
      const auditContext = request.auditContext!
      const clinicId = Number(auditContext.clinicId)
      const userId = auditContext.actorUserId

      const pool = getPool()
      const client = await pool.connect()

      try {
        await client.query('BEGIN')

        // Verify template exists and is active
        const templateCheck = await client.query(
          `SELECT id, template_key, name, slot_definitions 
           FROM public.imaging_mount_template 
           WHERE id = $1 AND is_active = true`,
          [body.templateId]
        )

        if (templateCheck.rows.length === 0) {
          await client.query('ROLLBACK')
          return reply.status(404).send({ error: 'Mount template not found' })
        }

        // Insert mount
        const result = await client.query(
          `INSERT INTO public.imaging_mount 
           (clinic_id, patient_id, template_id, name, description, created_by)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id, clinic_id, patient_id, template_id, name, description, created_at, created_by`,
          [
            clinicId,
            body.patientId,
            body.templateId,
            body.name || null,
            body.description || null,
            userId,
          ]
        )

        const mountId = result.rows[0].id

        await client.query('COMMIT')

        // Log audit event
        await logAuditEvent(auditContext, {
          action: 'imaging.mount.create',
          entityTable: 'imaging_mount',
          entityId: mountId,
          payload: {
            clinic_id: clinicId,
            patient_id: body.patientId,
            template_id: body.templateId,
            name: body.name,
          },
        })

        // Get template info for response
        const templateInfo = await client.query(
          `SELECT id, template_key, name, slot_definitions, layout_config
           FROM public.imaging_mount_template
           WHERE id = $1`,
          [body.templateId]
        )

        const mountData = result.rows[0]
        const template = templateInfo.rows[0]

        return {
          mountId,
          id: mountData.id,
          clinic_id: mountData.clinic_id,
          patient_id: mountData.patient_id,
          template_id: mountData.template_id,
          name: mountData.name,
          description: mountData.description,
          created_at: mountData.created_at,
          created_by: mountData.created_by,
          updated_at: mountData.updated_at,
          updated_by: mountData.updated_by,
          is_active: mountData.is_active,
          template: template
            ? {
                id: template.id,
                template_key: template.template_key,
                name: template.name,
                slot_definitions: template.slot_definitions,
                layout_config: template.layout_config,
              }
            : null,
        }
      } catch (error: any) {
        await client.query('ROLLBACK')
        console.error('Create mount error:', error)
        const errorMessage = error?.message || 'Internal server error'
        reply.status(500).send({
          error: 'Internal server error',
          details: errorMessage,
          code: error?.code,
        })
      } finally {
        client.release()
      }
    }
  )

  // List mounts for patient
  fastify.get<{ Querystring: { patientId?: string } }>(
    '/imaging/mounts',
    {
      preHandler: [fastify.authenticate],
    },
    async (request: AuthenticatedRequest & { query: { patientId?: string } }, reply) => {
      const hasCapability = await requireCapability(request, reply, 'imaging_read')
      if (!hasCapability) {
        return
      }

      const auditContext = request.auditContext!
      const clinicId = Number(auditContext.clinicId)
      const patientId = request.query.patientId ? Number(request.query.patientId) : null

      const pool = getPool()

      try {
        let query = `
          SELECT 
            m.id, m.clinic_id, m.patient_id, m.template_id, m.name, m.description,
            m.created_at, m.created_by, m.updated_at, m.updated_by, m.is_active,
            t.id as template_id_full, t.template_key, t.name as template_name, 
            t.slot_definitions, t.layout_config
          FROM public.imaging_mount m
          JOIN public.imaging_mount_template t ON m.template_id = t.id
          WHERE m.clinic_id = $1 AND m.is_active = true
        `
        const params: any[] = [clinicId]

        if (patientId) {
          query += ` AND m.patient_id = $${params.length + 1}`
          params.push(patientId)
        }

        query += ` ORDER BY m.created_at DESC LIMIT 100`

        const result = await pool.query(query, params)

        // Format response with template info
        return result.rows.map((row: any) => ({
          id: row.id,
          clinic_id: row.clinic_id,
          patient_id: row.patient_id,
          template_id: row.template_id,
          name: row.name,
          description: row.description,
          created_at: row.created_at,
          created_by: row.created_by,
          updated_at: row.updated_at,
          updated_by: row.updated_by,
          is_active: row.is_active,
          template: {
            id: row.template_id_full,
            template_key: row.template_key,
            name: row.template_name,
            slot_definitions: row.slot_definitions,
            layout_config: row.layout_config,
          },
        }))
      } catch (error) {
        console.error('List mounts error:', error)
        reply.status(500).send({ error: 'Internal server error' })
      }
    }
  )

  // Get mount with slots and assets
  fastify.get<{ Params: { mountId: string } }>(
    '/imaging/mounts/:mountId',
    {
      preHandler: [fastify.authenticate],
    },
    async (request: AuthenticatedRequest & { params: { mountId: string } }, reply) => {
      const hasCapability = await requireCapability(request, reply, 'imaging_read')
      if (!hasCapability) {
        return
      }

      const mountId = Number(request.params.mountId)
      const auditContext = request.auditContext!
      const clinicId = Number(auditContext.clinicId)

      const pool = getPool()

      try {
        // Get mount with template
        const mountResult = await pool.query(
          `SELECT 
            m.id, m.clinic_id, m.patient_id, m.template_id, m.name, m.description,
            m.created_at, m.created_by, m.updated_at, m.updated_by, m.is_active,
            t.template_key, t.name as template_name, t.slot_definitions, t.layout_config
          FROM public.imaging_mount m
          JOIN public.imaging_mount_template t ON m.template_id = t.id
          WHERE m.id = $1 AND m.clinic_id = $2 AND m.is_active = true`,
          [mountId, clinicId]
        )

        if (mountResult.rows.length === 0) {
          return reply.status(404).send({ error: 'Mount not found or access denied' })
        }

        const mount = mountResult.rows[0]

        // Get slots with assets
        const slotsResult = await pool.query(
          `SELECT 
            s.id, s.mount_id, s.asset_id, s.slot_id, s.created_at, s.created_by,
            a.id as asset_id, a.name as asset_name, a.image_source, a.captured_at,
            a.thumb_key, a.web_key, a.modality
          FROM public.imaging_mount_slot s
          LEFT JOIN public.imaging_asset a ON s.asset_id = a.id AND a.is_active = true
          WHERE s.mount_id = $1 AND s.is_active = true
          ORDER BY s.slot_id`,
          [mountId]
        )

        // Format slots with proper asset structure
        const formattedSlots = slotsResult.rows.map((slot: any) => ({
          id: slot.id,
          mount_id: slot.mount_id,
          asset_id: slot.asset_id,
          slot_id: slot.slot_id,
          created_at: slot.created_at,
          created_by: slot.created_by,
          asset: slot.asset_id
            ? {
                id: slot.asset_id,
                name: slot.asset_name,
                image_source: slot.image_source,
                captured_at: slot.captured_at,
                thumb_key: slot.thumb_key,
                web_key: slot.web_key,
                modality: slot.modality,
              }
            : null,
        }))

        return {
          id: mount.id,
          clinic_id: mount.clinic_id,
          patient_id: mount.patient_id,
          template_id: mount.template_id,
          name: mount.name,
          description: mount.description,
          created_at: mount.created_at,
          created_by: mount.created_by,
          updated_at: mount.updated_at,
          updated_by: mount.updated_by,
          is_active: mount.is_active,
          template: {
            id: mount.template_id,
            template_key: mount.template_key,
            name: mount.template_name,
            slot_definitions: mount.slot_definitions,
            layout_config: mount.layout_config,
          },
          slots: formattedSlots,
        }
      } catch (error) {
        console.error('Get mount error:', error)
        reply.status(500).send({ error: 'Internal server error' })
      }
    }
  )

  // Update mount
  fastify.patch<{ Params: { mountId: string }; Body: z.infer<typeof updateMountSchema> }>(
    '/imaging/mounts/:mountId',
    {
      preHandler: [fastify.authenticate],
    },
    async (request: AuthenticatedRequest & { params: { mountId: string }; body: z.infer<typeof updateMountSchema> }, reply) => {
      const hasCapability = await requireCapability(request, reply, 'imaging_write')
      if (!hasCapability) {
        return
      }

      const mountId = Number(request.params.mountId)
      const auditContext = request.auditContext!
      const clinicId = Number(auditContext.clinicId)
      const body = updateMountSchema.parse(request.body)

      const pool = getPool()
      const client = await pool.connect()

      try {
        await client.query('BEGIN')

        // Verify mount belongs to clinic
        const mountCheck = await client.query(
          `SELECT id FROM public.imaging_mount
           WHERE id = $1 AND clinic_id = $2 AND is_active = true`,
          [mountId, clinicId]
        )

        if (mountCheck.rows.length === 0) {
          await client.query('ROLLBACK')
          return reply.status(404).send({ error: 'Mount not found or access denied' })
        }

        // Build update query
        const updates: string[] = []
        const params: any[] = []
        let paramIndex = 1

        if (body.name !== undefined) {
          updates.push(`name = $${paramIndex++}`)
          params.push(body.name || null)
        }

        if (body.description !== undefined) {
          updates.push(`description = $${paramIndex++}`)
          params.push(body.description || null)
        }

        if (updates.length === 0) {
          await client.query('ROLLBACK')
          return reply.status(400).send({ error: 'No fields to update' })
        }

        updates.push(`updated_by = $${paramIndex++}`)
        params.push(auditContext.actorUserId)
        params.push(mountId)

        await client.query(
          `UPDATE public.imaging_mount 
           SET ${updates.join(', ')}
           WHERE id = $${paramIndex}`,
          params
        )

        await client.query('COMMIT')

        // Get updated mount
        const result = await client.query(
          `SELECT id, name, description, updated_at, updated_by
           FROM public.imaging_mount
           WHERE id = $1`,
          [mountId]
        )

        // Log update
        await logAuditEvent(auditContext, {
          action: 'imaging.mount.update',
          entityTable: 'imaging_mount',
          entityId: mountId,
          payload: body,
        })

        return result.rows[0]
      } catch (error) {
        await client.query('ROLLBACK')
        console.error('Update mount error:', error)
        reply.status(500).send({ error: 'Internal server error' })
      } finally {
        client.release()
      }
    }
  )

  // Assign asset to mount slot
  fastify.post<{ Params: { mountId: string; slotId: string }; Body: z.infer<typeof assignAssetToSlotSchema> }>(
    '/imaging/mounts/:mountId/slots/:slotId/assign',
    {
      preHandler: [fastify.authenticate],
    },
    async (request: AuthenticatedRequest & { params: { mountId: string; slotId: string }; body: z.infer<typeof assignAssetToSlotSchema> }, reply) => {
      const hasCapability = await requireCapability(request, reply, 'imaging_write')
      if (!hasCapability) {
        return
      }

      const mountId = Number(request.params.mountId)
      const slotId = decodeURIComponent(request.params.slotId)
      const auditContext = request.auditContext!
      const clinicId = Number(auditContext.clinicId)
      const body = assignAssetToSlotSchema.parse(request.body)

      const pool = getPool()
      const client = await pool.connect()

      try {
        await client.query('BEGIN')

        // Verify mount belongs to clinic
        const mountCheck = await client.query(
          `SELECT m.id, m.template_id, t.slot_definitions
           FROM public.imaging_mount m
           JOIN public.imaging_mount_template t ON m.template_id = t.id
           WHERE m.id = $1 AND m.clinic_id = $2 AND m.is_active = true`,
          [mountId, clinicId]
        )

        if (mountCheck.rows.length === 0) {
          await client.query('ROLLBACK')
          return reply.status(404).send({ error: 'Mount not found or access denied' })
        }

        const mount = mountCheck.rows[0]

        // Verify slot_id exists in template
        const slotDefinitions = mount.slot_definitions as Array<{ slot_id: string }>
        const validSlotIds = slotDefinitions.map((s) => s.slot_id)
        if (!validSlotIds.includes(slotId)) {
          await client.query('ROLLBACK')
          return reply.status(400).send({ error: `Invalid slot_id. Must be one of: ${validSlotIds.join(', ')}` })
        }

        // Verify asset belongs to clinic
        const assetCheck = await client.query(
          `SELECT id FROM public.imaging_asset
           WHERE id = $1 AND clinic_id = $2 AND is_active = true`,
          [body.assetId, clinicId]
        )

        if (assetCheck.rows.length === 0) {
          await client.query('ROLLBACK')
          return reply.status(404).send({ error: 'Asset not found or access denied' })
        }

        // Check if slot is already assigned (soft delete existing if present)
        const existingSlot = await client.query(
          `SELECT id FROM public.imaging_mount_slot
           WHERE mount_id = $1 AND slot_id = $2 AND is_active = true`,
          [mountId, slotId]
        )

        if (existingSlot.rows.length > 0) {
          // Soft delete existing assignment
          await client.query(
            `UPDATE public.imaging_mount_slot 
             SET is_active = false, updated_by = $1
             WHERE id = $2`,
            [auditContext.actorUserId, existingSlot.rows[0].id]
          )
        }

        // Insert new assignment
        const result = await client.query(
          `INSERT INTO public.imaging_mount_slot 
           (mount_id, asset_id, slot_id, created_by)
           VALUES ($1, $2, $3, $4)
           RETURNING id, mount_id, asset_id, slot_id, created_at, created_by`,
          [mountId, body.assetId, slotId, auditContext.actorUserId]
        )

        await client.query('COMMIT')

        // Log audit event
        await logAuditEvent(auditContext, {
          action: 'imaging.mount.slot.assign',
          entityTable: 'imaging_mount_slot',
          entityId: result.rows[0].id,
          payload: {
            mount_id: mountId,
            asset_id: body.assetId,
            slot_id: slotId,
          },
        })

        return result.rows[0]
      } catch (error: any) {
        await client.query('ROLLBACK')
        console.error('Assign asset to slot error:', error)
        const errorMessage = error?.message || 'Internal server error'
        reply.status(500).send({
          error: 'Internal server error',
          details: errorMessage,
          code: error?.code,
        })
      } finally {
        client.release()
      }
    }
  )

  // Remove asset from slot
  fastify.delete<{ Params: { mountId: string; slotId: string } }>(
    '/imaging/mounts/:mountId/slots/:slotId',
    {
      preHandler: [fastify.authenticate],
    },
    async (request: AuthenticatedRequest & { params: { mountId: string; slotId: string } }, reply) => {
      const hasCapability = await requireCapability(request, reply, 'imaging_write')
      if (!hasCapability) {
        return
      }

      const mountId = Number(request.params.mountId)
      const slotId = decodeURIComponent(request.params.slotId)
      const auditContext = request.auditContext!
      const clinicId = Number(auditContext.clinicId)

      const pool = getPool()
      const client = await pool.connect()

      try {
        await client.query('BEGIN')

        // Verify mount belongs to clinic
        const mountCheck = await client.query(
          `SELECT id FROM public.imaging_mount
           WHERE id = $1 AND clinic_id = $2 AND is_active = true`,
          [mountId, clinicId]
        )

        if (mountCheck.rows.length === 0) {
          await client.query('ROLLBACK')
          return reply.status(404).send({ error: 'Mount not found or access denied' })
        }

        // Soft delete slot assignment
        const result = await client.query(
          `UPDATE public.imaging_mount_slot 
           SET is_active = false, updated_by = $1
           WHERE mount_id = $2 AND slot_id = $3 AND is_active = true
           RETURNING id`,
          [auditContext.actorUserId, mountId, slotId]
        )

        if (result.rows.length === 0) {
          await client.query('ROLLBACK')
          return reply.status(404).send({ error: 'Slot assignment not found' })
        }

        await client.query('COMMIT')

        // Log audit event
        await logAuditEvent(auditContext, {
          action: 'imaging.mount.slot.remove',
          entityTable: 'imaging_mount_slot',
          entityId: result.rows[0].id,
        })

        return { success: true }
      } catch (error) {
        await client.query('ROLLBACK')
        console.error('Remove asset from slot error:', error)
        reply.status(500).send({ error: 'Internal server error' })
      } finally {
        client.release()
      }
    }
  )

  // Soft delete mount
  fastify.delete<{ Params: { mountId: string } }>(
    '/imaging/mounts/:mountId',
    {
      preHandler: [fastify.authenticate],
    },
    async (request: AuthenticatedRequest & { params: { mountId: string } }, reply) => {
      const hasCapability = await requireCapability(request, reply, 'imaging_write')
      if (!hasCapability) {
        return
      }

      const mountId = Number(request.params.mountId)
      const auditContext = request.auditContext!
      const clinicId = Number(auditContext.clinicId)

      const pool = getPool()
      const client = await pool.connect()

      try {
        await client.query('BEGIN')

        // Verify mount belongs to clinic
        const mountCheck = await client.query(
          `SELECT id FROM public.imaging_mount
           WHERE id = $1 AND clinic_id = $2 AND is_active = true`,
          [mountId, clinicId]
        )

        if (mountCheck.rows.length === 0) {
          await client.query('ROLLBACK')
          return reply.status(404).send({ error: 'Mount not found or access denied' })
        }

        // Soft delete mount
        await client.query(
          `UPDATE public.imaging_mount 
           SET is_active = false, updated_by = $1
           WHERE id = $2`,
          [auditContext.actorUserId, mountId]
        )

        await client.query('COMMIT')

        // Log audit event
        await logAuditEvent(auditContext, {
          action: 'imaging.mount.delete',
          entityTable: 'imaging_mount',
          entityId: mountId,
        })

        return { success: true }
      } catch (error) {
        await client.query('ROLLBACK')
        console.error('Delete mount error:', error)
        reply.status(500).send({ error: 'Internal server error' })
      } finally {
        client.release()
      }
    }
  )
}
