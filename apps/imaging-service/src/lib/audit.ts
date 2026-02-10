import { getPool } from '../db.js'
import type { AuditContext } from '../middleware/auth.js'

export interface AuditEvent {
  action: string
  entityTable: string
  entityId: string | number
  payload?: Record<string, any>
  success?: boolean
}

/**
 * Log an audit event using the audit context
 */
export async function logAuditEvent(
  context: AuditContext,
  event: AuditEvent
): Promise<void> {
  const pool = getPool()
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Set audit context
    await client.query(`SELECT set_config('audit.actor_user_id', $1::text, true)`, [context.actorUserId])
    await client.query(`SELECT set_config('audit.clinic_id', $1::text, true)`, [context.clinicId])
    await client.query(`SELECT set_config('audit.request_id', $1::text, true)`, [context.requestId])
    await client.query(`SELECT set_config('audit.ip', $1::text, true)`, [context.ip])
    await client.query(`SELECT set_config('audit.user_agent', $1::text, true)`, [context.userAgent])

    // Insert audit event
    await client.query(
      `SELECT audit.fn_log($1, $2, $3::text, $4, $5)`,
      [
        event.action,
        event.entityTable,
        String(event.entityId),
        event.payload ? JSON.stringify(event.payload) : null,
        event.success !== false, // default to true
      ]
    )

    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Audit log error:', error)
    // Don't throw - audit failures shouldn't break the request
  } finally {
    client.release()
  }
}
