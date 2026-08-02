import { lazy, Suspense, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import ScrollProgress from './components/layout/ScrollProgress.jsx'
import CustomCursor from './components/layout/CustomCursor.jsx'
import CommandPalette from './components/common/CommandPalette.jsx'
import LoadingScreen from './components/common/LoadingScreen.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'

const ProjectDetails = lazy(() => import('./pages/ProjectDetails.jsx'))
const ProjectsPage = lazy(() => import('./pages/Projects.jsx'))

function App({ entranceReady }) {
  const location = useLocation()
  const lenisRef = useRef(null)

  useEffect(() => {
    const useNativeScroll = window.matchMedia('(max-width: 768px), (pointer: coarse), (prefers-reduced-motion: reduce)').matches
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
  }, [])

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

  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      <Navbar entranceReady={entranceReady} />
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
    </>
  )
}

export default App
