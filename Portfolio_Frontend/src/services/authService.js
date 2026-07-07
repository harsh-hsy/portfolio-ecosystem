const AUTH_STORAGE_KEY = 'portfolio-admin-session'

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
}

function saveSession(session) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

function removeSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

function readSession() {
  try {
    const session = localStorage.getItem(AUTH_STORAGE_KEY)
    return session ? JSON.parse(session) : null
  } catch {
    return null
  }
}

export async function getAdminSession() {
  const session = readSession()

  return {
    authenticated: Boolean(session?.authenticated),
    user: session?.user ?? null,
  }
}

export async function loginAdmin(credentials) {
  const username = (credentials?.username ?? '').trim().toLowerCase()
  const password = credentials?.password ?? ''

  if (
    username !== ADMIN_CREDENTIALS.username ||
    password !== ADMIN_CREDENTIALS.password
  ) {
    throw new Error('Invalid username or password.')
  }

  const session = {
    authenticated: true,
    user: {
      username: ADMIN_CREDENTIALS.username,
      name: 'Harsh Singh',
    },
    loggedInAt: Date.now(),
  }

  saveSession(session)

  return session
}

export async function logoutAdmin() {
  removeSession()

  return {
    authenticated: false,
  }
}