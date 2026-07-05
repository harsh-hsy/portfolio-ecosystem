import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Navigate, useNavigate } from 'react-router-dom'
import { FiLock, FiLogIn } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.js'

const initialForm = { username: '', password: '' }

export default function AdminLogin() {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { authenticated, checkingSession, login } = useAuth()
  const navigate = useNavigate()

  if (!checkingSession && authenticated) return <Navigate to="/dashboard" replace />

  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(form)
      navigate('/dashboard', { replace: true })
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="admin-auth-page">
      <Helmet><title>Admin Access | Harsh Singh</title></Helmet>
      <motion.form className="admin-auth-card" onSubmit={submit} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}>
        <span className="admin-auth-mark"><FiLock /></span>
        <div>
          <p className="admin-kicker">Private Workspace</p>
          <h1>Admin Access</h1>
          <p>Sign in to manage protected portfolio content.</p>
        </div>
        <label>
          <span>Username</span>
          <input name="username" value={form.username} onChange={update} autoComplete="username" required />
        </label>
        <label>
          <span>Password</span>
          <input name="password" value={form.password} onChange={update} type="password" autoComplete="current-password" required />
        </label>
        {error && <p className="admin-error">{error}</p>}
        <button type="submit" disabled={submitting}>
          <FiLogIn /> {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </motion.form>
    </section>
  )
}
