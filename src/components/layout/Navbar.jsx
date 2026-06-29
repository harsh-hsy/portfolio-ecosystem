import { useEffect, useMemo, useState } from 'react'
import { FiDownload, FiMenu, FiX } from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ThemeToggle from './ThemeToggle.jsx'
import { profile } from '../../data/portfolio.js'
import { useScrollSpy } from '../../hooks/useScrollSpy.js'

const links = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const location = useLocation()
  const ids = useMemo(() => links.map((link) => link.id), [])
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
      <a className="skip-link" href="#main-content">Skip to content</a>
      <nav className="nav-shell" aria-label="Primary navigation">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span>HS</span>
          <strong>Harsh Singh</strong>
        </Link>
        <div className={`nav-links ${open ? 'is-open' : ''}`}>
          {links.map((link) => (
            <a key={link.id} href={hrefFor(link.id)} className={active === link.id && location.pathname === '/' ? 'active' : ''} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <ThemeToggle />
          <a className="resume-link" href={profile.resume} target="_blank" rel="noreferrer">
            <FiDownload /> Resume
          </a>
          <button className="icon-button menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>
    </motion.header>
  )
}
