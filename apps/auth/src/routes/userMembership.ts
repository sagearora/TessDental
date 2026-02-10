import { Router, type Request, type Response } from 'express'
import { z } from 'zod'
import { AuthenticatedRequest, withAuditContext } from '../middleware/audit.js'
import { requireCapability } from '../middleware/capability.js'
import { getPool } from '../db.js'

const router: Router = Router()

const updateMembershipSchema = z.object({
  jobTitle: z.string().optional(),
  isSchedulable: z.boolean().optional(),
  providerKind: z.enum(['dentist', 'hygienist', 'assistant']).nullable().optional(),
  defaultOperatoryId: z.number().nullable().optional(),
  schedulerColor: z.string().optional(),
  isActive: z.boolean().optional(),
})

// PATCH /auth/clinics/:clinicId/users/:userId/membership - Update clinic membership
router.patch(
  '/:clinicId/users/:userId/membership',
  async (req: AuthenticatedRequest, res: Response, next) => {
    requireCapability(req, res, next, 'users_manage')
  },
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.auditContext || !req.claims) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    try {
      const { clinicId, userId } = req.params
      const body = updateMembershipSchema.parse(req.body)
      const actorClinicId = Number(req.auditContext.clinicId)
      const targetClinicId = Number(clinicId)

      // Verify actor has access to target clinic
      if (targetClinicId !== actorClinicId) {
        return res.status(403).json({ error: 'Cannot update users for other clinics' })
      }

      // Validate: if is_schedulable is true, provider_kind must be set
      if (body.isSchedulable === true && body.providerKind === null) {
        return res.status(400).json({ 
          error: 'provider_kind is required when is_schedulable is true' 
        })
      }

      await withAuditContext(req.auditContext, async (client) => {
        // Get current membership state
        const currentMembership = await client.query(
          `SELECT job_title, is_schedulable, provider_kind, default_operatory_id, 
                  scheduler_color, is_active
           FROM public.clinic_user 
           WHERE clinic_id = $1 AND user_id = $2`,
          [targetClinicId, userId]
        )

        if (currentMembership.rows.length === 0) {
          throw new Error('Clinic membership not found')
        }

        const current = currentMembership.rows[0]

        const updates: string[] = []
        const values: any[] = []
        let paramCount = 1

        if (body.jobTitle !== undefined) {
          updates.push(`job_title = $${paramCount++}`)
          values.push(body.jobTitle || null)
        }
        if (body.isSchedulable !== undefined) {
          updates.push(`is_schedulable = $${paramCount++}`)
          values.push(body.isSchedulable)
        }
        if (body.providerKind !== undefined) {
          updates.push(`provider_kind = $${paramCount++}`)
          values.push(body.providerKind)
        }
        if (body.defaultOperatoryId !== undefined) {
          updates.push(`default_operatory_id = $${paramCount++}`)
          values.push(body.defaultOperatoryId)
        }
        if (body.schedulerColor !== undefined) {
          updates.push(`scheduler_color = $${paramCount++}`)
          values.push(body.schedulerColor || null)
        }
        if (body.isActive !== undefined) {
          updates.push(`is_active = $${paramCount++}`)
          values.push(body.isActive)
        }

        if (updates.length === 0) {
          return res.status(400).json({ error: 'No fields to update' })
        }

        values.push(targetClinicId, userId)
        await client.query(
          `UPDATE public.clinic_user 
           SET ${updates.join(', ')}, updated_at = now() 
           WHERE clinic_id = $${paramCount} AND user_id = $${paramCount + 1}`,
          values
        )

        // Log audit
        await client.query(
          `SELECT audit.fn_log($1, $2, $3::text, $4, $5)`,
          [
            'clinic_user.update',
            'clinic_user',
            userId,
            JSON.stringify({
              clinic_id: targetClinicId,
              before: {
                job_title: current.job_title,
                is_schedulable: current.is_schedulable,
                provider_kind: current.provider_kind,
                default_operatory_id: current.default_operatory_id,
                scheduler_color: current.scheduler_color,
                is_active: current.is_active,
              },
              after: {
                job_title: body.jobTitle ?? current.job_title,
                is_schedulable: body.isSchedulable ?? current.is_schedulable,
                provider_kind: body.providerKind ?? current.provider_kind,
                default_operatory_id: body.defaultOperatoryId ?? current.default_operatory_id,
                scheduler_color: body.schedulerColor ?? current.scheduler_color,
                is_active: body.isActive ?? current.is_active,
              },
            }),
            true,
          ]
        )
      })

      res.json({ success: true })
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid request data', details: error.errors })
      }

      if (error.message === 'Clinic membership not found') {
        return res.status(404).json({ error: error.message })
      }

      console.error('Update clinic membership error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
)

export default router
