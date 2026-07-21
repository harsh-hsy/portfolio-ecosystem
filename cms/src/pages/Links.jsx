import { useCallback } from "react";

import EditorActions from "../components/common/EditorActions";
import { usePortfolioEditor } from "../hooks/usePortfolioEditor";
import { createSocials } from "../utils/contentFormUtils";

const emptyForm = {
  github: "",
  linkedin: "",
  email: "",
  resume: "",
};

function formFromPortfolio(portfolio) {
  const profile = portfolio?.profile ?? {};

  return {
    github: profile.github ?? "",
    linkedin: profile.linkedin ?? "",
    email: profile.email ?? "",
    resume: profile.resume ?? "",
  };
}

function portfolioFromForm(portfolio, form) {
  const nextProfile = {
    ...(portfolio.profile ?? {}),
    github: form.github.trim(),
    linkedin: form.linkedin.trim(),
    email: form.email.trim(),
    resume: form.resume.trim(),
  };

  return {
    ...portfolio,
    profile: nextProfile,
    socials: createSocials(nextProfile),
  };
}

function Links() {
  const getForm = useCallback((portfolio) => portfolio ? formFromPortfolio(portfolio) : emptyForm, []);
  const getPortfolio = useCallback((portfolio, form) => portfolioFromForm(portfolio, form), []);

  const editor = usePortfolioEditor({
    moduleName: "links",
    getForm,
    getPortfolio,
    successMessage: "Links updated successfully.",
  });

  return (
    <section className="page">
      <div className="page-header">
        <p className="page-kicker">Content Module</p>
        <h1 className="page-title">Links</h1>
        <p className="page-description">
          Manage public social links, email, and resume URL from one backend-connected module.
        </p>
      </div>

      <form className="panel content-editor" onSubmit={editor.saveForm}>
        <div className="content-editor__header">
          <div>
            <span className="content-editor__eyebrow">Public links</span>
            <h2>Socials & Resume</h2>
            <p>These values power navbar actions, footer links, contact links, and resume downloads.</p>
          </div>

          <span className="content-editor__badge">
            {editor.isLoading ? "Loading" : "Connected"}
          </span>
        </div>

        <div className="content-editor__section">
          <h3>Social Media</h3>
          <div className="form-grid">
            <label className="form-group">
              <span className="form-label">GitHub URL</span>
              <input className="form-input" name="github" value={editor.form.github} onChange={editor.updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">LinkedIn URL</span>
              <input className="form-input" name="linkedin" value={editor.form.linkedin} onChange={editor.updateField} />
            </label>
          </div>
        </div>

        <div className="content-editor__section">
          <h3>Contact & Resume</h3>
          <div className="form-grid">
            <label className="form-group">
              <span className="form-label">Public Email</span>
              <input className="form-input" name="email" type="email" value={editor.form.email} onChange={editor.updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">Resume URL</span>
              <input className="form-input" name="resume" value={editor.form.resume} onChange={editor.updateField} />
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
    </section>
  );
}

export default Links;
