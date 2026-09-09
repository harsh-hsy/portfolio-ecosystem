import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { cmsExperience } from "../../config/cmsExperience.js";

function DashboardLayout() {
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("cms-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    if (cmsExperience.defaultTheme === "light" || cmsExperience.defaultTheme === "dark") {
      return cmsExperience.defaultTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const savedState = localStorage.getItem("cms-sidebar-collapsed");
    if (savedState === "true" || savedState === "false") return savedState === "true";

    return window.matchMedia("(max-width: 768px)").matches
      && cmsExperience.mobileSidebarMode === "compact";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("cms-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(
      "cms-sidebar-collapsed",
      String(isSidebarCollapsed),
    );
  }, [isSidebarCollapsed]);

  useEffect(() => {
    document.body.classList.add("cms-dashboard-open");

    return () => document.body.classList.remove("cms-dashboard-open");
  }, []);

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark",
    );
  }

  return (
    <div className={[
      "dashboard-layout",
      cmsExperience.desktopAnimations ? "" : "cms-no-desktop-motion",
      cmsExperience.mobileAnimations ? "" : "cms-no-mobile-motion",
      cmsExperience.stickyHeader ? "" : "cms-header-static",
      cmsExperience.respectReducedMotion ? "cms-respect-reduced-motion" : "",
    ].filter(Boolean).join(" ")}>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((isCollapsed) => !isCollapsed)}
      />

      <div className="dashboard-content">
        <Header theme={theme} onToggleTheme={toggleTheme} />

        <main
          className={`dashboard-main${location.pathname.startsWith("/projects") ? " dashboard-main--projects" : ""}`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
