export function withDefaults(value, defaults) {
  if (!value || typeof value !== 'object') return defaults

  return Object.entries(defaults).reduce((current, [key, defaultValue]) => {
    const nextValue = current[key]
    if (nextValue === undefined || nextValue === null) {
      return { ...current, [key]: defaultValue }
    }
    if (isPlainObject(defaultValue)) {
      return { ...current, [key]: withDefaults(nextValue, defaultValue) }
    }
    return current
  }, value)
}

export function ensureArray(value, fallback = []) {
  return Array.isArray(value) ? value : fallback
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}
