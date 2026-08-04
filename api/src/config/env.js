import dotenv from 'dotenv'

dotenv.config()

function cleanValue(value, fallback) {
  if (!value) {
    return fallback
  }

  return value.trim().replace(/^['"]|['"]$/g, '')
}

function normalizeOrigin(value, fallback) {
  return cleanValue(value, fallback).replace(/\/$/, '')
}

const isRender = Boolean(process.env.RENDER)

export const env = {
  port: Number(process.env.PORT || 4174),
  nodeEnv: cleanValue(process.env.NODE_ENV, isRender ? 'production' : 'development'),
  clientOrigin: normalizeOrigin(process.env.CLIENT_ORIGIN, 'http://localhost:5173'),
  cmsOrigin: normalizeOrigin(process.env.CMS_ORIGIN, 'http://localhost:5174'),
  mongoUri: cleanValue(process.env.MONGODB_URI, 'mongodb://127.0.0.1:27017/portfolio_cms'),
  jwtSecret: cleanValue(process.env.JWT_SECRET, 'replace-this-with-a-long-random-secret'),
  jwtExpiresIn: cleanValue(process.env.JWT_EXPIRES_IN, '8h'),
  adminName: cleanValue(process.env.ADMIN_NAME, 'Harsh Admin'),
  adminEmail: cleanValue(process.env.ADMIN_EMAIL, 'admin@example.com'),
  adminPassword: cleanValue(process.env.ADMIN_PASSWORD, 'change-me'),
  cloudinaryCloudName: cleanValue(process.env.CLOUDINARY_CLOUD_NAME, ''),
  cloudinaryApiKey: cleanValue(process.env.CLOUDINARY_API_KEY, ''),
  cloudinaryApiSecret: cleanValue(process.env.CLOUDINARY_API_SECRET, ''),
  cloudinaryFolder: cleanValue(process.env.CLOUDINARY_FOLDER, 'portfolio-ecosystem'),
  renderFrontendDeployHookUrl: cleanValue(process.env.RENDER_FRONTEND_DEPLOY_HOOK_URL, ''),
}
