import { FiCheckCircle } from 'react-icons/fi'
import SectionHeader from '../common/SectionHeader.jsx'
import Reveal from '../common/Reveal.jsx'
import { services } from '../../data/portfolio.js'

export default function Services() {
  return (
    <section id="services" className="section compact-section">
      <div className="container">
        <SectionHeader eyebrow="Services" title="What Harsh can build." />
        <div className="service-grid">
          {services.map((service) => <Reveal as="article" className="service-card" key={service}><FiCheckCircle /><h3>{service}</h3></Reveal>)}
        </div>
      </div>
    </section>
  )
}
