import { isSupportedIconKey } from './iconContent.js'

function validationError(message) {
  const error = new Error(message)
  error.statusCode = 400
  return error
}

function cleanList(value) {
  return Array.isArray(value)
    ? value.map((item) => String(item).trim()).filter(Boolean)
    : []
}

export function validateHomeContent(content) {
  const profile = content?.profile
  const hero = content?.sections?.hero

  if (!profile || !hero) {
    throw validationError('Home profile and hero content are required')
  }

  if (!profile.name?.trim()) {
    throw validationError('Display name is required')
  }

  if (profile.name.trim().length > 60) {
    throw validationError('Display name must use 60 characters or fewer')
  }

  const rotatingRoles = cleanList(profile.rotatingRoles)
  if (!rotatingRoles.length || rotatingRoles.length > 5) {
    throw validationError('Use between one and five rotating job titles')
  }

  if (!profile.image?.trim()) {
    throw validationError('Hero profile image is required')
  }

  if (!profile.location?.trim()) {
    throw validationError('Location badge is required')
  }

  if (!isSupportedIconKey(hero.orbitLocationIcon ?? 'mapPin')) {
    throw validationError('Select a supported location badge icon')
  }

  if (!hero.description?.trim() || hero.description.trim().length > 280) {
    throw validationError('Hero description is required and must use 280 characters or fewer')
  }

  if (hero.showAvailability !== undefined && typeof hero.showAvailability !== 'boolean') {
    throw validationError('Availability visibility must be true or false')
  }

  if (hero.showAvailability !== false && !hero.availability?.trim()) {
    throw validationError('Availability badge text is required while visible')
  }

  if ((hero.availability ?? '').trim().length > 60) {
    throw validationError('Availability badge must use 60 characters or fewer')
  }

  if (!hero.orbitRole?.trim() || hero.orbitRole.trim().length > 50) {
    throw validationError('Image role badge is required and must use 50 characters or fewer')
  }

  const highlights = cleanList(hero.strip)
  if (!highlights.length || highlights.length > 6) {
    throw validationError('Use between one and six expertise highlights')
  }

  return content
}
