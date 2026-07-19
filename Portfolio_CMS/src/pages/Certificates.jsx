import { useCallback } from "react";

import EditorActions from "../components/common/EditorActions";
import { usePortfolioEditor } from "../hooks/usePortfolioEditor";
import { parseJson, toPrettyJson, updateSection } from "../utils/contentFormUtils";

const emptyForm = {
  eyebrow: "",
  title: "",
  copy: "",
  viewLabel: "",
  downloadLabel: "",
  certificatesJson: "[]",
};

function formFromPortfolio(portfolio) {
  const section = portfolio?.sections?.certificates ?? {};
  return {
    eyebrow: section.eyebrow ?? "",
    title: section.title ?? "",
    copy: section.copy ?? "",
    viewLabel: section.viewLabel ?? "",
    downloadLabel: section.downloadLabel ?? "",
    certificatesJson: toPrettyJson(portfolio?.certificates ?? []),
  };
}

function portfolioFromForm(portfolio, form) {
  return updateSection(
    {
      ...portfolio,
      certificates: parseJson(form.certificatesJson, portfolio.certificates ?? []),
    },
    "certificates",
    {
      eyebrow: form.eyebrow.trim(),
      title: form.title.trim(),
      copy: form.copy.trim(),
      viewLabel: form.viewLabel.trim(),
      downloadLabel: form.downloadLabel.trim(),
    },
  );
}

function Certificates() {
  const getForm = useCallback((portfolio) => portfolio ? formFromPortfolio(portfolio) : emptyForm, []);
  const getPortfolio = useCallback((portfolio, form) => portfolioFromForm(portfolio, form), []);
  const editor = usePortfolioEditor({ moduleName: "certificates", getForm, getPortfolio, successMessage: "Certificates updated successfully." });

  return (
    <section className="page">
      <div className="page-header">
        <p className="page-kicker">Content Module</p>
        <h1 className="page-title">Certificates</h1>
        <p className="page-description">Manage certificate cards, issuers, dates, file links, and section labels.</p>
      </div>
      <form className="panel content-editor" onSubmit={editor.saveForm}>
        <div className="content-editor__header">
          <div>
            <span className="content-editor__eyebrow">Certificate showcase</span>
            <h2>{editor.form.title || "Certificates title"}</h2>
            <p>{editor.form.copy || "Certificate copy"}</p>
          </div>
          <span className="content-editor__badge">{editor.isLoading ? "Loading" : "Connected"}</span>
        </div>
        <div className="content-editor__section">
          <h3>Section Content</h3>
          <div className="form-grid">
            <label className="form-group"><span className="form-label">Eyebrow</span><input className="form-input" name="eyebrow" value={editor.form.eyebrow} onChange={editor.updateField} /></label>
            <label className="form-group"><span className="form-label">View Label</span><input className="form-input" name="viewLabel" value={editor.form.viewLabel} onChange={editor.updateField} /></label>
            <label className="form-group"><span className="form-label">Download Label</span><input className="form-input" name="downloadLabel" value={editor.form.downloadLabel} onChange={editor.updateField} /></label>
            <label className="form-group form-group--wide"><span className="form-label">Title</span><input className="form-input" name="title" value={editor.form.title} onChange={editor.updateField} /></label>
            <label className="form-group form-group--wide"><span className="form-label">Copy</span><textarea className="form-input form-textarea" name="copy" value={editor.form.copy} onChange={editor.updateField} /></label>
            <label className="form-group form-group--wide"><span className="form-label">Certificates JSON</span><textarea className="form-input form-textarea form-textarea--code" name="certificatesJson" value={editor.form.certificatesJson} onChange={editor.updateField} /></label>
          </div>
        </div>
        <EditorActions status={editor.status} isLoading={editor.isLoading} isSaving={editor.isSaving} onReset={editor.resetForm} />
      </form>
    </section>
  );
}

export default Certificates;
