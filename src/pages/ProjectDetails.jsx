import { Helmet } from 'react-helmet-async'
import { Link, Navigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiExternalLink, FiGithub } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { pageTransition } from '../animations/variants.js'
import Reveal from '../components/common/Reveal.jsx'
import ProjectCard from '../components/common/ProjectCard.jsx'
import { projects } from '../data/portfolio.js'

export default function ProjectDetails() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)
  if (!project) return <Navigate to="/404" replace />
  const related = projects.filter((item) => item.slug !== project.slug).slice(0, 3)

  return (
    <motion.div className="project-page section" variants={pageTransition} initial="initial" animate="animate" exit="exit">
      <Helmet>
        <title>{project.shortTitle} | Harsh Singh</title>
        <meta name="description" content={project.desc} />
      </Helmet>
      <div className="container">
        <Link to="/#projects" className="back-link"><FiArrowLeft /> Back to projects</Link>
        <div className="detail-hero">
          <Reveal>
            <span className="eyebrow">{project.category}</span>
            <h1>{project.title}</h1>
            <p>{project.desc}</p>
            <div className="project-actions detail-actions">
              <a href={project.live} target="_blank" rel="noreferrer"><FiExternalLink /> Live Demo</a>
              <a href={project.github} target="_blank" rel="noreferrer"><FiGithub /> GitHub</a>
            </div>
          </Reveal>
          <Reveal className="detail-preview">
            <img src={project.images[0]} alt={`${project.shortTitle} main screenshot`} />
          </Reveal>
        </div>
        <div className="detail-grid">
          {[
            ['Overview', project.desc],
            ['Problem', project.problem],
            ['Solution', project.solution],
            ['Challenges', project.challenges.join(', ')],
            ['Lessons Learned', project.lessons.join(', ')],
          ].map(([title, body]) => <Reveal as="article" className="detail-card" key={title}><h2>{title}</h2><p>{body}</p></Reveal>)}
        </div>
        <Reveal className="screenshot-grid">
          {project.images.map((image, index) => <img key={image} src={image} alt={`${project.shortTitle} screenshot ${index + 1}`} loading="lazy" />)}
        </Reveal>
        <Reveal className="tech-stack">
          <h2>Tech Stack</h2>
          <div className="tag-row">{project.tech.map((item) => <span key={item}>{item}</span>)}</div>
        </Reveal>
        <section className="related-section">
          <h2>Related Projects</h2>
          <div className="projects-grid">{related.map((item) => <ProjectCard key={item.slug} project={item} />)}</div>
        </section>
      </div>
    </motion.div>
  )
}
