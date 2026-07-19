import { FiCheckCircle } from 'react-icons/fi'
import SectionHeader from '../common/SectionHeader.jsx'
import Reveal from '../common/Reveal.jsx'
import { getServicesContent } from '../../lib/contentSelectors.js'
import { usePortfolioContent } from '../../hooks/usePortfolioContent.js'

export default function Services() {
  const contentState = usePortfolioContent()
  const { section, services } = getServicesContent(contentState?.portfolio)

  return (
    <section id="services" className="section compact-section">
      <div className="container">
        <SectionHeader eyebrow={section.eyebrow} title={section.title} />

        <div className="service-grid">
          {services.map((service) => (
  <Reveal
  as="article"
  className="service-card"
  key={service}
>
  <FiCheckCircle />
  <h3>{service}</h3>
</Reveal>
))}
        </div>
      </div>
    </section>
  )
}
