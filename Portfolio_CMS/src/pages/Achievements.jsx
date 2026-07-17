import { useCallback } from "react";

import EditorActions from "../components/common/EditorActions";
import { usePortfolioEditor } from "../hooks/usePortfolioEditor";
import { linesToList, listToLines, updateSection } from "../utils/contentFormUtils";

const emptyForm = { eyebrow: "", title: "", achievements: "" };

function formFromPortfolio(portfolio) {
  const section = portfolio?.sections?.achievements ?? {};
  return {
    eyebrow: section.eyebrow ?? "",
    title: section.title ?? "",
    achievements: listToLines(portfolio?.achievements ?? []),
  };
}

function portfolioFromForm(portfolio, form) {
  return updateSection(
    {
      ...portfolio,
      achievements: linesToList(form.achievements),
    },
    "achievements",
    {
      eyebrow: form.eyebrow.trim(),
      title: form.title.trim(),
    },
  );
}

function Achievements() {
  const getForm = useCallback((portfolio) => portfolio ? formFromPortfolio(portfolio) : emptyForm, []);
  const getPortfolio = useCallback((portfolio, form) => portfolioFromForm(portfolio, form), []);
  const editor = usePortfolioEditor({ getForm, getPortfolio, successMessage: "Achievements updated successfully." });

  return (
    <section className="page">
      <div className="page-header">
        <p className="page-kicker">Content Module</p>
        <h1 className="page-title">Achievements</h1>
        <p className="page-description">Manage achievement bullets shown in the portfolio.</p>
      </div>
      <form className="panel content-editor" onSubmit={editor.saveForm}>
        <div className="content-editor__header">
          <div><span className="content-editor__eyebrow">Achievements</span><h2>{editor.form.title || "Achievements title"}</h2><p>One achievement per line.</p></div>
          <span className="content-editor__badge">{editor.isLoading ? "Loading" : "Connected"}</span>
        </div>
        <div className="content-editor__section">
          <h3>Section Content</h3>
          <div className="form-grid">
            <label className="form-group"><span className="form-label">Eyebrow</span><input className="form-input" name="eyebrow" value={editor.form.eyebrow} onChange={editor.updateField} /></label>
            <label className="form-group form-group--wide"><span className="form-label">Title</span><input className="form-input" name="title" value={editor.form.title} onChange={editor.updateField} /></label>
            <label className="form-group form-group--wide"><span className="form-label">Achievements</span><textarea className="form-input form-textarea form-textarea--tall" name="achievements" value={editor.form.achievements} onChange={editor.updateField} /></label>
          </div>
        </div>
        <EditorActions status={editor.status} isLoading={editor.isLoading} isSaving={editor.isSaving} onReset={editor.resetForm} />
      </form>
    </section>
  );
}

export default Achievements;
