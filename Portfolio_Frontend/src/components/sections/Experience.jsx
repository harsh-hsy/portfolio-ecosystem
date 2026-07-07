import SectionHeader from '../common/SectionHeader.jsx'
import Reveal from '../common/Reveal.jsx'
import { getExperienceContent } from '../../lib/contentSelectors.js'

export default function Experience() {
  const { section, timeline } = getExperienceContent()

  return (
    <section id="experience" className="section timeline-section">
      <div className="container">
        <SectionHeader eyebrow={section.eyebrow} title={section.title} copy={section.copy} />
        <div className="timeline">
          {timeline.map((item) => (
            <Reveal as="article" className="timeline-item" key={item.title}>
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              <small>{item.period}</small>
              <p>{item.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
