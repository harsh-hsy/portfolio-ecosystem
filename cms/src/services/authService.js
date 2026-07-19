import { apiRequest } from './apiClient'

export function loginAdmin(credentials) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function getAdminSession() {
  return apiRequest('/api/auth/session')
}

export function logoutAdmin() {
  return apiRequest('/api/auth/logout', { method: 'POST' })
}
