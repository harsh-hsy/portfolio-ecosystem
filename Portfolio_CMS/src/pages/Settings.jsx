import { useCallback } from "react";

import EditorActions from "../components/common/EditorActions";
import { usePortfolioEditor } from "../hooks/usePortfolioEditor";
import { updateSection } from "../utils/contentFormUtils";

const emptyForm = {
  copyrightYear: "",
  notFoundEyebrow: "",
  notFoundTitle: "",
  notFoundCopy: "",
  notFoundAction: "",
};

function formFromPortfolio(portfolio) {
  const profile = portfolio?.profile ?? {};
  const notFound = portfolio?.sections?.notFound ?? {};
  return {
    copyrightYear: profile.copyrightYear ?? "",
    notFoundEyebrow: notFound.eyebrow ?? "",
    notFoundTitle: notFound.title ?? "",
    notFoundCopy: notFound.copy ?? "",
    notFoundAction: notFound.action ?? "",
  };
}

function portfolioFromForm(portfolio, form) {
  return updateSection(
    {
      ...portfolio,
      profile: {
        ...(portfolio.profile ?? {}),
        copyrightYear: form.copyrightYear.trim(),
      },
    },
    "notFound",
    {
      eyebrow: form.notFoundEyebrow.trim(),
      title: form.notFoundTitle.trim(),
      copy: form.notFoundCopy.trim(),
      action: form.notFoundAction.trim(),
    },
  );
}

function Settings() {
  const getForm = useCallback((portfolio) => portfolio ? formFromPortfolio(portfolio) : emptyForm, []);
  const getPortfolio = useCallback((portfolio, form) => portfolioFromForm(portfolio, form), []);
  const editor = usePortfolioEditor({ moduleName: "settings", getForm, getPortfolio, successMessage: "Settings updated successfully." });

  return (
    <section className="page">
      <div className="page-header">
        <p className="page-kicker">Content Module</p>
        <h1 className="page-title">Settings</h1>
        <p className="page-description">Manage site-level public portfolio settings that do not belong to one content section.</p>
      </div>
      <form className="panel content-editor" onSubmit={editor.saveForm}>
        <div className="content-editor__header">
          <div><span className="content-editor__eyebrow">Site settings</span><h2>Portfolio Settings</h2><p>Low-risk public content settings.</p></div>
          <span className="content-editor__badge">{editor.isLoading ? "Loading" : "Connected"}</span>
        </div>
        <div className="content-editor__section">
          <h3>Footer</h3>
          <div className="form-grid">
            <label className="form-group"><span className="form-label">Copyright Year</span><input className="form-input" name="copyrightYear" value={editor.form.copyrightYear} onChange={editor.updateField} /></label>
          </div>
        </div>
        <div className="content-editor__section">
          <h3>404 Page</h3>
          <div className="form-grid">
            <label className="form-group"><span className="form-label">Eyebrow</span><input className="form-input" name="notFoundEyebrow" value={editor.form.notFoundEyebrow} onChange={editor.updateField} /></label>
            <label className="form-group"><span className="form-label">Action Label</span><input className="form-input" name="notFoundAction" value={editor.form.notFoundAction} onChange={editor.updateField} /></label>
            <label className="form-group form-group--wide"><span className="form-label">Title</span><input className="form-input" name="notFoundTitle" value={editor.form.notFoundTitle} onChange={editor.updateField} /></label>
            <label className="form-group form-group--wide"><span className="form-label">Copy</span><textarea className="form-input form-textarea" name="notFoundCopy" value={editor.form.notFoundCopy} onChange={editor.updateField} /></label>
          </div>
        </div>
        <EditorActions status={editor.status} isLoading={editor.isLoading} isSaving={editor.isSaving} onReset={editor.resetForm} />
      </form>
    </section>
  );
}

export default Settings;
