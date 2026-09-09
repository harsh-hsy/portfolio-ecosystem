import { useContext } from 'react'
import { PortfolioContentContext } from '../state/PortfolioContentContext.js'

export function usePortfolioContent() {
  return useContext(PortfolioContentContext)
}
