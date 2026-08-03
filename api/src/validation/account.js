function validationError(message) {
  const error = new Error(message)
  error.statusCode = 400
  return error
}

export function validateAccountName(value) {
  const name = String(value ?? '').trim()
  if (!name) throw validationError('Name is required')
  if (name.length > 80) throw validationError('Name must use 80 characters or fewer')
  return name
}

export function validateAccountEmail(value) {
  const email = String(value ?? '').trim().toLowerCase()
  if (!email) throw validationError('Email is required')
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw validationError('Enter a valid email address')
  }
  return email
}

export function validatePhone(value) {
  const phone = String(value ?? '').trim()
  if (!phone) return ''
  if (!/^[+\d\s().-]+$/.test(phone)) {
    throw validationError('Contact number contains unsupported characters')
  }
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 7 || digits.length > 15) {
    throw validationError('Contact number must contain between 7 and 15 digits')
  }
  return phone
}

export function parseDateOfBirth(value) {
  const dateOfBirth = String(value ?? '').trim()
  if (!dateOfBirth) return null

  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dateOfBirth)
  if (!match) throw validationError('Date of birth must use DD/MM/YYYY format')

  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))
  const today = new Date()
  const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))

  if (
    year < 1900
    || date.getUTCFullYear() !== year
    || date.getUTCMonth() !== month - 1
    || date.getUTCDate() !== day
    || date > todayUtc
  ) {
    throw validationError('Enter a valid date of birth')
  }

  return date
}

export function formatDateOfBirth(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${day}/${month}/${date.getUTCFullYear()}`
}
