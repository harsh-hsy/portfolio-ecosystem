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
import { getHomeContent } from '../lib/contentSelectors.js'
import { usePortfolioContent } from '../hooks/usePortfolioContent.js'

export default function Home() {
  const contentState = usePortfolioContent()
  const { profile, seo, structuredData } = getHomeContent(contentState?.portfolio)

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit">
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={profile.about} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
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
