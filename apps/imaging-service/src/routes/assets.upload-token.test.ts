import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest'
import Fastify from 'fastify'
import multipart from '@fastify/multipart'
import jwt from 'jsonwebtoken'
import { authenticate } from '../middleware/auth.js'
import { signUploadToken } from '../jwt.js'
import { assetsRoutes } from './assets.js'
import type { AuthenticatedRequest } from '../middleware/auth.js'
import { env } from '../env.js'

const mockQuery = vi.fn().mockImplementation((sql: string) => {
  if (sql.includes('fn_has_capability')) return Promise.resolve({ rows: [{ has_capability: true }] })
  if (sql.includes('INSERT INTO') && sql.includes('imaging_asset')) return Promise.resolve({ rows: [{ id: 1 }] })
  return Promise.resolve({ rows: [] })
})

const mockRelease = vi.fn()

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

vi.mock('../storage/index.js', () => ({
  getStorageAdapter: () => ({
    put: vi.fn().mockResolvedValue(undefined),
  }),
}))

const { mockGenerateThumb, mockGenerateWebVersion } = vi.hoisted(() => ({
  mockGenerateThumb: vi.fn().mockResolvedValue(Buffer.from('mock-thumb')),
  mockGenerateWebVersion: vi.fn().mockResolvedValue(Buffer.from('mock-web')),
}))
vi.mock('../lib/thumbnails.js', () => ({
  generateThumb: mockGenerateThumb,
  generateWebVersion: mockGenerateWebVersion,
}))

describe('POST /imaging/assets/upload-token', () => {
  let app: Awaited<ReturnType<typeof Fastify>>

  beforeAll(async () => {
    app = Fastify({ logger: false })
    await app.register(multipart, { limits: { fileSize: 100 * 1024 * 1024 } })
    app.decorate('authenticate', async function (request: AuthenticatedRequest, reply: any) {
      await authenticate(request, reply)
    })
    await app.register(assetsRoutes)
  })

  afterAll(async () => {
    await app.close()
  })

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

  it('returns 401 without Authorization header', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/imaging/assets/upload-token',
      payload: { patientId: 1 },
    })
    expect(res.statusCode).toBe(401)
  })

  it('returns 400 when patientId is missing', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/imaging/assets/upload-token',
      headers: { authorization: `Bearer ${validAccessToken()}` },
      payload: {},
    })
    expect(res.statusCode).toBe(400)
  })

  it('returns 200 with uploadToken, expiresIn, uploadUrl when body is valid', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/imaging/assets/upload-token',
      headers: { authorization: `Bearer ${validAccessToken()}` },
      payload: { patientId: 1, modality: 'PHOTO', imageSource: 'scanner' },
    })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body).toHaveProperty('uploadToken')
    expect(typeof body.uploadToken).toBe('string')
    expect(body.uploadToken.length).toBeGreaterThan(0)
    expect(body).toHaveProperty('expiresIn')
    expect(typeof body.expiresIn).toBe('number')
    expect(body).toHaveProperty('uploadUrl')
    expect(typeof body.uploadUrl).toBe('string')

    const decoded = jwt.decode(body.uploadToken) as any
    expect(decoded).toHaveProperty('type', 'imaging_upload')
    expect(decoded).toHaveProperty('patientId', 1)
    expect(decoded).toHaveProperty('modality', 'PHOTO')
    expect(decoded).toHaveProperty('imageSource', 'scanner')
    expect(decoded).not.toHaveProperty('studyId')
  })
})

describe('POST /imaging/assets/upload-bridge', () => {
  let app: Awaited<ReturnType<typeof Fastify>>
  let uploadToken: string

  beforeAll(async () => {
    app = Fastify({ logger: false })
    await app.register(multipart, { limits: { fileSize: 100 * 1024 * 1024 } })
    app.decorate('authenticate', async function (request: AuthenticatedRequest, reply: any) {
      await authenticate(request, reply)
    })
    await app.register(assetsRoutes)

    uploadToken = signUploadToken({
      userId: 'user-123',
      clinicId: 1,
      patientId: 2,
      modality: 'PHOTO',
      imageSource: 'scanner',
    })
  })

  afterAll(async () => {
    await app.close()
  })

  it('returns 401 without Authorization header', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/imaging/assets/upload-bridge',
      payload: {},
    })
    expect(res.statusCode).toBe(401)
  })

  it('returns 401 with expired upload token', async () => {
    const expired = jwt.sign(
      {
        type: 'imaging_upload',
        sub: 'user-123',
        clinicId: 1,
        patientId: 2,
        modality: 'PHOTO',
        imageSource: 'scanner',
      },
      env.JWT_SECRET,
      { issuer: env.JWT_ISSUER, audience: env.JWT_AUDIENCE, expiresIn: '-1s' }
    )
    const res = await app.inject({
      method: 'POST',
      url: '/imaging/assets/upload-bridge',
      headers: { authorization: `Bearer ${expired}` },
      payload: {},
    })
    expect(res.statusCode).toBe(401)
  })

  it('returns 401 with normal JWT (wrong token type)', async () => {
    const normalJwt = jwt.sign(
      { sub: 'user-123', 'https://hasura.io/jwt/claims': { 'x-hasura-clinic-id': '1' } },
      env.JWT_SECRET,
      { issuer: env.JWT_ISSUER, audience: env.JWT_AUDIENCE, expiresIn: '1h' }
    )
    const res = await app.inject({
      method: 'POST',
      url: '/imaging/assets/upload-bridge',
      headers: { authorization: `Bearer ${normalJwt}` },
      payload: {},
    })
    expect(res.statusCode).toBe(401)
  })

  it('returns 200 and { assetId } with valid upload token and multipart file', async () => {
    const boundary = '----formboundary'
    const jpegHeader = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10])
    const body = Buffer.concat([
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="patientId"\r\n\r\n2\r\n` +
          `--${boundary}\r\nContent-Disposition: form-data; name="modality"\r\n\r\nPHOTO\r\n` +
          `--${boundary}\r\nContent-Disposition: form-data; name="imageSource"\r\n\r\nscanner\r\n` +
          `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="test.jpg"\r\n` +
          `Content-Type: image/jpeg\r\n\r\n`,
        'utf8'
      ),
      jpegHeader,
      Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8'),
    ])

    const res = await app.inject({
      method: 'POST',
      url: '/imaging/assets/upload-bridge',
      headers: {
        authorization: `Bearer ${uploadToken}`,
        'content-type': `multipart/form-data; boundary=${boundary}`,
      },
      payload: body,
    })
    expect(res.statusCode).toBe(200)
    const json = res.json()
    expect(json).toHaveProperty('assetId', 1)
  })

  describe('MIME type and thumbnail generation', () => {
    beforeEach(() => {
      mockGenerateThumb.mockClear()
      mockGenerateWebVersion.mockClear()
    })

    it('triggers thumbnail generation when file has Content-Type image/jpeg', async () => {
      const boundary = '----boundary1'
      const jpegHeader = Buffer.from([0xff, 0xd8, 0xff])
      const body = Buffer.concat([
        Buffer.from(
          `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="photo.jpg"\r\n` +
            `Content-Type: image/jpeg\r\n\r\n`,
          'utf8'
        ),
        jpegHeader,
        Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8'),
      ])
      const res = await app.inject({
        method: 'POST',
        url: '/imaging/assets/upload-bridge',
        headers: {
          authorization: `Bearer ${uploadToken}`,
          'content-type': `multipart/form-data; boundary=${boundary}`,
        },
        payload: body,
      })
      expect(res.statusCode).toBe(200)
      expect(res.json()).toHaveProperty('assetId', 1)
      expect(mockGenerateThumb).toHaveBeenCalledTimes(1)
      expect(mockGenerateWebVersion).toHaveBeenCalledTimes(1)
    })

    it('infers image/jpeg from filename when Content-Type is application/octet-stream and triggers thumbnail generation', async () => {
      const boundary = '----boundary2'
      const jpegHeader = Buffer.from([0xff, 0xd8, 0xff])
      const body = Buffer.concat([
        Buffer.from(
          `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="twain_capture.jpg"\r\n` +
            `Content-Type: application/octet-stream\r\n\r\n`,
          'utf8'
        ),
        jpegHeader,
        Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8'),
      ])
      const res = await app.inject({
        method: 'POST',
        url: '/imaging/assets/upload-bridge',
        headers: {
          authorization: `Bearer ${uploadToken}`,
          'content-type': `multipart/form-data; boundary=${boundary}`,
        },
        payload: body,
      })
      expect(res.statusCode).toBe(200)
      expect(res.json()).toHaveProperty('assetId', 1)
      expect(mockGenerateThumb).toHaveBeenCalledTimes(1)
      expect(mockGenerateWebVersion).toHaveBeenCalledTimes(1)
    })

    it('infers image/png from filename when Content-Type is application/octet-stream', async () => {
      const boundary = '----boundary3'
      const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47])
      const body = Buffer.concat([
        Buffer.from(
          `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="scan.png"\r\n` +
            `Content-Type: application/octet-stream\r\n\r\n`,
          'utf8'
        ),
        pngHeader,
        Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8'),
      ])
      const res = await app.inject({
        method: 'POST',
        url: '/imaging/assets/upload-bridge',
        headers: {
          authorization: `Bearer ${uploadToken}`,
          'content-type': `multipart/form-data; boundary=${boundary}`,
        },
        payload: body,
      })
      expect(res.statusCode).toBe(200)
      expect(res.json()).toHaveProperty('assetId', 1)
      expect(mockGenerateThumb).toHaveBeenCalledTimes(1)
      expect(mockGenerateWebVersion).toHaveBeenCalledTimes(1)
    })

    it('does not trigger thumbnail generation when MIME stays application/octet-stream', async () => {
      const boundary = '----boundary4'
      const body = Buffer.concat([
        Buffer.from(
          `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="data.bin"\r\n` +
            `Content-Type: application/octet-stream\r\n\r\n`,
          'utf8'
        ),
        Buffer.from('binary payload'),
        Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8'),
      ])
      const res = await app.inject({
        method: 'POST',
        url: '/imaging/assets/upload-bridge',
        headers: {
          authorization: `Bearer ${uploadToken}`,
          'content-type': `multipart/form-data; boundary=${boundary}`,
        },
        payload: body,
      })
      expect(res.statusCode).toBe(200)
      expect(res.json()).toHaveProperty('assetId', 1)
      expect(mockGenerateThumb).not.toHaveBeenCalled()
      expect(mockGenerateWebVersion).not.toHaveBeenCalled()
    })
  })
})
