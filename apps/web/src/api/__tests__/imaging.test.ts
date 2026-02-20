import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockAuthFetch = vi.fn()
vi.mock('@/lib/onUnauthorized', () => ({
  authFetch: (input: RequestInfo | URL, init?: RequestInit) => mockAuthFetch(input, init),
}))

describe('imaging asset blob cache', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    mockAuthFetch.mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob(['x'], { type: 'image/jpeg' })),
    })
    const imaging = await import('@/api/imaging')
    imaging.invalidateAssetBlobCache(1)
    imaging.invalidateAssetBlobCache(2)
  })

  it('returns same blob URL on second getAssetBlobUrl for same assetId and variant (cache hit)', async () => {
    const imaging = await import('@/api/imaging')
    const url1 = await imaging.getAssetBlobUrl(1, 'thumb')
    const url2 = await imaging.getAssetBlobUrl(1, 'thumb')
    expect(url1).toBe(url2)
    expect(url1).toMatch(/^blob:/)
    const assetFetches = mockAuthFetch.mock.calls.filter(
      (call: [RequestInfo | URL]) => String(call[0]).includes('/imaging/assets/')
    )
    expect(assetFetches).toHaveLength(1)
  })

  it('fetches again after invalidateAssetBlobCache for that asset', async () => {
    const imaging = await import('@/api/imaging')
    const url1 = await imaging.getAssetBlobUrl(1, 'thumb')
    imaging.invalidateAssetBlobCache(1)
    const url2 = await imaging.getAssetBlobUrl(1, 'thumb')
    expect(url1).toMatch(/^blob:/)
    expect(url2).toMatch(/^blob:/)
    expect(url1).not.toBe(url2)
    const assetFetches = mockAuthFetch.mock.calls.filter(
      (call: [RequestInfo | URL]) => String(call[0]).includes('/imaging/assets/')
    )
    expect(assetFetches).toHaveLength(2)
  })

  it('caches per variant: thumb and web are separate cache entries', async () => {
    const imaging = await import('@/api/imaging')
    const thumbUrl = await imaging.getAssetBlobUrl(1, 'thumb')
    const webUrl = await imaging.getAssetBlobUrl(1, 'web')
    expect(thumbUrl).not.toBe(webUrl)
    let assetFetches = mockAuthFetch.mock.calls.filter(
      (call: [RequestInfo | URL]) => String(call[0]).includes('/imaging/assets/')
    )
    expect(assetFetches).toHaveLength(2)
    const thumbUrl2 = await imaging.getAssetBlobUrl(1, 'thumb')
    expect(thumbUrl).toBe(thumbUrl2)
    assetFetches = mockAuthFetch.mock.calls.filter(
      (call: [RequestInfo | URL]) => String(call[0]).includes('/imaging/assets/')
    )
    expect(assetFetches).toHaveLength(2)
  })

  it('invalidateAssetBlobCache only clears the given asset', async () => {
    const imaging = await import('@/api/imaging')
    const url1a = await imaging.getAssetBlobUrl(1, 'thumb')
    const url2a = await imaging.getAssetBlobUrl(2, 'thumb')
    imaging.invalidateAssetBlobCache(1)
    const url1b = await imaging.getAssetBlobUrl(1, 'thumb')
    const url2b = await imaging.getAssetBlobUrl(2, 'thumb')
    expect(url1a).not.toBe(url1b)
    expect(url2a).toBe(url2b)
    const assetFetches = mockAuthFetch.mock.calls.filter(
      (call: [RequestInfo | URL]) => String(call[0]).includes('/imaging/assets/')
    )
    expect(assetFetches).toHaveLength(3)
  })
})
