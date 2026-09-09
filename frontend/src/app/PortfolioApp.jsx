import { useEffect, useRef, useState } from 'react'
import LandingIntro from '../components/common/LandingIntro.jsx'
import { PortfolioContentProvider } from '../state/PortfolioContentProvider.jsx'
import { ThemeProvider } from '../state/ThemeProvider.jsx'
import { usePortfolioContent } from '../hooks/usePortfolioContent.js'
import { getSiteSettings } from '../content/contentSelectors.js'
import { experienceSettings } from '../config/experience.js'
import App from './App.jsx'

function PortfolioExperience() {
  const [introComplete, setIntroComplete] = useState(false)
  const introStartedAt = useRef(performance.now())
  const contentState = usePortfolioContent()
  const settings = getSiteSettings(contentState?.portfolio)
  const loadingEnabled = experienceSettings.loadingEnabled
  const loadingDurationMs = experienceSettings.loadingDurationMs

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
