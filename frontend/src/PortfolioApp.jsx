import { useCallback, useEffect, useState } from 'react'
import LandingIntro from './components/common/LandingIntro.jsx'
import { PortfolioContentProvider } from './context/PortfolioContentContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import App from './App.jsx'

export default function PortfolioApp() {
  const [minimumIntroComplete, setMinimumIntroComplete] = useState(false)
  const [contentReady, setContentReady] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setMinimumIntroComplete(true), 1200)
    return () => window.clearTimeout(timer)
  }, [])

  const handleContentReady = useCallback(() => setContentReady(true), [])
  const introVisible = !minimumIntroComplete || !contentReady

  return (
    <ThemeProvider>
      <LandingIntro show={introVisible} />
      <PortfolioContentProvider onReady={handleContentReady}>
        <App entranceReady={!introVisible} />
      </PortfolioContentProvider>
    </ThemeProvider>
  )
}
