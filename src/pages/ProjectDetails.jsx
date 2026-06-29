import { Helmet } from 'react-helmet-async'
import { Link, Navigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiExternalLink, FiGithub } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { pageTransition } from '../animations/variants.js'
import Reveal from '../components/common/Reveal.jsx'
import ProjectCard from '../components/common/ProjectCard.jsx'
import { getProjectDetailsContent } from '../lib/contentSelectors.js'
import { getProjectBySlug, getRelatedProjects } from '../lib/projects.js'

export default function ProjectDetails() {
  const { slug } = useParams()
  const selectedProject = getProjectBySlug(slug)
  if (!selectedProject) return <Navigate to="/404" replace />
  const { project, seo, ui } = getProjectDetailsContent(selectedProject)
  const related = getRelatedProjects(project.slug)

  return (
    <motion.div className="project-page section" variants={pageTransition} initial="initial" animate="animate" exit="exit">
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>
      <div className="container">
        <Link to="/#projects" className="back-link"><FiArrowLeft /> {ui.backLabel}</Link>
        <div className="detail-hero">
          <Reveal>
            <span className="eyebrow">{project.category}</span>
            <h1>{project.title}</h1>
            <p>{project.desc}</p>
            <div className="project-actions detail-actions">
              <a href={project.live} target="_blank" rel="noreferrer"><FiExternalLink /> {ui.liveDemoLabel}</a>
              <a href={project.github} target="_blank" rel="noreferrer"><FiGithub /> {ui.githubLabel}</a>
            </div>
          </Reveal>
          <Reveal className="detail-preview">
            <img src={project.images[0]} alt={`${project.shortTitle} ${ui.mainScreenshotSuffix}`} />
          </Reveal>
        </div>
        <div className="detail-grid">
          {ui.detailCards.map((card) => {
            const body = card.type === 'list' ? project[card.field].join(ui.listSeparator) : project[card.field]
            return <Reveal as="article" className="detail-card" key={card.label}><h2>{card.label}</h2><p>{body}</p></Reveal>
          })}
        </div>
        <Reveal className="screenshot-grid">
          {project.images.map((image, index) => <img key={image} src={image} alt={`${project.shortTitle} ${ui.screenshotLabel} ${index + 1}`} loading="lazy" />)}
        </Reveal>
        <Reveal className="tech-stack">
          <h2>{ui.techStackTitle}</h2>
          <div className="tag-row">{project.tech.map((item) => <span key={item}>{item}</span>)}</div>
        </Reveal>
        <section className="related-section">
          <h2>{ui.relatedProjectsTitle}</h2>
          <div className="projects-grid">{related.map((item) => <ProjectCard key={item.slug} project={item} />)}</div>
        </section>
      </div>
    </motion.div>
  )
}
