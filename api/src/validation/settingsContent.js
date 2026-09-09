function validationError(message) {
  const error = new Error(message)
  error.statusCode = 400
  return error
}

function requiredText(value, label, limit) {
  const text = String(value ?? '').trim()
  if (!text) throw validationError(`${label} is required`)
  if (text.length > limit) throw validationError(`${label} must use ${limit} characters or fewer`)
  return text
}

function requiredBoolean(value, label) {
  if (typeof value !== 'boolean') throw validationError(`${label} must be true or false`)
}

export function validateSettingsContent(content) {
  const settings = content.settings ?? {}
  const maintenance = settings.maintenance ?? {}

  requiredBoolean(maintenance.enabled, 'Maintenance mode')
  requiredText(maintenance.heading, 'Maintenance heading', 90)
  requiredText(maintenance.message, 'Maintenance message', 240)
  requiredBoolean(maintenance.announcementEnabled, 'Announcement visibility')
  if (maintenance.announcementEnabled) {
    requiredText(maintenance.announcementText, 'Announcement text', 180)
  }
}
