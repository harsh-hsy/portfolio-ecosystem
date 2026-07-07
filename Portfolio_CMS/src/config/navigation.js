import {
  FiGrid,
  FiUser,
  FiFolder,
  FiCode,
  FiAward,
  FiMap,
  FiLayers,
  FiStar,
  FiInbox,
  FiFileText,
  FiSettings,
} from "react-icons/fi";

export const navigation = [
  { label: "Dashboard", path: "/dashboard", icon: FiGrid },
  { label: "Profile", path: "/profile", icon: FiUser },
  { label: "Projects", path: "/projects", icon: FiFolder },
  { label: "Skills", path: "/skills", icon: FiCode },
  { label: "Certificates", path: "/certificates", icon: FiAward },
  { label: "Journey", path: "/journey", icon: FiMap },
  { label: "Services", path: "/services", icon: FiLayers },
  { label: "Achievements", path: "/achievements", icon: FiStar },
  { label: "Inbox", path: "/messages", icon: FiInbox },
  { label: "Resume", path: "/resume", icon: FiFileText },
  { label: "Settings", path: "/settings", icon: FiSettings },
];