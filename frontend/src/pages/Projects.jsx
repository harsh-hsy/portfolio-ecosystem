import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { FiSearch } from 'react-icons/fi'

import { pageTransition, stagger } from '../animations/variants.js'
import ProjectCard from '../components/common/ProjectCard.jsx'
import SectionHeader from '../components/common/SectionHeader.jsx'
import { usePortfolioContent } from '../hooks/usePortfolioContent.js'
import { getProfileContent, getProjectsContent } from '../lib/contentSelectors.js'
import { useMediaQuery } from '../hooks/useMediaQuery.js'

export default function ProjectsPage() {
  const contentState = usePortfolioContent()
  const { section, projects } = getProjectsContent(contentState?.portfolio)
  const profile = getProfileContent(contentState?.portfolio)
  const allLabel = 'All'
  const [category, setCategory] = useState(allLabel)
  const [query, setQuery] = useState('')
  const simplifyMotion = useMediaQuery('(max-width: 640px), (pointer: coarse)')
  const categories = [allLabel, ...new Set(projects.map((project) => project.category))]
  const filtered = useMemo(
    () => projects.filter((project) => {
      const matchesCategory = category === allLabel || project.category === category
      const searchValue = `${project.title} ${project.shortTitle} ${project.tech.join(' ')}`.toLowerCase()
      return matchesCategory && searchValue.includes(query.trim().toLowerCase())
    }),
    [allLabel, category, projects, query],
  )

  return (
    <motion.div
      className="section projects-page"
      variants={simplifyMotion ? undefined : pageTransition}
      initial={simplifyMotion ? false : 'initial'}
      animate={simplifyMotion ? undefined : 'animate'}
      exit={simplifyMotion ? undefined : 'exit'}
    >
      <Helmet>
        <title>{`Projects | ${profile.fullName || profile.name}`}</title>
        <meta name="description" content={section.copy} />
      </Helmet>

      <div className="container">
        <SectionHeader
          eyebrow="Projects"
          title={section.title}
          copy={section.copy}
          headingAs="h1"
        />
        <div className="project-toolbar">
          <div className="filter-tabs" role="tablist" aria-label="Filter projects">
            {categories.map((item) => (
              <button
                type="button"
                className={category === item ? 'active' : ''}
                key={item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="search-field" htmlFor="projects-page-search">
  <FiSearch aria-hidden="true" />

  <span className="sr-only">Search projects</span>

  <input
    id="projects-page-search"
    name="projectsPageSearch"
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

        {!filtered.length ? (
          <p className="projects-empty">No projects match your current filters.</p>
        ) : null}
      </div>
    </motion.div>
  )
}
