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
import { SiCanva, SiExpress, SiMongodb, SiTailwindcss, SiVite } from 'react-icons/si'
import { VscCode } from 'react-icons/vsc'
import { projectSlug } from '../utils/format.js'

export const profile = {
  name: 'Harsh Singh',
  fullName: 'Harsh Kumar Singh',
  role: 'Frontend Developer',
  rotatingRoles: ['Frontend Developer', 'React Developer', 'UI Engineer', 'Web Designer'],
  location: 'Kanpur, India',
  email: 'mr.harshsingh.contact@gmail.com',
  github: 'https://github.com/harsh-hsy',
  linkedin: 'https://www.linkedin.com/in/harsh-hsy/',
  resume: 'https://drive.google.com/uc?export=download&id=1ybP16oy2vlj-K3a7CskXdZdX2riJ4vZ8',
  image: '/assets/images/homeImage.png',
  aboutImage: '/assets/images/aboutImage.jpg',
  skillsImage: '/assets/images/skillsImage.jpg',
  about:
    'I am Harsh Kumar Singh, a dedicated Front-End Developer & Web Designer with a passion for creating modern, responsive, and highly functional web experiences. With expertise in HTML, CSS, JavaScript, React.js, and modern UI/UX principles, I specialize in building intuitive, user-friendly, and aesthetically refined digital solutions.',
}

export const socials = [
  { label: 'GitHub', href: profile.github, icon: FaGithub },
  { label: 'LinkedIn', href: profile.linkedin, icon: FaLinkedinIn },
  { label: 'Email', href: `mailto:${profile.email}`, icon: FaEnvelope },
]

export const stats = [
  { value: 6, suffix: '+', label: 'Projects Completed' },
  { value: 20, suffix: '+', label: 'Technologies Practiced' },
  { value: 4, suffix: '+', label: 'Core UI Disciplines' },
  { value: 1, suffix: '+', label: 'Internship Experience' },
]

export const skills = [
  {
    category: 'Frontend',
    items: [
      { name: 'HTML5', icon: FaHtml5 },
      { name: 'CSS3', icon: FaCss3Alt },
      { name: 'JavaScript', icon: FaJs },
      { name: 'React', icon: FaReact },
      { name: 'Tailwind', icon: SiTailwindcss },
      { name: 'Bootstrap', icon: FaBootstrap },
    ],
  },
  {
    category: 'Backend Basics',
    items: [
      { name: 'Node.js', icon: FaNodeJs },
      { name: 'Express', icon: SiExpress },
      { name: 'MongoDB', icon: SiMongodb },
    ],
  },
  {
    category: 'Tools & Design',
    items: [
      { name: 'Git', icon: FaGitAlt },
      { name: 'GitHub', icon: FaGithub },
      { name: 'VS Code', icon: VscCode },
      { name: 'Figma', icon: FaFigma },
      { name: 'Canva', icon: SiCanva },
      { name: 'Photoshop', icon: FaPaintBrush },
      { name: 'Vite', icon: SiVite },
    ],
  },
]

const baseProjects = [
  {
    title: 'QR Fusion - Free & Advanced QR Code Generator',
    shortTitle: 'QR Fusion',
    category: 'Tools',
    desc: 'Generate, customize, and download professional QR codes instantly - free, private, and hassle-free.',
    live: 'https://qrfusion.netlify.app/',
    github: profile.github,
    tech: ['HTML', 'CSS', 'JavaScript', 'UI Design'],
    images: ['/assets/images/qr-fusion/qrfusion-1.png', '/assets/images/qr-fusion/qrfusion-2.png', '/assets/images/qr-fusion/qrfusion-3.png'],
    features: ['Custom QR styling', 'Instant download', 'Privacy-friendly workflow', 'Responsive utility interface'],
  },
  {
    title: 'TypRush - Test Your Typing Speed Online',
    shortTitle: 'TypRush',
    category: 'JavaScript',
    desc: 'Achieve typing excellence with TypeRush - simple, professional, and sound-powered.',
    live: 'https://typrush.netlify.app/',
    github: profile.github,
    tech: ['HTML', 'CSS', 'JavaScript', 'Sound UX'],
    images: ['/assets/images/typrush/typrush-1.png', '/assets/images/typrush/typrush-2.png', '/assets/images/typrush/typrush-3.png'],
    features: ['Typing speed test', 'Accuracy feedback', 'Sound-powered interactions', 'Focused practice UI'],
  },
  {
    title: 'QuickDriveLink - Instant Google Drive Links',
    shortTitle: 'QuickDriveLink',
    category: 'Tools',
    desc: 'Generate instant direct download links from Google Drive - fast, private, and hassle-free.',
    live: 'https://quickdrivelink.netlify.app/',
    github: profile.github,
    tech: ['HTML', 'CSS', 'JavaScript', 'Utility UX'],
    images: ['/assets/images/quickdrivelink/quickdrivelink-1.png', '/assets/images/quickdrivelink/quickdrivelink-2.png', '/assets/images/quickdrivelink/quickdrivelink-3.png'],
    features: ['Drive link conversion', 'Clear validation', 'Fast copy flow', 'Responsive single-purpose tool'],
  },
  {
    title: 'FreshCart - Frontend Shopping Experience',
    shortTitle: 'FreshCart',
    category: 'Frontend',
    desc: 'Responsive grocery website frontend built with HTML, CSS, and JS - clean design and mobile-ready.',
    live: 'https://codewithharshsingh-freshcart.netlify.app/',
    github: profile.github,
    tech: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    images: ['/assets/images/freshcart/freshcart-1.png', '/assets/images/freshcart/freshcart-2.png', '/assets/images/freshcart/freshcart-3.png'],
    features: ['Product browsing layout', 'Grocery storefront UI', 'Mobile-ready grids', 'Clean ecommerce presentation'],
  },
  {
    title: 'Weather App',
    shortTitle: 'Weather App',
    category: 'JavaScript',
    desc: 'Live weather app with light/dark theme, using OpenWeatherMap API and responsive design.',
    live: 'https://codewithharshsingh-weather-app.netlify.app/',
    github: profile.github,
    tech: ['HTML', 'CSS', 'JavaScript', 'OpenWeatherMap'],
    images: ['/assets/images/weather-app/weather-app-1.png', '/assets/images/weather-app/weather-app-2.png', '/assets/images/weather-app/weather-app-3.png'],
    features: ['Live weather data', 'Theme toggle', 'City search', 'Responsive dashboard cards'],
  },
  {
    title: 'Calculator',
    shortTitle: 'Calculator',
    category: 'JavaScript',
    desc: 'A simple, responsive calculator built with HTML, CSS, and JavaScript for basic arithmetic operations.',
    live: 'https://codewithharshsingh-calculator.netlify.app/',
    github: profile.github,
    tech: ['HTML', 'CSS', 'JavaScript'],
    images: ['/assets/images/calculator/calculator-1.png', '/assets/images/calculator/calculator-2.png', '/assets/images/calculator/calculator-3.png'],
    features: ['Basic arithmetic', 'Keyboard-friendly layout', 'Responsive sizing', 'Clean interaction states'],
  },
]

export const projects = baseProjects.map((project) => ({
  ...project,
  slug: projectSlug(project.shortTitle),
  problem: 'The project focuses on turning a common everyday web task into a cleaner, faster, and more approachable browser experience.',
  solution: 'Harsh designed a responsive interface with simple flows, readable hierarchy, and polished interaction states so users can complete the task without friction.',
  challenges: ['Keeping the UI responsive across screen sizes', 'Balancing visual polish with simple performance', 'Making the primary action obvious'],
  lessons: ['Clear interface hierarchy improves trust', 'Small interaction details make tools feel more professional', 'Responsive layouts need to be planned early'],
}))

export const timeline = [
  { title: 'B.Tech in Computer Science & Engineering', label: 'Education', period: 'Current', body: 'Building a foundation in computer science while sharpening frontend and UI engineering skills.' },
  { title: 'Frontend Development Internship', label: 'Internship', period: 'Professional Training', body: 'Applied HTML, CSS, JavaScript, responsive design, and UI thinking to practical web development work.' },
  { title: 'React & UI Learning Journey', label: 'Learning', period: 'Ongoing', body: 'Exploring React architecture, component-driven development, performance, accessibility, and motion design.' },
  { title: 'Future Goal', label: 'Next', period: 'Forward', body: 'Grow into a high-impact frontend engineer building polished, accessible, product-grade web experiences.' },
]

export const services = [
  'Frontend Development',
  'Responsive Websites',
  'Landing Pages',
  'React Applications',
  'UI Development',
  'Performance Optimization',
]

export const achievements = [
  'Built and shipped multiple public web projects',
  'Created focused utility products for QR codes and Google Drive links',
  'Practiced ecommerce, weather, productivity, and typing interfaces',
  'Continuously improving React, UI/UX, and frontend architecture skills',
]

export const certificates = [
  { title: 'Frontend Development Practice', issuer: 'Self-led Learning', date: 'Ongoing', file: profile.resume },
  { title: 'React & UI Engineering Journey', issuer: 'Project Portfolio', date: 'Ongoing', file: profile.resume },
  { title: 'Web Design Foundations', issuer: 'Hands-on Projects', date: 'Ongoing', file: profile.resume },
]
