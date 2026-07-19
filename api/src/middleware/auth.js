import { User } from '../models/User.js'
import { verifyAuthToken } from '../utils/tokens.js'

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.admin_token
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const payload = verifyAuthToken(token)
    const user = await User.findById(payload.sub).select('-passwordHash')
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'Unauthorized' })
  }
}
