import { useEffect, useMemo, useState } from 'react'
import { portfolioFallback } from '../content/portfolioFallback.js'
import { getPublishedPortfolio } from '../services/portfolioApi.js'
import { PortfolioContentContext } from './PortfolioContentContext.js'

export function PortfolioContentProvider({ children }) {
  // Start with the repository snapshot so the portfolio stays usable while the API is unavailable.
  const [portfolio, setPortfolio] = useState(portfolioFallback)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    let active = true

    setStatus('loading')
    getPublishedPortfolio()
      .then((response) => {
        if (!active) return
        if (!response.content) {
          setStatus('fallback')
          return
        }
        setPortfolio(response.content)
        setStatus('ready')
      })
      .catch(() => {
        if (active) setStatus('fallback')
      })

    return () => {
      active = false
    }
  }, [])

  const value = useMemo(
    () => ({
      portfolio,
      status,
    }),
    [portfolio, status],
  )

  return (
    <PortfolioContentContext.Provider value={value}>{children}</PortfolioContentContext.Provider>
  )
}
