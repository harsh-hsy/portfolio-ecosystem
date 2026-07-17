import { useCallback } from "react";

import EditorActions from "../components/common/EditorActions";
import { usePortfolioEditor } from "../hooks/usePortfolioEditor";
import { linesToList, listToLines, updateSection } from "../utils/contentFormUtils";

const emptyForm = { eyebrow: "", title: "", services: "" };

function formFromPortfolio(portfolio) {
  const section = portfolio?.sections?.services ?? {};
  return {
    eyebrow: section.eyebrow ?? "",
    title: section.title ?? "",
    services: listToLines(portfolio?.services ?? []),
  };
}

function portfolioFromForm(portfolio, form) {
  return updateSection(
    {
      ...portfolio,
      services: linesToList(form.services),
    },
    "services",
    {
      eyebrow: form.eyebrow.trim(),
      title: form.title.trim(),
    },
  );
}

function Services() {
  const getForm = useCallback((portfolio) => portfolio ? formFromPortfolio(portfolio) : emptyForm, []);
  const getPortfolio = useCallback((portfolio, form) => portfolioFromForm(portfolio, form), []);
  const editor = usePortfolioEditor({ getForm, getPortfolio, successMessage: "Services updated successfully." });

  return (
    <section className="page">
      <div className="page-header">
        <p className="page-kicker">Content Module</p>
        <h1 className="page-title">Services</h1>
        <p className="page-description">Manage frontend service offerings shown on the portfolio.</p>
      </div>
      <form className="panel content-editor" onSubmit={editor.saveForm}>
        <div className="content-editor__header">
          <div><span className="content-editor__eyebrow">Services</span><h2>{editor.form.title || "Services title"}</h2><p>One service per line.</p></div>
          <span className="content-editor__badge">{editor.isLoading ? "Loading" : "Connected"}</span>
        </div>
        <div className="content-editor__section">
          <h3>Section Content</h3>
          <div className="form-grid">
            <label className="form-group"><span className="form-label">Eyebrow</span><input className="form-input" name="eyebrow" value={editor.form.eyebrow} onChange={editor.updateField} /></label>
            <label className="form-group form-group--wide"><span className="form-label">Title</span><input className="form-input" name="title" value={editor.form.title} onChange={editor.updateField} /></label>
            <label className="form-group form-group--wide"><span className="form-label">Services</span><textarea className="form-input form-textarea form-textarea--tall" name="services" value={editor.form.services} onChange={editor.updateField} /></label>
          </div>
        </div>
        <EditorActions status={editor.status} isLoading={editor.isLoading} isSaving={editor.isSaving} onReset={editor.resetForm} />
      </form>
    </section>
  );
}

export default Services;
