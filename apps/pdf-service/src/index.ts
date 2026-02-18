import Fastify from 'fastify'
import cors from '@fastify/cors'
import { env } from './env.js'
import { authenticate } from './middleware/auth.js'
import { healthRoutes } from './routes/health.js'
import { pdfRoutes } from './routes/pdf.js'
import type { AuthenticatedRequest } from './middleware/auth.js'

const fastify = Fastify({
  ignoreTrailingSlash: true,
  logger: {
    transport:
      env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
  },
})

await fastify.register(cors, {
  origin: true,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'OPTIONS'],
})

fastify.decorate('authenticate', async function (request: AuthenticatedRequest, reply: any) {
  await authenticate(request, reply)
})

await fastify.register(healthRoutes)
// Mount PDF routes on root instance so GET /pdf/printimage etc. match
await pdfRoutes(fastify)

fastify.setNotFoundHandler((request, reply) => {
  reply.status(404).send({
    error: 'Route not found',
    path: request.url,
    method: request.method,
  })
})

try {
  await fastify.listen({ port: env.PORT, host: '0.0.0.0' })
  console.log(`PDF service listening on port ${env.PORT}`)
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
