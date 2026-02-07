import { Router, type Response } from 'express'
import { z } from 'zod'
import { AuthenticatedRequest, withAuditContext } from '../middleware/audit.js'
import { requireCapability } from '../middleware/capability.js'

const router: Router = Router()

const createRoleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  capabilityKeys: z.array(z.string()).optional(),
})

// POST /auth/clinics/:clinicId/roles - Create role
router.post(
  '/clinics/:clinicId/roles',
  async (req: AuthenticatedRequest, res: Response, next) => {
    requireCapability(req, res, next, 'users.manage')
  },
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.auditContext || !req.claims) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    try {
      const { clinicId: paramClinicId } = req.params
      const clinicId = Number(paramClinicId)
      const actorClinicId = Number(req.auditContext.clinicId)

      if (clinicId !== actorClinicId) {
        return res.status(403).json({ error: 'Cannot create roles for other clinics' })
      }

      const body = createRoleSchema.parse(req.body)
      const { name, description, capabilityKeys } = body

      const result = await withAuditContext(req.auditContext, async (client) => {
        // Check if role name already exists for this clinic
        const existing = await client.query(
          `SELECT id FROM public.role WHERE clinic_id = $1 AND name = $2`,
          [clinicId, name]
        )

        if (existing.rows.length > 0) {
          throw new Error('Role with this name already exists for this clinic')
        }

        // Create role
        const roleResult = await client.query(
          `INSERT INTO public.role (clinic_id, name, description, is_active)
           VALUES ($1, $2, $3, true)
           RETURNING id`,
          [clinicId, name, description || null]
        )
        const roleId = roleResult.rows[0].id

        // Add capabilities if provided
        if (capabilityKeys && capabilityKeys.length > 0) {
          for (const capabilityKey of capabilityKeys) {
            await client.query(
              `INSERT INTO public.role_capability (role_id, capability_key)
               VALUES ($1, $2)
               ON CONFLICT DO NOTHING`,
              [roleId, capabilityKey]
            )
          }
        }

        // Log audit
        await client.query(
          `SELECT audit.fn_log($1, $2, $3::text, $4, $5)`,
          [
            'role.create',
            'role',
            roleId.toString(),
            JSON.stringify({
              clinic_id: clinicId,
              name,
              description,
              capability_keys: capabilityKeys || [],
            }),
            true,
          ]
        )

        return { roleId }
      })

      res.status(201).json({ roleId: result.roleId })
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid request data', details: error.errors })
      }

      if (error.message === 'Role with this name already exists for this clinic') {
        return res.status(409).json({ error: error.message })
      }

      console.error('Create role error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
)

// PATCH /auth/clinics/:clinicId/roles/:roleId - Update role
const updateRoleSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
})

router.patch(
  '/clinics/:clinicId/roles/:roleId',
  async (req: AuthenticatedRequest, res: Response, next) => {
    requireCapability(req, res, next, 'users.manage')
  },
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.auditContext || !req.claims) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    try {
      const { clinicId: paramClinicId, roleId: paramRoleId } = req.params
      const clinicId = Number(paramClinicId)
      const roleId = Number(paramRoleId)
      const actorClinicId = Number(req.auditContext.clinicId)

      if (clinicId !== actorClinicId) {
        return res.status(403).json({ error: 'Cannot update roles for other clinics' })
      }

      const body = updateRoleSchema.parse(req.body)

      await withAuditContext(req.auditContext, async (client) => {
        // Get current role state
        const currentRole = await client.query(
          `SELECT name, description, is_active FROM public.role WHERE id = $1 AND clinic_id = $2`,
          [roleId, clinicId]
        )

        if (currentRole.rows.length === 0) {
          throw new Error('Role not found')
        }

        const current = currentRole.rows[0]
        const updates: string[] = []
        const values: any[] = []
        let paramCount = 1

        if (body.name !== undefined) {
          updates.push(`name = $${paramCount++}`)
          values.push(body.name)
        }
        if (body.description !== undefined) {
          updates.push(`description = $${paramCount++}`)
          values.push(body.description)
        }
        if (body.isActive !== undefined) {
          updates.push(`is_active = $${paramCount++}`)
          values.push(body.isActive)
        }

        if (updates.length === 0) {
          return res.status(400).json({ error: 'No fields to update' })
        }

        values.push(roleId, clinicId)
        await client.query(
          `UPDATE public.role SET ${updates.join(', ')}, updated_at = now() WHERE id = $${paramCount} AND clinic_id = $${paramCount + 1}`,
          values
        )

        // Log audit
        await client.query(
          `SELECT audit.fn_log($1, $2, $3::text, $4, $5)`,
          [
            'role.update',
            'role',
            roleId.toString(),
            JSON.stringify({
              clinic_id: clinicId,
              before: {
                name: current.name,
                description: current.description,
                is_active: current.is_active,
              },
              after: {
                name: body.name ?? current.name,
                description: body.description ?? current.description,
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

      if (error.message === 'Role not found') {
        return res.status(404).json({ error: error.message })
      }

      console.error('Update role error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
)

// POST /auth/clinics/:clinicId/roles/:roleId/capabilities - Add capability to role
router.post(
  '/clinics/:clinicId/roles/:roleId/capabilities',
  async (req: AuthenticatedRequest, res: Response, next) => {
    requireCapability(req, res, next, 'users.manage')
  },
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.auditContext || !req.claims) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    try {
      const { clinicId: paramClinicId, roleId: paramRoleId } = req.params
      const clinicId = Number(paramClinicId)
      const roleId = Number(paramRoleId)
      const actorClinicId = Number(req.auditContext.clinicId)

      if (clinicId !== actorClinicId) {
        return res.status(403).json({ error: 'Cannot modify roles for other clinics' })
      }

      const { capabilityKey } = z.object({ capabilityKey: z.string() }).parse(req.body)

      await withAuditContext(req.auditContext, async (client) => {
        await client.query(
          `INSERT INTO public.role_capability (role_id, capability_key)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [roleId, capabilityKey]
        )

        // Log audit
        await client.query(
          `SELECT audit.fn_log($1, $2, $3::text, $4, $5)`,
          [
            'role.capability.add',
            'role_capability',
            `${roleId}:${capabilityKey}`,
            JSON.stringify({ role_id: roleId, capability_key: capabilityKey, clinic_id: clinicId }),
            true,
          ]
        )
      })

      res.json({ success: true })
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid request data', details: error.errors })
      }

      console.error('Add capability error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
)

// DELETE /auth/clinics/:clinicId/roles/:roleId/capabilities/:capabilityKey - Remove capability from role
router.delete(
  '/clinics/:clinicId/roles/:roleId/capabilities/:capabilityKey',
  async (req: AuthenticatedRequest, res: Response, next) => {
    requireCapability(req, res, next, 'users.manage')
  },
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.auditContext || !req.claims) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    try {
      const { clinicId: paramClinicId, roleId: paramRoleId, capabilityKey } = req.params
      const clinicId = Number(paramClinicId)
      const roleId = Number(paramRoleId)
      const actorClinicId = Number(req.auditContext.clinicId)

      if (clinicId !== actorClinicId) {
        return res.status(403).json({ error: 'Cannot modify roles for other clinics' })
      }

      await withAuditContext(req.auditContext, async (client) => {
        await client.query(
          `DELETE FROM public.role_capability WHERE role_id = $1 AND capability_key = $2`,
          [roleId, capabilityKey]
        )

        // Log audit
        await client.query(
          `SELECT audit.fn_log($1, $2, $3::text, $4, $5)`,
          [
            'role.capability.remove',
            'role_capability',
            `${roleId}:${capabilityKey}`,
            JSON.stringify({ role_id: roleId, capability_key: capabilityKey, clinic_id: clinicId }),
            true,
          ]
        )
      })

      res.json({ success: true })
    } catch (error: any) {
      console.error('Remove capability error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
)

export default router
