import EditorActions from '../common/EditorActions'

function CertificateSectionEditor({ editor }) {
  return (
    <form className="panel content-editor certificates-section-editor" onSubmit={editor.saveForm}>
      <div className="content-editor__header">
        <div>
          <span className="content-editor__eyebrow">Certificate showcase</span>
          <h2>{editor.form.title || 'Certificates title'}</h2>
          <p>{editor.form.copy || 'Certificate description'}</p>
        </div>
        <span className="content-editor__badge">{editor.isLoading ? 'Loading' : 'Connected'}</span>
      </div>
      <div className="content-editor__section">
        <h3>Section Content</h3>
        <div className="form-grid">
          <label className="form-group form-group--wide">
            <span className="form-label">
              Title <b aria-hidden="true">*</b>
            </span>
            <input
              className="form-input"
              name="title"
              value={editor.form.title}
              onChange={editor.updateField}
            />
            {editor.errors.title ? <span className="form-error">{editor.errors.title}</span> : null}
          </label>
          <label className="form-group form-group--wide">
            <span className="form-label">
              Description <b aria-hidden="true">*</b>
            </span>
            <textarea
              className="form-input form-textarea"
              name="copy"
              value={editor.form.copy}
              onChange={editor.updateField}
            />
            {editor.errors.copy ? <span className="form-error">{editor.errors.copy}</span> : null}
          </label>
        </div>
      </div>
      <EditorActions
        status={editor.status}
        isDirty={editor.isDirty}
        isLoading={editor.isLoading}
        isSaving={editor.isSaving}
        onReset={editor.resetForm}
      />
    </form>
  )
}

export default CertificateSectionEditor
