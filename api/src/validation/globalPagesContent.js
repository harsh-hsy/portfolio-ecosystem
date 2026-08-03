function validationError(message) {
  const error = new Error(message)
  error.statusCode = 400
  return error
}

function requiredText(value, label, limit) {
  const text = String(value ?? '').trim()
  if (!text) throw validationError(`${label} is required`)
  if (text.length > limit) throw validationError(`${label} must use ${limit} characters or fewer`)
}

export function validateGlobalPagesContent(content) {
  const settings = content.settings ?? {}
  requiredText(settings.footerName ?? content.profile?.name, 'Footer name', 60)
  requiredText(settings.footerDescription ?? content.profile?.tagline, 'Footer description', 180)

  const copyrightYear = String(content.profile?.copyrightYear ?? '').trim()
  if (!/^\d{4}$/.test(copyrightYear)) {
    throw validationError('Copyright year must use four digits')
  }

  const notFound = content.sections?.notFound ?? {}
  requiredText(notFound.title, '404 page title', 90)
  requiredText(notFound.copy, '404 page message', 240)
}
