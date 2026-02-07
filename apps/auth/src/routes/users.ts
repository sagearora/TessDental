import { Router, type Request, type Response } from 'express'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { AuthenticatedRequest, withAuditContext } from '../middleware/audit.js'
import { requireCapability } from '../middleware/capability.js'
import { getPool } from '../db.js'
import { validatePassword } from '../lib/passwordValidation.js'

const router: Router = Router()

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  clinicId: z.number().optional(),
  roleIds: z.array(z.number()).optional(),
})

// POST /auth/users - Create user + membership + optional roles
router.post(
  '/',
  async (req: AuthenticatedRequest, res: Response, next) => {
    requireCapability(req, res, next, 'users.manage')
  },
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.auditContext || !req.claims) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    try {
      const body = createUserSchema.parse(req.body)
      const { email, password, firstName, lastName, clinicId, roleIds } = body
      const actorClinicId = Number(req.auditContext.clinicId)
      const targetClinicId = clinicId || actorClinicId

      // Verify actor has access to target clinic
      if (targetClinicId !== actorClinicId) {
        return res.status(403).json({ error: 'Cannot create users for other clinics' })
      }

      // Validate password
      const username = email.split('@')[0]
      const passwordValidation = validatePassword(password, { username })
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          error: 'Password does not meet security requirements',
          details: passwordValidation.errors,
        })
      }

      const result = await withAuditContext(req.auditContext, async (client) => {
        // Check if email already exists
        const existingUser = await client.query(
          `SELECT id FROM public.app_user WHERE email = $1`,
          [email.toLowerCase().trim()]
        )

        if (existingUser.rows.length > 0) {
          throw new Error('User with this email already exists')
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10)

        // Create user
        const userResult = await client.query(
          `INSERT INTO public.app_user (email, password_hash, first_name, last_name, is_active)
           VALUES ($1, $2, $3, $4, true)
           RETURNING id`,
          [email.toLowerCase().trim(), passwordHash, firstName || null, lastName || null]
        )
        const userId = userResult.rows[0].id

        // Create clinic_user membership
        const clinicUserResult = await client.query(
          `INSERT INTO public.clinic_user (clinic_id, user_id, is_active, joined_at)
           VALUES ($1, $2, true, now())
           RETURNING id`,
          [targetClinicId, userId]
        )
        const clinicUserId = clinicUserResult.rows[0].id

        // Assign roles if provided
        if (roleIds && roleIds.length > 0) {
          for (const roleId of roleIds) {
            await client.query(
              `INSERT INTO public.clinic_user_role (clinic_user_id, role_id)
               VALUES ($1, $2)
               ON CONFLICT DO NOTHING`,
              [clinicUserId, roleId]
            )
          }
        }

        // Log audit
        await client.query(
          `SELECT audit.fn_log($1, $2, $3::text, $4, $5)`,
          [
            'user.create',
            'app_user',
            userId,
            JSON.stringify({
              email,
              clinic_id: targetClinicId,
              clinic_user_id: clinicUserId,
              role_ids: roleIds || [],
            }),
            true,
          ]
        )

        return { userId, clinicUserId }
      })

      res.status(201).json({
        userId: result.userId,
        clinicUserId: result.clinicUserId,
      })
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid request data', details: error.errors })
      }

      // Log failed attempt
      if (req.auditContext) {
        try {
          await withAuditContext(req.auditContext, async (client) => {
            await client.query(
              `SELECT audit.fn_log($1, $2, $3::text, $4, $5)`,
              [
                'user.create',
                'app_user',
                null,
                JSON.stringify({ error: error.message, email: req.body.email }),
                false,
              ]
            )
          })
        } catch (auditError) {
          console.error('Failed to log audit:', auditError)
        }
      }

      if (error.message === 'User with this email already exists') {
        return res.status(409).json({ error: error.message })
      }

      console.error('Create user error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
)

// PATCH /auth/users/:userId - Update user (activate/deactivate, name updates, password)
const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(8).optional(),
})

router.patch(
  '/:userId',
  async (req: AuthenticatedRequest, res: Response, next) => {
    requireCapability(req, res, next, 'users.manage')
  },
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.auditContext || !req.claims) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    try {
      const { userId } = req.params
      const body = updateUserSchema.parse(req.body)
      const clinicId = Number(req.auditContext.clinicId)

      await withAuditContext(req.auditContext, async (client) => {
        // Get current user state
        const currentUser = await client.query(
          `SELECT email, first_name, last_name, is_active FROM public.app_user WHERE id = $1`,
          [userId]
        )

        if (currentUser.rows.length === 0) {
          throw new Error('User not found')
        }

        const current = currentUser.rows[0]
        
        // Validate password if provided
        if (body.password !== undefined) {
          const username = current.email ? current.email.split('@')[0] : undefined
          const passwordValidation = validatePassword(body.password, { username })
          if (!passwordValidation.isValid) {
            return res.status(400).json({
              error: 'Password does not meet security requirements',
              details: passwordValidation.errors,
            })
          }
        }

        const updates: string[] = []
        const values: any[] = []
        let paramCount = 1

        if (body.firstName !== undefined) {
          updates.push(`first_name = $${paramCount++}`)
          values.push(body.firstName)
        }
        if (body.lastName !== undefined) {
          updates.push(`last_name = $${paramCount++}`)
          values.push(body.lastName)
        }
        if (body.isActive !== undefined) {
          updates.push(`is_active = $${paramCount++}`)
          values.push(body.isActive)
        }
        if (body.password !== undefined) {
          const passwordHash = await bcrypt.hash(body.password, 10)
          updates.push(`password_hash = $${paramCount++}`)
          values.push(passwordHash)
        }

        if (updates.length === 0) {
          return res.status(400).json({ error: 'No fields to update' })
        }

        values.push(userId)
        await client.query(
          `UPDATE public.app_user SET ${updates.join(', ')}, updated_at = now() WHERE id = $${paramCount}`,
          values
        )

        // Log audit
        await client.query(
          `SELECT audit.fn_log($1, $2, $3::text, $4, $5)`,
          [
            'user.update',
            'app_user',
            userId,
            JSON.stringify({
              before: {
                first_name: current.first_name,
                last_name: current.last_name,
                is_active: current.is_active,
              },
              after: {
                first_name: body.firstName ?? current.first_name,
                last_name: body.lastName ?? current.last_name,
                is_active: body.isActive ?? current.is_active,
                password_changed: body.password !== undefined,
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

      if (error.message === 'User not found') {
        return res.status(404).json({ error: error.message })
      }

      console.error('Update user error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
)

export default router
