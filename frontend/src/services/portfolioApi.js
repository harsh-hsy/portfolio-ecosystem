import { apiRequest } from './apiClient'

export function getPublishedPortfolio() {
  return apiRequest('/api/portfolio', { cache: 'no-store' })
}
