import { profile } from './profile.js'

export const sectionContent = {
  hero: {
    availability: 'Available for frontend opportunities',
    intro: 'Hi, I am',
    description: 'Building beautiful, accessible and high-performance web experiences with React, thoughtful UI design, and clean frontend architecture.',
    primaryAction: 'Download Resume',
    secondaryAction: 'View Projects',
    contactAction: "Let's Connect",
    orbitLocation: profile.location,
    orbitRole: 'React UI Engineer',
    strip: ['React', 'Accessible UI', 'Responsive Design', 'Performance'],
  },
  about: {
    eyebrow: 'About',
    title: "A frontend developer with a designer's eye.",
    copy: 'Harsh blends practical web development with polished visual systems and responsive UI thinking.',
    facts: [
      { label: 'Education', value: 'B.Tech in Computer Science & Engineering', icon: 'user' },
      { label: 'Internship', value: 'Frontend Development', icon: 'briefcase' },
      { label: 'Location', value: profile.location, icon: 'mapPin' },
      { label: 'Languages', value: 'English, Hindi', icon: 'globe' },
    ],
  },
  skills: {
    eyebrow: 'Skills',
    title: 'Modern frontend toolkit, organized for product work.',
    copy: 'Progress bars are gone; the focus is on reusable capability groups and practical tools.',
  },
  projects: {
    eyebrow: 'Selected Projects',
    title: 'Product-style case cards with real shipped work.',
    copy: 'Every existing project is preserved, upgraded with filters, search, live links, and detail pages.',
    allFilterLabel: 'All',
    filterAriaLabel: 'Filter projects',
    searchPlaceholder: 'Search projects',
  },
  experience: {
    eyebrow: 'Journey',
    title: 'Education, internship, learning, and next steps.',
    copy: 'A compact timeline that keeps the recruiter scan fast while still showing momentum.',
  },
  certificates: {
    eyebrow: 'Certificates',
    title: 'A reusable certificate showcase.',
    copy: 'Prepared as a responsive slider-style row and ready for real certificate files.',
    viewLabel: 'View',
    downloadLabel: 'Download',
  },
  services: {
    eyebrow: 'Services',
    title: 'What Harsh can build.',
  },
  achievements: {
    eyebrow: 'Achievements',
    title: 'Milestones from the coding journey.',
  },
  contact: {
    eyebrow: 'Contact',
    title: "Let's build something amazing.",
    copy: 'Open to frontend development, React applications, responsive websites, and polished UI work.',
    availability: 'Available for opportunities',
    panelTitle: 'Send a message and Harsh will get back soon.',
    errorMessage: 'Please complete every field.',
    successMessage: 'Message flow opened successfully.',
    failureMessage: 'Something went wrong. Please email Harsh directly.',
    submitLabel: 'Send Message',
    fields: {
      name: 'Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message',
    },
  },
  notFound: {
    eyebrow: '404',
    title: 'Page not found.',
    copy: 'This route does not exist, but the portfolio is one click away.',
    action: 'Back Home',
  },
}

export const stats = [
  { value: 6, suffix: '+', label: 'Projects Completed' },
  { value: 20, suffix: '+', label: 'Technologies Practiced' },
  { value: 4, suffix: '+', label: 'Core UI Disciplines' },
  { value: 1, suffix: '+', label: 'Internship Experience' },
]
