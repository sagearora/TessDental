/**
 * Vitest setup: set minimal env vars so imaging-service modules can load in tests.
 * Real DB/S3 are mocked in tests; these satisfy requireEnv().
 */
const required = {
  JWT_SECRET: 'test-jwt-secret',
  JWT_ISSUER: 'test-issuer',
  JWT_AUDIENCE: 'test-audience',
  DATABASE_URL: 'postgres://localhost:5432/test',
  IMAGING_STORAGE_BACKEND: 'nfs',
  IMAGING_S3_BUCKET: 'test-bucket',
  IMAGING_S3_ACCESS_KEY_ID: 'test-key',
  IMAGING_S3_SECRET_ACCESS_KEY: 'test-secret',
  IMAGING_NFS_BASE_DIR: '/tmp/imaging-test',
}

for (const [k, v] of Object.entries(required)) {
  if (!process.env[k]) process.env[k] = v
}
