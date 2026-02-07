import { Router, Response } from 'express'
import { getPool } from '../db.js'
import { AuthenticatedRequest } from '../middleware/audit.js'

const router: Router = Router()

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.claims) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const claims = req.claims

    const pool = getPool()

    // Fetch user info
    const userResult = await pool.query(
      `SELECT id, email, first_name, last_name, is_active
       FROM public.app_user
       WHERE id = $1`,
      [claims.sub]
    )

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const user = userResult.rows[0]

    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is inactive' })
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
      clinicId: Number(claims['https://hasura.io/jwt/claims']['x-hasura-clinic-id']),
    })
  } catch (error: any) {
    if (error.message === 'Invalid or expired token') {
      return res.status(401).json({ error: error.message })
    }
    console.error('Me error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
