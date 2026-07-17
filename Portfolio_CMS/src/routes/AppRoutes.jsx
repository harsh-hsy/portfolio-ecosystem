import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import PublicRoute from "../components/auth/PublicRoute";
import DashboardLayout from "../layouts/DashboardLayout";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import About from "../pages/About";
import Projects from "../pages/Projects";
import Skills from "../pages/Skills";
import Certificates from "../pages/Certificates";
import Journey from "../pages/Journey";
import Services from "../pages/Services";
import Achievements from "../pages/Achievements";
import Contact from "../pages/Contact";
import Inbox from "../pages/Inbox";
import Links from "../pages/Links";
import Settings from "../pages/Settings";
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
        <Route path="certificates" element={<Certificates />} />
        <Route path="journey" element={<Journey />} />
        <Route path="services" element={<Services />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="contact" element={<Contact />} />
        <Route path="links" element={<Links />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="settings" element={<Settings />} />
        <Route path="/account" element={<Account />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;
