import { useCallback } from "react";

import EditorActions from "../components/common/EditorActions";
import { usePortfolioEditor } from "../hooks/usePortfolioEditor";
import { parseJson, toPrettyJson, updateSection } from "../utils/contentFormUtils";

const emptyForm = {
  eyebrow: "",
  title: "",
  copy: "",
  timelineJson: "[]",
  milestonesJson: "[]",
};

function formFromPortfolio(portfolio) {
  const section = portfolio?.sections?.experience ?? {};
  return {
    eyebrow: section.eyebrow ?? "",
    title: section.title ?? "",
    copy: section.copy ?? "",
    timelineJson: toPrettyJson(portfolio?.timeline ?? []),
    milestonesJson: toPrettyJson(portfolio?.milestones ?? []),
  };
}

function portfolioFromForm(portfolio, form) {
  return updateSection(
    {
      ...portfolio,
      timeline: parseJson(form.timelineJson, portfolio.timeline ?? []),
      milestones: parseJson(form.milestonesJson, portfolio.milestones ?? []),
    },
    "experience",
    {
      eyebrow: form.eyebrow.trim(),
      title: form.title.trim(),
      copy: form.copy.trim(),
    },
  );
}

function Journey() {
  const getForm = useCallback((portfolio) => portfolio ? formFromPortfolio(portfolio) : emptyForm, []);
  const getPortfolio = useCallback((portfolio, form) => portfolioFromForm(portfolio, form), []);
  const editor = usePortfolioEditor({ moduleName: "journey", getForm, getPortfolio, successMessage: "Journey content updated successfully." });

  return (
    <section className="page">
      <div className="page-header">
        <p className="page-kicker">Content Module</p>
        <h1 className="page-title">Journey</h1>
        <p className="page-description">Manage education, internship, learning journey, future goals, and milestones.</p>
      </div>
      <form className="panel content-editor" onSubmit={editor.saveForm}>
        <div className="content-editor__header">
          <div>
            <span className="content-editor__eyebrow">Timeline</span>
            <h2>{editor.form.title || "Journey title"}</h2>
            <p>{editor.form.copy || "Journey copy"}</p>
          </div>
          <span className="content-editor__badge">{editor.isLoading ? "Loading" : "Connected"}</span>
        </div>
        <div className="content-editor__section">
          <h3>Section Content</h3>
          <div className="form-grid">
            <label className="form-group"><span className="form-label">Eyebrow</span><input className="form-input" name="eyebrow" value={editor.form.eyebrow} onChange={editor.updateField} /></label>
            <label className="form-group form-group--wide"><span className="form-label">Title</span><input className="form-input" name="title" value={editor.form.title} onChange={editor.updateField} /></label>
            <label className="form-group form-group--wide"><span className="form-label">Copy</span><textarea className="form-input form-textarea" name="copy" value={editor.form.copy} onChange={editor.updateField} /></label>
            <label className="form-group form-group--wide"><span className="form-label">Timeline JSON</span><textarea className="form-input form-textarea form-textarea--code" name="timelineJson" value={editor.form.timelineJson} onChange={editor.updateField} /></label>
            <label className="form-group form-group--wide"><span className="form-label">Milestones JSON</span><textarea className="form-input form-textarea form-textarea--code" name="milestonesJson" value={editor.form.milestonesJson} onChange={editor.updateField} /></label>
          </div>
        </div>
        <EditorActions status={editor.status} isLoading={editor.isLoading} isSaving={editor.isSaving} onReset={editor.resetForm} />
      </form>
    </section>
  );
}

export default Journey;
