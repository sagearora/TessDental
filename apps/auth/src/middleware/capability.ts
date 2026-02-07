import { Response } from 'express'
import { AuthenticatedRequest, withAuditContext } from './audit.js'
import { getPool } from '../db.js'

export async function requireCapability(
  req: AuthenticatedRequest,
  res: Response,
  next: () => void,
  capabilityKey: string | string[]
) {
  if (!req.claims || !req.auditContext) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const pool = getPool()
  const clinicId = Number(req.auditContext.clinicId)
  const userId = req.claims.sub

  try {
    const capabilityKeys = Array.isArray(capabilityKey) ? capabilityKey : [capabilityKey]
    let hasCapability = false

    // Check each capability (OR logic)
    for (const key of capabilityKeys) {
      const result = await pool.query(
        `SELECT public.fn_has_capability($1, $2, $3) as has_capability`,
        [clinicId, userId, key]
      )

      if (result.rows[0]?.has_capability === true) {
        hasCapability = true
        break
      }
    }

    if (!hasCapability) {
      // Log failed capability check
      await withAuditContext(req.auditContext, async (client) => {
        await client.query(
          `SELECT audit.fn_log($1, $2, $3::text, $4, $5)`,
          [
            'capability.check.failed',
            'capability',
            Array.isArray(capabilityKey) ? capabilityKey.join('|') : capabilityKey,
            JSON.stringify({ clinic_id: clinicId, user_id: userId, capability_keys: capabilityKeys }),
            false,
          ]
        )
      })

      return res.status(403).json({ 
        error: `Missing required capability: ${Array.isArray(capabilityKey) ? capabilityKey.join(' or ') : capabilityKey}` 
      })
    }

    next()
  } catch (error) {
    console.error('Capability check error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
