import { createContext, useEffect, useMemo, useState } from 'react'
import { getPublishedPortfolio } from '../services/portfolioApi.js'
import { getPortfolio, updatePortfolio } from '../services/storage/portfolioRepository.js'

export const PortfolioContentContext = createContext(null)

export function PortfolioContentProvider({ children }) {
  const [portfolio, setPortfolio] = useState(() => getPortfolio())
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
        updatePortfolio(response.content)
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
    <PortfolioContentContext.Provider value={value}>
      {children}
    </PortfolioContentContext.Provider>
  )
}
