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

function optionalUrl(value, label) {
  const text = String(value ?? '').trim()
  if (!text) return

  try {
    const url = new URL(text)
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error()
  } catch {
    throw validationError(`${label} must be a valid HTTP or HTTPS URL`)
  }
}

function requiredBoolean(value, label) {
  if (typeof value !== 'boolean') throw validationError(`${label} must be true or false`)
}

export function validateSettingsContent(content) {
  const settings = content.settings ?? {}
  const identity = settings.siteIdentity ?? {}
  const sharing = settings.socialSharing ?? {}
  const experience = settings.experience ?? {}
  const maintenance = settings.maintenance ?? {}
  const seo = content.seo ?? {}

  requiredText(identity.siteName, 'Site name', 80)
  requiredText(settings.brandInitials, 'Brand initials', 4)
  requiredText(identity.titleSuffix, 'Browser title suffix', 60)
  requiredText(identity.authorName, 'Default author name', 80)
  optionalUrl(identity.portfolioUrl, 'Primary portfolio URL')
  optionalUrl(identity.favicon, 'Favicon URL')

  requiredText(seo.title, 'Default meta title', 70)
  requiredText(seo.description, 'Default meta description', 180)
  requiredText(seo.keywords, 'SEO keywords', 300)
  requiredBoolean(seo.allowIndexing, 'Search engine indexing')

  requiredText(sharing.openGraphTitle, 'Open Graph title', 70)
  requiredText(sharing.openGraphDescription, 'Open Graph description', 200)
  optionalUrl(sharing.image, 'Social sharing image URL')
  if (!['summary', 'summary_large_image'].includes(sharing.twitterCard)) {
    throw validationError('Select a supported Twitter card type')
  }

  requiredBoolean(experience.loadingEnabled, 'Loading animation')
  const duration = Number(experience.loadingDurationMs)
  if (!Number.isInteger(duration) || duration < 0 || duration > 5000) {
    throw validationError('Loading duration must be between 0 and 5000 milliseconds')
  }
  ;[
    ['desktopAnimations', 'Desktop animations'],
    ['mobileAnimations', 'Mobile animations'],
    ['smoothScroll', 'Smooth scrolling'],
    ['rotatingRole', 'Rotating job title'],
    ['stickyHeader', 'Sticky header'],
    ['respectReducedMotion', 'Reduced-motion preference'],
  ].forEach(([key, label]) => requiredBoolean(experience[key], label))

  requiredBoolean(maintenance.enabled, 'Maintenance mode')
  requiredText(maintenance.heading, 'Maintenance heading', 90)
  requiredText(maintenance.message, 'Maintenance message', 240)
  requiredBoolean(maintenance.announcementEnabled, 'Announcement visibility')
  if (maintenance.announcementEnabled) {
    requiredText(maintenance.announcementText, 'Announcement text', 180)
  }
}
