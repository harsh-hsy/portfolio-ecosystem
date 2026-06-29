import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch } from 'react-icons/fi'
import SectionHeader from '../common/SectionHeader.jsx'
import ProjectCard from '../common/ProjectCard.jsx'
import { projects } from '../../data/portfolio.js'
import { stagger } from '../../animations/variants.js'

export default function Projects() {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const categories = ['All', ...new Set(projects.map((project) => project.category))]
  const filtered = useMemo(
    () => projects.filter((project) => (category === 'All' || project.category === category) && project.title.toLowerCase().includes(query.toLowerCase())),
    [category, query],
  )

  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <SectionHeader eyebrow="Selected Projects" title="Product-style case cards with real shipped work." copy="Every existing project is preserved, upgraded with filters, search, live links, and detail pages." />
        <div className="project-toolbar">
          <div className="filter-tabs" role="tablist" aria-label="Filter projects">
            {categories.map((item) => <button type="button" className={category === item ? 'active' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
          <label className="search-field"><FiSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects" /></label>
        </div>
        <motion.div className="projects-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }}>
          {filtered.map((project) => <ProjectCard key={project.slug} project={project} />)}
        </motion.div>
      </div>
    </section>
  )
}
