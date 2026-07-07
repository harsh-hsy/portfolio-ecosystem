import { useEffect, useMemo, useState } from 'react'
import { FiDownload, FiMenu, FiX } from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ThemeToggle from './ThemeToggle.jsx'
import { getNavigationContent, getProfileContent, getSiteSettings } from '../../lib/contentSelectors.js'
import { useScrollSpy } from '../../hooks/useScrollSpy.js'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const location = useLocation()
  const navigation = getNavigationContent()
  const profile = getProfileContent()
  const settings = getSiteSettings()
  const ids = useMemo(() => navigation.map((link) => link.id), [navigation])
  const active = useScrollSpy(ids)

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const current = window.scrollY
      setHidden(current > lastY && current > 180)
      lastY = current
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const hrefFor = (id) => (location.pathname === '/' ? `#${id}` : `/#${id}`)

  return (
    <motion.header className={`navbar ${hidden ? 'is-hidden' : ''}`} initial={{ y: -80 }} animate={{ y: 0 }}>
      <a className="skip-link" href="#main-content">{settings.nav.skipLabel}</a>
      <nav className="nav-shell" aria-label={settings.nav.ariaLabel}>
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span>{settings.brandInitials}</span>
          <strong>{profile.name}</strong>
        </Link>
        <div className={`nav-links ${open ? 'is-open' : ''}`}>
          {navigation.map((link) => (
            <a key={link.id} href={hrefFor(link.id)} className={active === link.id && location.pathname === '/' ? 'active' : ''} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <ThemeToggle />
          <a className="resume-link" href={profile.resume} target="_blank" rel="noreferrer">
            <FiDownload /> {settings.nav.resumeLabel}
          </a>
          <button className="icon-button menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-label={settings.nav.menuToggleLabel}>
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>
    </motion.header>
  )
}
