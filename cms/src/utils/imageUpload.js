import { getMediaConfig, getMediaUploadSignature } from '../services/mediaService'

export const maxImageFileSize = 10_000_000
export const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])

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

export async function createCroppedFile(
  source,
  cropPixels,
  originalFile,
  outputWidth,
  outputHeight,
) {
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
      (result) => (result ? resolve(result) : reject(new Error('Unable to create cropped image'))),
      mimeType,
      mimeType === 'image/png' ? undefined : 0.9,
    )
  })

  return new File([blob], getOutputName(originalFile, mimeType), { type: mimeType })
}

export async function uploadImageToCloudinary(file, section) {
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
