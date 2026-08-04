import { useEffect, useMemo, useState } from 'react'
import { getPublishedPortfolio } from '../services/portfolioApi.js'
import { PortfolioContentContext } from './portfolio-content-context.js'

export function PortfolioContentProvider({ children }) {
  const [portfolio, setPortfolio] = useState(null)
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
    <PortfolioContentContext.Provider value={value}>
      {children}
    </PortfolioContentContext.Provider>
  )
}
