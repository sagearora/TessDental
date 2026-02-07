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

export const env = {
  // Database
  DATABASE_URL: requireEnv('DATABASE_URL'),
  
  // JWT
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_ISSUER: requireEnv('JWT_ISSUER'),
  JWT_AUDIENCE: requireEnv('JWT_AUDIENCE'),
  
  // Server
  PORT: parseInt(process.env.PORT || '4000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
}
