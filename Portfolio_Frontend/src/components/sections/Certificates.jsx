import { FiDownload, FiEye } from 'react-icons/fi'
import SectionHeader from '../common/SectionHeader.jsx'
import Reveal from '../common/Reveal.jsx'
import { getCertificatesContent } from '../../lib/contentSelectors.js'
import { usePortfolioContent } from '../../hooks/usePortfolioContent.js'

export default function Certificates() {
  const contentState = usePortfolioContent()
  const { section, certificates } = getCertificatesContent(contentState?.portfolio)

  return (
    <section id="certificates" className="section compact-section">
      <div className="container">
        <SectionHeader eyebrow={section.eyebrow} title={section.title} copy={section.copy} />
        <div className="horizontal-cards">
          {certificates.map((certificate) => (
            <Reveal as="article" className="mini-card" key={certificate.title}>
              <span>{certificate.date}</span>
              <h3>{certificate.title}</h3>
              <p>{certificate.issuer}</p>
              <div className="mini-actions">
                <a href={certificate.file} target="_blank" rel="noreferrer"><FiEye /> {section.viewLabel}</a>
                <a href={certificate.file} target="_blank" rel="noreferrer"><FiDownload /> {section.downloadLabel}</a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
