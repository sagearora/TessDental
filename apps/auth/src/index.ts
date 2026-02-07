import express from 'express'
import cors from 'cors'
import { env } from './env.js'
import { closePool } from './db.js'
import { authenticate, setupAuditContext } from './middleware/audit.js'
import loginRouter from './routes/login.js'
import refreshRouter from './routes/refresh.js'
import logoutRouter from './routes/logout.js'
import meRouter from './routes/me.js'
import usersRouter from './routes/users.js'
import userProfileRouter from './routes/userProfile.js'
import userMembershipRouter from './routes/userMembership.js'
import userProviderIdentifierRouter from './routes/userProviderIdentifier.js'
import clinicRouter from './routes/clinic.js'
import rolesRouter from './routes/roles.js'
import userRolesRouter from './routes/userRoles.js'
import auditExportRouter from './routes/auditExport.js'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.set('trust proxy', true) // For accurate IP addresses

// Health check
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok' })
})

// Routes
app.use('/auth/login', loginRouter)
app.use('/auth/refresh', refreshRouter)
app.use('/auth/logout', logoutRouter)
app.use('/auth/me', authenticate, setupAuditContext, meRouter)
app.use('/auth/users', authenticate, setupAuditContext, usersRouter)
app.use('/auth/users', authenticate, setupAuditContext, userProfileRouter)
app.use('/auth/users', authenticate, setupAuditContext, userProviderIdentifierRouter)
app.use('/auth/clinics', authenticate, setupAuditContext, clinicRouter)
app.use('/auth/clinics', authenticate, setupAuditContext, userMembershipRouter)
app.use('/auth', authenticate, setupAuditContext, rolesRouter)
app.use('/auth', authenticate, setupAuditContext, userRolesRouter)
app.use('/auth/audit', authenticate, setupAuditContext, auditExportRouter)

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

// Start server
const server = app.listen(env.PORT, () => {
  console.log(`Auth service listening on port ${env.PORT}`)
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close(async () => {
    await closePool()
    process.exit(0)
  })
})

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully')
  server.close(async () => {
    await closePool()
    process.exit(0)
  })
})
