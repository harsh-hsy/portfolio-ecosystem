import SectionHeader from '../common/SectionHeader.jsx'
import Reveal from '../common/Reveal.jsx'
import { usePortfolioContent } from '../../hooks/usePortfolioContent.js'
import { getMilestonesContent } from '../../lib/contentSelectors.js'

export default function Milestones() {
  const contentState = usePortfolioContent()
  const { section, milestones } = getMilestonesContent(contentState?.portfolio)

  if (!milestones.length) return null

  return (
    <section id={section.id || 'milestones'} className="section compact-section milestone-section">
      <div className="container">
        <SectionHeader
          eyebrow={section.eyebrow}
          title={section.title}
          copy={section.copy}
        />

        <div className="horizontal-cards milestone-grid">
          {milestones.map((milestone, index) => (
            <Reveal
              as="article"
              className="mini-card milestone-card"
              key={`${milestone.title}-${milestone.period}-${index}`}
            >
              <span>{milestone.label}</span>
              <h3>{milestone.title}</h3>
              <small>{milestone.period}</small>
              <p>{milestone.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
