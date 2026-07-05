import { Helmet } from 'react-helmet-async'
import { FiEdit3, FiImage, FiLogOut, FiSettings, FiShield } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { getHomeContent } from '../../lib/contentSelectors.js'
import { useAuth } from '../../hooks/useAuth.js'

const modules = [
  { title: 'Profile', body: 'Name, role, email, location, resume, social links.', icon: FiShield },
  { title: 'Content', body: 'Home, About, Skills, Projects, Journey, Achievements.', icon: FiEdit3 },
  { title: 'Media', body: 'Hero, About, Skills, Projects, and Certificates images.', icon: FiImage },
  { title: 'Settings', body: 'SEO, navigation, footer, theme-ready preferences.', icon: FiSettings },
]

export default function Dashboard() {
  const { profile } = getHomeContent()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const signOut = async () => {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <section className="admin-dashboard">
      <Helmet><title>Dashboard | Harsh Singh</title></Helmet>
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span>HS</span>
          <strong>Portfolio CMS</strong>
        </div>
        <nav aria-label="Admin modules">
          {modules.map((module) => {
            const Icon = module.icon
            return <a key={module.title} href={`#${module.title.toLowerCase()}`}><Icon /> {module.title}</a>
          })}
        </nav>
        <button type="button" onClick={signOut}><FiLogOut /> Logout</button>
      </aside>
      <main className="admin-main">
        <motion.header className="admin-hero" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <p className="admin-kicker">Protected Dashboard</p>
          <h1>Manage {profile.name}'s portfolio.</h1>
          <p>This backend-authenticated shell is ready for editable CMS modules in the next phase.</p>
        </motion.header>
        <div className="admin-module-grid">
          {modules.map((module) => {
            const Icon = module.icon
            return (
              <motion.article id={module.title.toLowerCase()} className="admin-module-card" key={module.title} whileHover={{ y: -4 }}>
                <Icon />
                <h2>{module.title}</h2>
                <p>{module.body}</p>
              </motion.article>
            )
          })}
        </div>
      </main>
    </section>
  )
}
