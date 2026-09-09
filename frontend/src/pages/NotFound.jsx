import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { pageTransition } from '../motion/variants.js'

export default function NotFound() {
  return (
    <motion.section
      className="not-found section"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="container">
        <h1>Page not found.</h1>
        <p>Looks like this page doesn't exist. Let's get you back to the portfolio.</p>
        <Link className="magnetic-button primary" to="/">
          Back Home
        </Link>
      </div>
    </motion.section>
  )
}
