import { AnimatePresence, motion } from 'framer-motion'
import './LandingIntro.css'

export default function LandingIntro({ show, mark = 'HS', durationMs = 2400 }) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="landing-intro"
          style={{ '--landing-duration': `${Math.max(100, durationMs)}ms` }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          role="status"
          aria-label="Loading portfolio"
        >
          <div className="landing-intro-mark" aria-hidden="true">{mark}</div>
          <div className="landing-intro-progress" aria-hidden="true">
            <span />
          </div>
          <span className="sr-only">Loading portfolio</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
