import {
  FiUser,
  FiMail,
  FiSettings,
} from "react-icons/fi";

const quickAccess = [
  {
  id: "account",
  title: "Account",
  description: "Manage your CMS account",
  icon: FiUser,
  path: "/settings",
},
  {
    id: "inbox",
    title: "Inbox",
    description: "View visitor messages",
    icon: FiMail,
    path: "/inbox",
  },
  {
    id: "settings",
    title: "Settings",
    description: "Configure your CMS",
    icon: FiSettings,
    path: "/settings",
  },
];

export default quickAccess;