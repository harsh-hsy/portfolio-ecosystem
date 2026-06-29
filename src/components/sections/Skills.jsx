import { motion } from 'framer-motion'
import SectionHeader from '../common/SectionHeader.jsx'
import Reveal from '../common/Reveal.jsx'
import { fadeUp, stagger } from '../../animations/variants.js'
import { profile, skills } from '../../data/portfolio.js'

export default function Skills() {
  return (
    <section id="skills" className="section skills-section">
      <div className="container">
        <SectionHeader eyebrow="Skills" title="Modern frontend toolkit, organized for product work." copy="Progress bars are gone; the focus is on reusable capability groups and practical tools." />
        <div className="skills-layout">
          <Reveal className="skills-image"><img src={profile.skillsImage} alt="Frontend skill workspace" loading="lazy" /></Reveal>
          <motion.div className="skill-groups" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            {skills.map((group) => (
              <motion.article className="skill-group" key={group.category} variants={fadeUp}>
                <h3>{group.category}</h3>
                <div className="skill-list">
                  {group.items.map((skill) => {
                    const Icon = skill.icon
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
