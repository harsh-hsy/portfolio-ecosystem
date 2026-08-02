import { motion, useScroll, useSpring } from 'framer-motion'
import { useMediaQuery } from '../../hooks/useMediaQuery.js'

function ProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  return <motion.div className="scroll-progress" style={{ scaleX }} />
}

export default function ScrollProgress() {
  const disableProgress = useMediaQuery('(max-width: 640px), (prefers-reduced-motion: reduce)')
  return disableProgress ? null : <ProgressBar />
}
