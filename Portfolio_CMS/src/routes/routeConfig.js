import {
  FiGrid,
  FiUser,
  FiFolder,
  FiLayers,
  FiAward,
  FiClock,
  FiBriefcase,
  FiTrendingUp,
  FiMail,
  FiFileText,
  FiSettings,
  FiExternalLink,
  FiLogOut,
} from "react-icons/fi";

const routeConfig = [
  {
    id: "dashboard",
    name: "Dashboard",
    path: "/",
    icon: FiGrid,
    showInSidebar: true,
  },
  {
    id: "profile",
    name: "Profile",
    path: "/profile",
    icon: FiUser,
    showInSidebar: true,
  },
  {
    id: "projects",
    name: "Projects",
    path: "/projects",
    icon: FiFolder,
    showInSidebar: true,
  },
  {
    id: "skills",
    name: "Skills",
    path: "/skills",
    icon: FiLayers,
    showInSidebar: true,
  },
  {
    id: "certificates",
    name: "Certificates",
    path: "/certificates",
    icon: FiAward,
    showInSidebar: true,
  },
  {
    id: "journey",
    name: "Journey",
    path: "/journey",
    icon: FiClock,
    showInSidebar: true,
  },
  {
    id: "services",
    name: "Services",
    path: "/services",
    icon: FiBriefcase,
    showInSidebar: true,
  },
  {
    id: "achievements",
    name: "Achievements",
    path: "/achievements",
    icon: FiTrendingUp,
    showInSidebar: true,
  },
  {
    id: "inbox",
    name: "Inbox",
    path: "/inbox",
    icon: FiMail,
    showInSidebar: true,
  },
  {
    id: "resume",
    name: "Resume",
    path: "/resume",
    icon: FiFileText,
    showInSidebar: true,
  },
  {
    id: "settings",
    name: "Settings",
    path: "/settings",
    icon: FiSettings,
    showInSidebar: true,
  },
];

export const footerRoutes = [
  {
    id: "portfolio",
    name: "Back to Portfolio",
    path: "/portfolio",
    icon: FiExternalLink,
  },
  {
    id: "logout",
    name: "Logout",
    path: "/logout",
    icon: FiLogOut,
  },
];

export default routeConfig;