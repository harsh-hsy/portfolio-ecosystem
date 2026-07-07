export const serverConfig = {
  port: Number(process.env.PORT || 4174),
  sessionCookieName: 'portfolio_admin_session',
  sessionTtlMs: 1000 * 60 * 60 * 8,
  adminUsername: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || 'change-me',
  allowedOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
}
