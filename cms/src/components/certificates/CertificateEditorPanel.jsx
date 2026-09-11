import { FiAward, FiEye, FiEyeOff, FiRefreshCw, FiSave, FiStar } from 'react-icons/fi'

import FormField from '../editor/FormField'
import ImageUploader from '../editor/ImageUploader'
import { resolveMediaUrl } from '../../utils/urls'

function CertificateEditorPanel({ certificate, isDirty, isSaving, onChange, onReset, onSave }) {
  const isPublished = certificate.publicationStatus === 'published'

  return (
    <div className="panel project-editor-panel certificate-editor-panel">
      <div className="project-editor-section">
        <div className="project-editor-section__heading">
          <h2>Certificate identity</h2>
          <p>Content used by the public certificate card.</p>
        </div>
        <div className="form-grid">
          <FormField
            label="Certificate Title"
            value={certificate.title}
            onChange={(event) => onChange('title', event.target.value)}
            required
          />
          <FormField
            label="Issuer / Organization"
            value={certificate.issuer}
            onChange={(event) => onChange('issuer', event.target.value)}
            required
          />
          <FormField
            label="Issue Date"
            value={certificate.date}
            onChange={(event) => onChange('date', event.target.value)}
            required
          />
          <FormField
            label="Certificate Slug"
            value={certificate.slug}
            onChange={(event) => onChange('slug', event.target.value)}
            helpText="Use lowercase words separated by hyphens."
            required
          />
        </div>
      </div>

      <div className="project-editor-section">
        <div className="project-editor-section__heading">
          <h2>Certificate media</h2>
          <p>Add an optional image that appears on the certificate card.</p>
        </div>
        <div className="project-media-preview certificate-media-preview">
          {certificate.thumbnail ? (
            <img src={resolveMediaUrl(certificate.thumbnail)} alt="Current certificate preview" />
          ) : (
            <span>
              <FiAward aria-hidden="true" /> No certificate image added
            </span>
          )}
          <ImageUploader
            value={certificate.thumbnail}
            onChange={(thumbnail) => onChange('thumbnail', thumbnail)}
            label="Certificate image"
            helpText="The original certificate ratio is preserved so no content is cut off."
            section="certificates"
            aspectRatio={null}
            previewMaxWidth="640px"
            preserveOriginalRatio
            alt={`${certificate.title} certificate`}
          />
        </div>
      </div>

      <div className="project-editor-section">
        <div className="project-editor-section__heading">
          <h2>Links and publishing</h2>
          <p>Control the view/download links and public visibility.</p>
        </div>
        <div className="form-grid">
          <FormField
            label="View URL"
            type="url"
            value={certificate.credentialUrl}
            onChange={(event) => onChange('credentialUrl', event.target.value)}
          />
          <FormField
            label="Download URL"
            type="url"
            value={certificate.file}
            onChange={(event) => onChange('file', event.target.value)}
          />
        </div>
        <div className="project-publishing-options">
          <label className={`project-publishing-option ${certificate.visible ? 'is-active' : ''}`}>
            <input
              type="checkbox"
              checked={certificate.visible}
              onChange={(event) => onChange('visible', event.target.checked)}
            />
            {certificate.visible ? <FiEye aria-hidden="true" /> : <FiEyeOff aria-hidden="true" />}
            <span>
              <strong>Visible on portfolio</strong>
              <small>Show this certificate in the public certificates section.</small>
            </span>
          </label>
          <label className={`project-publishing-option ${certificate.featured ? 'is-active' : ''}`}>
            <input
              type="checkbox"
              checked={certificate.featured}
              disabled={!certificate.visible}
              onChange={(event) => onChange('featured', event.target.checked)}
            />
            <FiStar aria-hidden="true" />
            <span>
              <strong>Featured certificate</strong>
              <small>Mark this certificate as highlighted for future layouts.</small>
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
            {isSaving
              ? 'Saving...'
              : isPublished
                ? 'Save Published Certificate'
                : 'Publish Certificate'}
          </button>
        </div>
      </footer>
    </div>
  )
}

export default CertificateEditorPanel
