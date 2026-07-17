import SectionHeader from '../common/SectionHeader.jsx'
import Reveal from '../common/Reveal.jsx'
import { getAboutContent } from '../../lib/contentSelectors.js'
import { getIcon } from '../../lib/icons.js'
import { usePortfolioContent } from '../../hooks/usePortfolioContent.js'

export default function About() {
  const contentState = usePortfolioContent()
  const { profile, section, stats } = getAboutContent(contentState?.portfolio)

  return (
    <section id="about" className="section about-section">
      <div className="container">
        <SectionHeader eyebrow={section.eyebrow} title={section.title} copy={section.copy} />
        <div className="about-grid">
          <Reveal className="about-photo"><img src={profile.aboutImage} alt={profile.name} loading="lazy" /></Reveal>
          <Reveal className="about-content">
            <p>{profile.about}</p>
            <div className="fact-grid">
              {section.facts.map((fact) => {
                const Icon = getIcon(fact.icon)
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
