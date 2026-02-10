import { FastifyReply } from 'fastify'
import { AuthenticatedRequest, AuditContext } from './auth.js'
import { getPool } from '../db.js'
import { logAuditEvent } from '../lib/audit.js'

export async function requireCapability(
  req: AuthenticatedRequest,
  reply: FastifyReply,
  capabilityKey: string | string[]
): Promise<boolean> {
  if (!req.claims || !req.auditContext) {
    reply.status(401).send({ error: 'Not authenticated' })
    return false
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
      await logAuditEvent(req.auditContext, {
        action: 'capability.check.failed',
        entityTable: 'capability',
        entityId: Array.isArray(capabilityKey) ? capabilityKey.join('|') : capabilityKey,
        payload: { clinic_id: clinicId, user_id: userId, capability_keys: capabilityKeys },
      })

      reply.status(403).send({
        error: `Missing required capability: ${Array.isArray(capabilityKey) ? capabilityKey.join(' or ') : capabilityKey}`,
      })
      return false
    }

    return true
  } catch (error) {
    console.error('Capability check error:', error)
    reply.status(500).send({ error: 'Internal server error' })
    return false
  }
}
