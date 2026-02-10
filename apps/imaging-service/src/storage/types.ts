export interface StorageAdapter {
  put(key: string, stream: NodeJS.ReadableStream, contentType?: string): Promise<void>
  get(key: string): Promise<NodeJS.ReadableStream>
  exists(key: string): Promise<boolean>
  delete(key: string): Promise<void>
}
