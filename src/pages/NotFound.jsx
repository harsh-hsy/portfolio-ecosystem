import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { pageTransition } from '../animations/variants.js'

export default function NotFound() {
  return (
    <motion.section className="not-found section" variants={pageTransition} initial="initial" animate="animate" exit="exit">
      <Helmet><title>Page Not Found | Harsh Singh</title></Helmet>
      <div className="container">
        <span className="eyebrow">404</span>
        <h1>Page not found.</h1>
        <p>This route does not exist, but the portfolio is one click away.</p>
        <Link className="magnetic-button primary" to="/">Back Home</Link>
      </div>
    </motion.section>
  )
}
