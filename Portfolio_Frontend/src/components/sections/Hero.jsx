import { motion } from 'framer-motion'
import { FiArrowDown, FiDownload, FiMapPin, FiSend } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import MagneticButton from '../common/MagneticButton.jsx'
import Reveal from '../common/Reveal.jsx'
import { fadeUp, slideLeft, slideRight, stagger } from '../../animations/variants.js'
import { getHomeContent } from '../../lib/contentSelectors.js'
import { getIcon } from '../../lib/icons.js'

export default function Hero() {
  const [index, setIndex] = useState(0)
  const { profile, socials, sections } = getHomeContent()
  const content = sections.hero
  const rotatingRoleCount = profile.rotatingRoles.length

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % rotatingRoleCount), 1800)
    return () => window.clearInterval(timer)
  }, [rotatingRoleCount])

  return (
    <section id="home" className="hero-section section">
      <div className="mesh-bg" aria-hidden="true" />
      <motion.div className="hero-grid container" variants={stagger} initial="hidden" animate="visible">
        <motion.div className="hero-copy" variants={slideRight}>
          <span className="availability">{content.availability}</span>
          <h1>{content.intro} <span>{profile.name}</span></h1>
          <div className="typing-line" aria-live="polite">{profile.rotatingRoles[index]}</div>
          <p>{content.description}</p>
          <div className="hero-actions">
            <MagneticButton href={profile.resume} target="_blank" className="primary"><FiDownload /> {content.primaryAction}</MagneticButton>
            <MagneticButton href="#projects" className="secondary"><FiArrowDown /> {content.secondaryAction}</MagneticButton>
            <MagneticButton href="#contact" className="ghost"><FiSend /> {content.contactAction}</MagneticButton>
          </div>
          <div className="hero-socials">
            {socials.map((social) => {
              const Icon = getIcon(social.icon)
              return <a key={social.label} href={social.href} target={social.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer" aria-label={social.label}><Icon /></a>
            })}
          </div>
        </motion.div>
        <motion.div className="hero-visual" variants={slideLeft}>
          <div className="portrait-shell">
            <img src={profile.image} alt={`${profile.name} portrait`} />
            <motion.div className="orbit-card top" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
              <FiMapPin /> {content.orbitLocation}
            </motion.div>
            <motion.div className="orbit-card bottom" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4.5 }}>
              {content.orbitRole}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
      <Reveal className="hero-strip container" variants={fadeUp}>
        {content.strip.map((item) => <span key={item}>{item}</span>)}
      </Reveal>
    </section>
  )
}
