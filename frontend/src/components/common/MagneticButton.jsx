import { motion } from 'framer-motion'
import { useMediaQuery } from '../../hooks/useMediaQuery.js'

export default function MagneticButton({ href, children, className = '', download, target, onClick, type = 'button' }) {
  const simplifyMotion = useMediaQuery('(max-width: 640px), (pointer: coarse)')
  const content = (
    <motion.span
      whileHover={simplifyMotion ? undefined : { y: -2 }}
      whileTap={simplifyMotion ? undefined : { scale: 0.97 }}
      className={`magnetic-button ${className}`}
    >
      {children}
    </motion.span>
  )

  if (href) {
    return (
      <a href={href} download={download} target={target} rel={target ? 'noreferrer' : undefined}>
        {content}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} className="button-reset">
      {content}
    </button>
  )
}
