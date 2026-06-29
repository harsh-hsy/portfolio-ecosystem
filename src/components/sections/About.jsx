import { FiBriefcase, FiGlobe, FiMapPin, FiUser } from 'react-icons/fi'
import SectionHeader from '../common/SectionHeader.jsx'
import Reveal from '../common/Reveal.jsx'
import { profile, stats } from '../../data/portfolio.js'

const facts = [
  { label: 'Education', value: 'B.Tech in Computer Science & Engineering', icon: FiUser },
  { label: 'Internship', value: 'Frontend Development', icon: FiBriefcase },
  { label: 'Location', value: profile.location, icon: FiMapPin },
  { label: 'Languages', value: 'English, Hindi', icon: FiGlobe },
]

export default function About() {
  return (
    <section id="about" className="section about-section">
      <div className="container">
        <SectionHeader eyebrow="About" title="A frontend developer with a designer's eye." copy="Harsh blends practical web development with polished visual systems and responsive UI thinking." />
        <div className="about-grid">
          <Reveal className="about-photo"><img src={profile.aboutImage} alt="Harsh Singh" loading="lazy" /></Reveal>
          <Reveal className="about-content">
            <p>{profile.about}</p>
            <div className="fact-grid">
              {facts.map((fact) => {
                const Icon = fact.icon
                return <article key={fact.label}><Icon /><span>{fact.label}</span><strong>{fact.value}</strong></article>
              })}
            </div>
          </Reveal>
        </div>
        <div className="stats-grid">
          {stats.map((stat) => <Reveal as="article" className="stat-card" key={stat.label}><strong>{stat.value}{stat.suffix}</strong><span>{stat.label}</span></Reveal>)}
        </div>
      </div>
    </section>
  )
}
