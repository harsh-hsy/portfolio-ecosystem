import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch } from 'react-icons/fi'
import SectionHeader from '../common/SectionHeader.jsx'
import ProjectCard from '../common/ProjectCard.jsx'
import { getProjectsContent } from '../../lib/contentSelectors.js'
import { stagger } from '../../animations/variants.js'

export default function Projects() {
  const { section, projects } = getProjectsContent()
  const [category, setCategory] = useState(section.allFilterLabel)
  const [query, setQuery] = useState('')
  const categories = [section.allFilterLabel, ...new Set(projects.map((project) => project.category))]
  const filtered = useMemo(
    () => projects.filter((project) => (category === section.allFilterLabel || project.category === category) && project.title.toLowerCase().includes(query.toLowerCase())),
    [category, projects, query, section.allFilterLabel],
  )

  console.log('Query:', query)
console.log('Filtered:', filtered.length)

  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <SectionHeader eyebrow={section.eyebrow} title={section.title} copy={section.copy} />
        <div className="project-toolbar">
          <div className="filter-tabs" role="tablist" aria-label={section.filterAriaLabel}>
            {categories.map((item) => <button type="button" className={category === item ? 'active' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
          <label className="search-field"><FiSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={section.searchPlaceholder} /></label>
        </div>
        <motion.div
  className="projects-grid"
  variants={stagger}
  initial="hidden"
  animate="visible"
>
          {filtered.map((project) => <ProjectCard key={project.slug} project={project} />)}
        </motion.div>
      </div>
    </section>
  )
}
