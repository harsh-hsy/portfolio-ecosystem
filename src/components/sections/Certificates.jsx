import { FiDownload, FiEye } from 'react-icons/fi'
import SectionHeader from '../common/SectionHeader.jsx'
import Reveal from '../common/Reveal.jsx'
import { certificates } from '../../data/portfolio.js'

export default function Certificates() {
  return (
    <section id="certificates" className="section compact-section">
      <div className="container">
        <SectionHeader eyebrow="Certificates" title="A reusable certificate showcase." copy="Prepared as a responsive slider-style row and ready for real certificate files." />
        <div className="horizontal-cards">
          {certificates.map((certificate) => (
            <Reveal as="article" className="mini-card" key={certificate.title}>
              <span>{certificate.date}</span>
              <h3>{certificate.title}</h3>
              <p>{certificate.issuer}</p>
              <div className="mini-actions">
                <a href={certificate.file} target="_blank" rel="noreferrer"><FiEye /> View</a>
                <a href={certificate.file} target="_blank" rel="noreferrer"><FiDownload /> Download</a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
