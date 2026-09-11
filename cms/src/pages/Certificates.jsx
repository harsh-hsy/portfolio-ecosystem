import { useCallback, useEffect, useMemo, useState } from 'react'
import { FiFileText } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

import CertificateLibraryCard from '../components/certificates/CertificateLibraryCard'
import CertificateSectionEditor from '../components/certificates/CertificateSectionEditor'
import CreateResourceDialog from '../components/library/CreateResourceDialog'
import LibraryToolbar from '../components/library/LibraryToolbar'
import { usePortfolioEditor } from '../hooks/usePortfolioEditor'
import { useToast } from '../hooks/useToast'
import {
  createAdminCertificate,
  getAdminCertificates,
  updateAdminCertificate,
} from '../services/portfolioService'
import { updateSection } from '../utils/contentFormUtils'

const emptyForm = { title: '', copy: '' }

function formFromPortfolio(portfolio) {
  const section = portfolio?.sections?.certificates ?? {}
  return { title: section.title ?? '', copy: section.copy ?? '' }
}

function portfolioFromForm(portfolio, form) {
  return updateSection(portfolio, 'certificates', {
    ...(portfolio.sections?.certificates ?? {}),
    title: form.title.trim(),
    copy: form.copy.trim(),
  })
}

function validateSection(form) {
  const errors = {}
  if (!form.title.trim()) errors.title = 'Certificate title is required.'
  if (!form.copy.trim()) errors.copy = 'Certificate description is required.'
  return errors
}

function Certificates() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [certificates, setCertificates] = useState([])
  const [isLoadingCertificates, setIsLoadingCertificates] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [certificateName, setCertificateName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [updatingSlug, setUpdatingSlug] = useState('')

  const getForm = useCallback(
    (portfolio) => (portfolio ? formFromPortfolio(portfolio) : emptyForm),
    [],
  )
  const getPortfolio = useCallback((portfolio, form) => portfolioFromForm(portfolio, form), [])
  const editor = usePortfolioEditor({
    moduleName: 'certificates',
    getForm,
    getPortfolio,
    validate: validateSection,
    successMessage: 'Certificate section updated successfully.',
  })

  useEffect(() => {
    document.querySelector('.dashboard-main')?.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadCertificates() {
      try {
        setIsLoadingCertificates(true)
        const response = await getAdminCertificates()
        if (!ignore) setCertificates(response.certificates || [])
      } catch (requestError) {
        if (!ignore) setError(requestError.message)
      } finally {
        if (!ignore) setIsLoadingCertificates(false)
      }
    }

    loadCertificates()
    return () => {
      ignore = true
    }
  }, [])

  const featuredCount = certificates.filter(
    (certificate) =>
      certificate.publicationStatus === 'published' && certificate.visible && certificate.featured,
  ).length

  const filteredCertificates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return certificates.filter((certificate) => {
      const matchesQuery =
        !normalizedQuery ||
        [certificate.title, certificate.issuer, certificate.date, certificate.slug]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)
      const matchesFilter =
        activeFilter === 'All' ||
        (activeFilter === 'Published' && certificate.publicationStatus === 'published') ||
        (activeFilter === 'Draft' && certificate.publicationStatus === 'draft') ||
        (activeFilter === 'Featured' && certificate.featured) ||
        (activeFilter === 'Hidden' && !certificate.visible)

      return matchesQuery && matchesFilter
    })
  }, [activeFilter, certificates, query])

  async function updateCertificate(certificate, changes, successMessage) {
    try {
      setUpdatingSlug(certificate.slug)
      const response = await updateAdminCertificate(certificate.slug, {
        ...certificate,
        ...changes,
      })
      setCertificates((current) =>
        current.map((item) => (item._id === certificate._id ? response.certificate : item)),
      )
      showToast(successMessage)
    } catch (requestError) {
      showToast(requestError.message, { type: 'error' })
    } finally {
      setUpdatingSlug('')
    }
  }

  async function handleCreate(event) {
    event.preventDefault()
    if (!certificateName.trim()) return

    try {
      setIsCreating(true)
      const response = await createAdminCertificate(certificateName)
      showToast('Certificate draft created in MongoDB.')
      navigate(`/certificates/${response.certificate.slug}`)
    } catch (requestError) {
      showToast(requestError.message, { type: 'error' })
    } finally {
      setIsCreating(false)
    }
  }

  function closeCreateDialog() {
    if (isCreating) return
    setIsCreateOpen(false)
    setCertificateName('')
  }

  return (
    <section className="page projects-overview certificates-overview">
      <CertificateSectionEditor editor={editor} />
      <LibraryToolbar
        resourceName="Certificate"
        activeFilter={activeFilter}
        query={query}
        onFilter={setActiveFilter}
        onQuery={setQuery}
        onCreate={() => setIsCreateOpen(true)}
      />

      <div className="projects-overview__summary">
        <span>{certificates.length} certificates</span>
        <span>{featuredCount} featured</span>
        <span>MongoDB connected</span>
      </div>

      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      {isLoadingCertificates ? (
        <div className="projects-overview__empty">Loading certificate library...</div>
      ) : filteredCertificates.length ? (
        <div className="project-library-grid certificate-library-grid">
          {filteredCertificates.map((certificate) => (
            <CertificateLibraryCard
              key={certificate._id || certificate.slug}
              certificate={certificate}
              isUpdating={updatingSlug === certificate.slug}
              onOpen={() => navigate(`/certificates/${certificate.slug}`)}
              onUpdate={(changes, message) => updateCertificate(certificate, changes, message)}
            />
          ))}
        </div>
      ) : (
        <div className="projects-overview__empty">
          <FiFileText aria-hidden="true" />
          <h2>No matching certificates</h2>
          <p>Adjust the filter or create a new certificate draft.</p>
        </div>
      )}

      {isCreateOpen ? (
        <CreateResourceDialog
          resourceName="Certificate"
          value={certificateName}
          placeholder="Example: React Developer Certificate"
          path="certificates"
          pathLabel="Generated certificate URL"
          isCreating={isCreating}
          onChange={setCertificateName}
          onClose={closeCreateDialog}
          onSubmit={handleCreate}
        />
      ) : null}
    </section>
  )
}

export default Certificates
