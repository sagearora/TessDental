import { Router, type Response } from 'express'
import { z } from 'zod'
import { AuthenticatedRequest, withAuditContext } from '../middleware/audit.js'
import { requireCapability } from '../middleware/capability.js'

const router: Router = Router()

// POST /auth/clinics/:clinicId/users/:userId/roles - Assign role to user
router.post(
  '/clinics/:clinicId/users/:userId/roles',
  async (req: AuthenticatedRequest, res: Response, next) => {
    requireCapability(req, res, next, 'users.manage')
  },
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.auditContext || !req.claims) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    try {
      const { clinicId: paramClinicId, userId } = req.params
      const clinicId = Number(paramClinicId)
      const actorClinicId = Number(req.auditContext.clinicId)

      if (clinicId !== actorClinicId) {
        return res.status(403).json({ error: 'Cannot assign roles for other clinics' })
      }

      const { roleId } = z.object({ roleId: z.number() }).parse(req.body)

      await withAuditContext(req.auditContext, async (client) => {
        // Get clinic_user_id
        const clinicUserResult = await client.query(
          `SELECT id FROM public.clinic_user WHERE clinic_id = $1 AND user_id = $2`,
          [clinicId, userId]
        )

        if (clinicUserResult.rows.length === 0) {
          throw new Error('User is not a member of this clinic')
        }

        const clinicUserId = clinicUserResult.rows[0].id

        // Verify role belongs to this clinic
        const roleResult = await client.query(
          `SELECT id FROM public.role WHERE id = $1 AND clinic_id = $2`,
          [roleId, clinicId]
        )

        if (roleResult.rows.length === 0) {
          throw new Error('Role not found or does not belong to this clinic')
        }

        // Assign role
        await client.query(
          `INSERT INTO public.clinic_user_role (clinic_user_id, role_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [clinicUserId, roleId]
        )

        // Log audit
        await client.query(
          `SELECT audit.fn_log($1, $2, $3::text, $4, $5)`,
          [
            'role.assign',
            'clinic_user_role',
            `${clinicUserId}:${roleId}`,
            JSON.stringify({
              clinic_user_id: clinicUserId,
              user_id: userId,
              role_id: roleId,
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

      if (error.message === 'User is not a member of this clinic' || error.message === 'Role not found or does not belong to this clinic') {
        return res.status(404).json({ error: error.message })
      }

      console.error('Assign role error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
)

// DELETE /auth/clinics/:clinicId/users/:userId/roles/:roleId - Remove role from user
router.delete(
  '/clinics/:clinicId/users/:userId/roles/:roleId',
  async (req: AuthenticatedRequest, res: Response, next) => {
    requireCapability(req, res, next, 'users.manage')
  },
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.auditContext || !req.claims) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    try {
      const { clinicId: paramClinicId, userId, roleId: paramRoleId } = req.params
      const clinicId = Number(paramClinicId)
      const roleId = Number(paramRoleId)
      const actorClinicId = Number(req.auditContext.clinicId)

      if (clinicId !== actorClinicId) {
        return res.status(403).json({ error: 'Cannot remove roles for other clinics' })
      }

      await withAuditContext(req.auditContext, async (client) => {
        // Get clinic_user_id
        const clinicUserResult = await client.query(
          `SELECT id FROM public.clinic_user WHERE clinic_id = $1 AND user_id = $2`,
          [clinicId, userId]
        )

        if (clinicUserResult.rows.length === 0) {
          throw new Error('User is not a member of this clinic')
        }

        const clinicUserId = clinicUserResult.rows[0].id

        // Check if this is the last admin (safety check)
        const adminCheck = await client.query(
          `SELECT COUNT(*) as count
           FROM public.clinic_user_role cur
           JOIN public.role_capability rc ON rc.role_id = cur.role_id
           WHERE cur.clinic_user_id IN (
             SELECT id FROM public.clinic_user WHERE clinic_id = $1 AND user_id = $2
           )
           AND rc.capability_key = 'system.admin'`,
          [clinicId, userId]
        )

        const hasAdmin = Number(adminCheck.rows[0].count) > 0

        // Remove role
        const deleteResult = await client.query(
          `DELETE FROM public.clinic_user_role
           WHERE clinic_user_id = $1 AND role_id = $2
           RETURNING clinic_user_id`,
          [clinicUserId, roleId]
        )

        if (deleteResult.rows.length === 0) {
          throw new Error('Role assignment not found')
        }

        // Log audit
        await client.query(
          `SELECT audit.fn_log($1, $2, $3::text, $4, $5)`,
          [
            'role.remove',
            'clinic_user_role',
            `${clinicUserId}:${roleId}`,
            JSON.stringify({
              clinic_user_id: clinicUserId,
              user_id: userId,
              role_id: roleId,
              clinic_id: clinicId,
              had_admin: hasAdmin,
            }),
            true,
          ]
        )
      })

      res.json({ success: true })
    } catch (error: any) {
      if (error.message === 'User is not a member of this clinic' || error.message === 'Role assignment not found') {
        return res.status(404).json({ error: error.message })
      }

      console.error('Remove role error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
)

export default router
