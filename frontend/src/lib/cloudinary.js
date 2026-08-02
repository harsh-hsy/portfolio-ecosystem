const UPLOAD_MARKER = '/image/upload/'

function isCloudinaryImage(source) {
  return typeof source === 'string'
    && source.includes('res.cloudinary.com')
    && source.includes(UPLOAD_MARKER)
}

export function getCloudinaryImageUrl(source, width) {
  if (!isCloudinaryImage(source) || !width) return source
  return source.replace(UPLOAD_MARKER, `${UPLOAD_MARKER}c_limit,w_${width}/`)
}

export function getCloudinarySrcSet(source, widths) {
  if (!isCloudinaryImage(source)) return undefined
  return widths.map((width) => `${getCloudinaryImageUrl(source, width)} ${width}w`).join(', ')
}
