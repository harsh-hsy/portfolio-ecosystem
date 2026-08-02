import { motion } from 'framer-motion'
import { useMousePosition } from '../../hooks/useMousePosition.js'
import { useMediaQuery } from '../../hooks/useMediaQuery.js'

function CursorVisual() {
  const { x, y } = useMousePosition()
  return (
    <div className="cursor-wrap" aria-hidden="true">
      <motion.span className="cursor-ring" animate={{ x: x - 18, y: y - 18 }} transition={{ type: 'spring', stiffness: 260, damping: 30 }} />
      <motion.span className="cursor-dot" animate={{ x: x - 4, y: y - 4 }} transition={{ type: 'spring', stiffness: 500, damping: 32 }} />
    </div>
  )
}

export default function CustomCursor() {
  const disableCursor = useMediaQuery('(max-width: 640px), (pointer: coarse), (prefers-reduced-motion: reduce)')
  return disableCursor ? null : <CursorVisual />
}
