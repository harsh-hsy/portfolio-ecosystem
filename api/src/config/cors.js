import { env } from './env.js'

export const allowedOrigins = [env.clientOrigin, env.cmsOrigin]

export const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }

    callback(new Error('Origin not allowed by CORS'))
  },
  credentials: true,
}
