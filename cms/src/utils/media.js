const portfolioUrl = import.meta.env.VITE_PORTFOLIO_URL || 'http://localhost:5173'

export function resolveMediaUrl(source) {
  const value = String(source ?? '').trim()
  if (!value) return ''
  if (/^(https?:|data:|blob:)/i.test(value)) return value

  try {
    return new URL(value, `${portfolioUrl.replace(/\/$/, '')}/`).href
  } catch {
    return value
  }
}
