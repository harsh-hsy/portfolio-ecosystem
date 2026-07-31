import { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
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
import ImageGalleryUploader from "../components/editor/ImageGalleryUploader";
import ImageUploader from "../components/editor/ImageUploader";
import RepeaterField from "../components/editor/RepeaterField";
import { useToast } from "../hooks/useToast";
import { useUnsavedChanges } from "../hooks/useUnsavedChanges";
import {
  deleteAdminProject,
  getAdminProject,
  updateAdminProject,
} from "../services/portfolioService";

const portfolioUrl = import.meta.env.VITE_PORTFOLIO_URL || "http://localhost:5173";

function toParagraph(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean).join(", ");
  }

  return String(value || "").trim();
}

function cleanProject(project) {
  return {
    ...project,
    images: Array.isArray(project.images) ? project.images : [],
    tech: Array.isArray(project.tech) ? project.tech : [],
    features: Array.isArray(project.features) ? project.features : [],
    challenges: toParagraph(project.challenges),
    lessons: toParagraph(project.lessons),
  };
}

function resolveImageUrl(path) {
  if (!path) return "";
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  return `${portfolioUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

function ProjectEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [project, setProject] = useState(null);
  const [savedProject, setSavedProject] = useState(null);
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

    async function loadProject() {
      try {
        setIsLoading(true);
        const response = await getAdminProject(slug);
        if (!ignore) {
          const nextProject = cleanProject(response.project);
          setProject(nextProject);
          setSavedProject(nextProject);
        }
      } catch (requestError) {
        if (!ignore) setError(requestError.message);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadProject();
    return () => {
      ignore = true;
    };
  }, [slug]);

  const isDirty = useMemo(
    () => Boolean(project && savedProject && JSON.stringify(project) !== JSON.stringify(savedProject)),
    [project, savedProject],
  );
  useUnsavedChanges(isDirty);

  function updateField(field, value) {
    setProject((current) => ({
      ...current,
      [field]: value,
      ...(field === "visible" && !value ? { featured: false } : {}),
    }));
  }

  function resetProject() {
    if (!savedProject) return;
    setProject(cleanProject(savedProject));
  }

  async function saveProject(publicationStatus) {
    if (!project) return;

    try {
      setIsSaving(true);
      const response = await updateAdminProject(slug, {
        ...project,
        publicationStatus,
        visible: publicationStatus === "published" ? project.visible : false,
        featured: publicationStatus === "published" ? project.featured : false,
      });
      const nextProject = cleanProject(response.project);
      setProject(nextProject);
      setSavedProject(nextProject);
      showToast(publicationStatus === "published" ? "Project published to MongoDB." : "Project draft saved to MongoDB.");

      if (nextProject.slug !== slug) {
        navigate(`/projects/${nextProject.slug}`, { replace: true });
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
      await deleteAdminProject(slug);
      showToast("Project deleted from MongoDB.");
      navigate("/projects", { replace: true });
    } catch (requestError) {
      showToast(requestError.message, { type: "error" });
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return <section className="page project-editor-page"><div className="projects-overview__empty">Loading project editor...</div></section>;
  }

  if (error || !project) {
    return (
      <section className="page project-editor-page">
        <Link className="project-editor-page__back" to="/projects"><FiArrowLeft /> Back to projects</Link>
        <div className="projects-overview__empty"><h1>Project unavailable</h1><p>{error || "Project not found"}</p></div>
      </section>
    );
  }

  const isPublished = project.publicationStatus === "published";
  const image = project.thumbnail || project.images[0];

  return (
    <section className="page project-editor-page">
      <header className="project-editor-page__header">
        <div>
          <Link className="project-editor-page__back" to="/projects"><FiArrowLeft aria-hidden="true" /> Project Library</Link>
          <div className="project-editor-page__title-row">
            <h1>{project.shortTitle || project.title}</h1>
            <span className={`project-editor-page__status project-editor-page__status--${isPublished ? "published" : "draft"}`}>
              {isPublished ? "Published" : "Draft"}
            </span>
          </div>
        </div>
        <div className="project-editor-page__header-actions">
          {isPublished ? (
            <a className="btn btn-secondary" href={`${portfolioUrl}/projects/${project.slug}`} target="_blank" rel="noreferrer">
              <FiExternalLink aria-hidden="true" /> Preview
            </a>
          ) : null}
          <button className="icon-button icon-button--danger" type="button" onClick={() => setIsDeleteOpen(true)} aria-label="Delete project" title="Delete project">
            <FiTrash2 aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="panel project-editor-panel">
        <div className="project-editor-section">
          <div className="project-editor-section__heading"><h2>Project identity</h2><p>Content used by the project card and case study heading.</p></div>
          <div className="form-grid">
            <FormField label="Case Study Title" value={project.title} onChange={(event) => updateField("title", event.target.value)} required />
            <FormField label="Card Title" value={project.shortTitle} onChange={(event) => updateField("shortTitle", event.target.value)} required />
            <FormField label="Project Slug" value={project.slug} onChange={(event) => updateField("slug", event.target.value)} helpText="Use lowercase words separated by hyphens." required />
            <FormField label="Category" value={project.category} onChange={(event) => updateField("category", event.target.value)} required />
            <FormField label="Description" value={project.desc} onChange={(event) => updateField("desc", event.target.value)} as="textarea" className="form-group--wide" required />
          </div>
        </div>

        <div className="project-editor-section">
          <div className="project-editor-section__heading"><h2>Project media</h2><p>The first screenshot is used as the card thumbnail unless a thumbnail is specified.</p></div>
          <div className="project-media-preview">
            {image ? <img src={resolveImageUrl(image)} alt="Current project preview" /> : <span>No preview available</span>}
            <ImageUploader
              value={project.thumbnail || ""}
              onChange={(thumbnail) => updateField("thumbnail", thumbnail)}
              label="Project thumbnail"
              helpText="Optional. Upload a 16:9 card thumbnail or leave empty to use the first screenshot."
              section="projects"
              aspectRatio={16 / 9}
              previewMaxWidth="640px"
              alt={`${project.shortTitle || project.title} thumbnail`}
            />
          </div>
          <ImageGalleryUploader items={project.images} onChange={(images) => updateField("images", images)} section="projects" />
        </div>

        <div className="project-editor-section">
          <div className="project-editor-section__heading"><h2>Technology and features</h2><p>Technologies appear on project cards; features support the case study.</p></div>
          <div className="project-editor-repeaters">
            <RepeaterField className="project-editor-list-repeater project-editor-list-repeater--columns" label="Technologies" items={project.tech} onChange={(items) => updateField("tech", items)} createItem={() => ""} addLabel="Add Technology" emptyMessage="Add at least one technology before publishing." />
            <RepeaterField className="project-editor-list-repeater project-editor-list-repeater--columns" label="Features" items={project.features} onChange={(items) => updateField("features", items)} createItem={() => ""} addLabel="Add Feature" />
          </div>
        </div>

        <div className="project-editor-section">
          <div className="project-editor-section__heading"><h2>Case study</h2><p>Explain the problem, solution, challenges, and what you learned.</p></div>
          <div className="form-grid project-case-study-grid">
            <FormField label="Problem" value={project.problem || ""} onChange={(event) => updateField("problem", event.target.value)} as="textarea" />
            <FormField label="Solution" value={project.solution || ""} onChange={(event) => updateField("solution", event.target.value)} as="textarea" />
            <FormField label="Challenges" value={project.challenges} onChange={(event) => updateField("challenges", event.target.value)} as="textarea" helpText="Write this as one clear paragraph." />
            <FormField label="Lessons Learned" value={project.lessons} onChange={(event) => updateField("lessons", event.target.value)} as="textarea" helpText="Write this as one clear paragraph." />
          </div>
        </div>

        <div className="project-editor-section">
          <div className="project-editor-section__heading"><h2>Links and publishing</h2><p>Control where the project appears after it is published.</p></div>
          <div className="form-grid">
            <FormField label="Live Demo URL" type="url" value={project.live || ""} onChange={(event) => updateField("live", event.target.value)} />
            <FormField label="GitHub URL" type="url" value={project.github || ""} onChange={(event) => updateField("github", event.target.value)} />
          </div>
          <div className="project-publishing-options">
            <label className={`project-publishing-option ${project.visible ? "is-active" : ""}`}>
              <input type="checkbox" checked={project.visible} onChange={(event) => updateField("visible", event.target.checked)} />
              {project.visible ? <FiEye aria-hidden="true" /> : <FiEyeOff aria-hidden="true" />}
              <span><strong>Visible on portfolio</strong><small>Show this project on the public projects page.</small></span>
            </label>
            <label className={`project-publishing-option ${project.featured ? "is-active" : ""}`}>
              <input type="checkbox" checked={project.featured} disabled={!project.visible} onChange={(event) => updateField("featured", event.target.checked)} />
              <FiStar aria-hidden="true" />
              <span><strong>Featured on homepage</strong><small>Show this project in the homepage project section.</small></span>
            </label>
          </div>
        </div>

        <footer className="panel-footer project-editor-actions">
          <div><span className={isDirty ? "is-dirty" : ""}>{isDirty ? "Unsaved changes" : "All changes saved"}</span></div>
          <div>
            <button className="btn btn-secondary" type="button" disabled={isSaving || !isDirty} onClick={resetProject}>
              <FiRefreshCw aria-hidden="true" /> Reset
            </button>
            <button className="btn btn-secondary" type="button" disabled={isSaving} onClick={() => saveProject("draft")}>
              <FiSave aria-hidden="true" /> {isPublished ? "Move to Draft" : "Save Draft"}
            </button>
            <button className="btn btn-primary" type="button" disabled={isSaving} onClick={() => saveProject("published")}>
              <FiSave aria-hidden="true" /> {isSaving ? "Saving..." : isPublished ? "Save Published Project" : "Publish Project"}
            </button>
          </div>
        </footer>
      </div>

      <ConfirmDialog isOpen={isDeleteOpen} title="Delete this project?" message="This permanently removes the project from MongoDB and the public portfolio." isConfirming={isDeleting} onConfirm={handleDelete} onCancel={() => setIsDeleteOpen(false)} />
    </section>
  );
}

export default ProjectEditor;
