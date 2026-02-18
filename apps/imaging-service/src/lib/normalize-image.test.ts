import { describe, it, expect, vi, beforeEach } from 'vitest'
import { normalizeImageBuffer } from './normalize-image.js'

const mockHeicConvert = vi.fn()
vi.mock('heic-convert', () => ({
  default: mockHeicConvert,
}))

describe('normalizeImageBuffer', () => {
  const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0x00])

  beforeEach(() => {
    mockHeicConvert.mockReset()
    mockHeicConvert.mockResolvedValue(Buffer.from('converted-jpeg'))
  })

  it('returns buffer and mimeType unchanged for image/jpeg', async () => {
    const input = { buffer: jpegBuffer, mimeType: 'image/jpeg' }
    const result = await normalizeImageBuffer(input)
    expect(result.buffer).toBe(jpegBuffer)
    expect(result.mimeType).toBe('image/jpeg')
    expect(mockHeicConvert).not.toHaveBeenCalled()
  })

  it('returns buffer and mimeType unchanged for image/png', async () => {
    const input = { buffer: jpegBuffer, mimeType: 'image/png' }
    const result = await normalizeImageBuffer(input)
    expect(result.buffer).toBe(jpegBuffer)
    expect(result.mimeType).toBe('image/png')
    expect(mockHeicConvert).not.toHaveBeenCalled()
  })

  it('converts when mimeType is image/heic and returns JPEG', async () => {
    const heicBuffer = Buffer.from('heic-data')
    const input = { buffer: heicBuffer, mimeType: 'image/heic' }
    const result = await normalizeImageBuffer(input)
    expect(mockHeicConvert).toHaveBeenCalledWith({
      buffer: heicBuffer,
      format: 'JPEG',
      quality: 0.9,
    })
    expect(result.mimeType).toBe('image/jpeg')
    expect(Buffer.from(result.buffer).toString()).toBe('converted-jpeg')
  })

  it('converts when mimeType is image/heif', async () => {
    const input = { buffer: Buffer.from('heif'), mimeType: 'image/heif' }
    const result = await normalizeImageBuffer(input)
    expect(mockHeicConvert).toHaveBeenCalled()
    expect(result.mimeType).toBe('image/jpeg')
  })

  it('treats as HEIC when mimetype is application/octet-stream and filename has .heic extension', async () => {
    const input = {
      buffer: Buffer.from('raw'),
      filename: 'photo.heic',
      mimeType: 'application/octet-stream',
    }
    const result = await normalizeImageBuffer(input)
    expect(mockHeicConvert).toHaveBeenCalled()
    expect(result.mimeType).toBe('image/jpeg')
  })

  it('treats as HEIC when filename has .heif extension', async () => {
    const input = {
      buffer: Buffer.from('raw'),
      filename: 'image.HEIF',
      mimeType: 'application/octet-stream',
    }
    const result = await normalizeImageBuffer(input)
    expect(mockHeicConvert).toHaveBeenCalled()
    expect(result.mimeType).toBe('image/jpeg')
  })

  it('passes through when application/octet-stream and filename has unknown extension', async () => {
    const input = {
      buffer: jpegBuffer,
      filename: 'file.bin',
      mimeType: 'application/octet-stream',
    }
    const result = await normalizeImageBuffer(input)
    expect(mockHeicConvert).not.toHaveBeenCalled()
    expect(result.mimeType).toBe('application/octet-stream')
    expect(result.buffer).toBe(jpegBuffer)
  })

  it('throws with clear message when HEIC conversion fails', async () => {
    mockHeicConvert.mockRejectedValue(new Error('Unsupported codec'))
    const input = { buffer: Buffer.from('bad'), mimeType: 'image/heic' }
    await expect(normalizeImageBuffer(input)).rejects.toThrow('HEIC conversion failed: Unsupported codec')
  })

  it('throws when conversion throws non-Error', async () => {
    mockHeicConvert.mockRejectedValue('string error')
    const input = { buffer: Buffer.from('x'), mimeType: 'image/heic' }
    await expect(normalizeImageBuffer(input)).rejects.toThrow('HEIC conversion failed: string error')
  })
})
