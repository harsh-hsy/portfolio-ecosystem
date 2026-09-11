import { useCallback, useMemo } from 'react'

import AboutImagePreview from '../components/about/AboutImagePreview'
import EditorActions from '../components/common/EditorActions'
import FormField from '../components/editor/FormField'
import IconPicker from '../components/editor/IconPicker'
import ImageUploader from '../components/editor/ImageUploader'
import RepeaterField from '../components/editor/RepeaterField'
import { usePortfolioEditor } from '../hooks/usePortfolioEditor'
import {
  aboutFormFromPortfolio,
  aboutSuffixOptions,
  emptyAboutForm,
  portfolioFromAboutForm,
  validateAboutForm,
} from '../utils/aboutEditor'
import { resolveMediaUrl } from '../utils/urls'

function About() {
  const getForm = useCallback(
    (portfolio) => (portfolio ? aboutFormFromPortfolio(portfolio) : emptyAboutForm),
    [],
  )
  const getPortfolio = useCallback((portfolio, form) => portfolioFromAboutForm(portfolio, form), [])

  const editor = usePortfolioEditor({
    moduleName: 'about',
    getForm,
    getPortfolio,
    validate: validateAboutForm,
    successMessage: 'About content updated successfully.',
  })

  const publishedPreviewImage = useMemo(
    () => resolveMediaUrl(editor.savedForm.aboutImage),
    [editor.savedForm.aboutImage],
  )

  return (
    <section className="page">
      <form className="panel content-editor about-editor" onSubmit={editor.saveForm}>
        <div className="content-editor__header">
          <div>
            <span className="content-editor__eyebrow">About preview</span>
            <h2>{editor.form.title || 'About title'}</h2>
            <p>
              {editor.form.facts.length} fact cards &middot; {editor.form.stats.length} statistics
            </p>
          </div>
          <span className="content-editor__badge">
            {editor.isLoading ? 'Loading' : 'Connected'}
          </span>
        </div>

        <div className="content-editor__section">
          <h3>Section Content</h3>
          <div className="form-grid">
            <FormField
              label="About Title"
              name="title"
              className="form-group--wide"
              value={editor.form.title}
              onChange={editor.updateField}
              error={editor.errors.title}
              maxLength={140}
              required
            />

            <FormField
              label="Short Description"
              name="copy"
              as="textarea"
              className="form-group--wide about-copy-field"
              value={editor.form.copy}
              onChange={editor.updateField}
              error={editor.errors.copy}
              maxLength={280}
              required
            >
              <span className="form-character-count">{editor.form.copy.length}/280</span>
            </FormField>

            <FormField
              label="Profile Bio"
              name="bio"
              as="textarea"
              className="form-group--wide about-bio-field"
              value={editor.form.bio}
              onChange={editor.updateField}
              error={editor.errors.bio}
              maxLength={1200}
              required
            >
              <span className="form-character-count">{editor.form.bio.length}/1200</span>
            </FormField>
          </div>
        </div>

        <div className="content-editor__section">
          <h3>About Image</h3>
          <div className="about-image-editor media-editor-layout">
            <div className="media-current-card">
              <div className="media-current-card__heading">
                <span>Current image</span>
                <small>Published preview</small>
              </div>
              <div className="about-image-editor__preview">
                <AboutImagePreview
                  source={publishedPreviewImage}
                  alt={`${editor.savedForm.title || 'About'} published preview`}
                />
              </div>
            </div>

            <div className="about-image-editor__control">
              <ImageUploader
                value={editor.form.aboutImage}
                onChange={(aboutImage) =>
                  editor.updateForm((current) => ({ ...current, aboutImage }))
                }
                label="Edit about image"
                section="about"
                aspectRatio={4 / 5}
                previewMaxWidth="100%"
                error={editor.errors.aboutImage}
                alt={`${editor.form.title || 'About'} preview`}
                required
              />
            </div>
          </div>
        </div>

        <div className="content-editor__section">
          <div className="editor-section-heading">
            <div>
              <h3>Fact Cards</h3>
              <p>Manage the information cards shown beside the About image.</p>
            </div>
          </div>

          <RepeaterField
            className="about-facts-editor"
            label="About Facts"
            items={editor.form.facts}
            onChange={(facts) => editor.updateForm((current) => ({ ...current, facts }))}
            createItem={() => ({ label: '', value: '', icon: 'user', useProfileLocation: false })}
            getItemKey={(_, index) => index}
            addLabel={editor.form.facts.length >= 6 ? 'Maximum 6 Fact Cards' : 'Add Fact Card'}
            itemLabel="Fact Card"
            maxItems={6}
            renderItem={({ item, updateItem }) => {
              const isLocation = item.label.trim().toLowerCase() === 'location'

              return (
                <div className="about-fact-fields">
                  <FormField
                    label="Label"
                    value={item.label}
                    onChange={(event) => updateItem({ ...item, label: event.target.value })}
                    required
                  />
                  <IconPicker
                    label="Icon"
                    value={item.icon}
                    onChange={(icon) => updateItem({ ...item, icon })}
                    required
                  />
                  <FormField
                    label="Value"
                    className="about-fact-value"
                    value={item.value}
                    onChange={(event) => updateItem({ ...item, value: event.target.value })}
                    disabled={isLocation && item.useProfileLocation}
                    required
                  />
                  {isLocation ? (
                    <label className="about-location-source">
                      <input
                        type="checkbox"
                        checked={item.useProfileLocation}
                        onChange={(event) =>
                          updateItem({
                            ...item,
                            useProfileLocation: event.target.checked,
                            value: event.target.checked
                              ? (editor.portfolio?.profile?.location ?? item.value)
                              : item.value,
                          })
                        }
                      />
                      <span>
                        <strong>Use Home location</strong>
                        <small>Keep this value synchronized with the Home location badge.</small>
                      </span>
                    </label>
                  ) : null}
                </div>
              )
            }}
          />
          {editor.errors.facts ? (
            <p className="form-error" role="alert">
              {editor.errors.facts}
            </p>
          ) : null}
        </div>

        <div className="content-editor__section">
          <div className="editor-section-heading">
            <div>
              <h3>Statistics</h3>
              <p>Manage up to four numeric cards displayed below the About section.</p>
            </div>
          </div>

          <RepeaterField
            className="about-stats-editor"
            label="About Statistics"
            items={editor.form.stats}
            onChange={(stats) => editor.updateForm((current) => ({ ...current, stats }))}
            createItem={() => ({ id: '', value: '0', suffix: '+', label: '' })}
            getItemKey={(_, index) => index}
            addLabel={editor.form.stats.length >= 4 ? 'Maximum 4 Statistics' : 'Add Statistic'}
            itemLabel="Statistic"
            maxItems={4}
            renderItem={({ item, updateItem }) => (
              <div className="about-stat-fields">
                <FormField
                  label="Number"
                  type="number"
                  min="0"
                  value={item.value}
                  onChange={(event) => updateItem({ ...item, value: event.target.value })}
                  required
                />
                <FormField
                  label="Suffix"
                  as="select"
                  options={aboutSuffixOptions}
                  value={item.suffix}
                  onChange={(event) => updateItem({ ...item, suffix: event.target.value })}
                />
                <FormField
                  label="Label"
                  className="about-stat-label"
                  value={item.label}
                  onChange={(event) => updateItem({ ...item, label: event.target.value })}
                  required
                />
              </div>
            )}
          />
          {editor.errors.stats ? (
            <p className="form-error" role="alert">
              {editor.errors.stats}
            </p>
          ) : null}
        </div>

        <EditorActions
          status={editor.status}
          isDirty={editor.isDirty}
          isLoading={editor.isLoading}
          isSaving={editor.isSaving}
          onReset={editor.resetForm}
        />
      </form>
    </section>
  )
}

export default About
