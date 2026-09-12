import { useEffect, useMemo, useState } from 'react'
import { FiArrowLeft, FiExternalLink, FiTrash2 } from 'react-icons/fi'
import { Link, useNavigate, useParams } from 'react-router-dom'

import ConfirmDialog from '../components/editor/ConfirmDialog'
import ProjectEditorPanel from '../components/projects/ProjectEditorPanel'
import { useToast } from '../hooks/useToast'
import { useUnsavedChanges } from '../hooks/useUnsavedChanges'
import {
  deleteAdminProject,
  getAdminProject,
  updateAdminProject,
} from '../services/portfolioService'
import { resolvePortfolioUrl } from '../utils/urls'

function toParagraph(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean)
      .join(', ')
  }

  return String(value || '').trim()
}

function cleanProject(project) {
  return {
    ...project,
    images: Array.isArray(project.images) ? project.images : [],
    tech: Array.isArray(project.tech) ? project.tech : [],
    challenges: toParagraph(project.challenges),
    lessons: toParagraph(project.lessons),
  }
}

function ProjectEditor() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [project, setProject] = useState(null)
  const [savedProject, setSavedProject] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.querySelector('.dashboard-main')?.scrollTo({ top: 0, behavior: 'auto' })
  }, [slug])

  useEffect(() => {
    let ignore = false

    async function loadProject() {
      try {
        setIsLoading(true)
        const response = await getAdminProject(slug)
        if (!ignore) {
          const nextProject = cleanProject(response.project)
          setProject(nextProject)
          setSavedProject(nextProject)
        }
      } catch (requestError) {
        if (!ignore) setError(requestError.message)
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    loadProject()
    return () => {
      ignore = true
    }
  }, [slug])

  const isDirty = useMemo(
    () =>
      Boolean(project && savedProject && JSON.stringify(project) !== JSON.stringify(savedProject)),
    [project, savedProject],
  )
  useUnsavedChanges(isDirty)

  function updateField(field, value) {
    setProject((current) => ({
      ...current,
      [field]: value,
      ...(field === 'visible' && !value ? { featured: false } : {}),
    }))
  }

  function resetProject() {
    if (savedProject) setProject(cleanProject(savedProject))
  }

  async function saveProject(publicationStatus) {
    if (!project) return

    try {
      setIsSaving(true)
      const response = await updateAdminProject(slug, {
        ...project,
        publicationStatus,
        visible: publicationStatus === 'published' ? project.visible : false,
        featured: publicationStatus === 'published' ? project.featured : false,
      })
      const nextProject = cleanProject(response.project)
      setProject(nextProject)
      setSavedProject(nextProject)
      showToast(
        publicationStatus === 'published'
          ? 'Project published to MongoDB.'
          : 'Project draft saved to MongoDB.',
      )

      if (nextProject.slug !== slug) {
        navigate(`/projects/${nextProject.slug}`, { replace: true })
      }
    } catch (requestError) {
      showToast(requestError.message, { type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    try {
      setIsDeleting(true)
      await deleteAdminProject(slug)
      showToast('Project deleted from MongoDB.')
      navigate('/projects', { replace: true })
    } catch (requestError) {
      showToast(requestError.message, { type: 'error' })
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <section className="page project-editor-page">
        <div className="projects-overview__empty">Loading project editor...</div>
      </section>
    )
  }

  if (error || !project) {
    return (
      <section className="page project-editor-page">
        <Link className="project-editor-page__back" to="/projects">
          <FiArrowLeft /> Back to projects
        </Link>
        <div className="projects-overview__empty">
          <h1>Project unavailable</h1>
          <p>{error || 'Project not found'}</p>
        </div>
      </section>
    )
  }

  const isPublished = project.publicationStatus === 'published'

  return (
    <section className="page project-editor-page">
      <header className="project-editor-page__header">
        <div>
          <Link className="project-editor-page__back" to="/projects">
            <FiArrowLeft aria-hidden="true" /> Project Library
          </Link>
          <div className="project-editor-page__title-row">
            <h1>{project.shortTitle || project.title}</h1>
            <span
              className={`project-editor-page__status project-editor-page__status--${isPublished ? 'published' : 'draft'}`}
            >
              {isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
        <div className="project-editor-page__header-actions">
          {isPublished ? (
            <a
              className="btn btn-secondary"
              href={resolvePortfolioUrl(`/projects/${project.slug}`)}
              target="_blank"
              rel="noreferrer"
            >
              <FiExternalLink aria-hidden="true" /> Preview
            </a>
          ) : null}
          <button
            className="icon-button icon-button--danger"
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            aria-label="Delete project"
            title="Delete project"
          >
            <FiTrash2 aria-hidden="true" />
          </button>
        </div>
      </header>

      <ProjectEditorPanel
        project={project}
        isDirty={isDirty}
        isSaving={isSaving}
        onChange={updateField}
        onReset={resetProject}
        onSave={saveProject}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete this project?"
        message="This permanently removes the project from MongoDB and the public portfolio."
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </section>
  )
}

export default ProjectEditor
