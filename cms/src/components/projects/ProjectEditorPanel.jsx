import { FiEye, FiEyeOff, FiRefreshCw, FiSave, FiStar } from 'react-icons/fi'

import FormField from '../editor/FormField'
import ImageGalleryUploader from '../editor/ImageGalleryUploader'
import ImageUploader from '../editor/ImageUploader'
import RepeaterField from '../editor/RepeaterField'
import { resolveMediaUrl } from '../../utils/urls'

function ProjectEditorPanel({ project, isDirty, isSaving, onChange, onReset, onSave }) {
  const isPublished = project.publicationStatus === 'published'
  const image = project.thumbnail || project.images[0]

  return (
    <div className="panel project-editor-panel">
      <div className="project-editor-section">
        <div className="project-editor-section__heading">
          <h2>Project identity</h2>
          <p>Content used by the project card and case study heading.</p>
        </div>
        <div className="form-grid">
          <FormField
            label="Case Study Title"
            value={project.title}
            onChange={(event) => onChange('title', event.target.value)}
            required
          />
          <FormField
            label="Card Title"
            value={project.shortTitle}
            onChange={(event) => onChange('shortTitle', event.target.value)}
            required
          />
          <FormField
            label="Project Slug"
            value={project.slug}
            onChange={(event) => onChange('slug', event.target.value)}
            helpText="Use lowercase words separated by hyphens."
            required
          />
          <FormField
            label="Category"
            value={project.category}
            onChange={(event) => onChange('category', event.target.value)}
            required
          />
          <FormField
            label="Description"
            value={project.desc}
            onChange={(event) => onChange('desc', event.target.value)}
            as="textarea"
            className="form-group--wide"
            required
          />
        </div>
      </div>

      <div className="project-editor-section">
        <div className="project-editor-section__heading">
          <h2>Project media</h2>
          <p>The first screenshot is used as the card thumbnail unless a thumbnail is specified.</p>
        </div>
        <div className="project-media-preview">
          {image ? (
            <img src={resolveMediaUrl(image)} alt="Current project preview" />
          ) : (
            <span>No preview available</span>
          )}
          <ImageUploader
            value={project.thumbnail || ''}
            onChange={(thumbnail) => onChange('thumbnail', thumbnail)}
            label="Project thumbnail"
            helpText="Optional. Upload a 16:9 card thumbnail or leave empty to use the first screenshot."
            section="projects"
            aspectRatio={16 / 9}
            previewMaxWidth="640px"
            alt={`${project.shortTitle || project.title} thumbnail`}
          />
        </div>
        <ImageGalleryUploader
          items={project.images}
          onChange={(images) => onChange('images', images)}
          section="projects"
        />
      </div>

      <div className="project-editor-section">
        <div className="project-editor-section__heading">
          <h2>Technology</h2>
          <p>Technologies appear on project cards.</p>
        </div>
        <div className="project-editor-repeaters">
          <RepeaterField
            className="project-editor-list-repeater project-editor-list-repeater--columns"
            label="Technologies"
            items={project.tech}
            onChange={(items) => onChange('tech', items)}
            createItem={() => ''}
            addLabel="Add Technology"
            emptyMessage="Add at least one technology before publishing."
          />
        </div>
      </div>

      <div className="project-editor-section">
        <div className="project-editor-section__heading">
          <h2>Case study</h2>
          <p>Explain the problem, solution, challenges, and what you learned.</p>
        </div>
        <div className="form-grid project-case-study-grid">
          <FormField
            label="Problem"
            value={project.problem || ''}
            onChange={(event) => onChange('problem', event.target.value)}
            as="textarea"
          />
          <FormField
            label="Solution"
            value={project.solution || ''}
            onChange={(event) => onChange('solution', event.target.value)}
            as="textarea"
          />
          <FormField
            label="Challenges"
            value={project.challenges}
            onChange={(event) => onChange('challenges', event.target.value)}
            as="textarea"
            helpText="Write this as one clear paragraph."
          />
          <FormField
            label="Lessons Learned"
            value={project.lessons}
            onChange={(event) => onChange('lessons', event.target.value)}
            as="textarea"
            helpText="Write this as one clear paragraph."
          />
        </div>
      </div>

      <div className="project-editor-section">
        <div className="project-editor-section__heading">
          <h2>Links and publishing</h2>
          <p>Control where the project appears after it is published.</p>
        </div>
        <div className="form-grid">
          <FormField
            label="Live Demo URL"
            type="url"
            value={project.live || ''}
            onChange={(event) => onChange('live', event.target.value)}
          />
          <FormField
            label="GitHub URL"
            type="url"
            value={project.github || ''}
            onChange={(event) => onChange('github', event.target.value)}
          />
        </div>
        <div className="project-publishing-options">
          <label className={`project-publishing-option ${project.visible ? 'is-active' : ''}`}>
            <input
              type="checkbox"
              checked={project.visible}
              onChange={(event) => onChange('visible', event.target.checked)}
            />
            {project.visible ? <FiEye aria-hidden="true" /> : <FiEyeOff aria-hidden="true" />}
            <span>
              <strong>Visible on portfolio</strong>
              <small>Show this project on the public projects page.</small>
            </span>
          </label>
          <label className={`project-publishing-option ${project.featured ? 'is-active' : ''}`}>
            <input
              type="checkbox"
              checked={project.featured}
              disabled={!project.visible}
              onChange={(event) => onChange('featured', event.target.checked)}
            />
            <FiStar aria-hidden="true" />
            <span>
              <strong>Featured on homepage</strong>
              <small>Show this project in the homepage project section.</small>
            </span>
          </label>
        </div>
      </div>

      <footer className="panel-footer project-editor-actions">
        <div>
          <span className={isDirty ? 'is-dirty' : ''}>
            {isDirty ? 'Unsaved changes' : 'All changes saved'}
          </span>
        </div>
        <div>
          <button
            className="btn btn-secondary"
            type="button"
            disabled={isSaving || !isDirty}
            onClick={onReset}
          >
            <FiRefreshCw aria-hidden="true" /> Reset
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            disabled={isSaving}
            onClick={() => onSave('draft')}
          >
            <FiSave aria-hidden="true" /> {isPublished ? 'Move to Draft' : 'Save Draft'}
          </button>
          <button
            className="btn btn-primary"
            type="button"
            disabled={isSaving}
            onClick={() => onSave('published')}
          >
            <FiSave aria-hidden="true" />{' '}
            {isSaving ? 'Saving...' : isPublished ? 'Save Published Project' : 'Publish Project'}
          </button>
        </div>
      </footer>
    </div>
  )
}

export default ProjectEditorPanel
