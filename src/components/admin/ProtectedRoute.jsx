import { Navigate } from 'react-router-dom'
import LoadingScreen from '../common/LoadingScreen.jsx'
import { useAuth } from '../../hooks/useAuth.js'

export default function ProtectedRoute({ children }) {
  const { authenticated, checkingSession } = useAuth()

  if (checkingSession) return <LoadingScreen show />
  if (!authenticated) return <Navigate to="/admin/login" replace />

  return children
}
