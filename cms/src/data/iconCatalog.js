import {
  FaBootstrap,
  FaCss3Alt,
  FaEnvelope,
  FaFigma,
  FaGithub,
  FaGitAlt,
  FaHtml5,
  FaJs,
  FaLinkedinIn,
  FaNodeJs,
  FaPaintBrush,
  FaPalette,
  FaReact,
} from "react-icons/fa";
import { FiBriefcase, FiGlobe, FiMapPin, FiUser } from "react-icons/fi";
import {
  SiExpress,
  SiMongodb,
  SiTailwindcss,
  SiVite,
} from "react-icons/si";
import { VscCode } from "react-icons/vsc";

export const iconCatalog = [
  { key: "user", label: "Person", category: "General", Icon: FiUser, keywords: "profile account person" },
  { key: "briefcase", label: "Briefcase", category: "General", Icon: FiBriefcase, keywords: "work internship career" },
  { key: "mapPin", label: "Location Pin", category: "General", Icon: FiMapPin, keywords: "location address place" },
  { key: "globe", label: "Globe", category: "General", Icon: FiGlobe, keywords: "language web global" },
  { key: "email", label: "Email", category: "Communication", Icon: FaEnvelope, keywords: "mail contact message" },
  { key: "github", label: "GitHub", category: "Social", Icon: FaGithub, keywords: "repository code social" },
  { key: "linkedin", label: "LinkedIn", category: "Social", Icon: FaLinkedinIn, keywords: "career social profile" },
  { key: "html", label: "HTML5", category: "Frontend", Icon: FaHtml5, keywords: "markup web frontend" },
  { key: "css", label: "CSS3", category: "Frontend", Icon: FaCss3Alt, keywords: "style web frontend" },
  { key: "javascript", label: "JavaScript", category: "Frontend", Icon: FaJs, keywords: "js language frontend" },
  { key: "react", label: "React", category: "Frontend", Icon: FaReact, keywords: "reactjs library frontend" },
  { key: "tailwind", label: "Tailwind CSS", category: "Frontend", Icon: SiTailwindcss, keywords: "css style utility" },
  { key: "bootstrap", label: "Bootstrap", category: "Frontend", Icon: FaBootstrap, keywords: "css framework frontend" },
  { key: "vite", label: "Vite", category: "Frontend", Icon: SiVite, keywords: "build tool frontend" },
  { key: "node", label: "Node.js", category: "Backend", Icon: FaNodeJs, keywords: "nodejs javascript backend" },
  { key: "express", label: "Express", category: "Backend", Icon: SiExpress, keywords: "node api backend" },
  { key: "mongodb", label: "MongoDB", category: "Backend", Icon: SiMongodb, keywords: "database backend mongo" },
  { key: "git", label: "Git", category: "Tools", Icon: FaGitAlt, keywords: "version control development" },
  { key: "code", label: "VS Code", category: "Tools", Icon: VscCode, keywords: "editor development code" },
  { key: "figma", label: "Figma", category: "Design", Icon: FaFigma, keywords: "design ui ux" },
  { key: "canva", label: "Canva", category: "Design", Icon: FaPalette, keywords: "design graphics" },
  { key: "paint", label: "Design Tool", category: "Design", Icon: FaPaintBrush, keywords: "photoshop paint design" },
];

export const iconKeys = new Set(iconCatalog.map((icon) => icon.key));

export function getIconOption(key) {
  return iconCatalog.find((icon) => icon.key === key) ?? iconCatalog[0];
}

export function isSupportedIcon(key) {
  return iconKeys.has(key);
}
