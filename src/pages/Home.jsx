import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import Hero from '../components/sections/Hero.jsx'
import About from '../components/sections/About.jsx'
import Skills from '../components/sections/Skills.jsx'
import Projects from '../components/sections/Projects.jsx'
import Experience from '../components/sections/Experience.jsx'
import Certificates from '../components/sections/Certificates.jsx'
import Services from '../components/sections/Services.jsx'
import Achievements from '../components/sections/Achievements.jsx'
import Testimonials from '../components/sections/Testimonials.jsx'
import Contact from '../components/sections/Contact.jsx'
import { pageTransition } from '../animations/variants.js'
import { profile } from '../data/portfolio.js'

export default function Home() {
  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit">
      <Helmet>
        <title>Harsh Singh | Frontend Developer</title>
        <meta name="description" content={profile.about} />
        <meta property="og:title" content="Harsh Singh | Frontend Developer" />
        <meta property="og:description" content="React developer and UI engineer building accessible, responsive, high-performance web experiences." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: profile.fullName,
          jobTitle: profile.role,
          email: profile.email,
          address: profile.location,
          sameAs: [profile.github, profile.linkedin],
        })}</script>
      </Helmet>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Certificates />
      <Services />
      <Achievements />
      <Testimonials />
      <Contact />
    </motion.div>
  )
}
