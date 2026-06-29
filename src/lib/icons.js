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
  FaReact,
} from 'react-icons/fa'
import { FiBriefcase, FiGlobe, FiMapPin, FiUser } from 'react-icons/fi'
import { SiCanva, SiExpress, SiMongodb, SiTailwindcss, SiVite } from 'react-icons/si'
import { VscCode } from 'react-icons/vsc'

export const iconRegistry = {
  bootstrap: FaBootstrap,
  briefcase: FiBriefcase,
  canva: SiCanva,
  code: VscCode,
  css: FaCss3Alt,
  email: FaEnvelope,
  express: SiExpress,
  figma: FaFigma,
  git: FaGitAlt,
  github: FaGithub,
  globe: FiGlobe,
  html: FaHtml5,
  javascript: FaJs,
  linkedin: FaLinkedinIn,
  mapPin: FiMapPin,
  mongodb: SiMongodb,
  node: FaNodeJs,
  paint: FaPaintBrush,
  react: FaReact,
  tailwind: SiTailwindcss,
  user: FiUser,
  vite: SiVite,
}

export function getIcon(icon) {
  return iconRegistry[icon]
}
