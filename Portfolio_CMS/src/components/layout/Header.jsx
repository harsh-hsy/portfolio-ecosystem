import { useLocation } from "react-router-dom";
import "../../styles/header.css";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/profile": "Profile",
  "/projects": "Projects",
  "/skills": "Skills",
  "/certificates": "Certificates",
  "/journey": "Journey",
  "/services": "Services",
  "/achievements": "Achievements",
  "/messages": "Inbox",
  "/resume": "Resume",
  "/settings": "Settings",
};

export default function Header() {
  const { pathname } = useLocation();

  const title = pageTitles[pathname] || "Portfolio CMS";

  return (
    <header className="cms-header">
      <div className="header-left">
        <h1>{title}</h1>
      </div>

      <div className="header-right">
        <button className="theme-toggle">
          🌙
        </button>
        <div className="user-placeholder">
          Harsh
        </div>
      </div>
    </header>
  );
}