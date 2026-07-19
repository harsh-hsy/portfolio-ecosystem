import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { FiArrowRight, FiCommand } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { getCommandPaletteContent } from '../../lib/contentSelectors.js'
import { usePortfolioContent } from '../../hooks/usePortfolioContent.js'

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const contentState = usePortfolioContent()
  const { actions: configuredActions, profile, projects, ui } = getCommandPaletteContent(contentState?.portfolio)

  const actions = useMemo(
    () => [
      ...configuredActions.map((action) => ({
        ...action,
        run: () => {
          if (action.type === 'route') navigate(action.target)
          if (action.type === 'externalProfile') window.open(profile[action.target], '_blank')
          if (action.type === 'email') window.location.href = `mailto:${profile.email}`
        },
      })),
      ...projects.map((project) => ({ label: `${ui.projectPrefix} ${project.shortTitle}`, value: project.shortTitle, run: () => navigate(`/projects/${project.slug}`) })),
    ],
    [configuredActions, navigate, profile, projects, ui.projectPrefix],
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
      <button className="command-trigger" type="button" onClick={() => setOpen(true)} aria-label={ui.triggerLabel}>
        <FiCommand /><span>{ui.shortcutLabel}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="palette-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
            <motion.div className="palette" initial={{ y: 24, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 16, scale: 0.98 }} onClick={(event) => event.stopPropagation()}>
              <label htmlFor="command-search">{ui.searchLabel}</label>
              <input id="command-search" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={ui.searchPlaceholder} />
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
