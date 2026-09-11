import { FiEye, FiEyeOff, FiFolder, FiStar } from 'react-icons/fi'

import { resolveMediaUrl } from '../../utils/urls'

function ProjectLibraryCard({ project, featuredCount, isUpdating, onOpen, onUpdate }) {
  const image = project.thumbnail || project.images?.[0]
  const isDraft = project.publicationStatus === 'draft'
  const canFeature = !isDraft && project.visible
  const title = project.shortTitle || project.title

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpen()
    }
  }

  return (
    <article
      className="project-library-card"
      tabIndex="0"
      role="link"
      onClick={onOpen}
      onKeyDown={handleKeyDown}
    >
      <div className="project-library-card__media">
        {image ? <img src={resolveMediaUrl(image)} alt="" /> : <FiFolder aria-hidden="true" />}
        <span
          className={`project-library-card__status project-library-card__status--${isDraft ? 'draft' : 'published'}`}
        >
          {isDraft ? 'Draft' : 'Published'}
        </span>
      </div>

      <div className="project-library-card__body">
        <div>
          <p>{project.category || 'Uncategorized'}</p>
          <h2>{title}</h2>
          <span>/projects/{project.slug}</span>
        </div>
        <div className="project-library-card__actions" aria-label={`${title} actions`}>
          <button
            className={project.featured ? 'is-active' : ''}
            type="button"
            disabled={isUpdating || !canFeature || (!project.featured && featuredCount >= 6)}
            aria-label={project.featured ? 'Remove from featured projects' : 'Feature project'}
            title={
              !canFeature ? 'Publish and show the project before featuring it' : 'Feature project'
            }
            onClick={(event) => {
              event.stopPropagation()
              onUpdate(
                { featured: !project.featured },
                project.featured
                  ? 'Removed from featured projects.'
                  : 'Project featured on homepage.',
              )
            }}
          >
            <FiStar aria-hidden="true" />
          </button>
          <button
            className={project.visible ? 'is-active' : ''}
            type="button"
            disabled={isUpdating || isDraft}
            aria-label={project.visible ? 'Hide project' : 'Show project'}
            title={
              isDraft
                ? 'Publish the project before showing it'
                : project.visible
                  ? 'Hide project'
                  : 'Show project'
            }
            onClick={(event) => {
              event.stopPropagation()
              onUpdate(
                { visible: !project.visible },
                project.visible
                  ? 'Project hidden from portfolio.'
                  : 'Project visible on portfolio.',
              )
            }}
          >
            {project.visible ? <FiEye aria-hidden="true" /> : <FiEyeOff aria-hidden="true" />}
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProjectLibraryCard
