import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'

export default function DashboardLayout({ children }) {
  return (
    <div className="cms-layout">
      <Sidebar />

      <div className="cms-main">

        <Header />

        <main className="cms-content">
          {children}
        </main>

      </div>
    </div>
  )
}