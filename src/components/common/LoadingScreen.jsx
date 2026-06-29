import { AnimatePresence, motion } from 'framer-motion'
import { getSiteSettings } from '../../lib/contentSelectors.js'

export default function LoadingScreen({ show }) {
  const settings = getSiteSettings()

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="loading-screen" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.45 } }}>
          <motion.div className="loading-mark" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.3, ease: 'linear' }}>
            {settings.loadingMark}
          </motion.div>
          <div className="loading-bar"><motion.span initial={{ width: '10%' }} animate={{ width: '100%' }} transition={{ duration: 0.8 }} /></div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
