import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import PublicRoute from "../components/auth/PublicRoute";
import DashboardLayout from "../layouts/DashboardLayout";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import About from "../pages/About";
import Projects from "../pages/Projects";
import ProjectEditor from "../pages/ProjectEditor";
import Skills from "../pages/Skills";
import Certificates from "../pages/Certificates";
import CertificateEditor from "../pages/CertificateEditor";
import Journey from "../pages/Journey";
import Milestones from "../pages/Milestones";
import Services from "../pages/Services";
import Achievements from "../pages/Achievements";
import Contact from "../pages/Contact";
import Inbox from "../pages/Inbox";
import Links from "../pages/Links";
import Settings from "../pages/Settings";
import SettingsHub from "../pages/SettingsHub";
import GlobalPages from "../pages/GlobalPages";
import Account from "../pages/Account";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="home" element={<Home />} />
        <Route path="profile" element={<Navigate to="/home" replace />} />
        <Route path="about" element={<About />} />
        <Route path="skills" element={<Skills />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:slug" element={<ProjectEditor />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="certificates/:slug" element={<CertificateEditor />} />
        <Route path="journey" element={<Journey />} />
        <Route path="milestones" element={<Milestones />} />
        <Route path="services" element={<Services />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="contact" element={<Contact />} />
        <Route path="links" element={<Links />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="global-pages" element={<GlobalPages />} />
        <Route path="settings" element={<SettingsHub />} />
        <Route path="settings/portfolio/identity" element={<Settings section="portfolio-identity" />} />
        <Route path="settings/portfolio/experience" element={<Settings section="portfolio-experience" />} />
        <Route path="settings/portfolio/social-sharing" element={<Settings section="portfolio-social-sharing" />} />
        <Route path="settings/cms/identity" element={<Settings section="cms-identity" />} />
        <Route path="settings/cms/experience" element={<Settings section="cms-experience" />} />
        <Route path="settings/cms/social-sharing" element={<Settings section="cms-social-sharing" />} />
        <Route path="settings/seo" element={<Settings section="seo" />} />
        <Route path="settings/maintenance" element={<Settings section="maintenance" />} />
        <Route path="/account" element={<Account />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;
