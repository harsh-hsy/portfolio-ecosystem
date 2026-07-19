import { apiRequest } from './apiClient'

export function getAdminPortfolio() {
  return apiRequest('/api/admin/portfolio')
}

export function initializeAdminPortfolio() {
  return apiRequest('/api/admin/portfolio/initialize', { method: 'POST' })
}

export function replaceAdminPortfolio(content) {
  return apiRequest('/api/admin/portfolio', {
    method: 'PUT',
    body: JSON.stringify(content),
  })
}

export function updateAdminPortfolioModule(moduleName, content) {
  return apiRequest(`/api/admin/portfolio/module/${moduleName}`, {
    method: 'PUT',
    body: JSON.stringify(content),
  })
}

export function updateAdminPortfolioField(field, value) {
  return apiRequest(`/api/admin/portfolio/${field}`, {
    method: 'PUT',
    body: JSON.stringify({ value }),
  })
}

export function resetAdminPortfolio() {
  return apiRequest('/api/admin/portfolio/reset', { method: 'POST' })
}

export function getEditablePortfolioFields() {
  return apiRequest('/api/admin/portfolio-fields')
}
