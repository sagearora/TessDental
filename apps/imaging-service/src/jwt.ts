import jwt from 'jsonwebtoken'
import { env } from './env.js'

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

export interface UploadTokenClaims {
  type: 'imaging_upload'
  sub: string
  clinicId: number
  patientId: number
  modality: string
  imageSource: string | null
  iat: number
  exp: number
  iss: string
  aud: string
}

const UPLOAD_TOKEN_EXPIRES_IN_SEC = 300 // 5 min

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

export function signUploadToken(params: {
  userId: string
  clinicId: number
  patientId: number
  modality: string
  imageSource: string | null
}): string {
  return jwt.sign(
    {
      type: 'imaging_upload',
      sub: params.userId,
      clinicId: params.clinicId,
      patientId: params.patientId,
      modality: params.modality,
      imageSource: params.imageSource,
    },
    env.JWT_SECRET,
    {
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
      algorithm: 'HS256',
      expiresIn: UPLOAD_TOKEN_EXPIRES_IN_SEC,
    }
  )
}

export function verifyUploadToken(token: string): UploadTokenClaims {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
      algorithms: ['HS256'],
    }) as jwt.JwtPayload & UploadTokenClaims
    if (decoded.type !== 'imaging_upload') {
      throw new Error('Invalid token type')
    }
    return decoded as UploadTokenClaims
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}

export { UPLOAD_TOKEN_EXPIRES_IN_SEC }
