import { useEffect, useMemo, useState } from 'react'
import { FiFolder } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

import CreateResourceDialog from '../components/library/CreateResourceDialog'
import LibraryToolbar from '../components/library/LibraryToolbar'
import ProjectLibraryCard from '../components/projects/ProjectLibraryCard'
import { useToast } from '../hooks/useToast'
import {
  createAdminProject,
  getAdminProjects,
  updateAdminProject,
} from '../services/portfolioService'

function Projects() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [updatingSlug, setUpdatingSlug] = useState('')

  useEffect(() => {
    document.querySelector('.dashboard-main')?.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadProjects() {
      try {
        setIsLoading(true)
        const response = await getAdminProjects()
        if (!ignore) setProjects(response.projects || [])
      } catch (requestError) {
        if (!ignore) setError(requestError.message)
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    loadProjects()
    return () => {
      ignore = true
    }
  }, [])

  const featuredCount = projects.filter(
    (project) => project.publicationStatus === 'published' && project.visible && project.featured,
  ).length

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return projects.filter((project) => {
      const matchesQuery =
        !normalizedQuery ||
        [project.title, project.shortTitle, project.category, project.slug]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)
      const matchesFilter =
        activeFilter === 'All' ||
        (activeFilter === 'Published' && project.publicationStatus === 'published') ||
        (activeFilter === 'Draft' && project.publicationStatus === 'draft') ||
        (activeFilter === 'Featured' && project.featured) ||
        (activeFilter === 'Hidden' && !project.visible)

      return matchesQuery && matchesFilter
    })
  }, [activeFilter, projects, query])

  async function updateProject(project, changes, successMessage) {
    try {
      setUpdatingSlug(project.slug)
      const response = await updateAdminProject(project.slug, { ...project, ...changes })
      setProjects((current) =>
        current.map((item) => (item._id === project._id ? response.project : item)),
      )
      showToast(successMessage)
    } catch (requestError) {
      showToast(requestError.message, { type: 'error' })
    } finally {
      setUpdatingSlug('')
    }
  }

  async function handleCreate(event) {
    event.preventDefault()
    if (!projectName.trim()) return

    try {
      setIsCreating(true)
      const response = await createAdminProject(projectName)
      showToast('Project draft created in MongoDB.')
      navigate(`/projects/${response.project.slug}`)
    } catch (requestError) {
      showToast(requestError.message, { type: 'error' })
    } finally {
      setIsCreating(false)
    }
  }

  function closeCreateDialog() {
    if (isCreating) return
    setIsCreateOpen(false)
    setProjectName('')
  }

  return (
    <section className="page projects-overview">
      <LibraryToolbar
        resourceName="Project"
        activeFilter={activeFilter}
        query={query}
        onFilter={setActiveFilter}
        onQuery={setQuery}
        onCreate={() => setIsCreateOpen(true)}
      />

      <div className="projects-overview__summary">
        <span>{projects.length} projects</span>
        <span>{featuredCount} of 6 featured</span>
        <span>MongoDB connected</span>
      </div>

      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <div className="projects-overview__empty">Loading project library...</div>
      ) : filteredProjects.length ? (
        <div className="project-library-grid">
          {filteredProjects.map((project) => (
            <ProjectLibraryCard
              key={project._id || project.slug}
              project={project}
              featuredCount={featuredCount}
              isUpdating={updatingSlug === project.slug}
              onOpen={() => navigate(`/projects/${project.slug}`)}
              onUpdate={(changes, message) => updateProject(project, changes, message)}
            />
          ))}
        </div>
      ) : (
        <div className="projects-overview__empty">
          <FiFolder aria-hidden="true" />
          <h2>No matching projects</h2>
          <p>Adjust the filter or create a new project draft.</p>
        </div>
      )}

      {isCreateOpen ? (
        <CreateResourceDialog
          resourceName="Project"
          value={projectName}
          placeholder="Example: Portfolio CMS"
          path="projects"
          pathLabel="Generated project URL"
          isCreating={isCreating}
          onChange={setProjectName}
          onClose={closeCreateDialog}
          onSubmit={handleCreate}
        />
      ) : null}
    </section>
  )
}

export default Projects
