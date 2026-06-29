import SectionHeader from '../common/SectionHeader.jsx'
import Reveal from '../common/Reveal.jsx'
import { timeline } from '../../data/portfolio.js'

export default function Experience() {
  return (
    <section id="experience" className="section timeline-section">
      <div className="container">
        <SectionHeader eyebrow="Journey" title="Education, internship, learning, and next steps." copy="A compact timeline that keeps the recruiter scan fast while still showing momentum." />
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
