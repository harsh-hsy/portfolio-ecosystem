import SidebarBrand from "./SidebarBrand";
import SidebarNav from "./SidebarNav";
import SidebarFooter from "./SidebarFooter";

function Sidebar() {
  return (
    <aside className="sidebar">
      <SidebarBrand />

      <SidebarNav />

      <SidebarFooter />
    </aside>
  );
}

export default Sidebar;