import { useEffect, useState } from 'react'
import LandingIntro from './components/common/LandingIntro.jsx'
import { PortfolioContentProvider } from './context/PortfolioContentContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import App from './App.jsx'

export default function PortfolioApp() {
  const [introComplete, setIntroComplete] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroComplete(true), 2400)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <ThemeProvider>
      <LandingIntro show={!introComplete} />
      <PortfolioContentProvider>
        <App entranceReady={introComplete} />
      </PortfolioContentProvider>
    </ThemeProvider>
  )
}
