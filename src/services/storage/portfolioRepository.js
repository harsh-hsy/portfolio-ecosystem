import { loadPortfolio, savePortfolio } from './portfolioStorage'
import { defaultPortfolio } from '../../content/defaultPortfolio'

export function getPortfolio() {
  return loadPortfolio() ?? defaultPortfolio
}

export function updatePortfolio(data) {
  savePortfolio(data)
}

export function resetPortfolio() {
  savePortfolio(defaultPortfolio)
}