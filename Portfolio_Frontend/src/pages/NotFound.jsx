import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { pageTransition } from '../animations/variants.js'
import { getNotFoundContent } from '../lib/contentSelectors.js'

export default function NotFound() {
  const { seoTitle, section } = getNotFoundContent()

  return (
    <motion.section className="not-found section" variants={pageTransition} initial="initial" animate="animate" exit="exit">
      <Helmet><title>{seoTitle}</title></Helmet>
      <div className="container">
        <span className="eyebrow">{section.eyebrow}</span>
        <h1>{section.title}</h1>
        <p>{section.copy}</p>
        <Link className="magnetic-button primary" to="/">{section.action}</Link>
      </div>
    </motion.section>
  )
}
