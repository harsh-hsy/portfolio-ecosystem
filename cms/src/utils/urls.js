const defaultPortfolioUrl = 'http://localhost:5173'

export const portfolioUrl = String(import.meta.env.VITE_PORTFOLIO_URL || defaultPortfolioUrl)
  .trim()
  .replace(/\/+$/, '')

export function resolvePortfolioUrl(path = '') {
  const value = String(path ?? '').trim()
  if (!value) return portfolioUrl
  if (/^(?:https?:|data:|blob:)/i.test(value)) return value

  try {
    return new URL(value, `${portfolioUrl}/`).href
  } catch {
    return value
  }
}

export function resolveMediaUrl(source) {
  const value = String(source ?? '').trim()
  return value ? resolvePortfolioUrl(value) : ''
}
