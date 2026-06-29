import { motion } from 'framer-motion'
import { FiArrowUpRight, FiGithub } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { fadeUp } from '../../animations/variants.js'

export default function ProjectCard({ project }) {
  return (
    <motion.article
      className="project-card"
      variants={fadeUp}
      whileHover={{ y: -8, rotateX: 1.5, rotateY: -1.5 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
    >
      <Link to={`/projects/${project.slug}`} className="project-image" aria-label={`Open ${project.shortTitle} details`}>
        <img src={project.images[0]} alt={`${project.shortTitle} screenshot`} loading="lazy" />
        <span>{project.category}</span>
      </Link>
      <div className="project-body">
        <div>
          <p className="project-kicker">{project.tech.slice(0, 3).join(' / ')}</p>
          <h3>{project.shortTitle}</h3>
          <p>{project.desc}</p>
        </div>
        <div className="tag-row">
          {project.tech.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="project-actions">
          <Link to={`/projects/${project.slug}`}>Case Study <FiArrowUpRight /></Link>
          <a href={project.github} target="_blank" rel="noreferrer" aria-label={`${project.shortTitle} GitHub`}>
            <FiGithub />
          </a>
          <a href={project.live} target="_blank" rel="noreferrer">Live Demo</a>
        </div>
      </div>
    </motion.article>
  )
}
