import { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { verifyAccessToken, JWTClaims } from '../jwt.js'
import { getPool } from '../db.js'

export interface AuditContext {
  actorUserId: string
  clinicId: string
  requestId: string
  ip: string
  userAgent: string
}

export interface AuthenticatedRequest extends Request {
  claims?: JWTClaims
  auditContext?: AuditContext
}

export function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const token = extractToken(req)
    if (!token) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' })
    }

    const claims = verifyAccessToken(token)
    req.claims = claims
    next()
  } catch (error: any) {
    if (error.message === 'Invalid or expired token') {
      return res.status(401).json({ error: error.message })
    }
    console.error('Auth error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export function setupAuditContext(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.claims) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const requestId = uuidv4()
  const ip = req.ip || req.socket.remoteAddress || 'unknown'
  const userAgent = req.headers['user-agent'] || 'unknown'

  req.auditContext = {
    actorUserId: req.claims.sub,
    clinicId: req.claims['https://hasura.io/jwt/claims']['x-hasura-clinic-id'],
    requestId,
    ip: Array.isArray(ip) ? ip[0] : ip,
    userAgent,
  }

  next()
}

export async function withAuditContext<T>(
  context: AuditContext,
  fn: (client: any) => Promise<T>
): Promise<T> {
  const pool = getPool()
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Set audit context (cast to text for set_config)
    await client.query(`SELECT set_config('audit.actor_user_id', $1::text, true)`, [context.actorUserId])
    await client.query(`SELECT set_config('audit.clinic_id', $1::text, true)`, [context.clinicId])
    await client.query(`SELECT set_config('audit.request_id', $1::text, true)`, [context.requestId])
    await client.query(`SELECT set_config('audit.ip', $1::text, true)`, [context.ip])
    await client.query(`SELECT set_config('audit.user_agent', $1::text, true)`, [context.userAgent])

    const result = await fn(client)

    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
