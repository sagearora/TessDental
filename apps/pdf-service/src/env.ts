import dotenv from 'dotenv'

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
  PORT: parseInt(optionalEnv('PORT', '4020'), 10),
  NODE_ENV: optionalEnv('NODE_ENV', 'development'),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_ISSUER: requireEnv('JWT_ISSUER'),
  JWT_AUDIENCE: requireEnv('JWT_AUDIENCE'),
  IMAGING_API_URL: requireEnv('IMAGING_API_URL'),
  HASURA_GRAPHQL_URL: requireEnv('HASURA_GRAPHQL_URL'),
}
