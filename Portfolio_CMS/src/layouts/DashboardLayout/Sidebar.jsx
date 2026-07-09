export default function Sidebar() {
  return (
    <aside className="cms-sidebar">

      <div className="sidebar-brand">
        <h2>HS</h2>
        <span>Portfolio CMS</span>
      </div>

      <nav className="sidebar-nav">

        <a className="active">Dashboard</a>

        <a>Profile</a>

        <a>Projects</a>

        <a>Skills</a>

        <a>Certificates</a>

        <a>Journey</a>

        <a>Services</a>

        <a>Achievements</a>

        <a>Inbox</a>

        <a>Resume</a>

        <a>Settings</a>

      </nav>

      <div className="sidebar-footer">

        <button>🌍 Portfolio</button>

        <button>🚪 Logout</button>

      </div>

    </aside>
  );
}