import { useEffect, useMemo, useState } from 'react'
import { getPublishedPortfolio } from '../services/portfolioApi.js'
import { PortfolioContentContext } from './portfolio-content-context.js'
import { getCloudinaryImageUrl, getCloudinarySrcSet } from '../lib/cloudinary.js'

export function PortfolioContentProvider({ children, onReady }) {
  const [portfolio, setPortfolio] = useState(null)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    let active = true
    let heroImage
    let readinessTimeout
    let readySignalled = false

    const signalReady = () => {
      if (!active || readySignalled) return
      readySignalled = true
      window.clearTimeout(readinessTimeout)
      onReady?.()
    }

    const preloadHeroImage = (source) => {
      if (!source) {
        signalReady()
        return
      }

      heroImage = new Image()
      const sourceSet = getCloudinarySrcSet(source, [320, 480, 640, 800])
      if (sourceSet) {
        heroImage.srcset = sourceSet
        heroImage.sizes = '(max-width: 640px) 92vw, (max-width: 980px) 340px, 420px'
      }

      heroImage.onload = () => {
        if (typeof heroImage.decode === 'function') {
          heroImage.decode().then(signalReady).catch(signalReady)
          return
        }
        signalReady()
      }
      heroImage.onerror = signalReady
      heroImage.src = getCloudinaryImageUrl(source, 800)

      readinessTimeout = window.setTimeout(signalReady, 8000)
    }

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
        preloadHeroImage(response.content.profile?.image)
      })
      .catch(() => {
        if (active) setStatus('fallback')
      })

    return () => {
      active = false
      window.clearTimeout(readinessTimeout)
      if (heroImage) {
        heroImage.onload = null
        heroImage.onerror = null
      }
    }
  }, [onReady])

  const value = useMemo(
    () => ({
      portfolio,
      status,
    }),
    [portfolio, status],
  )

  if (!portfolio) return null

  return (
    <PortfolioContentContext.Provider value={value}>
      {children}
    </PortfolioContentContext.Provider>
  )
}
