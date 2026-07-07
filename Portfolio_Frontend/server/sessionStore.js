import crypto from 'node:crypto'
import { serverConfig } from './config.js'

const sessions = new Map()

export function createSession() {
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = Date.now() + serverConfig.sessionTtlMs
  sessions.set(token, { expiresAt })
  return { token, expiresAt }
}

export function getSession(token) {
  if (!token) return null
  const session = sessions.get(token)
  if (!session) return null
  if (session.expiresAt <= Date.now()) {
    sessions.delete(token)
    return null
  }
  return session
}

export function destroySession(token) {
  if (token) sessions.delete(token)
}
