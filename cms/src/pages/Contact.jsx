import { useCallback } from "react";

import EditorActions from "../components/common/EditorActions";
import FormField from "../components/editor/FormField";
import { usePortfolioEditor } from "../hooks/usePortfolioEditor";
import { createSocials, updateSection } from "../utils/contentFormUtils";
import { validateForm, validators } from "../utils/validation";

const emptyForm = {
  eyebrow: "",
  title: "",
  copy: "",
  useHomeAvailability: false,
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
    useHomeAvailability: Boolean(section.useHomeAvailability),
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
      useHomeAvailability: form.useHomeAvailability,
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

function validateContactForm(form) {
  return validateForm(form, {
    publicEmail: [
      validators.required("Public email is required."),
      validators.email("Enter a valid public email address."),
    ],
    availability: (value, currentForm) =>
      currentForm.useHomeAvailability
        ? ""
        : validators.required("Availability text is required.")(value) ||
          validators.maxLength(80)(value),
    title: [validators.required("Contact title is required."), validators.maxLength(110)],
    copy: [validators.required("Contact copy is required."), validators.maxLength(280)],
    panelTitle: [validators.required("Panel title is required."), validators.maxLength(120)],
    submitLabel: [validators.required("Submit label is required."), validators.maxLength(40)],
    nameLabel: [validators.required("Name field label is required."), validators.maxLength(40)],
    emailLabel: [validators.required("Email field label is required."), validators.maxLength(40)],
    subjectLabel: [validators.required("Subject field label is required."), validators.maxLength(40)],
    messageLabel: [validators.required("Message field label is required."), validators.maxLength(40)],
    successMessage: [validators.required("Success message is required."), validators.maxLength(100)],
    errorMessage: [validators.required("Validation message is required."), validators.maxLength(100)],
    failureMessage: [validators.required("Failure message is required."), validators.maxLength(100)],
  });
}

function Contact() {
  const getForm = useCallback((portfolio) => portfolio ? formFromPortfolio(portfolio) : emptyForm, []);
  const getPortfolio = useCallback((portfolio, form) => portfolioFromForm(portfolio, form), []);
  const editor = usePortfolioEditor({
    moduleName: "contact",
    getForm,
    getPortfolio,
    validate: validateContactForm,
    successMessage: "Contact content updated successfully.",
  });
  const homeAvailability = editor.portfolio?.sections?.hero?.availability ?? "";
  const previewAvailability = editor.form.useHomeAvailability
    ? homeAvailability
    : editor.form.availability;

  return (
    <section className="page">
      <form className="panel content-editor structured-content-editor contact-editor" onSubmit={editor.saveForm}>
        <div className="content-editor__header">
          <div><span className="content-editor__eyebrow">Contact section</span><h2>{editor.form.title || "Contact title"}</h2><p>{previewAvailability || "Availability"}</p></div>
          <span className="content-editor__badge">{editor.isLoading ? "Loading" : "Connected"}</span>
        </div>
        <div className="content-editor__section">
          <h3>Section Content</h3>
          <div className="form-grid">
            <FormField label="Title" name="title" className="form-group--wide" value={editor.form.title} onChange={editor.updateField} error={editor.errors.title} required />
            <FormField label="Copy" name="copy" as="textarea" className="form-group--wide structured-section-copy" value={editor.form.copy} onChange={editor.updateField} error={editor.errors.copy} maxLength={280} required />
          </div>
        </div>

        <div className="content-editor__section">
          <h3>Contact Panel</h3>
          <div className="form-grid">
            <div className="availability-editor contact-availability-editor">
              <FormField
                label="Availability Badge"
                name="availability"
                value={editor.form.useHomeAvailability ? homeAvailability : editor.form.availability}
                onChange={editor.updateField}
                error={editor.errors.availability}
                disabled={editor.form.useHomeAvailability}
                required={!editor.form.useHomeAvailability}
              />

              <label className="toggle-field contact-availability-source">
                <input
                  type="checkbox"
                  checked={editor.form.useHomeAvailability}
                  onChange={(event) =>
                    editor.updateForm((current) => ({
                      ...current,
                      useHomeAvailability: event.target.checked,
                    }))
                  }
                />
                <span>
                  <strong>Fetch from Home page</strong>
                </span>
              </label>
            </div>
            <FormField label="Panel Title" name="panelTitle" value={editor.form.panelTitle} onChange={editor.updateField} error={editor.errors.panelTitle} required />
            <FormField label="Public Email" name="publicEmail" type="email" className="form-group--wide" value={editor.form.publicEmail} onChange={editor.updateField} error={editor.errors.publicEmail} helpText="Location, social links, resume, and portfolio URL are managed from the Links page." required />
          </div>
        </div>

        <div className="content-editor__section">
          <h3>Form Fields</h3>
          <div className="form-grid">
            <FormField label="Name Field" name="nameLabel" value={editor.form.nameLabel} onChange={editor.updateField} error={editor.errors.nameLabel} required />
            <FormField label="Email Field" name="emailLabel" value={editor.form.emailLabel} onChange={editor.updateField} error={editor.errors.emailLabel} required />
            <FormField label="Subject Field" name="subjectLabel" value={editor.form.subjectLabel} onChange={editor.updateField} error={editor.errors.subjectLabel} required />
            <FormField label="Message Field" name="messageLabel" value={editor.form.messageLabel} onChange={editor.updateField} error={editor.errors.messageLabel} required />
            <FormField label="Submit Label" name="submitLabel" className="form-group--wide" value={editor.form.submitLabel} onChange={editor.updateField} error={editor.errors.submitLabel} required />
          </div>
        </div>

        <div className="content-editor__section">
          <h3>Feedback Messages</h3>
          <div className="form-grid">
            <FormField label="Success Message" name="successMessage" value={editor.form.successMessage} onChange={editor.updateField} error={editor.errors.successMessage} required />
            <FormField label="Validation Message" name="errorMessage" value={editor.form.errorMessage} onChange={editor.updateField} error={editor.errors.errorMessage} required />
            <FormField label="Failure Message" name="failureMessage" className="form-group--wide" value={editor.form.failureMessage} onChange={editor.updateField} error={editor.errors.failureMessage} required />
          </div>
        </div>
        <EditorActions status={editor.status}
          isDirty={editor.isDirty} isLoading={editor.isLoading} isSaving={editor.isSaving} onReset={editor.resetForm} />
      </form>
    </section>
  );
}

export default Contact;
