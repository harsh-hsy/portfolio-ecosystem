import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Projects from "../pages/Projects";
import Skills from "../pages/Skills";
import Certificates from "../pages/Certificates";
import Journey from "../pages/Journey";
import Services from "../pages/Services";
import Achievements from "../pages/Achievements";
import Inbox from "../pages/Inbox";
import Resume from "../pages/Resume";
import Settings from "../pages/Settings";
import Account from "../pages/Account";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="projects" element={<Projects />} />
        <Route path="skills" element={<Skills />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="journey" element={<Journey />} />
        <Route path="services" element={<Services />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="resume" element={<Resume />} />
        <Route path="settings" element={<Settings />} />
        <Route path="/account" element={<Account />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;