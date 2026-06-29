import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { FiArrowRight, FiCommand } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { profile, projects } from '../../data/portfolio.js'

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const actions = useMemo(
    () => [
      { label: 'View Projects', value: 'projects', run: () => navigate('/#projects') },
      { label: 'Download Resume', value: 'resume', run: () => window.open(profile.resume, '_blank') },
      { label: 'Open GitHub', value: 'github', run: () => window.open(profile.github, '_blank') },
      { label: 'Open LinkedIn', value: 'linkedin', run: () => window.open(profile.linkedin, '_blank') },
      { label: 'Send Email', value: 'email', run: () => { window.location.href = `mailto:${profile.email}` } },
      ...projects.map((project) => ({ label: `Project: ${project.shortTitle}`, value: project.shortTitle, run: () => navigate(`/projects/${project.slug}`) })),
    ],
    [navigate],
  )

  const filtered = actions.filter((action) => action.label.toLowerCase().includes(query.toLowerCase())).slice(0, 7)

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((value) => !value)
      }
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const runAction = (action) => {
    action.run()
    setOpen(false)
    setQuery('')
  }

  return (
    <>
      <button className="command-trigger" type="button" onClick={() => setOpen(true)} aria-label="Open command palette">
        <FiCommand /><span>Ctrl K</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="palette-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
            <motion.div className="palette" initial={{ y: 24, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 16, scale: 0.98 }} onClick={(event) => event.stopPropagation()}>
              <label htmlFor="command-search">Search portfolio</label>
              <input id="command-search" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Projects, resume, contact..." />
              <div className="palette-list">
                {filtered.map((action) => (
                  <button type="button" key={action.label} onClick={() => runAction(action)}>
                    {action.label}<FiArrowRight />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
