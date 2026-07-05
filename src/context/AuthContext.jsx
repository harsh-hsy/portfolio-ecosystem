import { useCallback, useEffect, useMemo, useState } from 'react'
import { getAdminSession, loginAdmin, logoutAdmin } from '../services/authService.js'
import { AuthContext } from './auth-context.js'

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  const refreshSession = useCallback(async () => {
    try {
      const session = await getAdminSession()
      setAuthenticated(Boolean(session.authenticated))
    } catch {
      setAuthenticated(false)
    } finally {
      setCheckingSession(false)
    }
  }, [])

  useEffect(() => {
    refreshSession()
  }, [refreshSession])

  const login = useCallback(async (credentials) => {
    const session = await loginAdmin(credentials)
    setAuthenticated(Boolean(session.authenticated))
    return session
  }, [])

  const logout = useCallback(async () => {
    await logoutAdmin()
    setAuthenticated(false)
  }, [])

  const value = useMemo(
    () => ({ authenticated, checkingSession, login, logout, refreshSession }),
    [authenticated, checkingSession, login, logout, refreshSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
