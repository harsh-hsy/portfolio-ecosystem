import { useEffect, useMemo, useState } from "react";
import {
  FiEye,
  FiEyeOff,
  FiFolder,
  FiPlus,
  FiSearch,
  FiStar,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { useToast } from "../hooks/useToast";
import {
  createAdminProject,
  getAdminProjects,
  updateAdminProject,
} from "../services/portfolioService";

const filters = ["All", "Published", "Draft", "Featured", "Hidden"];
const portfolioUrl = import.meta.env.VITE_PORTFOLIO_URL || "http://localhost:5173";

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

function Projects() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [updatingSlug, setUpdatingSlug] = useState("");

  useEffect(() => {
    document.querySelector(".dashboard-main")?.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadProjects() {
      try {
        setIsLoading(true);
        const response = await getAdminProjects();
        if (!ignore) setProjects(response.projects || []);
      } catch (requestError) {
        if (!ignore) setError(requestError.message);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadProjects();
    return () => {
      ignore = true;
    };
  }, []);

  const featuredCount = projects.filter(
    (project) =>
      project.publicationStatus === "published" &&
      project.visible &&
      project.featured,
  ).length;

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesQuery =
        !normalizedQuery ||
        [project.title, project.shortTitle, project.category, project.slug]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Published" && project.publicationStatus === "published") ||
        (activeFilter === "Draft" && project.publicationStatus === "draft") ||
        (activeFilter === "Featured" && project.featured) ||
        (activeFilter === "Hidden" && !project.visible);

      return matchesQuery && matchesFilter;
    });
  }, [activeFilter, projects, query]);

  async function updateProject(project, changes, successMessage) {
    try {
      setUpdatingSlug(project.slug);
      const response = await updateAdminProject(project.slug, {
        ...project,
        ...changes,
      });
      setProjects((current) =>
        current.map((item) => (item._id === project._id ? response.project : item)),
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
    if (!projectName.trim()) return;

    try {
      setIsCreating(true);
      const response = await createAdminProject(projectName);
      showToast("Project draft created in MongoDB.");
      navigate(`/projects/${response.project.slug}`);
    } catch (requestError) {
      showToast(requestError.message, { type: "error" });
    } finally {
      setIsCreating(false);
    }
  }

  function closeCreateDialog() {
    if (isCreating) return;
    setIsCreateOpen(false);
    setProjectName("");
  }

  return (
    <section className="page projects-overview">
      <div className="page-header projects-overview__header">
        <div>
          <p className="page-kicker">Content Module</p>
          <h1 className="page-title">Projects</h1>
          <p className="page-description">
            Create drafts, publish case studies, and choose the projects shown on your portfolio.
          </p>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => setIsCreateOpen(true)}>
          <FiPlus aria-hidden="true" />
          Add Project
        </button>
      </div>

      <div className="projects-overview__toolbar" aria-label="Project library controls">
        <div className="projects-overview__filters" role="group" aria-label="Filter projects">
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
        <label className="projects-overview__search">
          <FiSearch aria-hidden="true" />
          <span className="sr-only">Search projects</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects"
          />
        </label>
      </div>

      <div className="projects-overview__summary">
        <span>{projects.length} projects</span>
        <span>{featuredCount} of 6 featured</span>
        <span>MongoDB connected</span>
      </div>

      {error ? <p className="form-error" role="alert">{error}</p> : null}

      {isLoading ? (
        <div className="projects-overview__empty">Loading project library...</div>
      ) : filteredProjects.length ? (
        <div className="project-library-grid">
          {filteredProjects.map((project) => {
            const image = project.thumbnail || project.images?.[0];
            const isDraft = project.publicationStatus === "draft";
            const isUpdating = updatingSlug === project.slug;
            const canFeature = !isDraft && project.visible;

            return (
              <article
                className="project-library-card"
                key={project._id || project.slug}
                tabIndex="0"
                role="link"
                onClick={() => navigate(`/projects/${project.slug}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(`/projects/${project.slug}`);
                  }
                }}
              >
                <div className="project-library-card__media">
                  {image ? (
                    <img src={resolveImageUrl(image)} alt="" />
                  ) : (
                    <FiFolder aria-hidden="true" />
                  )}
                  <span className={`project-library-card__status project-library-card__status--${isDraft ? "draft" : "published"}`}>
                    {isDraft ? "Draft" : "Published"}
                  </span>
                </div>

                <div className="project-library-card__body">
                  <div>
                    <p>{project.category || "Uncategorized"}</p>
                    <h2>{project.shortTitle || project.title}</h2>
                    <span>/projects/{project.slug}</span>
                  </div>
                  <div className="project-library-card__actions" aria-label={`${project.shortTitle || project.title} actions`}>
                    <button
                      className={project.featured ? "is-active" : ""}
                      type="button"
                      disabled={isUpdating || !canFeature || (!project.featured && featuredCount >= 6)}
                      aria-label={project.featured ? "Remove from featured projects" : "Feature project"}
                      title={!canFeature ? "Publish and show the project before featuring it" : "Feature project"}
                      onClick={(event) => {
                        event.stopPropagation();
                        updateProject(project, { featured: !project.featured }, project.featured ? "Removed from featured projects." : "Project featured on homepage.");
                      }}
                    >
                      <FiStar aria-hidden="true" />
                    </button>
                    <button
                      className={project.visible ? "is-active" : ""}
                      type="button"
                      disabled={isUpdating || isDraft}
                      aria-label={project.visible ? "Hide project" : "Show project"}
                      title={isDraft ? "Publish the project before showing it" : project.visible ? "Hide project" : "Show project"}
                      onClick={(event) => {
                        event.stopPropagation();
                        updateProject(project, { visible: !project.visible }, project.visible ? "Project hidden from portfolio." : "Project visible on portfolio.");
                      }}
                    >
                      {project.visible ? <FiEye aria-hidden="true" /> : <FiEyeOff aria-hidden="true" />}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="projects-overview__empty">
          <FiFolder aria-hidden="true" />
          <h2>No matching projects</h2>
          <p>Adjust the filter or create a new project draft.</p>
        </div>
      )}

      {isCreateOpen ? (
        <div className="dialog-backdrop" onMouseDown={closeCreateDialog}>
          <form
            className="project-create-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-project-title"
            onSubmit={handleCreate}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="project-create-dialog__header">
              <div>
                <p className="page-kicker">New Project</p>
                <h2 id="create-project-title">Create a project draft</h2>
              </div>
              <button type="button" onClick={closeCreateDialog} aria-label="Close dialog">
                <FiX aria-hidden="true" />
              </button>
            </div>
            <label className="form-group project-create-dialog__field">
              <span className="form-label">Project Name <b aria-hidden="true">*</b></span>
              <input
                className="form-input"
                autoFocus
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="Example: Portfolio CMS"
                aria-describedby="project-slug-preview"
                required
              />
            </label>
            <div className="project-create-dialog__slug" id="project-slug-preview">
              <span>Generated project URL</span>
              <code>/projects/{slugify(projectName) || "project-name"}</code>
            </div>
            <div className="project-create-dialog__actions">
              <button className="btn btn-secondary" type="button" onClick={closeCreateDialog}>Cancel</button>
              <button className="btn btn-primary" type="submit" disabled={isCreating || !projectName.trim()}>
                {isCreating ? "Creating..." : "Create Draft"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}

export default Projects;
