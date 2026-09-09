import { motion } from 'framer-motion'
import Hero from '../components/sections/Hero.jsx'
import About from '../components/sections/About.jsx'
import Skills from '../components/sections/Skills.jsx'
import Projects from '../components/sections/Projects.jsx'
import Experience from '../components/sections/Experience.jsx'
import Milestones from '../components/sections/Milestones.jsx'
import Certificates from '../components/sections/Certificates.jsx'
import Services from '../components/sections/Services.jsx'
import Achievements from '../components/sections/Achievements.jsx'
import Contact from '../components/sections/Contact.jsx'
import { pageTransition } from '../animations/variants.js'
import { useMediaQuery } from '../hooks/useMediaQuery.js'

export default function Home({ entranceReady }) {
  const simplifyMotion = useMediaQuery('(max-width: 640px), (pointer: coarse)')

  return (
    <motion.div
      variants={simplifyMotion ? undefined : pageTransition}
      initial={simplifyMotion ? false : 'initial'}
      animate={simplifyMotion ? undefined : 'animate'}
      exit={simplifyMotion ? undefined : 'exit'}
    >
      <Hero entranceReady={entranceReady} />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Milestones />
      <Certificates />
      <Services />
      <Achievements />
      <Contact />
    </motion.div>
  )
}
