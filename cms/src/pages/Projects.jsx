import { useCallback, useState } from "react";
import {
  FiArrowDown,
  FiArrowUp,
  FiCopy,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";

import EditorActions from "../components/common/EditorActions";
import ConfirmDialog from "../components/editor/ConfirmDialog";
import FormField from "../components/editor/FormField";
import RepeaterField from "../components/editor/RepeaterField";
import { usePortfolioEditor } from "../hooks/usePortfolioEditor";
import { updateSection } from "../utils/contentFormUtils";
import { validators } from "../utils/validation";

const emptyForm = {
  eyebrow: "",
  title: "",
  copy: "",
  allFilterLabel: "",
  filterAriaLabel: "",
  searchPlaceholder: "",
  projects: [],
};

function createEditorId() {
  return globalThis.crypto?.randomUUID?.() || `draft-${Date.now()}`;
}

function createEmptyProject() {
  return {
    _editorId: createEditorId(),
    id: "",
    slug: "",
    title: "",
    shortTitle: "",
    category: "",
    desc: "",
    live: "",
    github: "",
    thumbnail: "",
    images: [""],
    tech: [""],
    features: [""],
    problem: "",
    solution: "",
    challenges: [""],
    lessons: [""],
  };
}

function normalizeList(value, fallback = []) {
  return Array.isArray(value) ? [...value] : fallback;
}

function normalizeProject(project, index) {
  const images = normalizeList(
    project.images?.length ? project.images : project.gallery,
    project.thumbnail ? [project.thumbnail] : [""],
  );

  return {
    ...createEmptyProject(),
    ...project,
    _editorId:
      project._editorId ||
      project._id ||
      project.id ||
      project.slug ||
      `project-${index}`,
    images,
    tech: normalizeList(project.tech, [""]),
    features: normalizeList(project.features, [""]),
    challenges: normalizeList(project.challenges, [""]),
    lessons: normalizeList(project.lessons, [""]),
  };
}

function formFromPortfolio(portfolio) {
  const section = portfolio?.sections?.projects ?? {};

  return {
    eyebrow: section.eyebrow ?? "",
    title: section.title ?? "",
    copy: section.copy ?? "",
    allFilterLabel: section.allFilterLabel ?? "",
    filterAriaLabel: section.filterAriaLabel ?? "",
    searchPlaceholder: section.searchPlaceholder ?? "",
    projects: (portfolio?.projects ?? []).map(normalizeProject),
  };
}

function cleanList(items) {
  return items.map((item) => String(item).trim()).filter(Boolean);
}

function cleanProject(project) {
  const images = cleanList(project.images);
  const nextProject = {
    ...project,
    id: project.id.trim() || project.slug.trim(),
    slug: project.slug.trim(),
    title: project.title.trim(),
    shortTitle: project.shortTitle.trim(),
    category: project.category.trim(),
    desc: project.desc.trim(),
    live: project.live.trim(),
    github: project.github.trim(),
    thumbnail: String(project.thumbnail ?? "").trim() || images[0] || "",
    gallery: images,
    images,
    tech: cleanList(project.tech),
    features: cleanList(project.features ?? []),
    problem: project.problem.trim(),
    solution: project.solution.trim(),
    challenges: cleanList(project.challenges),
    lessons: cleanList(project.lessons),
  };

  delete nextProject._editorId;
  return nextProject;
}

function portfolioFromForm(portfolio, form) {
  return updateSection(
    {
      ...portfolio,
      projects: form.projects.map(cleanProject),
    },
    "projects",
    {
      eyebrow: form.eyebrow.trim(),
      title: form.title.trim(),
      copy: form.copy.trim(),
      allFilterLabel: form.allFilterLabel.trim(),
      filterAriaLabel: form.filterAriaLabel.trim(),
      searchPlaceholder: form.searchPlaceholder.trim(),
    },
  );
}

function validateProjectsForm(form) {
  const errors = {};

  if (!form.title.trim()) {
    errors.title = "Projects section title is required.";
  }

  if (!form.projects.length) {
    errors.projects = "Add at least one project.";
    return errors;
  }

  const slugs = new Set();

  form.projects.forEach((project, index) => {
    const prefix = `projects.${index}`;
    const requiredFields = {
      title: "Project title is required.",
      shortTitle: "Short title is required.",
      slug: "Project slug is required.",
      category: "Category is required.",
      desc: "Description is required.",
    };

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!project[field]?.trim()) {
        errors[`${prefix}.${field}`] = message;
      }
    });

    const normalizedSlug = project.slug.trim().toLowerCase();

    if (
      normalizedSlug &&
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedSlug)
    ) {
      errors[`${prefix}.slug`] =
        "Use lowercase letters, numbers, and hyphens only.";
    }

    if (normalizedSlug && slugs.has(normalizedSlug)) {
      errors[`${prefix}.slug`] = "Every project needs a unique slug.";
    }
    slugs.add(normalizedSlug);

    ["live", "github"].forEach((field) => {
      const message = validators.url()(project[field]);

      if (message) errors[`${prefix}.${field}`] = message;
    });

    if (!cleanList(project.images).length) {
      errors[`${prefix}.images`] = "Add at least one project image.";
    }

    if (!cleanList(project.tech).length) {
      errors[`${prefix}.tech`] = "Add at least one technology.";
    }
  });

  return errors;
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createUniqueSlug(baseSlug, projects, ignoredIndex = -1) {
  const root = baseSlug || "project";
  const existingSlugs = new Set(
    projects
      .filter((_, index) => index !== ignoredIndex)
      .map((project) => project.slug),
  );

  if (!existingSlugs.has(root)) return root;

  let suffix = 2;
  while (existingSlugs.has(`${root}-${suffix}`)) suffix += 1;
  return `${root}-${suffix}`;
}

function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState(null);
  const getForm = useCallback(
    (portfolio) => (portfolio ? formFromPortfolio(portfolio) : emptyForm),
    [],
  );
  const getPortfolio = useCallback(
    (portfolio, form) => portfolioFromForm(portfolio, form),
    [],
  );

  const editor = usePortfolioEditor({
    moduleName: "projects",
    getForm,
    getPortfolio,
    validate: validateProjectsForm,
    successMessage: "Projects updated in MongoDB successfully.",
  });

  const selectedIndex = editor.form.projects.length
    ? Math.min(activeIndex, editor.form.projects.length - 1)
    : -1;
  const selectedProject =
    selectedIndex >= 0 ? editor.form.projects[selectedIndex] : null;
  const fieldError = (field) =>
    editor.errors[`projects.${selectedIndex}.${field}`] || "";

  function updateProjects(updater) {
    editor.updateForm((current) => ({
      ...current,
      projects:
        typeof updater === "function" ? updater(current.projects) : updater,
    }));
  }

  function updateProject(field, value) {
    updateProjects((projects) =>
      projects.map((project, index) =>
        index === selectedIndex
          ? {
              ...project,
              [field]: value,
              ...(field === "title" && !project.slug
                ? {
                    slug: createUniqueSlug(
                      slugify(value),
                      editor.form.projects,
                      selectedIndex,
                    ),
                  }
                : {}),
            }
          : project,
      ),
    );
  }

  function updateProjectList(field, items) {
    updateProject(field, items);
  }

  function addProject() {
    setActiveIndex(editor.form.projects.length);
    updateProjects((projects) => [...projects, createEmptyProject()]);
  }

  function duplicateProject() {
    if (!selectedProject) return;

    const duplicate = {
      ...selectedProject,
      _editorId: createEditorId(),
      id: "",
      slug: createUniqueSlug(
        `${selectedProject.slug || "project"}-copy`,
        editor.form.projects,
      ),
      title: selectedProject.title
        ? `${selectedProject.title} Copy`
        : "Project Copy",
      shortTitle: selectedProject.shortTitle
        ? `${selectedProject.shortTitle} Copy`
        : "Project Copy",
      images: [...selectedProject.images],
      tech: [...selectedProject.tech],
      features: [...selectedProject.features],
      challenges: [...selectedProject.challenges],
      lessons: [...selectedProject.lessons],
    };

    updateProjects((projects) => {
      const nextProjects = [...projects];
      nextProjects.splice(selectedIndex + 1, 0, duplicate);
      return nextProjects;
    });
    setActiveIndex(selectedIndex + 1);
  }

  function moveProject(direction) {
    const nextIndex = selectedIndex + direction;

    if (selectedIndex < 0 || nextIndex < 0) return;
    if (nextIndex >= editor.form.projects.length) return;

    updateProjects((projects) => {
      const nextProjects = [...projects];
      [nextProjects[selectedIndex], nextProjects[nextIndex]] = [
        nextProjects[nextIndex],
        nextProjects[selectedIndex],
      ];
      return nextProjects;
    });
    setActiveIndex(nextIndex);
  }

  function deleteProject() {
    if (pendingDeleteIndex === null) return;

    updateProjects((projects) =>
      projects.filter((_, index) => index !== pendingDeleteIndex),
    );
    setActiveIndex((current) =>
      Math.max(0, Math.min(current, editor.form.projects.length - 2)),
    );
    setPendingDeleteIndex(null);
  }

  return (
    <section className="page">
      <div className="page-header">
        <p className="page-kicker">Content Module</p>
        <h1 className="page-title">Projects</h1>
        <p className="page-description">
          Add, edit, duplicate, reorder, hide, and remove portfolio projects
          without writing JSON.
        </p>
      </div>

      <form className="panel content-editor" onSubmit={editor.saveForm}>
        <div className="content-editor__header">
          <div>
            <span className="content-editor__eyebrow">MongoDB collection</span>
            <h2>{editor.form.title || "Projects title"}</h2>
            <p>
              {editor.form.projects.length} project
              {editor.form.projects.length === 1 ? "" : "s"} ready to manage.
            </p>
          </div>
          <span className="content-editor__badge">
            {editor.isLoading ? "Loading" : "Connected"}
          </span>
        </div>

        <div className="content-editor__section">
          <h3>Section Content</h3>
          <div className="form-grid">
            <FormField
              label="Eyebrow"
              name="eyebrow"
              value={editor.form.eyebrow}
              onChange={editor.updateField}
            />
            <FormField
              label="All Filter Label"
              name="allFilterLabel"
              value={editor.form.allFilterLabel}
              onChange={editor.updateField}
            />
                    <FormField
              label="Search Placeholder"
              name="searchPlaceholder"
              value={editor.form.searchPlaceholder}
              onChange={editor.updateField}
            />
            <FormField
              label="Title"
              name="title"
              value={editor.form.title}
              onChange={editor.updateField}
              error={editor.errors.title}
              className="form-group--wide"
              required
            />
            <FormField
              label="Description"
              name="copy"
              value={editor.form.copy}
              onChange={editor.updateField}
              as="textarea"
              className="form-group--wide"
            />
          </div>
        </div>

        <div className="content-editor__section">
          <div className="editor-section-heading">
            <div>
              <h3>Project Library</h3>
              <p>Select a project to edit its content and case study.</p>
            </div>
            <button type="button" className="btn btn-primary" onClick={addProject}>
              <FiPlus aria-hidden="true" />
              Add Project
            </button>
          </div>

          {editor.errors.projects ? (
            <p className="form-error" role="alert">
              {editor.errors.projects}
            </p>
          ) : null}

          <div className="project-manager">
            <aside className="project-manager__list" aria-label="Projects">
              {editor.form.projects.map((project, index) => (
                <button
                  type="button"
                  className={`project-manager__item ${
                    index === selectedIndex
                      ? "project-manager__item--active"
                      : ""
                  }`}
                  key={project._editorId}
                  onClick={() => setActiveIndex(index)}
                >
                  <span>{project.shortTitle || project.title || "Untitled project"}</span>
                  <small>
                    {project.category || "No category"}
                  </small>
                </button>
              ))}

              {!editor.form.projects.length ? (
                <div className="project-manager__empty">
                  No projects yet. Add your first project.
                </div>
              ) : null}
            </aside>

            {selectedProject ? (
              <div className="project-manager__editor">
                <div className="project-manager__toolbar">
                  <strong>
                    Project {selectedIndex + 1} of {editor.form.projects.length}
                  </strong>
                  <div>
                    <button
                      type="button"
                      className="icon-button"
                      onClick={() => moveProject(-1)}
                      disabled={selectedIndex === 0}
                      aria-label="Move project up"
                      title="Move up"
                    >
                      <FiArrowUp aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="icon-button"
                      onClick={() => moveProject(1)}
                      disabled={selectedIndex === editor.form.projects.length - 1}
                      aria-label="Move project down"
                      title="Move down"
                    >
                      <FiArrowDown aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="icon-button"
                      onClick={duplicateProject}
                      aria-label="Duplicate project"
                      title="Duplicate project"
                    >
                      <FiCopy aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="icon-button icon-button--danger"
                      onClick={() => setPendingDeleteIndex(selectedIndex)}
                      aria-label="Delete project"
                      title="Delete project"
                    >
                      <FiTrash2 aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="project-editor-group">
                  <h4>Identity</h4>
                  <div className="form-grid">
                    <FormField
                      label="Project Title"
                      value={selectedProject.title}
                      onChange={(event) => updateProject("title", event.target.value)}
                      error={fieldError("title")}
                      required
                    />
                    <FormField
                      label="Short Title"
                      value={selectedProject.shortTitle}
                      onChange={(event) =>
                        updateProject("shortTitle", event.target.value)
                      }
                      error={fieldError("shortTitle")}
                      required
                    />
                    <FormField
                      label="Category"
                      value={selectedProject.category}
                      onChange={(event) =>
                        updateProject("category", event.target.value)
                      }
                      error={fieldError("category")}
                      required
                    />
                    <FormField
                      label="Description"
                      value={selectedProject.desc}
                      onChange={(event) => updateProject("desc", event.target.value)}
                      error={fieldError("desc")}
                      as="textarea"
                      className="form-group--wide"
                      required
                    />
                  </div>
                </div>

                <div className="project-editor-group">
                  <h4>Links and Images</h4>
                  <div className="form-grid">
                    <FormField
                      label="Live Demo URL"
                      type="url"
                      value={selectedProject.live}
                      onChange={(event) => updateProject("live", event.target.value)}
                      error={fieldError("live")}
                    />
                    <FormField
                      label="GitHub URL"
                      type="url"
                      value={selectedProject.github}
                      onChange={(event) =>
                        updateProject("github", event.target.value)
                      }
                      error={fieldError("github")}
                    />
                  </div>

                  <RepeaterField
                    label="Project Screenshots"
                    items={selectedProject.images}
                    onChange={(items) => updateProjectList("images", items)}
                    createItem={() => ""}
                    addLabel="Add Screenshot"
                    emptyMessage="Add at least one screenshot."
                  />
                  {fieldError("images") ? (
                    <p className="form-error" role="alert">
                      {fieldError("images")}
                    </p>
                  ) : null}
                </div>

                <div className="project-editor-group">
                  <h4>Technology</h4>
                  <RepeaterField
                    label="Technologies"
                    items={selectedProject.tech}
                    onChange={(items) => updateProjectList("tech", items)}
                    createItem={() => ""}
                    addLabel="Add Technology"
                    />

                  {fieldError("tech") ? (
                    <p className="form-error" role="alert">
                      {fieldError("tech")}
                    </p>
                  ) : null}
                </div>

                <div className="project-editor-group">
                  <h4>Case Study</h4>
                  <div className="form-grid">
                    <FormField
                      label="Problem"
                      value={selectedProject.problem}
                      onChange={(event) =>
                        updateProject("problem", event.target.value)
                      }
                      as="textarea"
                    />
                    <FormField
                      label="Solution"
                      value={selectedProject.solution}
                      onChange={(event) =>
                        updateProject("solution", event.target.value)
                      }
                      as="textarea"
                    />
                  </div>
                  <div className="project-repeaters">
                    <RepeaterField
                      label="Challenges"
                      items={selectedProject.challenges}
                      onChange={(items) => updateProjectList("challenges", items)}
                    createItem={() => ""}
                      addLabel="Add Challenge"
                    />
                    <RepeaterField
                      label="Lessons Learned"
                      items={selectedProject.lessons}
                      onChange={(items) => updateProjectList("lessons", items)}
                    createItem={() => ""}
                      addLabel="Add Lesson"
                    />
                  </div>
                </div>
              </div>
            ) : null}
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

      <ConfirmDialog
        isOpen={pendingDeleteIndex !== null}
        title="Delete this project?"
        message="The project will be removed after you save these changes to MongoDB."
        onConfirm={deleteProject}
        onCancel={() => setPendingDeleteIndex(null)}
      />
    </section>
  );
}

export default Projects;
