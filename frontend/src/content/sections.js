import { profile } from "./profile.js";

export const sectionContent = {
  hero: {
    id: "hero",
    showAvailability: true,
    availability: "Available for frontend opportunities",
    intro: "Hi, I am",
    description:
      "Building beautiful, accessible and high-performance web experiences with React, thoughtful UI design, and clean frontend architecture.",
    primaryAction: "Download Resume",
    secondaryAction: "View Projects",
    contactAction: "Let's Connect",
    orbitLocation: profile.location,
    orbitLocationIcon: "mapPin",
    orbitRole: "React UI Engineer",
    strip: ["React", "Accessible UI", "Responsive Design", "Performance"],
  },

  about: {
    id: "about",
    eyebrow: "About",
    title: "A frontend developer with a designer's eye.",
    copy: "I build modern, responsive web experiences with frontend development and thoughtful design.",
    facts: [
      {
        label: "Education",
        value: "B.Tech in Computer Science & Engineering",
        icon: "user",
      },
      {
        label: "Internship",
        value: "Software Engineer Internship",
        icon: "briefcase",
      },
      {
        label: "Location",
        value: profile.location,
        icon: "mapPin",
        useProfileLocation: true,
      },
      {
        label: "Languages",
        value: "English, Hindi",
        icon: "globe",
      },
    ],
  },

  skills: {
    id: "skills",
    eyebrow: "Skills",
    title: "Modern frontend toolkit, organized for product work.",
    copy: "Skills, technologies, and tools I use to build modern and responsive web experiences.",
  },

  projects: {
    id: "projects",
    eyebrow: "Selected Projects",
    title: "Projects with real-world impact.",
    copy: "Explore projects that reflect my skills, creativity, and passion for modern web experiences.",
    allFilterLabel: "All",
    filterAriaLabel: "Filter projects",
    searchPlaceholder: "Search projects",
  },

  experience: {
    id: "experience",
    eyebrow: "Journey",
    title: "My journey in frontend development.",
    copy: "A timeline of my education, internship, continuous learning, and professional growth.",
  },

  milestones: {
    id: "milestones",
    eyebrow: "Milestones",
    title: "Milestones from my development journey.",
    copy: "Key milestones that reflect my learning, projects, and professional growth.",
  },

  certificates: {
    id: "certificates",
    eyebrow: "Certificates",
    title: "Certifications that reflect my learning.",
    copy: "A collection of certifications showcasing my skills, continuous learning, and professional growth.",
    viewLabel: "View",
    downloadLabel: "Download",
  },

  services: {
    id: "services",
    eyebrow: "Services",
    title: "What I Build.",
  },

  achievements: {
    id: "achievements",
    eyebrow: "Achievements",
    title: "Milestones from the coding journey.",
  },

  contact: {
    id: "contact",
    eyebrow: "Contact",
    title: "Let's build something amazing.",
    copy: "Open to frontend development, React applications, responsive websites, and polished UI work.",
    availability: "Available for opportunities",
    panelTitle: "Send me a message and I'll get back to you soon.",
    errorMessage: "Please complete every field.",
    successMessage: "Message sent successfully.",
    failureMessage: "Failed to send message.",
    submitLabel: "Send Message",
    fields: {
      name: "Name",
      email: "Email",
      subject: "Subject",
      message: "Message",
    },
  },

  notFound: {
    id: "not-found",
    eyebrow: "404",
    title: "Page not found.",
    copy: "This route does not exist, but the portfolio is one click away.",
    action: "Back Home",
  },
};

export const stats = [
  {
    id: "projects",
    value: 6,
    suffix: "+",
    label: "Projects Completed",
  },
  {
    id: "technologies",
    value: 20,
    suffix: "+",
    label: "Technologies Practiced",
  },
  {
    id: "disciplines",
    value: 4,
    suffix: "+",
    label: "Core UI Disciplines",
  },
  {
    id: "internship",
    value: 1,
    suffix: "+",
    label: "Internship Experience",
  },
];
