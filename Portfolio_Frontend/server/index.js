import http from 'node:http'
import crypto from 'node:crypto'
import { serverConfig } from './config.js'
import { createSession, destroySession, getSession } from './sessionStore.js'
import { corsHeaders, expiredSessionCookie, parseCookies, readJson, sendJson, sessionCookie } from './http.js'

function credentialsMatch(username, password) {
  return safeEqual(username, serverConfig.adminUsername) && safeEqual(password, serverConfig.adminPassword)
}

function safeEqual(value = '', expected = '') {
  const valueBuffer = Buffer.from(String(value))
  const expectedBuffer = Buffer.from(String(expected))
  if (valueBuffer.length !== expectedBuffer.length) return false
  return crypto.timingSafeEqual(valueBuffer, expectedBuffer)
}

function getSessionToken(req) {
  const cookies = parseCookies(req.headers.cookie)
  return cookies[serverConfig.sessionCookieName]
}

function isAuthenticated(req) {
  return Boolean(getSession(getSessionToken(req)))
}

const server = http.createServer(async (req, res) => {
  const headers = corsHeaders(req)

  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers)
    res.end()
    return
  }

  try {
    if (req.method === 'GET' && req.url === '/api/health') {
      sendJson(res, 200, { ok: true }, headers)
      return
    }

    if (req.method === 'POST' && req.url === '/api/auth/login') {
      const body = await readJson(req)
      if (!credentialsMatch(body.username, body.password)) {
        sendJson(res, 401, { authenticated: false, message: 'Invalid credentials' }, headers)
        return
      }

      const session = createSession()
      sendJson(res, 200, { authenticated: true, expiresAt: session.expiresAt }, { ...headers, 'Set-Cookie': sessionCookie(session.token, session.expiresAt) })
      return
    }

    if (req.method === 'GET' && req.url === '/api/auth/session') {
      sendJson(res, 200, { authenticated: isAuthenticated(req) }, headers)
      return
    }

    if (req.method === 'POST' && req.url === '/api/auth/logout') {
      destroySession(getSessionToken(req))
      sendJson(res, 200, { authenticated: false }, { ...headers, 'Set-Cookie': expiredSessionCookie() })
      return
    }

    if (req.url?.startsWith('/api/admin')) {
      if (!isAuthenticated(req)) {
        sendJson(res, 401, { message: 'Unauthorized' }, headers)
        return
      }

      sendJson(res, 200, { ok: true, message: 'Admin API foundation ready' }, headers)
      return
    }

    sendJson(res, 404, { message: 'Not found' }, headers)
  } catch {
    sendJson(res, 400, { message: 'Bad request' }, headers)
  }
})

server.listen(serverConfig.port, () => {
  console.log(`Portfolio backend listening on http://localhost:${serverConfig.port}`)
})
