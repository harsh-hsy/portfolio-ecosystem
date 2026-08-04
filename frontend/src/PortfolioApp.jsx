import { useEffect, useRef, useState } from 'react'
import LandingIntro from './components/common/LandingIntro.jsx'
import { PortfolioContentProvider } from './context/PortfolioContentContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { usePortfolioContent } from './hooks/usePortfolioContent.js'
import { getSiteSettings } from './lib/contentSelectors.js'
import App from './App.jsx'

function PortfolioExperience() {
  const [introComplete, setIntroComplete] = useState(false)
  const introStartedAt = useRef(performance.now())
  const contentState = usePortfolioContent()
  const settings = getSiteSettings(contentState?.portfolio)
  const experience = settings.experience ?? {}
  const loadingEnabled = experience.loadingEnabled !== false
  const loadingDurationMs = Math.min(5000, Math.max(0, Number(experience.loadingDurationMs) || 0))

  useEffect(() => {
    if (!['ready', 'fallback'].includes(contentState?.status)) return undefined
    if (!loadingEnabled) {
      setIntroComplete(true)
      return undefined
    }

    const elapsed = performance.now() - introStartedAt.current
    const timer = window.setTimeout(
      () => setIntroComplete(true),
      Math.max(0, loadingDurationMs - elapsed),
    )
    return () => window.clearTimeout(timer)
  }, [contentState?.status, loadingDurationMs, loadingEnabled])

  const entranceReady = introComplete || !loadingEnabled

  return (
    <>
      <LandingIntro
        show={!entranceReady}
        mark={settings.loadingMark || settings.brandInitials || 'HS'}
        durationMs={loadingDurationMs}
      />
      <App entranceReady={entranceReady} />
    </>
  )
}

export default function PortfolioApp() {
  return (
    <ThemeProvider>
      <PortfolioContentProvider>
        <PortfolioExperience />
      </PortfolioContentProvider>
    </ThemeProvider>
  )
}
