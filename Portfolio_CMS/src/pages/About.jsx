import { useCallback } from "react";

import EditorActions from "../components/common/EditorActions";
import { usePortfolioEditor } from "../hooks/usePortfolioEditor";
import {
  factsToLines,
  linesToFacts,
  updateSection,
} from "../utils/contentFormUtils";

const emptyForm = {
  eyebrow: "",
  title: "",
  copy: "",
  bio: "",
  aboutImage: "",
  facts: "",
};

function formFromPortfolio(portfolio) {
  const profile = portfolio?.profile ?? {};
  const about = portfolio?.sections?.about ?? {};

  return {
    eyebrow: about.eyebrow ?? "",
    title: about.title ?? "",
    copy: about.copy ?? "",
    bio: profile.about ?? "",
    aboutImage: profile.aboutImage ?? "",
    facts: factsToLines(about.facts ?? []),
  };
}

function portfolioFromForm(portfolio, form) {
  return updateSection(
    {
      ...portfolio,
      profile: {
        ...(portfolio.profile ?? {}),
        about: form.bio.trim(),
        aboutImage: form.aboutImage.trim(),
      },
    },
    "about",
    {
      eyebrow: form.eyebrow.trim(),
      title: form.title.trim(),
      copy: form.copy.trim(),
      facts: linesToFacts(form.facts),
    },
  );
}

function About() {
  const getForm = useCallback((portfolio) => portfolio ? formFromPortfolio(portfolio) : emptyForm, []);
  const getPortfolio = useCallback((portfolio, form) => portfolioFromForm(portfolio, form), []);

  const editor = usePortfolioEditor({
    moduleName: "about",
    getForm,
    getPortfolio,
    successMessage: "About content updated successfully.",
  });

  return (
    <section className="page">
      <div className="page-header">
        <p className="page-kicker">Content Module</p>
        <h1 className="page-title">About</h1>
        <p className="page-description">
          Manage the about section content, profile bio, facts, and about image path.
        </p>
      </div>

      <form className="panel content-editor" onSubmit={editor.saveForm}>
        <div className="content-editor__header">
          <div>
            <span className="content-editor__eyebrow">About section</span>
            <h2>{editor.form.title || "About title"}</h2>
            <p>{editor.form.eyebrow || "Section eyebrow"}</p>
          </div>
          <span className="content-editor__badge">{editor.isLoading ? "Loading" : "Connected"}</span>
        </div>

        <div className="content-editor__section">
          <h3>Section Copy</h3>
          <div className="form-grid">
            <label className="form-group">
              <span className="form-label">Eyebrow</span>
              <input className="form-input" name="eyebrow" value={editor.form.eyebrow} onChange={editor.updateField} />
            </label>
            <label className="form-group">
              <span className="form-label">About Image Path</span>
              <input className="form-input" name="aboutImage" value={editor.form.aboutImage} onChange={editor.updateField} />
            </label>
            <label className="form-group form-group--wide">
              <span className="form-label">Title</span>
              <input className="form-input" name="title" value={editor.form.title} onChange={editor.updateField} />
            </label>
            <label className="form-group form-group--wide">
              <span className="form-label">Section Copy</span>
              <textarea className="form-input form-textarea" name="copy" value={editor.form.copy} onChange={editor.updateField} />
            </label>
            <label className="form-group form-group--wide">
              <span className="form-label">Profile Bio</span>
              <textarea className="form-input form-textarea" name="bio" value={editor.form.bio} onChange={editor.updateField} />
            </label>
            <label className="form-group form-group--wide">
              <span className="form-label">Facts</span>
              <textarea
                className="form-input form-textarea form-textarea--tall"
                name="facts"
                value={editor.form.facts}
                onChange={editor.updateField}
                placeholder="Education | B.Tech in Computer Science & Engineering | user"
              />
            </label>
          </div>
        </div>

        <EditorActions status={editor.status} isLoading={editor.isLoading} isSaving={editor.isSaving} onReset={editor.resetForm} />
      </form>
    </section>
  );
}

export default About;
