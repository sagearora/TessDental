import { Router, Request, Response } from 'express'
import { getPool } from '../db.js'
import { hashRefreshToken } from '../jwt.js'
import { z } from 'zod'

const router: Router = Router()

const logoutSchema = z.object({
  refreshToken: z.string().min(1),
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const body = logoutSchema.parse(req.body)
    const { refreshToken } = body

    const pool = getPool()
    const refreshTokenHash = hashRefreshToken(refreshToken)

    // Revoke refresh token
    await pool.query(
      `UPDATE public.auth_refresh_token
       SET revoked_at = NOW()
       WHERE token_hash = $1 AND revoked_at IS NULL`,
      [refreshTokenHash]
    )

    res.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request', details: error.errors })
    }
    console.error('Logout error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
