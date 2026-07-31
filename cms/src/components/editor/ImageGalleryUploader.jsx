import { FiArrowDown, FiArrowUp, FiPlus, FiTrash2 } from 'react-icons/fi'

import ImageUploader from './ImageUploader'

function move(items, from, to) {
  if (to < 0 || to >= items.length) return items
  const next = [...items]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

function ImageGalleryUploader({ items = [], onChange, section = 'projects', error = '' }) {
  function updateItem(index, value) {
    const next = [...items]
    next[index] = value
    onChange(next)
  }

  function removeItem(index) {
    onChange(items.filter((_, itemIndex) => itemIndex !== index))
  }

  return (
    <div className="image-gallery-uploader">
      <div className="image-gallery-uploader__heading">
        <div>
          <h3>Project screenshots</h3>
          <p>Upload, crop and arrange screenshots. The first image is used when no separate thumbnail is set.</p>
        </div>
        <button className="btn btn-secondary" type="button" onClick={() => onChange([...items, ''])}>
          <FiPlus aria-hidden="true" /> Add screenshot
        </button>
      </div>

      {items.length ? (
        <div className="image-gallery-uploader__list">
          {items.map((item, index) => (
            <div className="image-gallery-uploader__item" key={`${item || 'new'}-${index}`}>
              <div className="image-gallery-uploader__item-header">
                <strong>Screenshot {index + 1}</strong>
                <div>
                  <button type="button" className="icon-button" onClick={() => onChange(move(items, index, index - 1))} disabled={index === 0} aria-label="Move screenshot up"><FiArrowUp /></button>
                  <button type="button" className="icon-button" onClick={() => onChange(move(items, index, index + 1))} disabled={index === items.length - 1} aria-label="Move screenshot down"><FiArrowDown /></button>
                  <button type="button" className="icon-button icon-button--danger" onClick={() => removeItem(index)} aria-label="Remove screenshot"><FiTrash2 /></button>
                </div>
              </div>
              <ImageUploader
                value={item}
                onChange={(value) => updateItem(index, value)}
                label={`Screenshot ${index + 1}`}
                helpText="Crop screenshots to the same 16:9 window frame used on the portfolio."
                section={section}
                aspectRatio={16 / 9}
                previewMaxWidth="100%"
                alt={`Project screenshot ${index + 1}`}
              />
            </div>
          ))}
        </div>
      ) : <div className="image-gallery-uploader__empty">No screenshots added.</div>}

      {error ? <p className="form-error" role="alert">{error}</p> : null}
    </div>
  )
}

export default ImageGalleryUploader
