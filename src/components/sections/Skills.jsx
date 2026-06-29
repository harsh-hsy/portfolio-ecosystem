import { motion } from 'framer-motion'
import SectionHeader from '../common/SectionHeader.jsx'
import Reveal from '../common/Reveal.jsx'
import { fadeUp, stagger } from '../../animations/variants.js'
import { getSkillsContent } from '../../lib/contentSelectors.js'
import { getIcon } from '../../lib/icons.js'

export default function Skills() {
  const { profile, section, skills } = getSkillsContent()

  return (
    <section id="skills" className="section skills-section">
      <div className="container">
        <SectionHeader eyebrow={section.eyebrow} title={section.title} copy={section.copy} />
        <div className="skills-layout">
          <Reveal className="skills-image"><img src={profile.skillsImage} alt="Frontend skill workspace" loading="lazy" /></Reveal>
          <motion.div className="skill-groups" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            {skills.map((group) => (
              <motion.article className="skill-group" key={group.category} variants={fadeUp}>
                <h3>{group.category}</h3>
                <div className="skill-list">
                  {group.items.map((skill) => {
                    const Icon = getIcon(skill.icon)
                    return <span key={skill.name}><Icon /> {skill.name}</span>
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
