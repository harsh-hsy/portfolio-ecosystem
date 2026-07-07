import { serverConfig } from './config.js'

export function sendJson(res, statusCode, payload, headers = {}) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    ...headers,
  })
  res.end(JSON.stringify(payload))
}

export function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
      if (body.length > 1_000_000) {
        req.destroy()
        reject(new Error('Payload too large'))
      }
    })
    req.on('end', () => {
      if (!body) {
        resolve({})
        return
      }

      try {
        resolve(JSON.parse(body))
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

export function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').reduce((cookies, item) => {
    const [rawKey, ...rawValue] = item.trim().split('=')
    if (!rawKey) return cookies
    return { ...cookies, [rawKey]: decodeURIComponent(rawValue.join('=')) }
  }, {})
}

export function sessionCookie(token, expiresAt) {
  return [
    `${serverConfig.sessionCookieName}=${encodeURIComponent(token)}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Strict',
    `Expires=${new Date(expiresAt).toUTCString()}`,
  ].join('; ')
}

export function expiredSessionCookie() {
  return [
    `${serverConfig.sessionCookieName}=`,
    'HttpOnly',
    'Path=/',
    'SameSite=Strict',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
  ].join('; ')
}

export function corsHeaders(req) {
  const origin = req.headers.origin
  if (origin !== serverConfig.allowedOrigin) return {}

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  }
}
