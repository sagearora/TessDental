import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

function optionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue
}

export const env = {
  // Server
  PORT: parseInt(optionalEnv('PORT', '4010'), 10),
  NODE_ENV: optionalEnv('NODE_ENV', 'development'),

  // JWT verification
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_ISSUER: requireEnv('JWT_ISSUER'),
  JWT_AUDIENCE: requireEnv('JWT_AUDIENCE'),

  // Database
  DATABASE_URL: requireEnv('DATABASE_URL'),

  // Storage backend
  IMAGING_STORAGE_BACKEND: requireEnv('IMAGING_STORAGE_BACKEND') as 's3' | 'nfs',
  IMAGING_MAX_UPLOAD_MB: parseInt(optionalEnv('IMAGING_MAX_UPLOAD_MB', '100'), 10),
  IMAGING_THUMBS_ENABLED: optionalEnv('IMAGING_THUMBS_ENABLED', 'true') === 'true',

  // S3 settings
  IMAGING_S3_ENDPOINT: optionalEnv('IMAGING_S3_ENDPOINT', ''),
  IMAGING_S3_REGION: optionalEnv('IMAGING_S3_REGION', 'us-east-1'),
  IMAGING_S3_BUCKET: requireEnv('IMAGING_S3_BUCKET'),
  IMAGING_S3_ACCESS_KEY_ID: requireEnv('IMAGING_S3_ACCESS_KEY_ID'),
  IMAGING_S3_SECRET_ACCESS_KEY: requireEnv('IMAGING_S3_SECRET_ACCESS_KEY'),
  IMAGING_S3_FORCE_PATH_STYLE: optionalEnv('IMAGING_S3_FORCE_PATH_STYLE', 'false') === 'true',

  // NFS settings
  IMAGING_NFS_BASE_DIR: optionalEnv('IMAGING_NFS_BASE_DIR', '/data/imaging'),
}
