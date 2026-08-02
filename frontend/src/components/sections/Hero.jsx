import { motion, useReducedMotion } from 'framer-motion'
import { FiArrowDown, FiDownload, FiSend } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import MagneticButton from '../common/MagneticButton.jsx'
import Reveal from '../common/Reveal.jsx'
import { fadeUp, slideLeft, slideRight, stagger } from '../../animations/variants.js'
import { getHomeContent } from '../../lib/contentSelectors.js'
import { getIcon } from '../../lib/icons.js'
import { usePortfolioContent } from '../../hooks/usePortfolioContent.js'
import { useMediaQuery } from '../../hooks/useMediaQuery.js'
import { getCloudinaryImageUrl, getCloudinarySrcSet } from '../../lib/cloudinary.js'

export default function Hero({ entranceReady }) {
  const [index, setIndex] = useState(0)
  const contentState = usePortfolioContent()
  const { profile, socials, sections } = getHomeContent(contentState?.portfolio)
  const content = sections.hero
  const LocationIcon = getIcon(content.orbitLocationIcon || 'mapPin')
  const rotatingRoleCount = profile.rotatingRoles.length
  const prefersReducedMotion = useReducedMotion()
  const hasLimitedMotion = useMediaQuery('(max-width: 640px), (pointer: coarse)')
  const reduceEffects = prefersReducedMotion || hasLimitedMotion
  const copyEntrance = hasLimitedMotion ? fadeUp : slideRight
  const imageEntrance = hasLimitedMotion ? fadeUp : slideLeft

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % rotatingRoleCount), 1800)
    return () => window.clearInterval(timer)
  }, [rotatingRoleCount])

  return (
    <section id="home" className="hero-section section">
      <div className="mesh-bg" aria-hidden="true" />
      <motion.div className="hero-grid container" variants={stagger} initial="hidden" animate={entranceReady ? 'visible' : 'hidden'}>
        <motion.div className="hero-copy" variants={copyEntrance}>
          {content.showAvailability !== false ? (
            <span className="availability">{content.availability}</span>
          ) : null}
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
        <motion.div className="hero-visual" variants={imageEntrance}>
          <div className="portrait-shell">
            <img
              src={getCloudinaryImageUrl(profile.image, 800)}
              srcSet={getCloudinarySrcSet(profile.image, [320, 480, 640, 800])}
              sizes="(max-width: 640px) 92vw, (max-width: 980px) 340px, 420px"
              alt={`${profile.name} portrait`}
              width="1024"
              height="1024"
              fetchPriority="high"
              decoding="async"
            />
            <motion.div className="orbit-card top" animate={reduceEffects ? undefined : { y: [0, -10, 0] }} transition={reduceEffects ? undefined : { repeat: Infinity, duration: 4 }}>
              <LocationIcon /> {profile.location}
            </motion.div>
            <motion.div className="orbit-card bottom" animate={reduceEffects ? undefined : { y: [0, 10, 0] }} transition={reduceEffects ? undefined : { repeat: Infinity, duration: 4.5 }}>
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
