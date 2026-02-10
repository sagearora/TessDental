import { AuthenticatedRequest } from '../middleware/auth.js'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: AuthenticatedRequest, reply: any) => Promise<void>
  }
}
