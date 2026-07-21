import { useCallback } from "react";

import EditorActions from "../components/common/EditorActions";
import { usePortfolioEditor } from "../hooks/usePortfolioEditor";
import { parseJson, toPrettyJson, updateSection } from "../utils/contentFormUtils";

const emptyForm = {
  eyebrow: "",
  title: "",
  copy: "",
  skillsImage: "",
  skillsJson: "[]",
};

function formFromPortfolio(portfolio) {
  const profile = portfolio?.profile ?? {};
  const skills = portfolio?.sections?.skills ?? {};

  return {
    eyebrow: skills.eyebrow ?? "",
    title: skills.title ?? "",
    copy: skills.copy ?? "",
    skillsImage: profile.skillsImage ?? "",
    skillsJson: toPrettyJson(portfolio?.skills ?? []),
  };
}

function portfolioFromForm(portfolio, form) {
  return updateSection(
    {
      ...portfolio,
      profile: {
        ...(portfolio.profile ?? {}),
        skillsImage: form.skillsImage.trim(),
      },
      skills: parseJson(form.skillsJson, portfolio.skills ?? []),
    },
    "skills",
    {
      eyebrow: form.eyebrow.trim(),
      title: form.title.trim(),
      copy: form.copy.trim(),
    },
  );
}

function Skills() {
  const getForm = useCallback((portfolio) => portfolio ? formFromPortfolio(portfolio) : emptyForm, []);
  const getPortfolio = useCallback((portfolio, form) => portfolioFromForm(portfolio, form), []);

  const editor = usePortfolioEditor({
    moduleName: "skills",
    getForm,
    getPortfolio,
    successMessage: "Skills content updated successfully.",
  });

  return (
    <section className="page">
      <div className="page-header">
        <p className="page-kicker">Content Module</p>
        <h1 className="page-title">Skills</h1>
        <p className="page-description">
          Manage skill section copy, skills image path, categories, skill names, and icons.
        </p>
      </div>

      <form className="panel content-editor" onSubmit={editor.saveForm}>
        <div className="content-editor__header">
          <div>
            <span className="content-editor__eyebrow">Skills section</span>
            <h2>{editor.form.title || "Skills title"}</h2>
            <p>{editor.form.eyebrow || "Section eyebrow"}</p>
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
              <span className="form-label">Skills Image Path</span>
              <input className="form-input" name="skillsImage" value={editor.form.skillsImage} onChange={editor.updateField} />
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
              <span className="form-label">Skill Categories JSON</span>
              <textarea className="form-input form-textarea form-textarea--code" name="skillsJson" value={editor.form.skillsJson} onChange={editor.updateField} />
            </label>
          </div>
        </div>

        <EditorActions status={editor.status}
          isDirty={editor.isDirty} isLoading={editor.isLoading} isSaving={editor.isSaving} onReset={editor.resetForm} />
      </form>
    </section>
  );
}

export default Skills;
