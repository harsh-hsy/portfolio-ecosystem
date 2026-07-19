import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp } from '../../animations/variants.js'

export default function Reveal({ children, className = '', variants = fadeUp, delay = 0, as = 'div' }) {
  const prefersReducedMotion = useReducedMotion()
  const Component = motion[as]

  return (
    <Component
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      transition={{ delay }}
      {...(prefersReducedMotion ? { initial: false, whileInView: false } : {})}
    >
      {children}
    </Component>
  )
}
