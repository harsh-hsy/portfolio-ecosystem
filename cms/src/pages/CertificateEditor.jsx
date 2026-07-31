import { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiAward,
  FiExternalLink,
  FiEye,
  FiEyeOff,
  FiRefreshCw,
  FiSave,
  FiStar,
  FiTrash2,
} from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";

import ConfirmDialog from "../components/editor/ConfirmDialog";
import FormField from "../components/editor/FormField";
import ImageUploader from "../components/editor/ImageUploader";
import { useToast } from "../hooks/useToast";
import { useUnsavedChanges } from "../hooks/useUnsavedChanges";
import {
  deleteAdminCertificate,
  getAdminCertificate,
  updateAdminCertificate,
} from "../services/portfolioService";

const portfolioUrl = import.meta.env.VITE_PORTFOLIO_URL || "http://localhost:5173";

function cleanCertificate(certificate) {
  return {
    ...certificate,
    title: certificate?.title ?? "",
    issuer: certificate?.issuer ?? "",
    date: certificate?.date ?? "",
    slug: certificate?.slug ?? "",
    thumbnail: certificate?.thumbnail ?? "",
    file: certificate?.file ?? "",
    credentialUrl: certificate?.credentialUrl ?? "",
    publicationStatus: certificate?.publicationStatus ?? "draft",
    visible: Boolean(certificate?.visible),
    featured: Boolean(certificate?.featured),
  };
}

function resolveImageUrl(path) {
  if (!path) return "";
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  return `${portfolioUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

function CertificateEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [certificate, setCertificate] = useState(null);
  const [savedCertificate, setSavedCertificate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.querySelector(".dashboard-main")?.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  useEffect(() => {
    let ignore = false;

    async function loadCertificate() {
      try {
        setIsLoading(true);
        const response = await getAdminCertificate(slug);
        if (!ignore) {
          const nextCertificate = cleanCertificate(response.certificate);
          setCertificate(nextCertificate);
          setSavedCertificate(nextCertificate);
        }
      } catch (requestError) {
        if (!ignore) setError(requestError.message);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadCertificate();
    return () => {
      ignore = true;
    };
  }, [slug]);

  const isDirty = useMemo(
    () => Boolean(certificate && savedCertificate && JSON.stringify(certificate) !== JSON.stringify(savedCertificate)),
    [certificate, savedCertificate],
  );
  useUnsavedChanges(isDirty);

  function updateField(field, value) {
    setCertificate((current) => ({
      ...current,
      [field]: value,
      ...(field === "visible" && !value ? { featured: false } : {}),
    }));
  }

  function resetCertificate() {
    if (!savedCertificate) return;
    setCertificate(cleanCertificate(savedCertificate));
  }

  async function saveCertificate(publicationStatus) {
    if (!certificate) return;

    try {
      setIsSaving(true);
      const response = await updateAdminCertificate(slug, {
        ...certificate,
        publicationStatus,
        visible: publicationStatus === "published" ? certificate.visible : false,
        featured: publicationStatus === "published" ? certificate.featured : false,
      });
      const nextCertificate = cleanCertificate(response.certificate);
      setCertificate(nextCertificate);
      setSavedCertificate(nextCertificate);
      showToast(publicationStatus === "published" ? "Certificate published to MongoDB." : "Certificate draft saved to MongoDB.");

      if (nextCertificate.slug !== slug) {
        navigate(`/certificates/${nextCertificate.slug}`, { replace: true });
      }
    } catch (requestError) {
      showToast(requestError.message, { type: "error" });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    try {
      setIsDeleting(true);
      await deleteAdminCertificate(slug);
      showToast("Certificate deleted from MongoDB.");
      navigate("/certificates", { replace: true });
    } catch (requestError) {
      showToast(requestError.message, { type: "error" });
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return <section className="page project-editor-page"><div className="projects-overview__empty">Loading certificate editor...</div></section>;
  }

  if (error || !certificate) {
    return (
      <section className="page project-editor-page">
        <Link className="project-editor-page__back" to="/certificates"><FiArrowLeft /> Certificate Library</Link>
        <div className="projects-overview__empty"><h1>Certificate unavailable</h1><p>{error || "Certificate not found"}</p></div>
      </section>
    );
  }

  const isPublished = certificate.publicationStatus === "published";
  const image = certificate.thumbnail;

  return (
    <section className="page project-editor-page certificate-editor-page">
      <header className="project-editor-page__header">
        <div>
          <Link className="project-editor-page__back" to="/certificates"><FiArrowLeft aria-hidden="true" /> Certificate Library</Link>
          <div className="project-editor-page__title-row">
            <h1>{certificate.title}</h1>
            <span className={`project-editor-page__status project-editor-page__status--${isPublished ? "published" : "draft"}`}>
              {isPublished ? "Published" : "Draft"}
            </span>
          </div>
        </div>
        <div className="project-editor-page__header-actions">
          {isPublished && certificate.visible ? (
            <a className="btn btn-secondary" href={`${portfolioUrl}/#certificates`} target="_blank" rel="noreferrer">
              <FiExternalLink aria-hidden="true" /> Preview
            </a>
          ) : null}
          <button className="icon-button icon-button--danger" type="button" onClick={() => setIsDeleteOpen(true)} aria-label="Delete certificate" title="Delete certificate">
            <FiTrash2 aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="panel project-editor-panel certificate-editor-panel">
        <div className="project-editor-section">
          <div className="project-editor-section__heading"><h2>Certificate identity</h2><p>Content used by the public certificate card.</p></div>
          <div className="form-grid">
            <FormField label="Certificate Title" value={certificate.title} onChange={(event) => updateField("title", event.target.value)} required />
            <FormField label="Issuer / Organization" value={certificate.issuer} onChange={(event) => updateField("issuer", event.target.value)} required />
            <FormField label="Issue Date" value={certificate.date} onChange={(event) => updateField("date", event.target.value)} required />
            <FormField label="Certificate Slug" value={certificate.slug} onChange={(event) => updateField("slug", event.target.value)} helpText="Use lowercase words separated by hyphens." required />
          </div>
        </div>

        <div className="project-editor-section">
          <div className="project-editor-section__heading"><h2>Certificate media</h2><p>Add an optional image that appears on the certificate card.</p></div>
          <div className="project-media-preview certificate-media-preview">
            {image ? <img src={resolveImageUrl(image)} alt="Current certificate preview" /> : <span><FiAward aria-hidden="true" /> No certificate image added</span>}
            <ImageUploader
              value={certificate.thumbnail}
              onChange={(thumbnail) => updateField("thumbnail", thumbnail)}
              label="Certificate image"
              helpText="The original certificate ratio is preserved so no content is cut off."
              section="certificates"
              aspectRatio={null}
              previewMaxWidth="640px"
              preserveOriginalRatio
              alt={`${certificate.title} certificate`}
            />
          </div>
        </div>

        <div className="project-editor-section">
          <div className="project-editor-section__heading"><h2>Links and publishing</h2><p>Control the view/download links and public visibility.</p></div>
          <div className="form-grid">
            <FormField label="View URL" type="url" value={certificate.credentialUrl} onChange={(event) => updateField("credentialUrl", event.target.value)} />
            <FormField label="Download URL" type="url" value={certificate.file} onChange={(event) => updateField("file", event.target.value)} />
          </div>
          <div className="project-publishing-options">
            <label className={`project-publishing-option ${certificate.visible ? "is-active" : ""}`}>
              <input type="checkbox" checked={certificate.visible} onChange={(event) => updateField("visible", event.target.checked)} />
              {certificate.visible ? <FiEye aria-hidden="true" /> : <FiEyeOff aria-hidden="true" />}
              <span><strong>Visible on portfolio</strong><small>Show this certificate in the public certificates section.</small></span>
            </label>
            <label className={`project-publishing-option ${certificate.featured ? "is-active" : ""}`}>
              <input type="checkbox" checked={certificate.featured} disabled={!certificate.visible} onChange={(event) => updateField("featured", event.target.checked)} />
              <FiStar aria-hidden="true" />
              <span><strong>Featured certificate</strong><small>Mark this certificate as highlighted for future layouts.</small></span>
            </label>
          </div>
        </div>

        <footer className="panel-footer project-editor-actions">
          <div><span className={isDirty ? "is-dirty" : ""}>{isDirty ? "Unsaved changes" : "All changes saved"}</span></div>
          <div>
            <button className="btn btn-secondary" type="button" disabled={isSaving || !isDirty} onClick={resetCertificate}>
              <FiRefreshCw aria-hidden="true" /> Reset
            </button>
            <button className="btn btn-secondary" type="button" disabled={isSaving} onClick={() => saveCertificate("draft")}>
              <FiSave aria-hidden="true" /> {isPublished ? "Move to Draft" : "Save Draft"}
            </button>
            <button className="btn btn-primary" type="button" disabled={isSaving} onClick={() => saveCertificate("published")}>
              <FiSave aria-hidden="true" /> {isSaving ? "Saving..." : isPublished ? "Save Published Certificate" : "Publish Certificate"}
            </button>
          </div>
        </footer>
      </div>

      <ConfirmDialog isOpen={isDeleteOpen} title="Delete this certificate?" message="This permanently removes the certificate from MongoDB and the public portfolio." isConfirming={isDeleting} onConfirm={handleDelete} onCancel={() => setIsDeleteOpen(false)} />
    </section>
  );
}

export default CertificateEditor;
