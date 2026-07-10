import { LuPanelLeftClose } from "react-icons/lu";

function SidebarBrand() {
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
        aria-label="Collapse Sidebar"
      >
        <LuPanelLeftClose size={20} />
      </button>
    </div>
  );
}

export default SidebarBrand;