import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

function DashboardLayout() {
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("cms-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    () => localStorage.getItem("cms-sidebar-collapsed") === "true",
  );

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
    <div className="dashboard-layout">
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
