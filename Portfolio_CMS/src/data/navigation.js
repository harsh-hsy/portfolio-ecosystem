import {
  FiGrid,
  FiHome,
  FiUser,
  FiFolder,
  FiAward,
  FiMap,
  FiBriefcase,
  FiStar,
  FiMail,
  FiLink,
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
    id: "home",
    label: "Home",
    path: "/home",
    icon: FiHome,
  },
  {
    id: "about",
    label: "About",
    path: "/about",
    icon: FiUser,
  },
  {
    id: "skills",
    label: "Skills",
    path: "/skills",
    icon: FiStar,
  },
  {
    id: "projects",
    label: "Projects",
    path: "/projects",
    icon: FiFolder,
  },
  {
    id: "journey",
    label: "Journey",
    path: "/journey",
    icon: FiMap,
  },
  {
    id: "certificates",
    label: "Certificates",
    path: "/certificates",
    icon: FiAward,
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
    id: "contact",
    label: "Contact",
    path: "/contact",
    icon: FiMail,
  },
  {
    id: "links",
    label: "Links",
    path: "/links",
    icon: FiLink,
  },
  {
    id: "inbox",
    label: "Inbox",
    path: "/inbox",
    icon: FiMail,
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
