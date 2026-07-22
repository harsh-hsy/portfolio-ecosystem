import { isSupportedIconKey } from './iconContent.js'

function validationError(message) {
  const error = new Error(message)
  error.statusCode = 400
  return error
}

function cleanText(value) {
  return String(value ?? '').trim()
}

export function validateAboutContent(content) {
  const profile = content?.profile
  const about = content?.sections?.about
  const facts = Array.isArray(about?.facts) ? about.facts : []
  const stats = Array.isArray(content?.stats) ? content.stats : []

  if (!profile || !about) {
    throw validationError('About profile and section content are required')
  }

  if (!cleanText(about.title) || cleanText(about.title).length > 140) {
    throw validationError('About title is required and must use 140 characters or fewer')
  }

  if (!cleanText(about.copy) || cleanText(about.copy).length > 280) {
    throw validationError('About short description is required and must use 280 characters or fewer')
  }

  if (!cleanText(profile.about) || cleanText(profile.about).length > 1200) {
    throw validationError('Profile bio is required and must use 1200 characters or fewer')
  }

  if (!cleanText(profile.aboutImage)) {
    throw validationError('About image is required')
  }

  if (!facts.length || facts.length > 6) {
    throw validationError('Use between one and six About fact cards')
  }

  for (const fact of facts) {
    if (!cleanText(fact?.label) || !cleanText(fact?.value)) {
      throw validationError('Every About fact needs a label and value')
    }

    if (!isSupportedIconKey(fact?.icon)) {
      throw validationError('Select a supported icon for every About fact')
    }

    if (fact?.useProfileLocation !== undefined && typeof fact.useProfileLocation !== 'boolean') {
      throw validationError('About location source must be true or false')
    }
  }

  if (!stats.length || stats.length > 4) {
    throw validationError('Use between one and four About statistics')
  }

  for (const stat of stats) {
    if (!cleanText(stat?.label)) {
      throw validationError('Every About statistic needs a label')
    }

    if (!Number.isFinite(Number(stat?.value)) || Number(stat.value) < 0) {
      throw validationError('Every About statistic needs a non-negative number')
    }

    if (cleanText(stat?.suffix).length > 4) {
      throw validationError('Statistic suffixes must use four characters or fewer')
    }
  }

  return content
}
