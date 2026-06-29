import { FiAward } from 'react-icons/fi'
import SectionHeader from '../common/SectionHeader.jsx'
import Reveal from '../common/Reveal.jsx'
import { achievements } from '../../data/portfolio.js'

export default function Achievements() {
  return (
    <section id="achievements" className="section compact-section">
      <div className="container">
        <SectionHeader eyebrow="Achievements" title="Milestones from the coding journey." />
        <div className="achievement-grid">
          {achievements.map((item) => <Reveal as="article" className="achievement-card" key={item}><FiAward /><p>{item}</p></Reveal>)}
        </div>
      </div>
    </section>
  )
}
