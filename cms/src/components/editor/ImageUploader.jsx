import { useEffect, useId, useRef, useState } from 'react'
import Cropper from 'react-easy-crop'
import 'react-easy-crop/react-easy-crop.css'
import {
  FiCrop,
  FiImage,
  FiMinus,
  FiPlus,
  FiRefreshCw,
  FiTrash2,
  FiUploadCloud,
  FiX,
} from 'react-icons/fi'

import { useToast } from '../../hooks/useToast'
import {
  getMediaConfig,
  getMediaUploadSignature,
  registerMediaAsset,
} from '../../services/mediaService'
import { resolveMediaUrl } from '../../utils/media'

const maxFileSize = 10_000_000
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value))
}

function getOutputType(file) {
  if (file.type === 'image/png') return 'image/png'
  if (file.type === 'image/webp') return 'image/webp'
  return 'image/jpeg'
}

function getOutputName(file, mimeType) {
  const base = file.name.replace(/\.[^.]+$/, '') || 'portfolio-image'
  const extension = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg'
  return `${base}-cropped.${extension}`
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Unable to process the selected image'))
    image.src = source
  })
}

async function createCroppedFile(source, cropPixels, originalFile, outputWidth, outputHeight) {
  const image = await loadImage(source)
  const cropWidth = Math.max(1, Math.round(cropPixels.width))
  const cropHeight = Math.max(1, Math.round(cropPixels.height))
  const width = Math.max(1, Math.round(outputWidth || cropWidth))
  const height = Math.max(1, Math.round(outputHeight || cropHeight))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) throw new Error('Image crop is not supported by this browser')

  context.drawImage(
    image,
    Math.round(cropPixels.x),
    Math.round(cropPixels.y),
    cropWidth,
    cropHeight,
    0,
    0,
    width,
    height,
  )

  const mimeType = getOutputType(originalFile)
  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => result ? resolve(result) : reject(new Error('Unable to create cropped image')),
      mimeType,
      mimeType === 'image/png' ? undefined : 0.9,
    )
  })

  return new File([blob], getOutputName(originalFile, mimeType), { type: mimeType })
}

async function uploadToCloudinary(file, section) {
  const config = await getMediaConfig()
  const timestamp = Math.floor(Date.now() / 1000)
  const assetFolder = `${config.folder}/${section}`
  const paramsToSign = { asset_folder: assetFolder, timestamp }
  const { signature } = await getMediaUploadSignature(paramsToSign)
  const body = new FormData()

  body.append('file', file)
  body.append('api_key', config.apiKey)
  body.append('timestamp', String(timestamp))
  body.append('asset_folder', assetFolder)
  body.append('signature', signature)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/image/upload`,
    { method: 'POST', body },
  )
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error?.message || 'Cloudinary image upload failed')
  }

  return data
}

function CropDialog({ image, aspectRatio, label, onCancel, onConfirm, isUploading }) {
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
          <button type="button" className="icon-button" onClick={onCancel} disabled={isUploading} aria-label="Close crop editor">
            <FiX aria-hidden="true" />
          </button>
        </div>

        <div className="media-crop-dialog__stage" style={{ '--crop-aspect-ratio': effectiveAspectRatio }}>
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
              <button type="button" className="icon-button" onClick={() => changeZoom(zoom - 0.1)} disabled={zoom <= 1 || isUploading} aria-label="Zoom out"><FiMinus /></button>
              <input type="range" min="1" max="3" step="0.01" value={zoom} onChange={(event) => changeZoom(event.target.value)} aria-label="Image zoom" />
              <button type="button" className="icon-button" onClick={() => changeZoom(zoom + 0.1)} disabled={zoom >= 3 || isUploading} aria-label="Zoom in"><FiPlus /></button>
            </div>
          </div>

          <div className="media-crop-dialog__actions">
            <button type="button" className="btn btn-secondary" onClick={() => { setCropPosition({ x: 0, y: 0 }); setZoom(1) }} disabled={isUploading}>
              Reset
            </button>
            <button type="button" className="btn btn-primary" onClick={() => onConfirm(cropPixels)} disabled={!cropPixels || isUploading}>
              {isUploading ? <FiRefreshCw className="image-uploader__spinner" aria-hidden="true" /> : <FiCrop aria-hidden="true" />}
              {isUploading ? 'Uploading...' : 'Crop and upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ImageUploader({
  value = '',
  onChange,
  label = 'Image',
  helpText = '',
  section,
  aspectRatio = 1,
  required = false,
  error = '',
  alt = '',
  className = '',
  previewMaxWidth = '560px',
  preserveOriginalRatio = false,
  outputWidth,
  outputHeight,
}) {
  const { showToast } = useToast()
  const inputRef = useRef(null)
  const selectedImageRef = useRef(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [failedPreviewUrl, setFailedPreviewUrl] = useState('')
  const previewUrl = resolveMediaUrl(value)
  const previewError = Boolean(previewUrl && failedPreviewUrl === previewUrl)

  useEffect(() => () => {
    if (selectedImageRef.current?.url) URL.revokeObjectURL(selectedImageRef.current.url)
  }, [])

  function clearSelectedImage() {
    if (selectedImageRef.current?.url) URL.revokeObjectURL(selectedImageRef.current.url)
    selectedImageRef.current = null
    setSelectedImage(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  function selectFile(event) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!allowedTypes.has(file.type)) {
      showToast('Choose a JPG, PNG or WebP image.', { type: 'error' })
      event.target.value = ''
      return
    }

    if (file.size > maxFileSize) {
      showToast('Image must be 10 MB or smaller.', { type: 'error' })
      event.target.value = ''
      return
    }

    const nextImage = { file, url: URL.createObjectURL(file) }
    if (selectedImageRef.current?.url) URL.revokeObjectURL(selectedImageRef.current.url)
    selectedImageRef.current = nextImage
    setSelectedImage(nextImage)
  }

  async function cropAndUpload(cropPixels) {
    if (!selectedImage || !cropPixels || isUploading) return

    try {
      setIsUploading(true)
      const croppedFile = await createCroppedFile(
        selectedImage.url,
        cropPixels,
        selectedImage.file,
        outputWidth,
        outputHeight,
      )
      const info = await uploadToCloudinary(croppedFile, section)
      const response = await registerMediaAsset({
        publicId: info.public_id,
        assetId: info.asset_id,
        secureUrl: info.secure_url,
        section,
        alt,
        format: info.format,
        width: info.width,
        height: info.height,
        bytes: info.bytes,
        hasCustomCrop: false,
      })

      onChange(response.asset.url, response.asset)
      clearSelectedImage()
      showToast('Image uploaded. Save this page to publish it.', { type: 'success' })
    } catch (uploadError) {
      showToast(uploadError.message || 'Image upload failed.', { type: 'error' })
    } finally {
      setIsUploading(false)
    }
  }

  function removeImage() {
    onChange('', null)
    showToast('Image removed from this field. Save the page to publish the change.', { type: 'warning' })
  }

  return (
    <div
      className={`image-uploader ${preserveOriginalRatio ? 'image-uploader--natural' : ''} ${error ? 'image-uploader--error' : ''} ${className}`.trim()}
      style={{ '--image-aspect-ratio': aspectRatio, '--image-preview-max-width': previewMaxWidth }}
    >
      <input ref={inputRef} className="image-uploader__input" type="file" accept="image/jpeg,image/png,image/webp" onChange={selectFile} />

      <div className="image-uploader__heading">
        <div>
          <label>{label}{required ? <span aria-hidden="true"> *</span> : null}</label>
          {helpText ? <p>{helpText}</p> : null}
        </div>
        <span className="image-uploader__crop-badge"><FiCrop aria-hidden="true" /> Crop + zoom</span>
      </div>

      <div className="image-uploader__preview">
        {previewUrl && !previewError ? (
          <img src={previewUrl} alt={alt || `${label} preview`} onError={() => setFailedPreviewUrl(previewUrl)} />
        ) : (
          <div className="image-uploader__empty">
            <FiImage aria-hidden="true" />
            <span>{previewError ? 'Image preview unavailable' : 'No image selected'}</span>
          </div>
        )}
      </div>

      <div className="image-uploader__actions">
        <button className="btn btn-primary" type="button" onClick={() => inputRef.current?.click()}>
          <FiUploadCloud aria-hidden="true" /> {value ? 'Replace image' : 'Upload image'}
        </button>
        {value ? (
          <button className="btn btn-danger" type="button" onClick={removeImage}>
            <FiTrash2 aria-hidden="true" /> Remove
          </button>
        ) : null}
      </div>

      {error ? <p className="form-error" role="alert">{error}</p> : null}

      {selectedImage ? (
        <CropDialog
          image={selectedImage}
          aspectRatio={preserveOriginalRatio ? null : aspectRatio}
          label={label}
          isUploading={isUploading}
          onCancel={clearSelectedImage}
          onConfirm={cropAndUpload}
        />
      ) : null}
    </div>
  )
}

export default ImageUploader
