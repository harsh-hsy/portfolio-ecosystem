import { useCallback } from "react";

import EditorActions from "../components/common/EditorActions";
import { usePortfolioEditor } from "../hooks/usePortfolioEditor";
import { parseJson, toPrettyJson, updateSection } from "../utils/contentFormUtils";

const emptyForm = {
  eyebrow: "",
  title: "",
  copy: "",
  allFilterLabel: "",
  filterAriaLabel: "",
  searchPlaceholder: "",
  projectsJson: "[]",
};

function formFromPortfolio(portfolio) {
  const section = portfolio?.sections?.projects ?? {};

  return {
    eyebrow: section.eyebrow ?? "",
    title: section.title ?? "",
    copy: section.copy ?? "",
    allFilterLabel: section.allFilterLabel ?? "",
    filterAriaLabel: section.filterAriaLabel ?? "",
    searchPlaceholder: section.searchPlaceholder ?? "",
    projectsJson: toPrettyJson(portfolio?.projects ?? []),
  };
}

function portfolioFromForm(portfolio, form) {
  return updateSection(
    {
      ...portfolio,
      projects: parseJson(form.projectsJson, portfolio.projects ?? []),
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

function Projects() {
  const getForm = useCallback((portfolio) => portfolio ? formFromPortfolio(portfolio) : emptyForm, []);
  const getPortfolio = useCallback((portfolio, form) => portfolioFromForm(portfolio, form), []);

  const editor = usePortfolioEditor({
    getForm,
    getPortfolio,
    successMessage: "Projects content updated successfully.",
  });

  return (
    <section className="page">
      <div className="page-header">
        <p className="page-kicker">Content Module</p>
        <h1 className="page-title">Projects</h1>
        <p className="page-description">
          Manage project cards, case studies, live links, GitHub links, thumbnails, gallery images, filters, and search labels.
        </p>
      </div>

      <form className="panel content-editor" onSubmit={editor.saveForm}>
        <div className="content-editor__header">
          <div>
            <span className="content-editor__eyebrow">Project library</span>
            <h2>{editor.form.title || "Projects title"}</h2>
            <p>Each project object powers both the card and the case study page.</p>
          </div>
          <span className="content-editor__badge">{editor.isLoading ? "Loading" : "Connected"}</span>
        </div>

        <div className="content-editor__section">
          <h3>Section Content</h3>
          <div className="form-grid">
            <label className="form-group">
              <span className="form-label">Eyebrow</span>
              <input className="form-input" name="eyebrow" value={editor.form.eyebrow} onChange={editor.updateField} />
            </label>
            <label className="form-group">
              <span className="form-label">All Filter Label</span>
              <input className="form-input" name="allFilterLabel" value={editor.form.allFilterLabel} onChange={editor.updateField} />
            </label>
            <label className="form-group">
              <span className="form-label">Filter ARIA Label</span>
              <input className="form-input" name="filterAriaLabel" value={editor.form.filterAriaLabel} onChange={editor.updateField} />
            </label>
            <label className="form-group">
              <span className="form-label">Search Placeholder</span>
              <input className="form-input" name="searchPlaceholder" value={editor.form.searchPlaceholder} onChange={editor.updateField} />
            </label>
            <label className="form-group form-group--wide">
              <span className="form-label">Title</span>
              <input className="form-input" name="title" value={editor.form.title} onChange={editor.updateField} />
            </label>
            <label className="form-group form-group--wide">
              <span className="form-label">Copy</span>
              <textarea className="form-input form-textarea" name="copy" value={editor.form.copy} onChange={editor.updateField} />
            </label>
            <label className="form-group form-group--wide">
              <span className="form-label">Projects JSON</span>
              <textarea className="form-input form-textarea form-textarea--code" name="projectsJson" value={editor.form.projectsJson} onChange={editor.updateField} />
            </label>
          </div>
        </div>

        <EditorActions status={editor.status} isLoading={editor.isLoading} isSaving={editor.isSaving} onReset={editor.resetForm} />
      </form>
    </section>
  );
}

export default Projects;
