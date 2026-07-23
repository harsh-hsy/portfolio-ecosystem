import { FiDownload, FiEye } from 'react-icons/fi'
import SectionHeader from '../common/SectionHeader.jsx'
import Reveal from '../common/Reveal.jsx'
import { getCertificatesContent } from '../../lib/contentSelectors.js'
import { usePortfolioContent } from '../../hooks/usePortfolioContent.js'

const portfolioUrl = import.meta.env.VITE_PORTFOLIO_URL || ''

function resolveImageUrl(path) {
  if (!path) return ''
  if (/^(https?:|data:|blob:)/i.test(path)) return path
  return `${portfolioUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

export default function Certificates() {
  const contentState = usePortfolioContent()
  const { section, certificates } = getCertificatesContent(contentState?.portfolio)

  return (
    <section id="certificates" className="section compact-section">
      <div className="container">
        <SectionHeader eyebrow={section.eyebrow} title={section.title} copy={section.copy} />
        <div className="horizontal-cards">
          {certificates.map((certificate) => (
            <Reveal as="article" className="mini-card" key={certificate.slug || certificate.title}>
              {certificate.thumbnail && (
                <img
                  className="certificate-card-image"
                  src={resolveImageUrl(certificate.thumbnail)}
                  alt={`${certificate.title} certificate`}
                  loading="lazy"
                  decoding="async"
                />
              )}
              <span>{certificate.date}</span>
              <h3>{certificate.title}</h3>
              <p>{certificate.issuer}</p>
              <div className="mini-actions">
                {(certificate.credentialUrl || certificate.file) && (
                  <a href={certificate.credentialUrl || certificate.file} target="_blank" rel="noreferrer"><FiEye /> {section.viewLabel}</a>
                )}
                {certificate.file && (
                  <a href={certificate.file} target="_blank" rel="noreferrer"><FiDownload /> {section.downloadLabel}</a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
