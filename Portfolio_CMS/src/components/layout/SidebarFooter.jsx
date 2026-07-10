import { NavLink } from "react-router-dom";

import { footerNavigation } from "../../data/navigation";

function SidebarFooter() {
  return (
    <div className="sidebar-footer">
      <ul className="sidebar-footer__menu">
        {footerNavigation.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.id}>
              <NavLink
  to={item.path}
  className={`sidebar-nav__link ${
    item.danger ? "sidebar-nav__link--danger" : ""
  }`}
>
                <Icon size={20} />

                <span>{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SidebarFooter;