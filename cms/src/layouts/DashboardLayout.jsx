import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { getAdminPortfolio } from "../services/portfolioService";

const defaultExperience = {
  defaultTheme: "system",
  desktopAnimations: true,
  mobileAnimations: false,
  stickyHeader: true,
  respectReducedMotion: true,
  mobileSidebarMode: "compact",
};

function DashboardLayout() {
  const location = useLocation();
  const [hasSavedTheme] = useState(() => Boolean(localStorage.getItem("cms-theme")));
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
  const [experience, setExperience] = useState(defaultExperience);

  useEffect(() => {
    let active = true;

    getAdminPortfolio()
      .then((response) => {
        if (!active) return;
        const nextExperience = {
          ...defaultExperience,
          ...(response.content?.settings?.cmsExperience ?? {}),
        };
        setExperience(nextExperience);

        if (!hasSavedTheme) {
          const preferredTheme = nextExperience.defaultTheme === "system"
            ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
            : nextExperience.defaultTheme;
          setTheme(preferredTheme);
        }

        if (window.matchMedia("(max-width: 768px)").matches) {
          setIsSidebarCollapsed(nextExperience.mobileSidebarMode === "compact");
        }
      })
      .catch(() => {
        // The individual page will surface API errors; layout preferences safely use defaults.
      });

    return () => {
      active = false;
    };
  }, [hasSavedTheme]);

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
      experience.desktopAnimations ? "" : "cms-no-desktop-motion",
      experience.mobileAnimations ? "" : "cms-no-mobile-motion",
      experience.stickyHeader ? "" : "cms-header-static",
      experience.respectReducedMotion ? "cms-respect-reduced-motion" : "",
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
