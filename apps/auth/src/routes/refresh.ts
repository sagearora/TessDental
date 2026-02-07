import { Router, Request, Response } from 'express'
import { getPool } from '../db.js'
import { signAccessToken, generateRefreshToken, hashRefreshToken } from '../jwt.js'
import { z } from 'zod'

const router: Router = Router()

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const body = refreshSchema.parse(req.body)
    const { refreshToken } = body

    const pool = getPool()
    const refreshTokenHash = hashRefreshToken(refreshToken)

    // 1. Find refresh token
    const tokenResult = await pool.query(
      `SELECT id, user_id, revoked_at, expires_at
       FROM public.auth_refresh_token
       WHERE token_hash = $1`,
      [refreshTokenHash]
    )

    if (tokenResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid refresh token' })
    }

    const tokenRecord = tokenResult.rows[0]

    // 2. Check if revoked
    if (tokenRecord.revoked_at) {
      return res.status(401).json({ error: 'Refresh token has been revoked' })
    }

    // 3. Check if expired
    const expiresAt = new Date(tokenRecord.expires_at)
    if (expiresAt < new Date()) {
      return res.status(401).json({ error: 'Refresh token has expired' })
    }

    // 4. Get user's current clinic (use current_clinic_id if set, otherwise first active clinic)
    const userResult = await pool.query(
      `SELECT current_clinic_id
       FROM public.app_user
       WHERE id = $1`,
      [tokenRecord.user_id]
    )

    let clinicId: number | null = null

    if (userResult.rows.length > 0 && userResult.rows[0].current_clinic_id) {
      // Use the saved current_clinic_id
      clinicId = Number(userResult.rows[0].current_clinic_id)
      
      // Verify the user is still a member of this clinic
      const membershipCheck = await pool.query(
        `SELECT 1
         FROM public.clinic_user
         WHERE user_id = $1 AND clinic_id = $2 AND is_active = true`,
        [tokenRecord.user_id, clinicId]
      )

      if (membershipCheck.rows.length === 0) {
        // Current clinic is no longer valid, fall back to first active clinic
        clinicId = null
      }
    }

    // If no current_clinic_id or it's invalid, use the first active clinic
    if (!clinicId) {
      const clinicResult = await pool.query(
        `SELECT clinic_id
         FROM public.clinic_user
         WHERE user_id = $1 AND is_active = true
         ORDER BY clinic_id ASC
         LIMIT 1`,
        [tokenRecord.user_id]
      )

      if (clinicResult.rows.length === 0) {
        return res.status(403).json({ error: 'User has no active clinic memberships' })
      }

      clinicId = Number(clinicResult.rows[0].clinic_id)
      
      // Update current_clinic_id to the first active clinic
      await pool.query(
        `UPDATE public.app_user
         SET current_clinic_id = $1, updated_at = NOW()
         WHERE id = $2`,
        [clinicId, tokenRecord.user_id]
      )
    }

    // 5. Rotate: revoke old token
    await pool.query(
      `UPDATE public.auth_refresh_token
       SET revoked_at = NOW()
       WHERE id = $1`,
      [tokenRecord.id]
    )

    // 6. Create new refresh token
    const newRefreshToken = generateRefreshToken()
    const newRefreshTokenHash = hashRefreshToken(newRefreshToken)
    const newExpiresAt = new Date()
    newExpiresAt.setDate(newExpiresAt.getDate() + 7) // 7 days

    await pool.query(
      `INSERT INTO public.auth_refresh_token (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [tokenRecord.user_id, newRefreshTokenHash, newExpiresAt]
    )

    // 7. Issue new access token
    const accessToken = signAccessToken(tokenRecord.user_id, clinicId)

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request', details: error.errors })
    }
    console.error('Refresh error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
