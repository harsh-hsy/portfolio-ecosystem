export function maskDateOfBirth(value, appendSeparator = true) {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length < 2) return digits

  const day = digits.slice(0, 2)
  if (digits.length === 2) return appendSeparator ? `${day}/` : day

  const month = digits.slice(2, 4)
  if (digits.length < 4) return `${day}/${month}`
  if (digits.length === 4) return appendSeparator ? `${day}/${month}/` : `${day}/${month}`

  return `${day}/${month}/${digits.slice(4)}`
}

export function isValidDateOfBirth(value) {
  if (!value) return true
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value)
  if (!match) return false

  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))
  const now = new Date()
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))

  return (
    year >= 1900 &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day &&
    date <= today
  )
}

export function isValidPhone(value) {
  if (!value.trim()) return true
  if (!/^[+\d\s().-]+$/.test(value)) return false
  const digits = value.replace(/\D/g, '')
  return digits.length >= 7 && digits.length <= 15
}
