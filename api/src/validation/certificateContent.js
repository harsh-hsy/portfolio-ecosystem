function validationError(message) {
  const error = new Error(message)
  error.statusCode = 400
  return error
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function isValidHttpUrl(value) {
  if (!value) return true

  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

function isValidAssetPath(value) {
  if (!value) return true
  return /^(https?:|data:|blob:|\/)/i.test(value)
}

export function validateCertificatesContent(content) {
  if (!content || !Array.isArray(content.certificates)) {
    throw validationError('Certificates must be provided as an array')
  }

  const slugs = new Set()

  content.certificates.forEach((certificate, index) => {
    const label = certificate?.title?.trim() || `Certificate ${index + 1}`

    if (!certificate || typeof certificate !== 'object') {
      throw validationError(`Certificate ${index + 1} must be an object`)
    }

    const requiredFields = ['title', 'issuer', 'date']
    const missingField = requiredFields.find((field) => !hasText(certificate[field]))

    if (missingField) {
      throw validationError(`${label}: ${missingField} is required`)
    }

    if (certificate.slug) {
      const slug = certificate.slug.trim().toLowerCase()

      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        throw validationError(
          `${label}: slug may only contain lowercase letters, numbers, and hyphens`,
        )
      }

      if (slugs.has(slug)) {
        throw validationError(`${label}: certificate slug must be unique`)
      }
      slugs.add(slug)
    }

    if (!isValidAssetPath(certificate.thumbnail)) {
      throw validationError(`${label}: certificate image must be a URL or public asset path`)
    }

    if (!isValidHttpUrl(certificate.file) || !isValidHttpUrl(certificate.credentialUrl)) {
      throw validationError(`${label}: view and download links must be valid URLs`)
    }

    if (certificate.visible !== undefined && typeof certificate.visible !== 'boolean') {
      throw validationError(`${label}: visible must be true or false`)
    }

    if (certificate.featured !== undefined && typeof certificate.featured !== 'boolean') {
      throw validationError(`${label}: featured must be true or false`)
    }
  })

  return content
}
