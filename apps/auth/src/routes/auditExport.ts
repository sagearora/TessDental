import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { AuthenticatedRequest, withAuditContext } from '../middleware/audit.js'
import { requireCapability } from '../middleware/capability.js'
import { getPool } from '../db.js'
// CSV formatting helper
function escapeCsvField(field: any): string {
  if (field === null || field === undefined) {
    return ''
  }
  const str = String(field)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

const router: Router = Router()

const exportSchema = z.object({
  format: z.enum(['csv', 'jsonl']).default('csv'),
  from: z.string().optional(),
  to: z.string().optional(),
  action: z.string().optional(),
  entityType: z.string().optional(),
  actorUserId: z.string().uuid().optional(),
  success: z.string().transform((val) => val === 'true' ? true : val === 'false' ? false : undefined).optional(),
  limit: z.string().transform((val) => parseInt(val, 10)).default('100000'),
  order: z.enum(['asc', 'desc']).default('desc'),
  clinicId: z.string().transform((val) => parseInt(val, 10)).optional(),
})

router.get(
  '/export',
  async (req: AuthenticatedRequest, res: Response, next) => {
    // Parse and validate query params
    const parseResult = exportSchema.safeParse(req.query)
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid query parameters', details: parseResult.error.errors })
    }

    const params = parseResult.data

    // Determine clinic ID
    let clinicId: number
    if (params.clinicId) {
      // If clinicId override is provided, require system.admin
      if (!req.claims || !req.auditContext) {
        return res.status(401).json({ error: 'Not authenticated' })
      }

      const pool = getPool()
      const userId = req.claims.sub
      const overrideClinicId = params.clinicId

      try {
        const result = await pool.query(
          `SELECT public.fn_has_capability($1, $2, $3) as has_capability`,
          [overrideClinicId, userId, 'system.admin']
        )

        if (result.rows[0]?.has_capability !== true) {
          return res.status(403).json({ error: 'Missing system.admin capability for clinic override' })
        }

        clinicId = overrideClinicId
      } catch (error) {
        console.error('Capability check error:', error)
        return res.status(500).json({ error: 'Internal server error' })
      }
    } else {
      // Use clinic from JWT
      if (!req.auditContext) {
        return res.status(401).json({ error: 'Not authenticated' })
      }
      clinicId = Number(req.auditContext.clinicId)
    }

    // Check capability: audit.export OR system.admin
    await requireCapability(req, res, next, ['audit.export', 'system.admin'])
  },
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.claims || !req.auditContext) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const parseResult = exportSchema.safeParse(req.query)
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid query parameters' })
    }

    const params = parseResult.data

    // Determine clinic ID (same logic as above)
    let clinicId: number
    if (params.clinicId) {
      clinicId = params.clinicId
    } else {
      clinicId = Number(req.auditContext.clinicId)
    }

    // Validate limit
    const limit = Math.min(Math.max(1, params.limit), 500000)

    // Parse dates
    const fromDate = params.from ? new Date(params.from) : null
    const toDate = params.to ? new Date(params.to) : null

    // Build query
    const pool = getPool()
    const client = await pool.connect()

    try {
      // Build base query
      let query = `
        SELECT
          occurred_at,
          clinic_id,
          actor_user_id,
          action,
          entity_type,
          entity_id,
          success,
          request_id,
          ip,
          user_agent,
          payload
        FROM audit.event
        WHERE clinic_id = $1
      `

      const queryParams: any[] = [clinicId]
      let paramIndex = 2

      if (fromDate) {
        query += ` AND occurred_at >= $${paramIndex}`
        queryParams.push(fromDate)
        paramIndex++
      }

      if (toDate) {
        query += ` AND occurred_at < $${paramIndex}`
        queryParams.push(toDate)
        paramIndex++
      }

      if (params.action) {
        query += ` AND action = $${paramIndex}`
        queryParams.push(params.action)
        paramIndex++
      }

      if (params.entityType) {
        query += ` AND entity_type = $${paramIndex}`
        queryParams.push(params.entityType)
        paramIndex++
      }

      if (params.actorUserId) {
        query += ` AND actor_user_id = $${paramIndex}`
        queryParams.push(params.actorUserId)
        paramIndex++
      }

      if (params.success !== undefined) {
        query += ` AND success = $${paramIndex}`
        queryParams.push(params.success)
        paramIndex++
      }

      query += ` ORDER BY occurred_at ${params.order.toUpperCase()}`
      query += ` LIMIT $${paramIndex}`
      queryParams.push(limit)

      // Audit the export itself
      const exportPayload = {
        filters: {
          from: params.from || null,
          to: params.to || null,
          action: params.action || null,
          entityType: params.entityType || null,
          actorUserId: params.actorUserId || null,
          success: params.success !== undefined ? params.success : null,
        },
        format: params.format,
        limit,
        order: params.order,
        clinicId,
      }

      await withAuditContext(req.auditContext, async (auditClient) => {
        await auditClient.query(
          `SELECT audit.fn_log($1, $2, $3::text, $4, $5)`,
          [
            'audit.export',
            'audit.event',
            null,
            JSON.stringify(exportPayload),
            true,
          ]
        )
      })

      // Set response headers
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = `audit-export-${clinicId}-${timestamp}.${params.format}`
      
      res.setHeader('Content-Type', params.format === 'csv' ? 'text/csv' : 'application/x-ndjson')
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)

      if (params.format === 'csv') {
        // CSV: fetch rows and format manually (safer with parameterized queries)
        const result = await client.query(query, queryParams)
        
        // Write CSV header
        const headers = [
          'occurred_at',
          'clinic_id',
          'actor_user_id',
          'action',
          'entity_type',
          'entity_id',
          'success',
          'request_id',
          'ip',
          'user_agent',
          'payload',
        ]
        res.write(headers.map(escapeCsvField).join(',') + '\n')
        
        // Write CSV rows
        for (const row of result.rows) {
          const csvRow = [
            row.occurred_at,
            row.clinic_id,
            row.actor_user_id,
            row.action,
            row.entity_type,
            row.entity_id,
            row.success,
            row.request_id,
            row.ip,
            row.user_agent,
            row.payload ? JSON.stringify(row.payload) : '',
          ]
          res.write(csvRow.map(escapeCsvField).join(',') + '\n')
        }
        
        res.end()
        client.release()
      } else {
        // JSONL: fetch rows and write line by line
        const result = await client.query(query, queryParams)
        
        for (const row of result.rows) {
          res.write(JSON.stringify(row) + '\n')
        }
        
        res.end()
        client.release()
      }
    } catch (error) {
      console.error('Export error:', error)
      client.release()
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' })
      }
    }
  }
)

export default router
