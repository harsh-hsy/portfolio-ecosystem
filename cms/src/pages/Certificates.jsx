import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiAward,
  FiEye,
  FiEyeOff,
  FiFileText,
  FiPlus,
  FiSearch,
  FiStar,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import EditorActions from "../components/common/EditorActions";
import { usePortfolioEditor } from "../hooks/usePortfolioEditor";
import { useToast } from "../hooks/useToast";
import {
  createAdminCertificate,
  getAdminCertificates,
  updateAdminCertificate,
} from "../services/portfolioService";
import { updateSection } from "../utils/contentFormUtils";

const filters = ["All", "Published", "Draft", "Featured", "Hidden"];
const portfolioUrl = import.meta.env.VITE_PORTFOLIO_URL || "http://localhost:5173";

const emptyForm = {
  title: "",
  copy: "",
};

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveImageUrl(path) {
  if (!path) return "";
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  return `${portfolioUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

function formFromPortfolio(portfolio) {
  const section = portfolio?.sections?.certificates ?? {};
  return {
    title: section.title ?? "",
    copy: section.copy ?? "",
  };
}

function portfolioFromForm(portfolio, form) {
  return updateSection(portfolio, "certificates", {
    ...(portfolio.sections?.certificates ?? {}),
    title: form.title.trim(),
    copy: form.copy.trim(),
  });
}

function validateSection(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = "Certificate title is required.";
  if (!form.copy.trim()) errors.copy = "Certificate description is required.";
  return errors;
}

function Certificates() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [certificates, setCertificates] = useState([]);
  const [isLoadingCertificates, setIsLoadingCertificates] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [certificateName, setCertificateName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [updatingSlug, setUpdatingSlug] = useState("");

  const getForm = useCallback((portfolio) => (portfolio ? formFromPortfolio(portfolio) : emptyForm), []);
  const getPortfolio = useCallback((portfolio, form) => portfolioFromForm(portfolio, form), []);
  const editor = usePortfolioEditor({
    moduleName: "certificates",
    getForm,
    getPortfolio,
    validate: validateSection,
    successMessage: "Certificate section updated successfully.",
  });

  useEffect(() => {
    document.querySelector(".dashboard-main")?.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadCertificates() {
      try {
        setIsLoadingCertificates(true);
        const response = await getAdminCertificates();
        if (!ignore) setCertificates(response.certificates || []);
      } catch (requestError) {
        if (!ignore) setError(requestError.message);
      } finally {
        if (!ignore) setIsLoadingCertificates(false);
      }
    }

    loadCertificates();
    return () => {
      ignore = true;
    };
  }, []);

  const featuredCount = certificates.filter(
    (certificate) =>
      certificate.publicationStatus === "published" &&
      certificate.visible &&
      certificate.featured,
  ).length;

  const filteredCertificates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return certificates.filter((certificate) => {
      const matchesQuery =
        !normalizedQuery ||
        [certificate.title, certificate.issuer, certificate.date, certificate.slug]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Published" && certificate.publicationStatus === "published") ||
        (activeFilter === "Draft" && certificate.publicationStatus === "draft") ||
        (activeFilter === "Featured" && certificate.featured) ||
        (activeFilter === "Hidden" && !certificate.visible);

      return matchesQuery && matchesFilter;
    });
  }, [activeFilter, certificates, query]);

  async function updateCertificate(certificate, changes, successMessage) {
    try {
      setUpdatingSlug(certificate.slug);
      const response = await updateAdminCertificate(certificate.slug, {
        ...certificate,
        ...changes,
      });
      setCertificates((current) =>
        current.map((item) => (item._id === certificate._id ? response.certificate : item)),
      );
      showToast(successMessage);
    } catch (requestError) {
      showToast(requestError.message, { type: "error" });
    } finally {
      setUpdatingSlug("");
    }
  }

  async function handleCreate(event) {
    event.preventDefault();
    if (!certificateName.trim()) return;

    try {
      setIsCreating(true);
      const response = await createAdminCertificate(certificateName);
      showToast("Certificate draft created in MongoDB.");
      navigate(`/certificates/${response.certificate.slug}`);
    } catch (requestError) {
      showToast(requestError.message, { type: "error" });
    } finally {
      setIsCreating(false);
    }
  }

  function closeCreateDialog() {
    if (isCreating) return;
    setIsCreateOpen(false);
    setCertificateName("");
  }

  return (
    <section className="page projects-overview certificates-overview">
      <form className="panel content-editor certificates-section-editor" onSubmit={editor.saveForm}>
        <div className="content-editor__header">
          <div>
            <span className="content-editor__eyebrow">Certificate showcase</span>
            <h2>{editor.form.title || "Certificates title"}</h2>
            <p>{editor.form.copy || "Certificate description"}</p>
          </div>
          <span className="content-editor__badge">{editor.isLoading ? "Loading" : "Connected"}</span>
        </div>
        <div className="content-editor__section">
          <h3>Section Content</h3>
          <div className="form-grid">
            <label className="form-group form-group--wide">
              <span className="form-label">Title <b aria-hidden="true">*</b></span>
              <input className="form-input" name="title" value={editor.form.title} onChange={editor.updateField} />
              {editor.errors.title ? <span className="form-error">{editor.errors.title}</span> : null}
            </label>
            <label className="form-group form-group--wide">
              <span className="form-label">Description <b aria-hidden="true">*</b></span>
              <textarea className="form-input form-textarea" name="copy" value={editor.form.copy} onChange={editor.updateField} />
              {editor.errors.copy ? <span className="form-error">{editor.errors.copy}</span> : null}
            </label>
          </div>
        </div>
        <EditorActions
          status={editor.status}
          isDirty={editor.isDirty}
          isLoading={editor.isLoading}
          isSaving={editor.isSaving}
          onReset={editor.resetForm}
        />
      </form>

      <div className="projects-overview__toolbar" aria-label="Certificate library controls">
        <div className="projects-overview__filters" role="group" aria-label="Filter certificates">
          {filters.map((filter) => (
            <button
              className={activeFilter === filter ? "is-active" : ""}
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="projects-overview__toolbar-actions">
          <label className="projects-overview__search">
            <FiSearch aria-hidden="true" />
            <span className="sr-only">Search certificates</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search certificates"
            />
          </label>
          <button className="btn btn-primary" type="button" onClick={() => setIsCreateOpen(true)}>
            <FiPlus aria-hidden="true" />
            Add Certificate
          </button>
        </div>
      </div>

      <div className="projects-overview__summary">
        <span>{certificates.length} certificates</span>
        <span>{featuredCount} featured</span>
        <span>MongoDB connected</span>
      </div>

      {error ? <p className="form-error" role="alert">{error}</p> : null}

      {isLoadingCertificates ? (
        <div className="projects-overview__empty">Loading certificate library...</div>
      ) : filteredCertificates.length ? (
        <div className="project-library-grid certificate-library-grid">
          {filteredCertificates.map((certificate) => {
            const isDraft = certificate.publicationStatus === "draft";
            const isUpdating = updatingSlug === certificate.slug;
            const canFeature = !isDraft && certificate.visible;

            return (
              <article
                className="project-library-card certificate-library-card"
                key={certificate._id || certificate.slug}
                tabIndex="0"
                role="link"
                onClick={() => navigate(`/certificates/${certificate.slug}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(`/certificates/${certificate.slug}`);
                  }
                }}
              >
                <div className="project-library-card__media certificate-library-card__media">
                  {certificate.thumbnail ? (
                    <img src={resolveImageUrl(certificate.thumbnail)} alt="" />
                  ) : (
                    <FiAward aria-hidden="true" />
                  )}
                  <span className={`project-library-card__status project-library-card__status--${isDraft ? "draft" : "published"}`}>
                    {isDraft ? "Draft" : "Published"}
                  </span>
                </div>

                <div className="project-library-card__body">
                  <div>
                    <p>{certificate.date || "Date pending"}</p>
                    <h2>{certificate.title}</h2>
                    <span>{certificate.issuer || "Issuer pending"}</span>
                  </div>
                  <div className="project-library-card__actions" aria-label={`${certificate.title} actions`}>
                    <button
                      className={certificate.featured ? "is-active" : ""}
                      type="button"
                      disabled={isUpdating || !canFeature}
                      aria-label={certificate.featured ? "Remove featured certificate" : "Feature certificate"}
                      title={!canFeature ? "Publish and show the certificate before featuring it" : "Feature certificate"}
                      onClick={(event) => {
                        event.stopPropagation();
                        updateCertificate(certificate, { featured: !certificate.featured }, certificate.featured ? "Removed from featured certificates." : "Certificate featured.");
                      }}
                    >
                      <FiStar aria-hidden="true" />
                    </button>
                    <button
                      className={certificate.visible ? "is-active" : ""}
                      type="button"
                      disabled={isUpdating || isDraft}
                      aria-label={certificate.visible ? "Hide certificate" : "Show certificate"}
                      title={isDraft ? "Publish the certificate before showing it" : certificate.visible ? "Hide certificate" : "Show certificate"}
                      onClick={(event) => {
                        event.stopPropagation();
                        updateCertificate(certificate, { visible: !certificate.visible }, certificate.visible ? "Certificate hidden from portfolio." : "Certificate visible on portfolio.");
                      }}
                    >
                      {certificate.visible ? <FiEye aria-hidden="true" /> : <FiEyeOff aria-hidden="true" />}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="projects-overview__empty">
          <FiFileText aria-hidden="true" />
          <h2>No matching certificates</h2>
          <p>Adjust the filter or create a new certificate draft.</p>
        </div>
      )}

      {isCreateOpen ? (
        <div className="dialog-backdrop" onMouseDown={closeCreateDialog}>
          <form
            className="project-create-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-certificate-title"
            onSubmit={handleCreate}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="project-create-dialog__header">
              <div>
                <p className="page-kicker">New Certificate</p>
                <h2 id="create-certificate-title">Create a certificate draft</h2>
              </div>
              <button type="button" onClick={closeCreateDialog} aria-label="Close dialog">
                <FiX aria-hidden="true" />
              </button>
            </div>
            <label className="form-group project-create-dialog__field">
              <span className="form-label">Certificate Name <b aria-hidden="true">*</b></span>
              <input
                className="form-input"
                autoFocus
                value={certificateName}
                onChange={(event) => setCertificateName(event.target.value)}
                placeholder="Example: Front-End Software Engineering Job Simulation"
                aria-describedby="certificate-slug-preview"
                required
              />
            </label>
            <div className="project-create-dialog__slug" id="certificate-slug-preview">
              <span>Generated editor URL</span>
              <code>/certificates/{slugify(certificateName) || "certificate-name"}</code>
            </div>
            <div className="project-create-dialog__actions">
              <button className="btn btn-secondary" type="button" onClick={closeCreateDialog}>Cancel</button>
              <button className="btn btn-primary" type="submit" disabled={isCreating || !certificateName.trim()}>
                {isCreating ? "Creating..." : "Create Draft"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}

export default Certificates;
