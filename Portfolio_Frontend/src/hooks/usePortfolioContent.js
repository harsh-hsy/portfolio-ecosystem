import { useContext } from 'react'
import { PortfolioContentContext } from '../context/PortfolioContentContext.jsx'

export function usePortfolioContent() {
  return useContext(PortfolioContentContext)
}
