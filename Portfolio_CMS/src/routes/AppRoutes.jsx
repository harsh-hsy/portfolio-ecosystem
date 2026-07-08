import { Routes, Route } from 'react-router-dom'

import DashboardLayout from "../layouts/DashboardLayout";

import Login from '../pages/auth/Login'
import Dashboard from '../pages/dashboard/Dashboard'
import Profile from '../pages/dashboard/Profile'
import Projects from '../pages/dashboard/Projects'
import Skills from '../pages/dashboard/Skills'
import Certificates from '../pages/dashboard/Certificates'
import Journey from '../pages/dashboard/Journey'
import Services from '../pages/dashboard/Services'
import Achievements from '../pages/dashboard/Achievements'
import Messages from '../pages/dashboard/Messages'
import Resume from '../pages/dashboard/Resume'
import Settings from '../pages/dashboard/Settings'

export default function AppRoutes() {
  return (
    
<Routes>
  <Route path="/" element={<Login />} />

  <Route element={<DashboardLayout />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/projects" element={<Projects />} />
    <Route path="/skills" element={<Skills />} />
    <Route path="/certificates" element={<Certificates />} />
    <Route path="/journey" element={<Journey />} />
    <Route path="/services" element={<Services />} />
    <Route path="/achievements" element={<Achievements />} />
    <Route path="/messages" element={<Messages />} />
    <Route path="/resume" element={<Resume />} />
    <Route path="/settings" element={<Settings />} />
  </Route>
</Routes>
  )
}