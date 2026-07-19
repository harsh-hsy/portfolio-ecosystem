import { NavLink } from "react-router-dom";

import navigation from "../../data/navigation";

function SidebarNav() {
  return (
  <nav className="sidebar-nav">
    <ul className="sidebar-nav__menu">
      {navigation.map((item) => {
        const Icon = item.icon;

        return (
          <li key={item.id}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `sidebar-nav__link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          </li>
        );
      })}
    </ul>
  </nav>
);
}

export default SidebarNav;