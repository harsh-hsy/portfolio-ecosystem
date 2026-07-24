import { env } from './env.js'

function normalizeOrigin(value) {
  return String(value || '').trim().replace(/^['"]|['"]$/g, '').replace(/\/$/, '')
}

const normalizedAllowedOrigins = [env.clientOrigin, env.cmsOrigin].map(normalizeOrigin)

export const allowedOrigins = normalizedAllowedOrigins

export const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true)
      return
    }

    const normalizedOrigin = normalizeOrigin(origin)
    if (normalizedAllowedOrigins.includes(normalizedOrigin)) {
      callback(null, true)
      return
    }

    callback(new Error('Origin not allowed by CORS'))
  },
  credentials: true,
}
