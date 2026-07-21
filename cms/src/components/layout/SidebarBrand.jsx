import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";

function SidebarBrand({ isCollapsed, onToggle }) {
  return (
    <div className="sidebar-brand">
      <div className="sidebar-brand__logo">
        HS
      </div>

      <div className="sidebar-brand__content">
        <h2>Portfolio CMS</h2>
        <p>Admin Dashboard</p>
      </div>

      <button
        type="button"
        className="sidebar-brand__toggle"
        onClick={onToggle}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!isCollapsed}
      >
        {isCollapsed ? (
          <LuPanelLeftOpen size={20} />
        ) : (
          <LuPanelLeftClose size={20} />
        )}
      </button>
    </div>
  );
}

export default SidebarBrand;
