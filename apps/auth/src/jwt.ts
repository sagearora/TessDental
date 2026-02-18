import jwt from 'jsonwebtoken'
import { env } from './env.js'
import crypto from 'crypto'

export interface JWTClaims {
  sub: string // user_id
  iat: number
  exp: number
  iss: string
  aud: string
  'https://hasura.io/jwt/claims': {
    'x-hasura-user-id': string
    'x-hasura-clinic-id': string
    'x-hasura-default-role': string
    'x-hasura-allowed-roles': string[]
  }
}

export function signAccessToken(
  userId: string,
  clinicId: string | number
): string {
  const now = Math.floor(Date.now() / 1000)
  const expiresIn = 5 * 60 * 60 // 5 hours

  const claims: JWTClaims = {
    sub: userId,
    iat: now,
    exp: now + expiresIn,
    iss: env.JWT_ISSUER,
    aud: env.JWT_AUDIENCE,
    'https://hasura.io/jwt/claims': {
      'x-hasura-user-id': userId,
      'x-hasura-clinic-id': String(clinicId),
      'x-hasura-default-role': 'clinic_user',
      'x-hasura-allowed-roles': ['clinic_user'],
    },
  }

  return jwt.sign(claims, env.JWT_SECRET, {
    algorithm: 'HS256',
  })
}

export function verifyAccessToken(token: string): JWTClaims {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
      algorithms: ['HS256'],
    }) as JWTClaims
    return decoded
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function hashRefreshToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}
