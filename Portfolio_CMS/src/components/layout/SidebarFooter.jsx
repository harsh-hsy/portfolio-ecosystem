export default function SidebarFooter() {
  return (
    <div className="sidebar-footer">
      <a
        href="http://localhost:5173"
        target="_blank"
        rel="noopener noreferrer"
        className="sidebar-link"
      >
        🌍 Back to Portfolio
      </a>

      <button className="sidebar-link">
        🚪 Logout
      </button>
    </div>
  );
}