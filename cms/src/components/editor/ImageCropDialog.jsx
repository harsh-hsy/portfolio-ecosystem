import { useId, useState } from 'react'
import Cropper from 'react-easy-crop'
import 'react-easy-crop/react-easy-crop.css'
import { FiCrop, FiMinus, FiPlus, FiRefreshCw, FiX } from 'react-icons/fi'

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value))
}

function ImageCropDialog({ image, aspectRatio, label, onCancel, onConfirm, isUploading }) {
  const titleId = useId()
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [cropPixels, setCropPixels] = useState(null)
  const [naturalAspectRatio, setNaturalAspectRatio] = useState(null)
  const effectiveAspectRatio = aspectRatio || naturalAspectRatio || 1

  function changeZoom(nextZoom) {
    setZoom(clamp(Number(nextZoom), 1, 3))
  }

  return (
    <div className="media-crop-backdrop" role="presentation">
      <div className="media-crop-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="media-crop-dialog__header">
          <div>
            <span>Image editor</span>
            <h2 id={titleId}>Crop {label}</h2>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onCancel}
            disabled={isUploading}
            aria-label="Close crop editor"
          >
            <FiX aria-hidden="true" />
          </button>
        </div>

        <div
          className="media-crop-dialog__stage"
          style={{ '--crop-aspect-ratio': effectiveAspectRatio }}
        >
          <Cropper
            image={image.url}
            crop={cropPosition}
            zoom={zoom}
            aspect={effectiveAspectRatio}
            minZoom={1}
            maxZoom={3}
            zoomSpeed={0.1}
            showGrid
            objectFit="contain"
            onCropChange={setCropPosition}
            onZoomChange={setZoom}
            onMediaLoaded={(media) => {
              if (!aspectRatio) {
                const width = media.naturalWidth || media.width
                const height = media.naturalHeight || media.height
                if (width && height) setNaturalAspectRatio(width / height)
              }
            }}
            onCropComplete={(_, pixels) => setCropPixels(pixels)}
          />
        </div>

        <div className="media-crop-dialog__controls">
          <div className="media-zoom-control">
            <div className="media-zoom-control__label">
              <span>Zoom</span>
              <output>{Math.round(zoom * 100)}%</output>
            </div>
            <div className="media-zoom-control__row">
              <button
                type="button"
                className="icon-button"
                onClick={() => changeZoom(zoom - 0.1)}
                disabled={zoom <= 1 || isUploading}
                aria-label="Zoom out"
              >
                <FiMinus />
              </button>
              <input
                type="range"
                min="1"
                max="3"
                step="0.01"
                value={zoom}
                onChange={(event) => changeZoom(event.target.value)}
                aria-label="Image zoom"
              />
              <button
                type="button"
                className="icon-button"
                onClick={() => changeZoom(zoom + 0.1)}
                disabled={zoom >= 3 || isUploading}
                aria-label="Zoom in"
              >
                <FiPlus />
              </button>
            </div>
          </div>

          <div className="media-crop-dialog__actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setCropPosition({ x: 0, y: 0 })
                setZoom(1)
              }}
              disabled={isUploading}
            >
              Reset
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onConfirm(cropPixels)}
              disabled={!cropPixels || isUploading}
            >
              {isUploading ? (
                <FiRefreshCw className="image-uploader__spinner" aria-hidden="true" />
              ) : (
                <FiCrop aria-hidden="true" />
              )}
              {isUploading ? 'Uploading...' : 'Crop and upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageCropDialog
