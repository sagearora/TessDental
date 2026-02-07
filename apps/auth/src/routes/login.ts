import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { getPool } from '../db.js'
import { signAccessToken, generateRefreshToken, hashRefreshToken } from '../jwt.js'
import { z } from 'zod'

const router: Router = Router()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  clinicId: z.number().optional(),
})

interface LoginRequest {
  email: string
  password: string
  clinicId?: number
}

interface LoginResponse {
  accessToken: string
  refreshToken: string
  clinicId: number
  user: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
  }
}

router.post('/', async (req: Request, res: Response) => {
  try {
    const body = loginSchema.parse(req.body)
    const { email, password, clinicId } = body as LoginRequest

    const pool = getPool()

    // 1. Find user by email
    const userResult = await pool.query(
      `SELECT id, email, password_hash, first_name, last_name, is_active
       FROM public.app_user
       WHERE email = $1`,
      [email.toLowerCase().trim()]
    )

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const user = userResult.rows[0]

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is inactive' })
    }

    // 2. Verify password
    const passwordValid = await bcrypt.compare(password, user.password_hash)
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // 3. Fetch user's clinic memberships
    const clinicsResult = await pool.query(
      `SELECT clinic_id
       FROM public.clinic_user
       WHERE user_id = $1 AND is_active = true
       ORDER BY clinic_id ASC`,
      [user.id]
    )

    const clinicIds = clinicsResult.rows.map((row) => Number(row.clinic_id))

    if (clinicIds.length === 0) {
      return res.status(403).json({ error: 'User has no active clinic memberships' })
    }

    // 4. Handle clinic selection
    let selectedClinicId: number

    if (clinicIds.length === 1) {
      selectedClinicId = clinicIds[0]
    } else {
      // Multiple clinics
      if (clinicId) {
        if (!clinicIds.includes(clinicId)) {
          return res.status(403).json({ error: 'User is not a member of the specified clinic' })
        }
        selectedClinicId = clinicId
      } else {
        // Return clinic list for client to choose
        return res.status(200).json({
          requiresClinicSelection: true,
          clinics: clinicIds,
        })
      }
    }

    // 5. Update current_clinic_id for the user
    await pool.query(
      `UPDATE public.app_user
       SET current_clinic_id = $1, updated_at = NOW()
       WHERE id = $2`,
      [selectedClinicId, user.id]
    )

    // 6. Issue access token
    const accessToken = signAccessToken(user.id, selectedClinicId)

    // 7. Create refresh token
    const refreshToken = generateRefreshToken()
    const refreshTokenHash = hashRefreshToken(refreshToken)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

    await pool.query(
      `INSERT INTO public.auth_refresh_token (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, refreshTokenHash, expiresAt]
    )

    const response: LoginResponse = {
      accessToken,
      refreshToken,
      clinicId: selectedClinicId,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    }

    res.json(response)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request', details: error.errors })
    }
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
