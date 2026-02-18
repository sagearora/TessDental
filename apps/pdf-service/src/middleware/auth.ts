import type { FastifyRequest, FastifyReply } from 'fastify'
import { verifyAccessToken, type JWTClaims } from '../jwt.js'

export interface AuthenticatedRequest extends FastifyRequest {
  claims?: JWTClaims
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
    req.claims = verifyAccessToken(token)
  } catch {
    return reply.status(401).send({ error: 'Invalid or expired token' })
  }
}
