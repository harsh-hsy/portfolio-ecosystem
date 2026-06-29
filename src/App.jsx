import { lazy, Suspense, useEffect, useState } from 'react'
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

function App() {
  const location = useLocation()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 900)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true })
    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return (
    <>
      <LoadingScreen show={loading} />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <CommandPalette />
      <main id="main-content">
        <AnimatePresence mode="wait">
          <Suspense fallback={<LoadingScreen show />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
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
