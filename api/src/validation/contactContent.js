function validationError(message) {
  const error = new Error(message)
  error.statusCode = 400
  return error
}

function requiredText(value, label, maxLength) {
  const text = String(value ?? '').trim()
  if (!text) throw validationError(`${label} is required`)
  if (maxLength && text.length > maxLength) {
    throw validationError(`${label} must use ${maxLength} characters or fewer`)
  }
}

function optionalText(value, label, maxLength) {
  const text = String(value ?? '').trim()
  if (maxLength && text.length > maxLength) {
    throw validationError(`${label} must use ${maxLength} characters or fewer`)
  }
}

function validUrl(value, label) {
  const text = String(value ?? '').trim()
  if (!text) throw validationError(`${label} is required`)

  try {
    const url = new URL(text)
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid protocol')
  } catch {
    throw validationError(`${label} must be a valid URL`)
  }
}

function validEmail(value, label) {
  const text = String(value ?? '').trim()
  if (!text) throw validationError(`${label} is required`)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
    throw validationError(`${label} must be a valid email address`)
  }
}

export function validateContactContent(content) {
  const contact = content?.sections?.contact
  const fields = contact?.fields ?? {}

  if (!contact) throw validationError('Contact section content is required')

  optionalText(contact.eyebrow, 'Contact eyebrow', 40)
  requiredText(contact.title, 'Contact title', 110)
  requiredText(contact.copy, 'Contact copy', 280)
  if (contact.useHomeAvailability !== undefined && typeof contact.useHomeAvailability !== 'boolean') {
    throw validationError('Contact availability source must be true or false')
  }
  if (contact.useHomeAvailability) {
    optionalText(contact.availability, 'Contact availability', 80)
  } else {
    requiredText(contact.availability, 'Contact availability', 80)
  }
  requiredText(contact.panelTitle, 'Contact panel title', 120)
  requiredText(contact.submitLabel, 'Contact submit label', 40)
  requiredText(contact.successMessage, 'Contact success message', 100)
  requiredText(contact.errorMessage, 'Contact validation message', 100)
  requiredText(contact.failureMessage, 'Contact failure message', 100)
  requiredText(fields.name, 'Name field label', 40)
  requiredText(fields.email, 'Email field label', 40)
  requiredText(fields.subject, 'Subject field label', 40)
  requiredText(fields.message, 'Message field label', 40)

  return content
}

export function validateLinksContent(content) {
  const profile = content?.profile ?? {}
  const seo = content?.seo ?? {}

  validUrl(profile.github, 'GitHub URL')
  validUrl(profile.linkedin, 'LinkedIn URL')
  validEmail(profile.email, 'Public email')
  validUrl(profile.resume, 'Resume URL')
  requiredText(profile.location, 'Location', 80)
  validUrl(profile.mapUrl, 'Location map URL')
  validUrl(seo.siteUrl, 'Portfolio URL')

  return content
}
