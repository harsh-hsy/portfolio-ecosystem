import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export function signAuthToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  )
}

export function verifyAuthToken(token) {
  return jwt.verify(token, env.jwtSecret)
}
