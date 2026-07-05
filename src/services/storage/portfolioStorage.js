import { STORAGE_KEYS } from './storageKeys'

export function loadPortfolio() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PORTFOLIO)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function savePortfolio(data) {
  localStorage.setItem(
    STORAGE_KEYS.PORTFOLIO,
    JSON.stringify(data)
  )
}

export function clearPortfolio() {
  localStorage.removeItem(STORAGE_KEYS.PORTFOLIO)
}