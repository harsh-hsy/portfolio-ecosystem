import dotenv from 'dotenv'

dotenv.config()

export const env = {
  port: Number(process.env.PORT || 4174),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  cmsOrigin: process.env.CMS_ORIGIN || 'http://localhost:5174',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio_cms',
  jwtSecret: process.env.JWT_SECRET || 'replace-this-with-a-long-random-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  adminName: process.env.ADMIN_NAME || 'Harsh Admin',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'change-me',
}
