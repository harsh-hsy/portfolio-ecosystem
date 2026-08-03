import { motion } from 'framer-motion'
import { FiArrowUpRight, FiGithub } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { fadeUp } from '../../animations/variants.js'
import { getProjectCardContent } from '../../lib/contentSelectors.js'
import { usePortfolioContent } from '../../hooks/usePortfolioContent.js'
import { getCloudinaryImageUrl, getCloudinarySrcSet } from '../../lib/cloudinary.js'
import { useMediaQuery } from '../../hooks/useMediaQuery.js'

export default function ProjectCard({ project }) {
  const contentState = usePortfolioContent()
  const ui = getProjectCardContent(contentState?.portfolio)
  const simplifyMotion = useMediaQuery('(max-width: 640px), (pointer: coarse)')

  return (
    <motion.article
      className="project-card"
      variants={simplifyMotion ? undefined : fadeUp}
      whileHover={simplifyMotion ? undefined : { y: -8, rotateX: 1.5, rotateY: -1.5 }}
      transition={simplifyMotion ? undefined : { type: 'spring', stiffness: 220, damping: 22 }}
    >
      <Link to={`/projects/${project.slug}`} className="project-image" aria-label={`${ui.detailsAriaPrefix} ${project.shortTitle} ${ui.detailsAriaSuffix}, ${project.category}`}>
        <img
          src={getCloudinaryImageUrl(project.images[0], 800)}
          srcSet={getCloudinarySrcSet(project.images[0], [400, 640, 800])}
          sizes="(max-width: 760px) 92vw, 33vw"
          alt={`${project.shortTitle} ${ui.screenshotSuffix}`}
          width="800"
          height="450"
          loading="lazy"
          decoding="async"
        />
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
          {project.github ? (
            <a href={project.github} target="_blank" rel="noreferrer" aria-label={`${project.shortTitle} ${ui.githubLabel}`}>
              <FiGithub />
            </a>
          ) : null}
          {project.live ? (
            <a href={project.live} target="_blank" rel="noreferrer">{ui.liveDemoLabel}</a>
          ) : null}
        </div>
      </div>
    </motion.article>
  )
}
