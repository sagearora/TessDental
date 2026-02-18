import jwt from 'jsonwebtoken'
import { env } from './env.js'

export interface JWTClaims {
  sub: string
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

export function verifyAccessToken(token: string): JWTClaims {
  const decoded = jwt.verify(token, env.JWT_SECRET, {
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
    algorithms: ['HS256'],
  }) as JWTClaims
  return decoded
}
