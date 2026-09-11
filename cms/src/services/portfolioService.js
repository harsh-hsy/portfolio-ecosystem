import { apiRequest } from './apiClient'

export function getAdminPortfolio() {
  return apiRequest('/api/admin/portfolio')
}

export function updateAdminPortfolioModule(moduleName, content) {
  return apiRequest(`/api/admin/portfolio/module/${moduleName}`, {
    method: 'PUT',
    body: JSON.stringify(content),
  })
}

export function getAdminProjects() {
  return apiRequest('/api/admin/projects')
}

export function createAdminProject(name) {
  return apiRequest('/api/admin/projects', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
}

export function getAdminProject(slug) {
  return apiRequest(`/api/admin/projects/${encodeURIComponent(slug)}`)
}

export function updateAdminProject(slug, project) {
  return apiRequest(`/api/admin/projects/${encodeURIComponent(slug)}`, {
    method: 'PUT',
    body: JSON.stringify(project),
  })
}

export function deleteAdminProject(slug) {
  return apiRequest(`/api/admin/projects/${encodeURIComponent(slug)}`, {
    method: 'DELETE',
  })
}

export function getAdminCertificates() {
  return apiRequest('/api/admin/certificates')
}

export function createAdminCertificate(name) {
  return apiRequest('/api/admin/certificates', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
}

export function getAdminCertificate(slug) {
  return apiRequest(`/api/admin/certificates/${encodeURIComponent(slug)}`)
}

export function updateAdminCertificate(slug, certificate) {
  return apiRequest(`/api/admin/certificates/${encodeURIComponent(slug)}`, {
    method: 'PUT',
    body: JSON.stringify(certificate),
  })
}

export function deleteAdminCertificate(slug) {
  return apiRequest(`/api/admin/certificates/${encodeURIComponent(slug)}`, {
    method: 'DELETE',
  })
}
