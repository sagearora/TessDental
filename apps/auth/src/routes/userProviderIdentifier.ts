import { Router, Response } from 'express'
import { AuthenticatedRequest, withAuditContext } from '../middleware/audit.js'
import { requireCapability } from '../middleware/capability.js'
import { z } from 'zod'

const router: Router = Router()

// Validation schemas
const createIdentifierSchema = z.object({
  userId: z.string().uuid(),
  identifierKind: z.string().default('cda_uin'),
  provinceCode: z.string().length(2),
  licenseType: z.string().min(1),
  identifierValue: z.string().min(1),
  effectiveFrom: z.string().date().optional().nullable(),
  effectiveTo: z.string().date().optional().nullable(),
  isActive: z.boolean().default(true),
})

const updateIdentifierSchema = z.object({
  provinceCode: z.string().length(2).optional(),
  licenseType: z.string().min(1).optional(),
  identifierValue: z.string().min(1).optional(),
  effectiveFrom: z.string().date().optional().nullable(),
  effectiveTo: z.string().date().optional().nullable(),
  isActive: z.boolean().optional(),
})

// POST /auth/users/:userId/provider-identifiers
router.post(
  '/:userId/provider-identifiers',
  async (req: AuthenticatedRequest, res: Response, next) => {
    requireCapability(req, res, next, 'users.manage')
  },
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.auditContext || !req.claims) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    try {
      const { userId } = req.params
      const validated = createIdentifierSchema.parse({
        userId,
        ...req.body,
      })

      await withAuditContext(req.auditContext, async (client) => {
        // Check if there's already an active identifier for this combination
        const existingCheck = await client.query(
          `SELECT id FROM public.user_provider_identifier
           WHERE user_id = $1::uuid
             AND identifier_kind = $2
             AND province_code = $3
             AND license_type = $4
             AND is_active = true`,
          [
            validated.userId,
            validated.identifierKind,
            validated.provinceCode,
            validated.licenseType,
          ]
        )

        if (existingCheck.rows.length > 0) {
          return res.status(409).json({
            error: 'An active identifier already exists for this user, province, and license type',
          })
        }

        // Insert new identifier
        const result = await client.query(
          `INSERT INTO public.user_provider_identifier
           (user_id, identifier_kind, province_code, license_type, identifier_value, effective_from, effective_to, is_active)
           VALUES ($1::uuid, $2, $3, $4, $5, $6::date, $7::date, $8)
           RETURNING id, user_id, identifier_kind, province_code, license_type, identifier_value, effective_from, effective_to, is_active, created_at, updated_at`,
          [
            validated.userId,
            validated.identifierKind,
            validated.provinceCode,
            validated.licenseType,
            validated.identifierValue,
            validated.effectiveFrom || null,
            validated.effectiveTo || null,
            validated.isActive,
          ]
        )

        // Log semantic audit event
        await client.query(
          `SELECT audit.fn_log(
            $1::text,
            $2::text,
            $3::text,
            $4::jsonb,
            $5::boolean
          )`,
          [
            'provider_identifier.create',
            'public.user_provider_identifier',
            result.rows[0].id.toString(),
            JSON.stringify({
              user_id: validated.userId,
              identifier_kind: validated.identifierKind,
              province_code: validated.provinceCode,
              license_type: validated.licenseType,
            }),
            true,
          ]
        )

        res.status(201).json(result.rows[0])
      })
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: err.errors })
      }
      console.error('Create provider identifier error:', err)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
)

// PATCH /auth/users/provider-identifiers/:id
router.patch(
  '/provider-identifiers/:id',
  async (req: AuthenticatedRequest, res: Response, next) => {
    requireCapability(req, res, next, 'users.manage')
  },
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.auditContext || !req.claims) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    try {
      const { id } = req.params
      const validated = updateIdentifierSchema.parse(req.body)

      await withAuditContext(req.auditContext, async (client) => {
        // Get current state
        const current = await client.query(
          `SELECT user_id, identifier_kind, province_code, license_type, is_active
           FROM public.user_provider_identifier
           WHERE id = $1::bigint`,
          [id]
        )

        if (current.rows.length === 0) {
          return res.status(404).json({ error: 'Provider identifier not found' })
        }

        const currentRow = current.rows[0]

        // If deactivating, we can allow new active ones
        // If activating, check for conflicts
        if (validated.isActive === true && currentRow.is_active === false) {
          const conflictCheck = await client.query(
            `SELECT id FROM public.user_provider_identifier
             WHERE user_id = $1::uuid
               AND identifier_kind = $2
               AND province_code = $3
               AND license_type = $4
               AND is_active = true
               AND id != $5::bigint`,
            [
              currentRow.user_id,
              currentRow.identifier_kind,
              validated.provinceCode || currentRow.province_code,
              validated.licenseType || currentRow.license_type,
              id,
            ]
          )

          if (conflictCheck.rows.length > 0) {
            return res.status(409).json({
              error: 'An active identifier already exists for this user, province, and license type',
            })
          }
        }

        // Build update query
        const updates: string[] = []
        const values: any[] = []
        let paramIndex = 1

        if (validated.provinceCode !== undefined) {
          updates.push(`province_code = $${paramIndex++}`)
          values.push(validated.provinceCode)
        }
        if (validated.licenseType !== undefined) {
          updates.push(`license_type = $${paramIndex++}`)
          values.push(validated.licenseType)
        }
        if (validated.identifierValue !== undefined) {
          updates.push(`identifier_value = $${paramIndex++}`)
          values.push(validated.identifierValue)
        }
        if (validated.effectiveFrom !== undefined) {
          updates.push(`effective_from = $${paramIndex++}`)
          values.push(validated.effectiveFrom || null)
        }
        if (validated.effectiveTo !== undefined) {
          updates.push(`effective_to = $${paramIndex++}`)
          values.push(validated.effectiveTo || null)
        }
        if (validated.isActive !== undefined) {
          updates.push(`is_active = $${paramIndex++}`)
          values.push(validated.isActive)
        }

        if (updates.length === 0) {
          return res.status(400).json({ error: 'No fields to update' })
        }

        values.push(id)
        const result = await client.query(
          `UPDATE public.user_provider_identifier
           SET ${updates.join(', ')}, updated_at = now()
           WHERE id = $${paramIndex}::bigint
           RETURNING id, user_id, identifier_kind, province_code, license_type, identifier_value, effective_from, effective_to, is_active, created_at, updated_at`,
          values
        )

        // Log semantic audit event
        await client.query(
          `SELECT audit.fn_log(
            $1::text,
            $2::text,
            $3::text,
            $4::jsonb,
            $5::boolean
          )`,
          [
            'provider_identifier.update',
            'public.user_provider_identifier',
            id,
            JSON.stringify({
              changes: validated,
              previous: currentRow,
            }),
            true,
          ]
        )

        res.json(result.rows[0])
      })
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: err.errors })
      }
      console.error('Update provider identifier error:', err)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
)

// DELETE /auth/users/provider-identifiers/:id
router.delete(
  '/provider-identifiers/:id',
  async (req: AuthenticatedRequest, res: Response, next) => {
    requireCapability(req, res, next, 'users.manage')
  },
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.auditContext || !req.claims) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    try {
      const { id } = req.params

      await withAuditContext(req.auditContext, async (client) => {
        // Get current state for audit
        const current = await client.query(
          `SELECT user_id, identifier_kind, province_code, license_type
           FROM public.user_provider_identifier
           WHERE id = $1::bigint`,
          [id]
        )

        if (current.rows.length === 0) {
          return res.status(404).json({ error: 'Provider identifier not found' })
        }

        // Delete the identifier
        await client.query(
          `DELETE FROM public.user_provider_identifier
           WHERE id = $1::bigint`,
          [id]
        )

        // Log semantic audit event
        await client.query(
          `SELECT audit.fn_log(
            $1::text,
            $2::text,
            $3::text,
            $4::jsonb,
            $5::boolean
          )`,
          [
            'provider_identifier.delete',
            'public.user_provider_identifier',
            id,
            JSON.stringify({
              deleted: current.rows[0],
            }),
            true,
          ]
        )

        res.status(204).send()
      })
    } catch (err: any) {
      console.error('Delete provider identifier error:', err)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
)

export default router
