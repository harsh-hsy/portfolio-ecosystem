import { FiExternalLink, FiLogOut } from "react-icons/fi";

export default function SidebarFooter() {
  return (
    <div className="sidebar-footer">
      <a
        href="http://localhost:5173"
        target="_blank"
        rel="noopener noreferrer"
        className="sidebar-link"
      >
        <FiExternalLink size={18} />
        <span>Back to Portfolio</span>
      </a>

      <button className="sidebar-link">
        <FiLogOut size={18} />
        <span>Logout</span>
      </button>
    </div>
  );
}