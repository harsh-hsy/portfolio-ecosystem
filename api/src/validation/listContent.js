function validationError(message) {
  const error = new Error(message)
  error.statusCode = 400
  return error
}

function cleanText(value) {
  return String(value ?? '').trim()
}

function validateTextList(items, { label, min = 1, max = 12, maxLength = 120 }) {
  if (!Array.isArray(items)) {
    throw validationError(`${label} must be provided as an array`)
  }

  const cleaned = items.map(cleanText).filter(Boolean)

  if (cleaned.length < min || cleaned.length > max) {
    throw validationError(`Use between ${min} and ${max} ${label.toLowerCase()}`)
  }

  if (cleaned.some((item) => item.length > maxLength)) {
    throw validationError(`Each ${label.toLowerCase()} must use ${maxLength} characters or fewer`)
  }
}

export function validateServicesContent(content) {
  const section = content?.sections?.services

  if (!cleanText(section?.title) || cleanText(section.title).length > 90) {
    throw validationError('Services title is required and must use 90 characters or fewer')
  }

  validateTextList(content?.services, {
    label: 'Services',
    maxLength: 70,
  })

  return content
}

export function validateAchievementsContent(content) {
  const section = content?.sections?.achievements

  if (!cleanText(section?.title) || cleanText(section.title).length > 100) {
    throw validationError('Achievements title is required and must use 100 characters or fewer')
  }

  validateTextList(content?.achievements, {
    label: 'Achievements',
    maxLength: 140,
  })

  return content
}
