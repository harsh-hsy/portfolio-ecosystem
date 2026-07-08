import { navigation } from "../../config/navigation";
import SidebarItem from "./SidebarItem";
import SidebarFooter from "./SidebarFooter";
import "../../styles/sidebar.css";

export default function Sidebar() {
  return (
    <aside className="cms-sidebar">

      <div className="sidebar-logo">
  <h2>Portfolio CMS</h2>
  <p>Manage your portfolio</p>
</div>

      <nav className="sidebar-nav">
        {navigation.map((item) => (
          <SidebarItem key={item.path} item={item} />
        ))}
      </nav>

      <SidebarFooter />

    </aside>
  );
}