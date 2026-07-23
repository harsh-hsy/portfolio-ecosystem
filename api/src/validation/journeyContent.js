function validationError(message) {
  const error = new Error(message)
  error.statusCode = 400
  return error
}

function cleanText(value) {
  return String(value ?? '').trim()
}

function validateSection(section, label) {
  if (!section) {
    throw validationError(`${label} section content is required`)
  }

  if (!cleanText(section.title) || cleanText(section.title).length > 140) {
    throw validationError(`${label} title is required and must use 140 characters or fewer`)
  }

  if (!cleanText(section.copy) || cleanText(section.copy).length > 280) {
    throw validationError(`${label} description is required and must use 280 characters or fewer`)
  }
}

function validateEntries(entries, label) {
  if (!Array.isArray(entries) || entries.length < 1 || entries.length > 12) {
    throw validationError(`Use between one and twelve ${label.toLowerCase()} entries`)
  }

  for (const entry of entries) {
    const title = cleanText(entry?.title)
    const category = cleanText(entry?.label)
    const period = cleanText(entry?.period)
    const body = cleanText(entry?.body)

    if (!title || title.length > 120) {
      throw validationError(`Every ${label.toLowerCase()} entry needs a title using 120 characters or fewer`)
    }

    if (!category || category.length > 40) {
      throw validationError(`Every ${label.toLowerCase()} entry needs a label using 40 characters or fewer`)
    }

    if (!period || period.length > 60) {
      throw validationError(`Every ${label.toLowerCase()} entry needs a status or period using 60 characters or fewer`)
    }

    if (!body || body.length > 500) {
      throw validationError(`Every ${label.toLowerCase()} entry needs a description using 500 characters or fewer`)
    }
  }
}

export function validateJourneyContent(content) {
  validateSection(content?.sections?.experience, 'Journey')
  validateEntries(content?.timeline, 'Journey')
  return content
}

export function validateMilestonesContent(content) {
  validateSection(content?.sections?.milestones, 'Milestones')
  validateEntries(content?.milestones, 'Milestone')
  return content
}
