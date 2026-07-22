import { isSupportedIconKey } from './iconContent.js'

function validationError(message) {
  const error = new Error(message)
  error.statusCode = 400
  return error
}

function cleanText(value) {
  return String(value ?? '').trim()
}

function hasDuplicates(values) {
  const normalized = values.map((value) => cleanText(value).toLowerCase())
  return new Set(normalized).size !== normalized.length
}

export function validateSkillsContent(content) {
  const profile = content?.profile
  const section = content?.sections?.skills
  const groups = Array.isArray(content?.skills) ? content.skills : []

  if (!profile || !section) {
    throw validationError('Skills profile and section content are required')
  }

  if (!cleanText(section.title) || cleanText(section.title).length > 140) {
    throw validationError('Skills title is required and must use 140 characters or fewer')
  }

  if (!cleanText(section.copy) || cleanText(section.copy).length > 280) {
    throw validationError('Skills description is required and must use 280 characters or fewer')
  }

  if (!cleanText(profile.skillsImage)) {
    throw validationError('Skills image is required')
  }

  if (!groups.length || groups.length > 6) {
    throw validationError('Use between one and six skill categories')
  }

  if (hasDuplicates(groups.map((group) => group?.category))) {
    throw validationError('Skill category names must be unique')
  }

  for (const group of groups) {
    const category = cleanText(group?.category)
    const items = Array.isArray(group?.items) ? group.items : []

    if (!category || category.length > 50) {
      throw validationError('Every skill category needs a name using 50 characters or fewer')
    }

    if (!items.length || items.length > 16) {
      throw validationError('Each skill category must contain between one and sixteen skills')
    }

    if (hasDuplicates(items.map((skill) => skill?.name))) {
      throw validationError(`Skill names in ${category} must be unique`)
    }

    for (const skill of items) {
      const name = cleanText(skill?.name)

      if (!name || name.length > 40) {
        throw validationError('Every skill needs a name using 40 characters or fewer')
      }

      if (!isSupportedIconKey(skill?.icon)) {
        throw validationError(`Select a supported icon for ${name}`)
      }
    }
  }

  return content
}
