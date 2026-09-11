import { useEffect, useRef, useState } from 'react'
import { FiCrop, FiImage, FiTrash2, FiUploadCloud } from 'react-icons/fi'

import { useToast } from '../../hooks/useToast'
import { registerMediaAsset } from '../../services/mediaService'
import {
  allowedImageTypes,
  createCroppedFile,
  maxImageFileSize,
  uploadImageToCloudinary,
} from '../../utils/imageUpload'
import { resolveMediaUrl } from '../../utils/urls'
import ImageCropDialog from './ImageCropDialog'

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

  useEffect(
    () => () => {
      if (selectedImageRef.current?.url) URL.revokeObjectURL(selectedImageRef.current.url)
    },
    [],
  )

  function clearSelectedImage() {
    if (selectedImageRef.current?.url) URL.revokeObjectURL(selectedImageRef.current.url)
    selectedImageRef.current = null
    setSelectedImage(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  function selectFile(event) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!allowedImageTypes.has(file.type)) {
      showToast('Choose a JPG, PNG or WebP image.', { type: 'error' })
      event.target.value = ''
      return
    }

    if (file.size > maxImageFileSize) {
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
      const info = await uploadImageToCloudinary(croppedFile, section)
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
    showToast('Image removed from this field. Save the page to publish the change.', {
      type: 'warning',
    })
  }

  return (
    <div
      className={`image-uploader ${preserveOriginalRatio ? 'image-uploader--natural' : ''} ${error ? 'image-uploader--error' : ''} ${className}`.trim()}
      style={{ '--image-aspect-ratio': aspectRatio, '--image-preview-max-width': previewMaxWidth }}
    >
      <input
        ref={inputRef}
        className="image-uploader__input"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={selectFile}
      />

      <div className="image-uploader__heading">
        <div>
          <label>
            {label}
            {required ? <span aria-hidden="true"> *</span> : null}
          </label>
          {helpText ? <p>{helpText}</p> : null}
        </div>
        <span className="image-uploader__crop-badge">
          <FiCrop aria-hidden="true" /> Crop + zoom
        </span>
      </div>

      <div className="image-uploader__preview">
        {previewUrl && !previewError ? (
          <img
            src={previewUrl}
            alt={alt || `${label} preview`}
            onError={() => setFailedPreviewUrl(previewUrl)}
          />
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

      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      {selectedImage ? (
        <ImageCropDialog
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
