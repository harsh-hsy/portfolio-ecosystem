import { motion } from 'framer-motion'
import SectionHeader from '../common/SectionHeader.jsx'
import Reveal from '../common/Reveal.jsx'
import { fadeUp, stagger } from '../../animations/variants.js'
import { getSkillsContent } from '../../lib/contentSelectors.js'
import { getIcon } from '../../lib/icons.js'
import { usePortfolioContent } from '../../hooks/usePortfolioContent.js'
import { getCloudinaryImageUrl, getCloudinarySrcSet } from '../../lib/cloudinary.js'
import { useMediaQuery } from '../../hooks/useMediaQuery.js'

export default function Skills() {
  const contentState = usePortfolioContent()
  const { profile, section, skills } = getSkillsContent(contentState?.portfolio)
  const simplifyMotion = useMediaQuery('(max-width: 640px), (pointer: coarse)')

  return (
    <section id="skills" className="section skills-section">
      <div className="container">
        <SectionHeader eyebrow={section.eyebrow} title={section.title} copy={section.copy} />
        <div className="skills-layout">
          <Reveal className="skills-image" disableMotion={simplifyMotion}>
            <img
              src={getCloudinaryImageUrl(profile.skillsImage, 900)}
              srcSet={getCloudinarySrcSet(profile.skillsImage, [360, 540, 720, 900])}
              sizes="(max-width: 760px) 92vw, 42vw"
              alt="Frontend skill workspace"
              width="800"
              height="1000"
              loading="lazy"
              decoding="async"
            />
          </Reveal>
          <motion.div
            className="skill-groups"
            variants={simplifyMotion ? undefined : stagger}
            initial={simplifyMotion ? false : 'hidden'}
            whileInView={simplifyMotion ? undefined : 'visible'}
            viewport={{ once: true, amount: 0.2 }}
          >
            {skills.map((group) => (
              <motion.article className="skill-group" key={group.category} variants={simplifyMotion ? undefined : fadeUp}>
                <h3>{group.category}</h3>
                <div className="skill-list">
                  {group.items.map((skill) => {
                    const Icon = getIcon(skill.icon)
                    return <span key={skill.name}><Icon aria-hidden="true" focusable="false" /> {skill.name}</span>
                  })}
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
