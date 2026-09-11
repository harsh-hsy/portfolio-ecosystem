import { useEffect, useMemo, useState } from 'react'
import { FiArrowLeft, FiExternalLink, FiTrash2 } from 'react-icons/fi'
import { Link, useNavigate, useParams } from 'react-router-dom'

import CertificateEditorPanel from '../components/certificates/CertificateEditorPanel'
import ConfirmDialog from '../components/editor/ConfirmDialog'
import { useToast } from '../hooks/useToast'
import { useUnsavedChanges } from '../hooks/useUnsavedChanges'
import {
  deleteAdminCertificate,
  getAdminCertificate,
  updateAdminCertificate,
} from '../services/portfolioService'
import { resolvePortfolioUrl } from '../utils/urls'

function cleanCertificate(certificate) {
  return {
    ...certificate,
    title: certificate?.title ?? '',
    issuer: certificate?.issuer ?? '',
    date: certificate?.date ?? '',
    slug: certificate?.slug ?? '',
    thumbnail: certificate?.thumbnail ?? '',
    file: certificate?.file ?? '',
    credentialUrl: certificate?.credentialUrl ?? '',
    publicationStatus: certificate?.publicationStatus ?? 'draft',
    visible: Boolean(certificate?.visible),
    featured: Boolean(certificate?.featured),
  }
}

function CertificateEditor() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [certificate, setCertificate] = useState(null)
  const [savedCertificate, setSavedCertificate] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.querySelector('.dashboard-main')?.scrollTo({ top: 0, behavior: 'auto' })
  }, [slug])

  useEffect(() => {
    let ignore = false

    async function loadCertificate() {
      try {
        setIsLoading(true)
        const response = await getAdminCertificate(slug)
        if (!ignore) {
          const nextCertificate = cleanCertificate(response.certificate)
          setCertificate(nextCertificate)
          setSavedCertificate(nextCertificate)
        }
      } catch (requestError) {
        if (!ignore) setError(requestError.message)
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    loadCertificate()
    return () => {
      ignore = true
    }
  }, [slug])

  const isDirty = useMemo(
    () =>
      Boolean(
        certificate &&
        savedCertificate &&
        JSON.stringify(certificate) !== JSON.stringify(savedCertificate),
      ),
    [certificate, savedCertificate],
  )
  useUnsavedChanges(isDirty)

  function updateField(field, value) {
    setCertificate((current) => ({
      ...current,
      [field]: value,
      ...(field === 'visible' && !value ? { featured: false } : {}),
    }))
  }

  function resetCertificate() {
    if (savedCertificate) setCertificate(cleanCertificate(savedCertificate))
  }

  async function saveCertificate(publicationStatus) {
    if (!certificate) return

    try {
      setIsSaving(true)
      const response = await updateAdminCertificate(slug, {
        ...certificate,
        publicationStatus,
        visible: publicationStatus === 'published' ? certificate.visible : false,
        featured: publicationStatus === 'published' ? certificate.featured : false,
      })
      const nextCertificate = cleanCertificate(response.certificate)
      setCertificate(nextCertificate)
      setSavedCertificate(nextCertificate)
      showToast(
        publicationStatus === 'published'
          ? 'Certificate published to MongoDB.'
          : 'Certificate draft saved to MongoDB.',
      )

      if (nextCertificate.slug !== slug) {
        navigate(`/certificates/${nextCertificate.slug}`, { replace: true })
      }
    } catch (requestError) {
      showToast(requestError.message, { type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    try {
      setIsDeleting(true)
      await deleteAdminCertificate(slug)
      showToast('Certificate deleted from MongoDB.')
      navigate('/certificates', { replace: true })
    } catch (requestError) {
      showToast(requestError.message, { type: 'error' })
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <section className="page project-editor-page">
        <div className="projects-overview__empty">Loading certificate editor...</div>
      </section>
    )
  }

  if (error || !certificate) {
    return (
      <section className="page project-editor-page">
        <Link className="project-editor-page__back" to="/certificates">
          <FiArrowLeft /> Certificate Library
        </Link>
        <div className="projects-overview__empty">
          <h1>Certificate unavailable</h1>
          <p>{error || 'Certificate not found'}</p>
        </div>
      </section>
    )
  }

  const isPublished = certificate.publicationStatus === 'published'

  return (
    <section className="page project-editor-page certificate-editor-page">
      <header className="project-editor-page__header">
        <div>
          <Link className="project-editor-page__back" to="/certificates">
            <FiArrowLeft aria-hidden="true" /> Certificate Library
          </Link>
          <div className="project-editor-page__title-row">
            <h1>{certificate.title}</h1>
            <span
              className={`project-editor-page__status project-editor-page__status--${isPublished ? 'published' : 'draft'}`}
            >
              {isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
        <div className="project-editor-page__header-actions">
          {isPublished && certificate.visible ? (
            <a
              className="btn btn-secondary"
              href={resolvePortfolioUrl('/#certificates')}
              target="_blank"
              rel="noreferrer"
            >
              <FiExternalLink aria-hidden="true" /> Preview
            </a>
          ) : null}
          <button
            className="icon-button icon-button--danger"
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            aria-label="Delete certificate"
            title="Delete certificate"
          >
            <FiTrash2 aria-hidden="true" />
          </button>
        </div>
      </header>

      <CertificateEditorPanel
        certificate={certificate}
        isDirty={isDirty}
        isSaving={isSaving}
        onChange={updateField}
        onReset={resetCertificate}
        onSave={saveCertificate}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete this certificate?"
        message="This permanently removes the certificate from MongoDB and the public portfolio."
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </section>
  )
}

export default CertificateEditor
