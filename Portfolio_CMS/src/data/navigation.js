import {
  FiGrid,
  FiUser,
  FiFolder,
  FiAward,
  FiMap,
  FiBriefcase,
  FiStar,
  FiMail,
  FiFileText,
  FiSettings,
  FiExternalLink,
  FiLogOut,
} from "react-icons/fi";

const navigation = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: FiGrid,
  },
  {
    id: "profile",
    label: "Profile",
    path: "/profile",
    icon: FiUser,
  },
  {
    id: "projects",
    label: "Projects",
    path: "/projects",
    icon: FiFolder,
  },
  {
    id: "skills",
    label: "Skills",
    path: "/skills",
    icon: FiStar,
  },
  {
    id: "certificates",
    label: "Certificates",
    path: "/certificates",
    icon: FiAward,
  },
  {
    id: "journey",
    label: "Journey",
    path: "/journey",
    icon: FiMap,
  },
  {
    id: "services",
    label: "Services",
    path: "/services",
    icon: FiBriefcase,
  },
  {
    id: "achievements",
    label: "Achievements",
    path: "/achievements",
    icon: FiAward,
  },
  {
    id: "inbox",
    label: "Inbox",
    path: "/inbox",
    icon: FiMail,
  },
  {
    id: "resume",
    label: "Resume",
    path: "/resume",
    icon: FiFileText,
  },
  {
    id: "settings",
    label: "Settings",
    path: "/settings",
    icon: FiSettings,
  },
];

export const footerNavigation = [
  {
    id: "portfolio",
    label: "Back to Portfolio",
    path: "http://localhost:5173/",
    icon: FiExternalLink,
    external: true,
  },
  {
    id: "logout",
    label: "Logout",
    icon: FiLogOut,
    danger: true,
    action: "logout",
  },
];

export default navigation;
