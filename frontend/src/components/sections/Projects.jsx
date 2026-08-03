import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowUpRight, FiSearch } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import SectionHeader from '../common/SectionHeader.jsx'
import ProjectCard from '../common/ProjectCard.jsx'
import { getProjectsContent } from '../../lib/contentSelectors.js'
import { stagger } from '../../animations/variants.js'
import { usePortfolioContent } from '../../hooks/usePortfolioContent.js'
import { useMediaQuery } from '../../hooks/useMediaQuery.js'

export default function Projects() {
  const contentState = usePortfolioContent()
  const { section, featuredProjects: projects } = getProjectsContent(contentState?.portfolio)
  const allLabel = 'All'
  const [category, setCategory] = useState(allLabel)
  const [query, setQuery] = useState('')
  const simplifyMotion = useMediaQuery('(max-width: 640px), (pointer: coarse)')
  const categories = [allLabel, ...new Set(projects.map((project) => project.category))]
  const filtered = useMemo(
    () => projects.filter((project) => (category === allLabel || project.category === category) && project.title.toLowerCase().includes(query.toLowerCase())),
    [category, projects, query],
  )

  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <SectionHeader eyebrow="Projects" title={section.title} copy={section.copy} />
        <div className="project-toolbar">
          <div className="filter-tabs" role="group" aria-label="Filter projects">
            {categories.map((item) => <button type="button" className={category === item ? 'active' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
          <label className="search-field" htmlFor="home-project-search">
  <FiSearch aria-hidden="true" />

  <span className="sr-only">Search projects</span>

  <input
    id="home-project-search"
    name="homeProjectSearch"
    type="search"
    autoComplete="off"
    value={query}
    onChange={(event) => setQuery(event.target.value)}
    placeholder="Search projects"
  />
</label>
        </div>
        <motion.div
  className="projects-grid"
  variants={simplifyMotion ? undefined : stagger}
  initial={simplifyMotion ? false : 'hidden'}
  animate={simplifyMotion ? undefined : 'visible'}
>
          {filtered.map((project) => <ProjectCard key={project.slug} project={project} />)}
        </motion.div>
        <div className="projects-more">
          <Link to="/projects" className="magnetic-button secondary">
            View All Projects <FiArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
