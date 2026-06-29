import { motion } from 'framer-motion'
import { FiArrowDown, FiDownload, FiMapPin, FiSend } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import MagneticButton from '../common/MagneticButton.jsx'
import Reveal from '../common/Reveal.jsx'
import { fadeUp, slideLeft, slideRight, stagger } from '../../animations/variants.js'
import { profile, socials } from '../../data/portfolio.js'

export default function Hero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % profile.rotatingRoles.length), 1800)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <section id="home" className="hero-section section">
      <div className="mesh-bg" aria-hidden="true" />
      <motion.div className="hero-grid container" variants={stagger} initial="hidden" animate="visible">
        <motion.div className="hero-copy" variants={slideRight}>
          <span className="availability">Available for frontend opportunities</span>
          <h1>Hi, I am <span>Harsh Singh</span></h1>
          <div className="typing-line" aria-live="polite">{profile.rotatingRoles[index]}</div>
          <p>Building beautiful, accessible and high-performance web experiences with React, thoughtful UI design, and clean frontend architecture.</p>
          <div className="hero-actions">
            <MagneticButton href={profile.resume} target="_blank" className="primary"><FiDownload /> Download Resume</MagneticButton>
            <MagneticButton href="#projects" className="secondary"><FiArrowDown /> View Projects</MagneticButton>
            <MagneticButton href="#contact" className="ghost"><FiSend /> Let's Connect</MagneticButton>
          </div>
          <div className="hero-socials">
            {socials.map((social) => {
              const Icon = social.icon
              return <a key={social.label} href={social.href} target={social.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer" aria-label={social.label}><Icon /></a>
            })}
          </div>
        </motion.div>
        <motion.div className="hero-visual" variants={slideLeft}>
          <div className="portrait-shell">
            <img src={profile.image} alt="Harsh Singh portrait" />
            <motion.div className="orbit-card top" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
              <FiMapPin /> {profile.location}
            </motion.div>
            <motion.div className="orbit-card bottom" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4.5 }}>
              React UI Engineer
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
      <Reveal className="hero-strip container" variants={fadeUp}>
        <span>React</span><span>Accessible UI</span><span>Responsive Design</span><span>Performance</span>
      </Reveal>
    </section>
  )
}
