import { Helmet } from 'react-helmet-async'
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
import Testimonials from '../components/sections/Testimonials.jsx'
import Contact from '../components/sections/Contact.jsx'
import { pageTransition } from '../animations/variants.js'
import { getHomeContent } from '../lib/contentSelectors.js'
import { usePortfolioContent } from '../hooks/usePortfolioContent.js'
import { useMediaQuery } from '../hooks/useMediaQuery.js'

export default function Home({ entranceReady }) {
  const contentState = usePortfolioContent()
  const { profile, seo, structuredData } = getHomeContent(contentState?.portfolio)
  const simplifyMotion = useMediaQuery('(max-width: 640px), (pointer: coarse)')

  return (
    <motion.div
      variants={simplifyMotion ? undefined : pageTransition}
      initial={simplifyMotion ? false : 'initial'}
      animate={simplifyMotion ? undefined : 'animate'}
      exit={simplifyMotion ? undefined : 'exit'}
    >
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description || profile.about} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>
      <Hero entranceReady={entranceReady} />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Milestones />
      <Certificates />
      <Services />
      <Achievements />
      <Testimonials />
      <Contact />
    </motion.div>
  )
}
