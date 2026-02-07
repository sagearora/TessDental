import { Router, Response } from 'express'
import { AuthenticatedRequest, withAuditContext } from '../middleware/audit.js'
import { requireCapability } from '../middleware/capability.js'
import { z } from 'zod'

const router: Router = Router()

const updateClinicSchema = z.object({
  name: z.string().min(1).optional(),
  timezone: z.string().optional(),
  phone: z.string().optional().nullable(),
  fax: z.string().optional().nullable(),
  website: z.string().url().optional().nullable().or(z.literal('')),
  email: z.string().email().optional().nullable(),
  addressStreet: z.string().optional().nullable(),
  addressUnit: z.string().optional().nullable(),
  addressCity: z.string().optional().nullable(),
  addressProvince: z.string().optional().nullable(),
  addressPostal: z.string().optional().nullable(),
  billingNumber: z.string().optional().nullable(),
})

// PATCH /auth/clinics/:clinicId - Update clinic information
router.patch(
  '/:clinicId',
  async (req: AuthenticatedRequest, res: Response, next) => {
    requireCapability(req, res, next, 'clinic.manage')
  },
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.auditContext || !req.claims) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    try {
      const { clinicId: paramClinicId } = req.params
      const clinicId = Number(paramClinicId)
      const actorClinicId = Number(req.auditContext.clinicId)

      // Ensure user can only update their own clinic
      if (clinicId !== actorClinicId) {
        return res.status(403).json({ error: 'Cannot update other clinics' })
      }

      const body = updateClinicSchema.parse(req.body)

      await withAuditContext(req.auditContext, async (client) => {
        // Get current clinic state
        const currentClinic = await client.query(
          `SELECT name, timezone, phone, fax, website, email, 
                  address_street, address_unit, address_city, address_province, 
                  address_postal, billing_number
           FROM public.clinic 
           WHERE id = $1`,
          [clinicId]
        )

        if (currentClinic.rows.length === 0) {
          return res.status(404).json({ error: 'Clinic not found' })
        }

        const current = currentClinic.rows[0]

        // Build update query
        const updates: string[] = []
        const values: any[] = []
        let paramCount = 1

        if (body.name !== undefined) {
          updates.push(`name = $${paramCount++}`)
          values.push(body.name)
        }
        if (body.timezone !== undefined) {
          updates.push(`timezone = $${paramCount++}`)
          values.push(body.timezone)
        }
        if (body.phone !== undefined) {
          updates.push(`phone = $${paramCount++}`)
          values.push(body.phone || null)
        }
        if (body.fax !== undefined) {
          updates.push(`fax = $${paramCount++}`)
          values.push(body.fax || null)
        }
        if (body.website !== undefined) {
          // Normalize website URL
          let website = body.website
          if (website && website.trim() !== '') {
            const trimmed = website.trim()
            if (!/^https?:\/\//i.test(trimmed)) {
              website = `http://${trimmed}`
            }
          }
          updates.push(`website = $${paramCount++}`)
          values.push(website || null)
        }
        if (body.email !== undefined) {
          updates.push(`email = $${paramCount++}`)
          values.push(body.email || null)
        }
        if (body.addressStreet !== undefined) {
          updates.push(`address_street = $${paramCount++}`)
          values.push(body.addressStreet || null)
        }
        if (body.addressUnit !== undefined) {
          updates.push(`address_unit = $${paramCount++}`)
          values.push(body.addressUnit || null)
        }
        if (body.addressCity !== undefined) {
          updates.push(`address_city = $${paramCount++}`)
          values.push(body.addressCity || null)
        }
        if (body.addressProvince !== undefined) {
          updates.push(`address_province = $${paramCount++}`)
          values.push(body.addressProvince || null)
        }
        if (body.addressPostal !== undefined) {
          updates.push(`address_postal = $${paramCount++}`)
          values.push(body.addressPostal || null)
        }
        if (body.billingNumber !== undefined) {
          updates.push(`billing_number = $${paramCount++}`)
          values.push(body.billingNumber || null)
        }

        if (updates.length === 0) {
          return res.status(400).json({ error: 'No fields to update' })
        }

        values.push(clinicId)
        const result = await client.query(
          `UPDATE public.clinic 
           SET ${updates.join(', ')}, updated_at = now() 
           WHERE id = $${paramCount}
           RETURNING id, name, timezone, phone, fax, website, email, 
                     address_street, address_unit, address_city, address_province, 
                     address_postal, billing_number, is_active, updated_at`,
          values
        )

        // Log audit event
        await client.query(
          `SELECT audit.fn_log($1, $2, $3::text, $4, $5)`,
          [
            'clinic.update',
            'public.clinic',
            clinicId.toString(),
            JSON.stringify({
              before: {
                name: current.name,
                timezone: current.timezone,
                phone: current.phone,
                fax: current.fax,
                website: current.website,
                email: current.email,
                address_street: current.address_street,
                address_unit: current.address_unit,
                address_city: current.address_city,
                address_province: current.address_province,
                address_postal: current.address_postal,
                billing_number: current.billing_number,
              },
              after: {
                name: body.name ?? current.name,
                timezone: body.timezone ?? current.timezone,
                phone: body.phone ?? current.phone,
                fax: body.fax ?? current.fax,
                website: body.website !== undefined ? (body.website || null) : current.website,
                email: body.email ?? current.email,
                address_street: body.addressStreet ?? current.address_street,
                address_unit: body.addressUnit ?? current.address_unit,
                address_city: body.addressCity ?? current.address_city,
                address_province: body.addressProvince ?? current.address_province,
                address_postal: body.addressPostal ?? current.address_postal,
                billing_number: body.billingNumber ?? current.billing_number,
              },
            }),
            true,
          ]
        )

        res.json(result.rows[0])
      })
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid request data', details: error.errors })
      }

      if (error.message === 'Clinic not found') {
        return res.status(404).json({ error: error.message })
      }

      console.error('Update clinic error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
)

export default router
