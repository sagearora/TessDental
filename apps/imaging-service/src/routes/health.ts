import { FastifyInstance } from 'fastify'
import { env } from '../env.js'

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (request, reply) => {
    return {
      ok: true,
      backend: env.IMAGING_STORAGE_BACKEND,
    }
  })
}
