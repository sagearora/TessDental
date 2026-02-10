import { FastifyRequest, FastifyReply } from 'fastify'
import { verifyAccessToken, JWTClaims } from '../jwt.js'
import { v4 as uuidv4 } from 'uuid'

export interface AuditContext {
  actorUserId: string
  clinicId: string
  requestId: string
  ip: string
  userAgent: string
}

export interface AuthenticatedRequest extends FastifyRequest {
  claims?: JWTClaims
  auditContext?: AuditContext
}

export function extractToken(req: FastifyRequest): string | null {
  const authHeader = req.headers.authorization
  if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}

export async function authenticate(
  req: AuthenticatedRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const token = extractToken(req)
    if (!token) {
      return reply.status(401).send({ error: 'Missing or invalid authorization header' })
    }

    const claims = verifyAccessToken(token)
    req.claims = claims

    // Setup audit context
    const requestId = uuidv4()
    const ip = req.ip || req.socket.remoteAddress || 'unknown'
    const userAgent = req.headers['user-agent'] || 'unknown'

    req.auditContext = {
      actorUserId: claims.sub,
      clinicId: claims['https://hasura.io/jwt/claims']['x-hasura-clinic-id'],
      requestId,
      ip: Array.isArray(ip) ? ip[0] : ip,
      userAgent,
    }
  } catch (error: any) {
    if (error.message === 'Invalid or expired token') {
      return reply.status(401).send({ error: error.message })
    }
    throw error
  }
}
