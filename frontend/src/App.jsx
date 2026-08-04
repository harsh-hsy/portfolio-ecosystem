import { lazy, Suspense, useEffect, useRef } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import Lenis from 'lenis'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import ScrollProgress from './components/layout/ScrollProgress.jsx'
import CustomCursor from './components/layout/CustomCursor.jsx'
import CommandPalette from './components/common/CommandPalette.jsx'
import LoadingScreen from './components/common/LoadingScreen.jsx'
import MaintenancePage from './components/common/MaintenancePage.jsx'
import SiteMetadata from './components/common/SiteMetadata.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import { getSiteSettings } from './lib/contentSelectors.js'
import { usePortfolioContent } from './hooks/usePortfolioContent.js'
import { useMediaQuery } from './hooks/useMediaQuery.js'

const ProjectDetails = lazy(() => import('./pages/ProjectDetails.jsx'))
const ProjectsPage = lazy(() => import('./pages/Projects.jsx'))

function App({ entranceReady }) {
  const location = useLocation()
  const lenisRef = useRef(null)
  const contentState = usePortfolioContent()
  const settings = getSiteSettings(contentState?.portfolio)
  const experience = settings.experience ?? {}
  const maintenance = settings.maintenance ?? {}
  const isMobile = useMediaQuery('(max-width: 640px), (pointer: coarse)')
  const systemReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const animationsEnabled = isMobile
    ? experience.mobileAnimations === true
    : experience.desktopAnimations !== false
  const disableMotion = !animationsEnabled
    || (experience.respectReducedMotion !== false && systemReducedMotion)
  const showAnnouncement = maintenance.announcementEnabled && maintenance.announcementText

  useEffect(() => {
    const reducedMotionQuery = experience.respectReducedMotion !== false
      ? ', (prefers-reduced-motion: reduce)'
      : ''
    const useNativeScroll = experience.smoothScroll === false
      || window.matchMedia(`(max-width: 768px), (pointer: coarse)${reducedMotionQuery}`).matches
    if (useNativeScroll) return undefined

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true })
    lenisRef.current = lenis
    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [experience.respectReducedMotion, experience.smoothScroll])

  useEffect(() => {
    document.documentElement.classList.toggle('portfolio-native-scroll', experience.smoothScroll === false)
    return () => document.documentElement.classList.remove('portfolio-native-scroll')
  }, [experience.smoothScroll])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (location.hash) {
        const target = document.getElementById(decodeURIComponent(location.hash.slice(1)))
        if (target) {
          if (lenisRef.current) {
            lenisRef.current.scrollTo(target, { offset: -96, immediate: true })
          } else {
            window.scrollTo({
              top: target.getBoundingClientRect().top + window.scrollY - 96,
              left: 0,
              behavior: 'auto',
            })
          }
        }
        return
      }

      lenisRef.current?.scrollTo(0, { immediate: true })
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }, 0)

    return () => window.clearTimeout(timer)
  }, [location.hash, location.pathname])

  if (maintenance.enabled) {
    return (
      <>
        <SiteMetadata />
        <MaintenancePage settings={settings} />
      </>
    )
  }

  return (
    <MotionConfig reducedMotion={disableMotion ? 'always' : experience.respectReducedMotion !== false ? 'user' : 'never'}>
      <div className={`portfolio-app ${disableMotion ? 'portfolio-motion-disabled' : ''} ${showAnnouncement ? 'has-announcement' : ''}`.trim()}>
        <SiteMetadata />
        {showAnnouncement ? <aside className="announcement-banner" role="status">{maintenance.announcementText}</aside> : null}
        <ScrollProgress />
        <CustomCursor />
        <Navbar entranceReady={entranceReady} sticky={experience.stickyHeader !== false} />
        <CommandPalette />
        <main id="main-content">
          <AnimatePresence mode="wait">
            <Suspense fallback={<LoadingScreen show />}>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home entranceReady={entranceReady} />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:slug" element={<ProjectDetails />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  )
}

export default App
