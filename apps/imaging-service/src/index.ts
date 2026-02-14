import Fastify from 'fastify'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import { env } from './env.js'
import { closePool } from './db.js'
import { authenticate } from './middleware/auth.js'
import { healthRoutes } from './routes/health.js'
import { studiesRoutes } from './routes/studies.js'
import { assetsRoutes } from './routes/assets.js'
import { mountsRoutes } from './routes/mounts.js'
import type { AuthenticatedRequest } from './middleware/auth.js'

const fastify = Fastify({
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

// Register plugins
await fastify.register(cors, {
  origin: true,
})

await fastify.register(multipart, {
  limits: {
    fileSize: env.IMAGING_MAX_UPLOAD_MB * 1024 * 1024,
  },
})

// Register authentication as a decorator
fastify.decorate('authenticate', async function (request: AuthenticatedRequest, reply: any) {
  await authenticate(request, reply)
})

// Register routes
await fastify.register(healthRoutes)
await fastify.register(studiesRoutes)
await fastify.register(assetsRoutes)
await fastify.register(mountsRoutes)

// Graceful shutdown
const shutdown = async () => {
  try {
    await fastify.close()
    await closePool()
    process.exit(0)
  } catch (error) {
    console.error('Error during shutdown:', error)
    process.exit(1)
  }
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

// Start server
try {
  await fastify.listen({ port: env.PORT, host: '0.0.0.0' })
  console.log(`Imaging service listening on port ${env.PORT}`)
} catch (error) {
  fastify.log.error(error)
  process.exit(1)
}
