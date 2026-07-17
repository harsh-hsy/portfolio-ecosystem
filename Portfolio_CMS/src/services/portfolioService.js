import { apiRequest } from './apiClient'

export function getAdminPortfolio() {
  return apiRequest('/api/admin/portfolio')
}
