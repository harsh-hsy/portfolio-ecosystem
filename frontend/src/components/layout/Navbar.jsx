import { useMemo, useState } from 'react'
import { FiDownload, FiMenu, FiX } from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ThemeToggle from './ThemeToggle.jsx'
import { fadeDown } from '../../animations/variants.js'
import { getNavigationContent, getProfileContent, getSiteSettings } from '../../lib/contentSelectors.js'
import { useScrollSpy } from '../../hooks/useScrollSpy.js'
import { usePortfolioContent } from '../../hooks/usePortfolioContent.js'

export default function Navbar({ entranceReady }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const contentState = usePortfolioContent()
  const navigation = getNavigationContent(contentState?.portfolio)
  const profile = getProfileContent(contentState?.portfolio)
  const settings = getSiteSettings(contentState?.portfolio)
  const ids = useMemo(() => navigation.map((link) => link.id), [navigation])
  const active = useScrollSpy(ids)

  const hrefFor = (id) => (location.pathname === '/' ? `#${id}` : `/#${id}`)

  return (
    <header className="navbar">
      <a className="skip-link" href="#main-content">{settings.nav.skipLabel}</a>
      <motion.nav className="nav-shell" aria-label={settings.nav.ariaLabel} variants={fadeDown} initial="hidden" animate={entranceReady ? 'visible' : 'hidden'}>
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
      </motion.nav>
    </header>
  )
}
