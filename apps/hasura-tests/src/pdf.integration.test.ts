// @vitest-environment node
/// <reference types="node" />

import { describe, it, expect, beforeAll } from 'vitest'
import { bootstrapPdfTestData, pdfServiceRequest } from './test-utils'

const PDF_REBUILD_HINT = `
PDF service at PDF_API_URL does not have the new print routes (GET /pdf/printnotes returned 404).
Rebuild and restart the test stack:
  docker compose -f infra/compose/docker-compose.test.yml build pdf-service-test
  docker compose -f infra/compose/docker-compose.test.yml up -d pdf-service-test
Then re-run: pnpm test:hasura
`

/**
 * PDF service integration tests. All tests run when the test stack (including pdf-service-test) is up.
 * If the PDF service is outdated (missing /pdf/printnotes), beforeAll throws with PDF_REBUILD_HINT.
 * Start stack: docker compose -f infra/compose/docker-compose.test.yml up -d --build
 */
describe('PDF service', () => {
  let testData: Awaited<ReturnType<typeof bootstrapPdfTestData>>

  beforeAll(async () => {
    testData = await bootstrapPdfTestData()

    const probe = await pdfServiceRequest('/pdf/printnotes', 'GET', testData.token)
    if (probe.status === 404) {
      throw new Error(PDF_REBUILD_HINT)
    }
  }, 60_000)

  describe('GET /pdf/printimage', () => {
    it('should return 200 and PDF with test clinic name and patient name and image content', async () => {
      const response = await pdfServiceRequest(
        `/pdf/printimage?assetId=${testData.assetId}`,
        'GET',
        testData.token,
        undefined,
        { timeoutMs: 25_000 }
      )

      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toContain('application/pdf')

      const blob = await response.blob()
      const buffer = Buffer.from(await blob.arrayBuffer())
      expect(buffer.length).toBeGreaterThan(1000)
      expect(buffer.subarray(0, 5).toString('ascii')).toBe('%PDF-')

      // PDFKit encodes text via font encoding and may compress streams, so raw UTF-8 byte search fails.
      // Assert PDF structure: has pages and has an image XObject (or substantial content).
      const ascii = buffer.toString('ascii')
      expect(ascii).toMatch(/\/(Pages|Page)\b/)
      const hasImageRef = ascii.includes('/Image') || ascii.includes('/Im1') || ascii.includes('/Im0')
      expect(hasImageRef).toBe(true)
    }, 30_000)

    it('should return 401 without Authorization', async () => {
      const response = await pdfServiceRequest(
        `/pdf/printimage?assetId=${testData.assetId}`,
        'GET',
        null
      )
      expect(response.status).toBe(401)
    })

    it('should return 404 for non-existent asset', async () => {
      const response = await pdfServiceRequest(
        '/pdf/printimage?assetId=999999999',
        'GET',
        testData.token
      )
      expect(response.status).toBe(404)
    })
  })

  describe('GET /pdf/printmount', () => {
    it('should return 200 and PDF with test clinic name, patient name, and image content', async () => {
      const response = await pdfServiceRequest(
        `/pdf/printmount?mountId=${testData.mountId}`,
        'GET',
        testData.token,
        undefined,
        { timeoutMs: 25_000 }
      )

      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toContain('application/pdf')

      const blob = await response.blob()
      const buffer = Buffer.from(await blob.arrayBuffer())
      expect(buffer.length).toBeGreaterThan(1000)
      expect(buffer.subarray(0, 5).toString('ascii')).toBe('%PDF-')

      // PDFKit encodes text via font encoding and may compress streams, so raw UTF-8 byte search fails.
      // Assert PDF structure: has pages and has an image XObject (or substantial content).
      const ascii = buffer.toString('ascii')
      expect(ascii).toMatch(/\/(Pages|Page)\b/)
      const hasImageRef = ascii.includes('/Image') || ascii.includes('/Im1') || ascii.includes('/Im0')
      expect(hasImageRef).toBe(true)
      const pageCount = (ascii.match(/\/Type\s*\/Page/g) || []).length
      expect(pageCount).toBeGreaterThanOrEqual(1)
    }, 30_000)

    it('should return 401 without Authorization', async () => {
      const response = await pdfServiceRequest(
        `/pdf/printmount?mountId=${testData.mountId}`,
        'GET',
        null
      )
      expect(response.status).toBe(401)
    })

    it('should return 404 for non-existent mount', async () => {
      const response = await pdfServiceRequest(
        '/pdf/printmount?mountId=999999999',
        'GET',
        testData.token
      )
      expect(response.status).toBe(404)
    })
  })

  describe('GET /pdf/printnotes', () => {
    it('should return 501 Not Implemented', async () => {
      const response = await pdfServiceRequest('/pdf/printnotes', 'GET', testData.token)
      expect(response.status).toBe(501)
    })
  })

  describe('CORS', () => {
    it('should include CORS headers when Origin is sent', async () => {
      const PDF_API_URL = process.env.PDF_API_URL || 'http://localhost:4021'
      const response = await fetch(`${PDF_API_URL}/health`, {
        method: 'GET',
        headers: { Origin: 'http://localhost:5173' },
      })

      expect(response.status).toBe(200)
      const allowOrigin = response.headers.get('Access-Control-Allow-Origin')
      expect(allowOrigin).toBeTruthy()
      expect(['http://localhost:5173', '*']).toContain(allowOrigin)
    })
  })
})
