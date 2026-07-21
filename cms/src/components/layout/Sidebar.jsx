import SidebarBrand from "./SidebarBrand";
import SidebarNav from "./SidebarNav";
import SidebarFooter from "./SidebarFooter";

function Sidebar({ isCollapsed, onToggle }) {
  return (
    <aside className={`sidebar ${isCollapsed ? "sidebar--collapsed" : ""}`}>
      <SidebarBrand isCollapsed={isCollapsed} onToggle={onToggle} />

      <SidebarNav />

      <SidebarFooter />
    </aside>
  );
}

export default Sidebar;
