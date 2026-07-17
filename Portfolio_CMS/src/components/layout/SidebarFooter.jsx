import { NavLink } from "react-router-dom";

import { footerNavigation } from "../../data/navigation";
import { useAuth } from "../../hooks/useAuth";

function SidebarFooter() {
  const { logout } = useAuth();

  async function handleAction(item) {
    if (item.action === "logout") {
      await logout();
    }
  }

  return (
    <div className="sidebar-footer">
      <ul className="sidebar-footer__menu">
        {footerNavigation.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.id}>
              {item.action ? (
                <button
                  type="button"
                  className={`sidebar-nav__link ${
                    item.danger
                      ? "sidebar-nav__link--danger"
                      : ""
                  }`}
                  onClick={() => handleAction(item)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              ) : item.external ? (
                <a
                  href={item.path}
                  className="sidebar-nav__link"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </a>
              ) : (
                <NavLink
                  to={item.path}
                  className={`sidebar-nav__link ${
                    item.danger
                      ? "sidebar-nav__link--danger"
                      : ""
                  }`}
                >
                  <Icon size={20} />

                  <span>{item.label}</span>
                </NavLink>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SidebarFooter;
