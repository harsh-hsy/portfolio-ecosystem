import { FiX } from 'react-icons/fi'

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function CreateResourceDialog({
  resourceName,
  value,
  placeholder,
  path,
  pathLabel,
  isCreating,
  onChange,
  onClose,
  onSubmit,
}) {
  const idPrefix = resourceName.toLowerCase()

  return (
    <div className="dialog-backdrop" onMouseDown={onClose}>
      <form
        className="project-create-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`create-${idPrefix}-title`}
        onSubmit={onSubmit}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="project-create-dialog__header">
          <div>
            <p className="page-kicker">New {resourceName}</p>
            <h2 id={`create-${idPrefix}-title`}>Create a {idPrefix} draft</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog">
            <FiX aria-hidden="true" />
          </button>
        </div>
        <label className="form-group project-create-dialog__field">
          <span className="form-label">
            {resourceName} Name <b aria-hidden="true">*</b>
          </span>
          <input
            className="form-input"
            autoFocus
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            aria-describedby={`${idPrefix}-slug-preview`}
            required
          />
        </label>
        <div className="project-create-dialog__slug" id={`${idPrefix}-slug-preview`}>
          <span>{pathLabel}</span>
          <code>
            /{path}/{slugify(value) || `${idPrefix}-name`}
          </code>
        </div>
        <div className="project-create-dialog__actions">
          <button className="btn btn-secondary" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" type="submit" disabled={isCreating || !value.trim()}>
            {isCreating ? 'Creating...' : 'Create Draft'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateResourceDialog
