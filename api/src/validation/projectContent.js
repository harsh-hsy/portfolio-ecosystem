function validationError(message) {
  const error = new Error(message)
  error.statusCode = 400
  return error
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function isValidWebUrl(value) {
  if (!value) return true

  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

export function validateProjectsContent(content) {
  if (!content || !Array.isArray(content.projects)) {
    throw validationError('Projects must be provided as an array')
  }

  const slugs = new Set()

  content.projects.forEach((project, index) => {
    const label = project?.title?.trim() || `Project ${index + 1}`

    if (!project || typeof project !== 'object') {
      throw validationError(`Project ${index + 1} must be an object`)
    }

    const requiredFields = ['title', 'shortTitle', 'slug', 'category', 'desc']
    const missingField = requiredFields.find((field) => !hasText(project[field]))

    if (missingField) {
      throw validationError(`${label}: ${missingField} is required`)
    }

    const slug = project.slug.trim().toLowerCase()

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw validationError(
        `${label}: slug may only contain lowercase letters, numbers, and hyphens`,
      )
    }

    if (slugs.has(slug)) {
      throw validationError(`${label}: project slug must be unique`)
    }
    slugs.add(slug)

    if (!isValidWebUrl(project.live) || !isValidWebUrl(project.github)) {
      throw validationError(`${label}: live and GitHub links must be valid URLs`)
    }

    if (!Array.isArray(project.images) || !project.images.some(hasText)) {
      throw validationError(`${label}: add at least one project image`)
    }

    if (!Array.isArray(project.tech) || !project.tech.some(hasText)) {
      throw validationError(`${label}: add at least one technology`)
    }

    const listFields = ['features', 'challenges', 'lessons']
    const invalidList = listFields.find(
      (field) =>
        !Array.isArray(project[field]) ||
        project[field].some((item) => typeof item !== 'string'),
    )

    if (invalidList) {
      throw validationError(`${label}: ${invalidList} must be a list of text values`)
    }

    if (project.visible !== undefined && typeof project.visible !== 'boolean') {
      throw validationError(`${label}: visible must be true or false`)
    }

    if (project.featured !== undefined && typeof project.featured !== 'boolean') {
      throw validationError(`${label}: featured must be true or false`)
    }
  })

  return content
}
