import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp } from '../../animations/variants.js'
import { useMediaQuery } from '../../hooks/useMediaQuery.js'

export default function Reveal({ children, className = '', variants = fadeUp, delay = 0, as = 'div', disableMotion = false }) {
  const prefersReducedMotion = useReducedMotion()
  const simplifyMotion = useMediaQuery('(max-width: 640px), (pointer: coarse)')
  const Component = motion[as]

  return (
    <Component
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      transition={{ delay }}
      {...(prefersReducedMotion || simplifyMotion || disableMotion ? { initial: false, whileInView: false } : {})}
    >
      {children}
    </Component>
  )
}
