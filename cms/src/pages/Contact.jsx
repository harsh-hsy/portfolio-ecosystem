import { useCallback } from "react";

import EditorActions from "../components/common/EditorActions";
import { usePortfolioEditor } from "../hooks/usePortfolioEditor";
import { createSocials, updateSection } from "../utils/contentFormUtils";

const emptyForm = {
  eyebrow: "",
  title: "",
  copy: "",
  availability: "",
  panelTitle: "",
  submitLabel: "",
  successMessage: "",
  errorMessage: "",
  failureMessage: "",
  nameLabel: "",
  emailLabel: "",
  subjectLabel: "",
  messageLabel: "",
  publicEmail: "",
};

function formFromPortfolio(portfolio) {
  const profile = portfolio?.profile ?? {};
  const section = portfolio?.sections?.contact ?? {};
  const fields = section.fields ?? {};

  return {
    eyebrow: section.eyebrow ?? "",
    title: section.title ?? "",
    copy: section.copy ?? "",
    availability: section.availability ?? "",
    panelTitle: section.panelTitle ?? "",
    submitLabel: section.submitLabel ?? "",
    successMessage: section.successMessage ?? "",
    errorMessage: section.errorMessage ?? "",
    failureMessage: section.failureMessage ?? "",
    nameLabel: fields.name ?? "",
    emailLabel: fields.email ?? "",
    subjectLabel: fields.subject ?? "",
    messageLabel: fields.message ?? "",
    publicEmail: profile.email ?? "",
  };
}

function portfolioFromForm(portfolio, form) {
  const nextProfile = {
    ...(portfolio.profile ?? {}),
    email: form.publicEmail.trim(),
  };

  return updateSection(
    {
      ...portfolio,
      profile: nextProfile,
      socials: createSocials(nextProfile),
    },
    "contact",
    {
      eyebrow: form.eyebrow.trim(),
      title: form.title.trim(),
      copy: form.copy.trim(),
      availability: form.availability.trim(),
      panelTitle: form.panelTitle.trim(),
      submitLabel: form.submitLabel.trim(),
      successMessage: form.successMessage.trim(),
      errorMessage: form.errorMessage.trim(),
      failureMessage: form.failureMessage.trim(),
      fields: {
        name: form.nameLabel.trim(),
        email: form.emailLabel.trim(),
        subject: form.subjectLabel.trim(),
        message: form.messageLabel.trim(),
      },
    },
  );
}

function Contact() {
  const getForm = useCallback((portfolio) => portfolio ? formFromPortfolio(portfolio) : emptyForm, []);
  const getPortfolio = useCallback((portfolio, form) => portfolioFromForm(portfolio, form), []);
  const editor = usePortfolioEditor({ moduleName: "contact", getForm, getPortfolio, successMessage: "Contact content updated successfully." });

  return (
    <section className="page">
      <div className="page-header">
        <p className="page-kicker">Content Module</p>
        <h1 className="page-title">Contact</h1>
        <p className="page-description">Manage contact section copy, form labels, feedback messages, availability, and public email.</p>
      </div>
      <form className="panel content-editor" onSubmit={editor.saveForm}>
        <div className="content-editor__header">
          <div><span className="content-editor__eyebrow">Contact section</span><h2>{editor.form.title || "Contact title"}</h2><p>{editor.form.availability || "Availability"}</p></div>
          <span className="content-editor__badge">{editor.isLoading ? "Loading" : "Connected"}</span>
        </div>
        <div className="content-editor__section">
          <h3>Section Copy</h3>
          <div className="form-grid">
            <label className="form-group"><span className="form-label">Eyebrow</span><input className="form-input" name="eyebrow" value={editor.form.eyebrow} onChange={editor.updateField} /></label>
            <label className="form-group"><span className="form-label">Public Email</span><input className="form-input" name="publicEmail" value={editor.form.publicEmail} onChange={editor.updateField} /></label>
            <label className="form-group"><span className="form-label">Availability</span><input className="form-input" name="availability" value={editor.form.availability} onChange={editor.updateField} /></label>
            <label className="form-group"><span className="form-label">Submit Label</span><input className="form-input" name="submitLabel" value={editor.form.submitLabel} onChange={editor.updateField} /></label>
            <label className="form-group form-group--wide"><span className="form-label">Title</span><input className="form-input" name="title" value={editor.form.title} onChange={editor.updateField} /></label>
            <label className="form-group form-group--wide"><span className="form-label">Copy</span><textarea className="form-input form-textarea" name="copy" value={editor.form.copy} onChange={editor.updateField} /></label>
            <label className="form-group form-group--wide"><span className="form-label">Panel Title</span><input className="form-input" name="panelTitle" value={editor.form.panelTitle} onChange={editor.updateField} /></label>
          </div>
        </div>
        <div className="content-editor__section">
          <h3>Form Labels & Messages</h3>
          <div className="form-grid">
            <label className="form-group"><span className="form-label">Name Field</span><input className="form-input" name="nameLabel" value={editor.form.nameLabel} onChange={editor.updateField} /></label>
            <label className="form-group"><span className="form-label">Email Field</span><input className="form-input" name="emailLabel" value={editor.form.emailLabel} onChange={editor.updateField} /></label>
            <label className="form-group"><span className="form-label">Subject Field</span><input className="form-input" name="subjectLabel" value={editor.form.subjectLabel} onChange={editor.updateField} /></label>
            <label className="form-group"><span className="form-label">Message Field</span><input className="form-input" name="messageLabel" value={editor.form.messageLabel} onChange={editor.updateField} /></label>
            <label className="form-group"><span className="form-label">Success Message</span><input className="form-input" name="successMessage" value={editor.form.successMessage} onChange={editor.updateField} /></label>
            <label className="form-group"><span className="form-label">Validation Message</span><input className="form-input" name="errorMessage" value={editor.form.errorMessage} onChange={editor.updateField} /></label>
            <label className="form-group form-group--wide"><span className="form-label">Failure Message</span><input className="form-input" name="failureMessage" value={editor.form.failureMessage} onChange={editor.updateField} /></label>
          </div>
        </div>
        <EditorActions status={editor.status}
          isDirty={editor.isDirty} isLoading={editor.isLoading} isSaving={editor.isSaving} onReset={editor.resetForm} />
      </form>
    </section>
  );
}

export default Contact;
