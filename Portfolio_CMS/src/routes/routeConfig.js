import { useState } from "react";
import { NavLink } from "react-router-dom";
import routeConfig, { footerRoutes } from "../../routes/routeConfig";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`cms-sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Top */}

      <div className="sidebar-top">
        {!collapsed && (
          <>
            <div className="sidebar-logo">HS</div>

            <div className="sidebar-brand">
              <h2>Portfolio CMS</h2>
            </div>
          </>
        )}

        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
        >
          ☰
        </button>
      </div>

      {/* Navigation */}

      <nav className="sidebar-nav">
        {routeConfig
          .filter((item) => item.showInSidebar)
          .map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <Icon className="sidebar-icon" />

                {!collapsed && (
                  <span className="sidebar-label">{item.name}</span>
                )}
              </NavLink>
            );
          })}
      </nav>

      {/* Footer */}

      <div className="sidebar-footer">
        {footerRoutes.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              className="sidebar-footer-btn"
            >
              <Icon className="sidebar-icon" />

              {!collapsed && (
                <span>{item.name}</span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}