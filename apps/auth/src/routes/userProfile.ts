import { Router, type Request, type Response } from 'express'
import { z } from 'zod'
import { AuthenticatedRequest, withAuditContext } from '../middleware/audit.js'
import { requireCapability } from '../middleware/capability.js'
import { getPool } from '../db.js'

const router: Router = Router()

const updateProfileSchema = z.object({
  userKind: z.enum(['staff', 'dentist', 'hygienist', 'assistant', 'manager']).optional(),
  licenseNo: z.string().optional(),
  schedulerColor: z.string().optional(),
  isActive: z.boolean().optional(),
})

// PATCH /auth/users/:userId/profile - Update user profile
router.patch(
  '/:userId/profile',
  async (req: AuthenticatedRequest, res: Response, next) => {
    requireCapability(req, res, next, 'users_manage')
  },
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.auditContext || !req.claims) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    try {
      const { userId } = req.params
      const body = updateProfileSchema.parse(req.body)
      const clinicId = Number(req.auditContext.clinicId)

      await withAuditContext(req.auditContext, async (client) => {
        // Get current profile state
        const currentProfile = await client.query(
          `SELECT user_kind, license_no, scheduler_color, is_active 
           FROM public.user_profile WHERE user_id = $1`,
          [userId]
        )

        if (currentProfile.rows.length === 0) {
          throw new Error('User profile not found')
        }

        const current = currentProfile.rows[0]

        const updates: string[] = []
        const values: any[] = []
        let paramCount = 1

        if (body.userKind !== undefined) {
          updates.push(`user_kind = $${paramCount++}`)
          values.push(body.userKind)
        }
        if (body.licenseNo !== undefined) {
          updates.push(`license_no = $${paramCount++}`)
          values.push(body.licenseNo || null)
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

        values.push(userId)
        await client.query(
          `UPDATE public.user_profile 
           SET ${updates.join(', ')}, updated_at = now() 
           WHERE user_id = $${paramCount}`,
          values
        )

        // Log audit
        await client.query(
          `SELECT audit.fn_log($1, $2, $3::text, $4, $5)`,
          [
            'user.profile.update',
            'user_profile',
            userId,
            JSON.stringify({
              before: {
                user_kind: current.user_kind,
                license_no: current.license_no,
                scheduler_color: current.scheduler_color,
                is_active: current.is_active,
              },
              after: {
                user_kind: body.userKind ?? current.user_kind,
                license_no: body.licenseNo ?? current.license_no,
                scheduler_color: body.schedulerColor ?? current.scheduler_color,
                is_active: body.isActive ?? current.is_active,
              },
              clinic_id: clinicId,
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

      if (error.message === 'User profile not found') {
        return res.status(404).json({ error: error.message })
      }

      console.error('Update user profile error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
)

export default router
