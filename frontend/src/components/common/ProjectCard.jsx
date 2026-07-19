import { motion } from 'framer-motion'
import { FiArrowUpRight, FiGithub } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { fadeUp } from '../../animations/variants.js'
import { getProjectCardContent } from '../../lib/contentSelectors.js'
import { usePortfolioContent } from '../../hooks/usePortfolioContent.js'

export default function ProjectCard({ project }) {
  const contentState = usePortfolioContent()
  const ui = getProjectCardContent(contentState?.portfolio)

  return (
    <motion.article
      className="project-card"
      variants={fadeUp}
      whileHover={{ y: -8, rotateX: 1.5, rotateY: -1.5 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
    >
      <Link to={`/projects/${project.slug}`} className="project-image" aria-label={`${ui.detailsAriaPrefix} ${project.shortTitle} ${ui.detailsAriaSuffix}`}>
        <img src={project.images[0]} alt={`${project.shortTitle} ${ui.screenshotSuffix}`} loading="lazy" />
        <span>{project.category}</span>
      </Link>
      <div className="project-body">
        <div>
          <p className="project-kicker">{project.tech.slice(0, 3).join(ui.techSeparator)}</p>
          <h3>{project.shortTitle}</h3>
          <p>{project.desc}</p>
        </div>
        <div className="tag-row">
          {project.tech.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="project-actions">
          <Link to={`/projects/${project.slug}`}>{ui.caseStudyLabel} <FiArrowUpRight /></Link>
          <a href={project.github} target="_blank" rel="noreferrer" aria-label={`${project.shortTitle} ${ui.githubLabel}`}>
            <FiGithub />
          </a>
          <a href={project.live} target="_blank" rel="noreferrer">{ui.liveDemoLabel}</a>
        </div>
      </div>
    </motion.article>
  )
}
