import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest'
import Fastify from 'fastify'
import jwt from 'jsonwebtoken'
import { authenticate } from '../middleware/auth.js'
import { assetsRoutes } from './assets.js'
import type { AuthenticatedRequest } from '../middleware/auth.js'
import { env } from '../env.js'

let assetCheckRows: { id: number; clinic_id: number }[] = []
let finalSelectRow: {
  id: number
  name: string | null
  image_source: string | null
  captured_at: Date | string
  updated_at: Date
  updated_by: number
} | null = null

const mockRelease = vi.fn()

const mockQuery = vi.fn().mockImplementation((sql: string) => {
  if (sql.includes('fn_has_capability')) {
    return Promise.resolve({ rows: [{ has_capability: true }] })
  }
  if (sql.includes('BEGIN')) {
    return Promise.resolve({ rows: [] })
  }
  if (sql.includes('SELECT id, clinic_id FROM public.imaging_asset') && sql.includes('is_active')) {
    return Promise.resolve({ rows: assetCheckRows })
  }
  if (sql.includes('UPDATE public.imaging_asset')) {
    return Promise.resolve({ rows: [] })
  }
  if (sql.includes('COMMIT')) {
    return Promise.resolve({ rows: [] })
  }
  if (
    sql.includes('SELECT id, name, image_source, captured_at, updated_at, updated_by') &&
    sql.includes('FROM public.imaging_asset')
  ) {
    const row = finalSelectRow
    if (row && row.captured_at instanceof Date) {
      return Promise.resolve({
        rows: [{ ...row, captured_at: row.captured_at.toISOString() }],
      })
    }
    return Promise.resolve({ rows: row ? [row] : [] })
  }
  return Promise.resolve({ rows: [] })
})

vi.mock('../db.js', () => ({
  getPool: () => ({
    query: mockQuery,
    connect: () =>
      Promise.resolve({
        query: mockQuery,
        release: mockRelease,
      }),
  }),
  closePool: () => Promise.resolve(),
}))

vi.mock('../lib/audit.js', () => ({
  logAuditEvent: vi.fn().mockResolvedValue(undefined),
}))

describe('PATCH /imaging/assets/:assetId', () => {
  let app: Awaited<ReturnType<typeof Fastify>>

  const validAccessToken = () =>
    jwt.sign(
      {
        sub: 'user-123',
        'https://hasura.io/jwt/claims': {
          'x-hasura-user-id': 'user-123',
          'x-hasura-clinic-id': '1',
          'x-hasura-default-role': 'user',
          'x-hasura-allowed-roles': ['user'],
        },
      },
      env.JWT_SECRET,
      { issuer: env.JWT_ISSUER, audience: env.JWT_AUDIENCE, expiresIn: '1h' }
    )

  beforeAll(async () => {
    app = Fastify({ logger: false })
    app.decorate('authenticate', async function (request: AuthenticatedRequest, reply: any) {
      await authenticate(request, reply)
    })
    await app.register(assetsRoutes)
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    mockQuery.mockClear()
    mockRelease.mockClear()
    assetCheckRows = [{ id: 1, clinic_id: 1 }]
    finalSelectRow = {
      id: 1,
      name: 'Updated Name',
      image_source: 'scanner',
      captured_at: new Date('2024-01-15T14:30:00.000Z'),
      updated_at: new Date(),
      updated_by: 1,
    }
  })

  it('returns 401 when Authorization header is missing', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: '/imaging/assets/1',
      payload: { name: 'Test' },
    })
    expect(res.statusCode).toBe(401)
  })

  it('returns 401 when Authorization header is invalid', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: '/imaging/assets/1',
      headers: { authorization: 'Bearer invalid-token' },
      payload: { name: 'Test' },
    })
    expect(res.statusCode).toBe(401)
  })

  it('returns 404 when asset does not exist or does not belong to clinic', async () => {
    assetCheckRows = []
    const res = await app.inject({
      method: 'PATCH',
      url: '/imaging/assets/999',
      headers: { authorization: `Bearer ${validAccessToken()}` },
      payload: { name: 'Test' },
    })
    expect(res.statusCode).toBe(404)
    expect(res.json()).toMatchObject({ error: 'Asset not found or access denied' })
  })

  it('returns 400 when body is empty', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: '/imaging/assets/1',
      headers: { authorization: `Bearer ${validAccessToken()}` },
      payload: {},
    })
    expect(res.statusCode).toBe(400)
    expect(res.json()).toMatchObject({
      error: expect.stringContaining('At least one field'),
    })
  })

  it('returns 400 when no updatable field is provided', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: '/imaging/assets/1',
      headers: { authorization: `Bearer ${validAccessToken()}` },
      payload: { other: 'ignored' },
    })
    expect(res.statusCode).toBe(400)
  })

  it('returns 200 and updated name when sending name only', async () => {
    finalSelectRow = {
      id: 1,
      name: 'New Name',
      image_source: 'scanner',
      captured_at: new Date('2024-01-10T12:00:00.000Z'),
      updated_at: new Date(),
      updated_by: 1,
    }
    const res = await app.inject({
      method: 'PATCH',
      url: '/imaging/assets/1',
      headers: { authorization: `Bearer ${validAccessToken()}` },
      payload: { name: 'New Name' },
    })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body).toHaveProperty('name', 'New Name')
    expect(body).toHaveProperty('id', 1)
    expect(body).toHaveProperty('image_source')
    expect(body).toHaveProperty('captured_at')
    expect(body).toHaveProperty('updated_at')
    expect(body).toHaveProperty('updated_by')
  })

  it('returns 200 and updated imageSource when sending imageSource only', async () => {
    finalSelectRow = {
      id: 1,
      name: 'Existing',
      image_source: 'intraoral',
      captured_at: new Date('2024-01-10T12:00:00.000Z'),
      updated_at: new Date(),
      updated_by: 1,
    }
    const res = await app.inject({
      method: 'PATCH',
      url: '/imaging/assets/1',
      headers: { authorization: `Bearer ${validAccessToken()}` },
      payload: { imageSource: 'intraoral' },
    })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body).toHaveProperty('image_source', 'intraoral')
    expect(body).toHaveProperty('captured_at')
  })

  it('returns 200 and response includes captured_at when sending capturedAt only', async () => {
    const capturedAt = '2024-01-15T14:30:00.000Z'
    finalSelectRow = {
      id: 1,
      name: null,
      image_source: 'scanner',
      captured_at: new Date(capturedAt),
      updated_at: new Date(),
      updated_by: 1,
    }
    const res = await app.inject({
      method: 'PATCH',
      url: '/imaging/assets/1',
      headers: { authorization: `Bearer ${validAccessToken()}` },
      payload: { capturedAt },
    })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body).toHaveProperty('captured_at', capturedAt)
    expect(body).toHaveProperty('id', 1)
  })

  it('returns 200 and updates both name and capturedAt when sent together', async () => {
    const capturedAt = '2024-02-01T09:00:00.000Z'
    finalSelectRow = {
      id: 1,
      name: 'Combined Update',
      image_source: 'panoramic',
      captured_at: new Date(capturedAt),
      updated_at: new Date(),
      updated_by: 1,
    }
    const res = await app.inject({
      method: 'PATCH',
      url: '/imaging/assets/1',
      headers: { authorization: `Bearer ${validAccessToken()}` },
      payload: { name: 'Combined Update', capturedAt },
    })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body).toHaveProperty('name', 'Combined Update')
    expect(body).toHaveProperty('captured_at', capturedAt)
  })

  it('returns 400 for invalid capturedAt (malformed date)', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: '/imaging/assets/1',
      headers: { authorization: `Bearer ${validAccessToken()}` },
      payload: { capturedAt: 'not-a-date' },
    })
    expect(res.statusCode).toBe(400)
    expect(res.json()).toMatchObject({
      error: expect.stringMatching(/invalid capturedAt/i),
    })
  })
})
