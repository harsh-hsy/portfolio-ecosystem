import { motion } from 'framer-motion'

export default function MagneticButton({ href, children, className = '', download, target, onClick, type = 'button' }) {
  const content = (
    <motion.span whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className={`magnetic-button ${className}`}>
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
