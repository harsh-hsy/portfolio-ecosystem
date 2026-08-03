import { AnimatePresence, motion } from 'framer-motion'
import './LandingIntro.css'

export default function LandingIntro({ show }) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="landing-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          role="status"
          aria-label="Loading portfolio"
        >
          <div className="landing-intro-mark" aria-hidden="true">HS</div>
          <div className="landing-intro-progress" aria-hidden="true">
            <span />
          </div>
          <span className="sr-only">Loading portfolio</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
