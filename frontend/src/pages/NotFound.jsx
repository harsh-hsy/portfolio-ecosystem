import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { pageTransition } from '../motion/variants.js'
import { getNotFoundContent } from '../content/contentSelectors.js'
import { usePortfolioContent } from '../hooks/usePortfolioContent.js'

export default function NotFound() {
  const contentState = usePortfolioContent()
  const { section } = getNotFoundContent(contentState?.portfolio)

  return (
    <motion.section
      className="not-found section"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="container">
        <h1>{section.title}</h1>
        <p>{section.copy}</p>
        <Link className="magnetic-button primary" to="/">
          Back Home
        </Link>
      </div>
    </motion.section>
  )
}
