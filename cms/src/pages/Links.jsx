import { useCallback } from "react";

import EditorActions from "../components/common/EditorActions";
import FormField from "../components/editor/FormField";
import { usePortfolioEditor } from "../hooks/usePortfolioEditor";
import { createSocials } from "../utils/contentFormUtils";
import { validateForm, validators } from "../utils/validation";

const emptyForm = {
  github: "",
  linkedin: "",
  email: "",
  resume: "",
  location: "",
  mapUrl: "",
};

function formFromPortfolio(portfolio) {
  const profile = portfolio?.profile ?? {};

  return {
    github: profile.github ?? "",
    linkedin: profile.linkedin ?? "",
    email: profile.email ?? "",
    resume: profile.resume ?? "",
    location: profile.location ?? "",
    mapUrl: profile.mapUrl ?? "",
  };
}

function portfolioFromForm(portfolio, form) {
  const nextProfile = {
    ...(portfolio.profile ?? {}),
    github: form.github.trim(),
    linkedin: form.linkedin.trim(),
    email: form.email.trim(),
    resume: form.resume.trim(),
    location: form.location.trim(),
    mapUrl: form.mapUrl.trim(),
  };

  return {
    ...portfolio,
    profile: nextProfile,
    socials: createSocials(nextProfile),
  };
}

function validateLinksForm(form) {
  return validateForm(form, {
    github: [validators.required("GitHub URL is required."), validators.url("Enter a valid GitHub URL.")],
    linkedin: [validators.required("LinkedIn URL is required."), validators.url("Enter a valid LinkedIn URL.")],
    email: [validators.required("Public email is required."), validators.email("Enter a valid public email address.")],
    resume: [validators.required("Resume URL is required."), validators.url("Enter a valid resume URL.")],
    location: [validators.required("Location is required."), validators.maxLength(80)],
    mapUrl: [validators.required("Location map URL is required."), validators.url("Enter a valid map URL.")],
  });
}

function Links() {
  const getForm = useCallback((portfolio) => portfolio ? formFromPortfolio(portfolio) : emptyForm, []);
  const getPortfolio = useCallback((portfolio, form) => portfolioFromForm(portfolio, form), []);

  const editor = usePortfolioEditor({
    moduleName: "links",
    getForm,
    getPortfolio,
    validate: validateLinksForm,
    successMessage: "Links updated successfully.",
  });

  return (
    <section className="page">
      <form className="panel content-editor structured-content-editor links-editor" onSubmit={editor.saveForm}>
        <div className="content-editor__header">
          <div>
            <span className="content-editor__eyebrow">Public links</span>
            <h2>Profile Links</h2>
            <p>These values power navbar actions, footer links, contact links, and resume downloads.</p>
          </div>

          <span className="content-editor__badge">
            {editor.isLoading ? "Loading" : "Connected"}
          </span>
        </div>

        <div className="content-editor__section">
          <h3>Social Media</h3>
          <div className="form-grid">
            <FormField label="GitHub URL" name="github" value={editor.form.github} onChange={editor.updateField} error={editor.errors.github} required />
            <FormField label="LinkedIn URL" name="linkedin" value={editor.form.linkedin} onChange={editor.updateField} error={editor.errors.linkedin} required />
          </div>
        </div>

        <div className="content-editor__section">
          <h3>Contact & Location</h3>
          <div className="form-grid">
            <FormField label="Public Email" name="email" type="email" value={editor.form.email} onChange={editor.updateField} error={editor.errors.email} required />
            <FormField label="Location" name="location" value={editor.form.location} onChange={editor.updateField} error={editor.errors.location} required />
            <FormField label="Location Map URL" name="mapUrl" className="form-group--wide" value={editor.form.mapUrl} onChange={editor.updateField} error={editor.errors.mapUrl} required />
          </div>
        </div>

        <div className="content-editor__section">
          <h3>Resume</h3>
          <div className="form-grid">
            <FormField label="Resume URL" name="resume" className="form-group--wide" value={editor.form.resume} onChange={editor.updateField} error={editor.errors.resume} required />
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
