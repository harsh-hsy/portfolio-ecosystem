import { FiAward } from 'react-icons/fi'
import SectionHeader from '../common/SectionHeader.jsx'
import Reveal from '../common/Reveal.jsx'
import { getAchievementsContent } from '../../lib/contentSelectors.js'

export default function Achievements() {
  const { section, achievements } = getAchievementsContent()

  return (
    <section id="achievements" className="section compact-section">
      <div className="container">
        <SectionHeader eyebrow={section.eyebrow} title={section.title} />
        <div className="achievement-grid">
          {achievements.map((item) => <Reveal as="article" className="achievement-card" key={item}><FiAward /><p>{item}</p></Reveal>)}
        </div>
      </div>
    </section>
  )
}
