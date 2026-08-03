import { Router } from 'express'
import { env } from '../config/env.js'
import { requireAuth } from '../middleware/auth.js'
import { User } from '../models/User.js'
import { signAuthToken } from '../utils/tokens.js'

const router = Router()

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: env.nodeEnv === 'production' ? 'none' : 'strict',
    secure: env.nodeEnv === 'production',
    maxAge: 1000 * 60 * 60 * 8,
    path: '/',
  }
}

router.post('/login', async (req, res) => {
  const { email, username, password } = req.body
  const loginId = email || username

  if (!loginId || !password) {
    res.status(400).json({ message: 'Email and password are required' })
    return
  }

  const user = await User.findOne({ email: String(loginId).toLowerCase() })
  if (!user || user.status === 'disabled' || !(await user.verifyPassword(password))) {
    res.status(401).json({ message: 'Invalid credentials' })
    return
  }

  user.lastLoginAt = new Date()
  await user.save({ timestamps: false })

  const token = signAuthToken(user)
  res.cookie('admin_token', token, cookieOptions())
  res.json({ authenticated: true, user: { name: user.name, email: user.email, role: user.role } })
})

router.get('/session', requireAuth, (req, res) => {
  res.json({ authenticated: true, user: req.user })
})

router.post('/logout', (req, res) => {
  res.clearCookie('admin_token', cookieOptions())
  res.json({ authenticated: false })
})

export default router
