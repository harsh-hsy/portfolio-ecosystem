import { useContext } from 'react'
import { PortfolioContentContext } from '../context/portfolio-content-context.js'

export function usePortfolioContent() {
  return useContext(PortfolioContentContext)
}
