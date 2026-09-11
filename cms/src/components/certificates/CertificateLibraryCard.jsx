import { FiAward, FiEye, FiEyeOff, FiStar } from 'react-icons/fi'

import { resolveMediaUrl } from '../../utils/urls'

function CertificateLibraryCard({ certificate, isUpdating, onOpen, onUpdate }) {
  const isDraft = certificate.publicationStatus === 'draft'
  const canFeature = !isDraft && certificate.visible

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpen()
    }
  }

  return (
    <article
      className="project-library-card certificate-library-card"
      tabIndex="0"
      role="link"
      onClick={onOpen}
      onKeyDown={handleKeyDown}
    >
      <div className="project-library-card__media certificate-library-card__media">
        {certificate.thumbnail ? (
          <img src={resolveMediaUrl(certificate.thumbnail)} alt="" />
        ) : (
          <FiAward aria-hidden="true" />
        )}
        <span
          className={`project-library-card__status project-library-card__status--${isDraft ? 'draft' : 'published'}`}
        >
          {isDraft ? 'Draft' : 'Published'}
        </span>
      </div>

      <div className="project-library-card__body">
        <div>
          <p>{certificate.date || 'Date pending'}</p>
          <h2>{certificate.title}</h2>
          <span>{certificate.issuer || 'Issuer pending'}</span>
        </div>
        <div className="project-library-card__actions" aria-label={`${certificate.title} actions`}>
          <button
            className={certificate.featured ? 'is-active' : ''}
            type="button"
            disabled={isUpdating || !canFeature}
            aria-label={
              certificate.featured ? 'Remove featured certificate' : 'Feature certificate'
            }
            title={
              !canFeature
                ? 'Publish and show the certificate before featuring it'
                : 'Feature certificate'
            }
            onClick={(event) => {
              event.stopPropagation()
              onUpdate(
                { featured: !certificate.featured },
                certificate.featured
                  ? 'Removed from featured certificates.'
                  : 'Certificate featured.',
              )
            }}
          >
            <FiStar aria-hidden="true" />
          </button>
          <button
            className={certificate.visible ? 'is-active' : ''}
            type="button"
            disabled={isUpdating || isDraft}
            aria-label={certificate.visible ? 'Hide certificate' : 'Show certificate'}
            title={
              isDraft
                ? 'Publish the certificate before showing it'
                : certificate.visible
                  ? 'Hide certificate'
                  : 'Show certificate'
            }
            onClick={(event) => {
              event.stopPropagation()
              onUpdate(
                { visible: !certificate.visible },
                certificate.visible
                  ? 'Certificate hidden from portfolio.'
                  : 'Certificate visible on portfolio.',
              )
            }}
          >
            {certificate.visible ? <FiEye aria-hidden="true" /> : <FiEyeOff aria-hidden="true" />}
          </button>
        </div>
      </div>
    </article>
  )
}

export default CertificateLibraryCard
