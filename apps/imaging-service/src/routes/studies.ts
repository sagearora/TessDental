import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { getPool } from '../db.js'
import { AuthenticatedRequest } from '../middleware/auth.js'
import { requireCapability } from '../middleware/capability.js'
import { logAuditEvent } from '../lib/audit.js'

const createStudySchema = z.object({
  patientId: z.number().int().positive(),
  kind: z.string(),
  title: z.string().nullable().optional(),
  capturedAt: z.string().datetime().optional(),
  source: z.string().nullable().optional(),
})

export async function studiesRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: z.infer<typeof createStudySchema> }>(
    '/imaging/studies',
    {
      preHandler: [fastify.authenticate],
    },
    async (request: AuthenticatedRequest, reply) => {
      // Check capability
      const hasCapability = await requireCapability(request, reply, 'imaging_write')
      if (!hasCapability) {
        return
      }

      const body = createStudySchema.parse(request.body)
      const auditContext = request.auditContext!
      const clinicId = Number(auditContext.clinicId)
      const userId = auditContext.actorUserId

      const pool = getPool()
      const client = await pool.connect()

      try {
        await client.query('BEGIN')

        // Insert study
        const result = await client.query(
          `INSERT INTO public.imaging_study 
           (clinic_id, patient_id, kind, title, captured_at, source, created_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id`,
          [
            clinicId,
            body.patientId,
            body.kind,
            body.title || null,
            body.capturedAt ? new Date(body.capturedAt) : new Date(),
            body.source || null,
            userId,
          ]
        )

        const studyId = result.rows[0].id

        await client.query('COMMIT')

        // Log audit event
        await logAuditEvent(auditContext, {
          action: 'imaging.study.create',
          entityTable: 'imaging_study',
          entityId: studyId,
          payload: {
            clinic_id: clinicId,
            patient_id: body.patientId,
            kind: body.kind,
            title: body.title,
            source: body.source,
          },
        })

        return { studyId }
      } catch (error: any) {
        await client.query('ROLLBACK')
        console.error('Create study error:', error)
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
}
