import { apiRequest } from './apiClient'

export function getMediaConfig() {
  return apiRequest('/api/admin/media/config')
}

export function getMediaUploadSignature(paramsToSign) {
  return apiRequest('/api/admin/media/signature', {
    method: 'POST',
    body: JSON.stringify({ paramsToSign }),
  })
}

export function registerMediaAsset(asset) {
  return apiRequest('/api/admin/media', {
    method: 'POST',
    body: JSON.stringify(asset),
  })
}

export function deleteMediaAsset(id) {
  return apiRequest(`/api/admin/media/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}
