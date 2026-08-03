import { useCallback } from "react";

import EditorActions from "../components/common/EditorActions";
import FormField from "../components/editor/FormField";
import { usePortfolioEditor } from "../hooks/usePortfolioEditor";
import { validateForm, validators } from "../utils/validation";

const emptyForm = {
  footerName: "",
  footerTagline: "",
  copyrightYear: "",
  notFoundTitle: "",
  notFoundCopy: "",
};

function formFromPortfolio(portfolio) {
  const profile = portfolio?.profile ?? {};
  const settings = portfolio?.settings ?? {};
  const notFound = portfolio?.sections?.notFound ?? {};

  return {
    footerName: settings.footerName ?? profile.name ?? "",
    footerTagline: settings.footerDescription ?? profile.tagline ?? "",
    copyrightYear: profile.copyrightYear ?? "",
    notFoundTitle: notFound.title ?? "",
    notFoundCopy: notFound.copy ?? "",
  };
}

function portfolioFromForm(portfolio, form) {
  const currentNotFound = portfolio.sections?.notFound ?? {};
  const notFoundWithoutEyebrow = Object.fromEntries(
    Object.entries(currentNotFound).filter(([key]) => key !== "eyebrow"),
  );

  return {
    ...portfolio,
    profile: {
      ...(portfolio.profile ?? {}),
      copyrightYear: form.copyrightYear.trim(),
    },
    settings: {
      ...(portfolio.settings ?? {}),
      copyrightPrefix: "\u00a9",
      developedByLabel: "Developed by",
      footerName: form.footerName.trim(),
      footerDescription: form.footerTagline.trim(),
      footerBackToTopLabel: "Back to top",
    },
    sections: {
      ...(portfolio.sections ?? {}),
      notFound: {
        ...notFoundWithoutEyebrow,
        title: form.notFoundTitle.trim(),
        copy: form.notFoundCopy.trim(),
        action: "Back Home",
      },
    },
  };
}

function validateGlobalPages(form) {
  return validateForm(form, {
    footerName: [validators.required(), validators.maxLength(60)],
    footerTagline: [validators.required(), validators.maxLength(180)],
    copyrightYear: [
      validators.required("Copyright year is required."),
      (value) => /^\d{4}$/.test(String(value).trim())
        ? ""
        : "Use a four-digit year.",
    ],
    notFoundTitle: [validators.required(), validators.maxLength(90)],
    notFoundCopy: [validators.required(), validators.maxLength(240)],
  });
}

function GlobalPages() {
  const getForm = useCallback(
    (portfolio) => (portfolio ? formFromPortfolio(portfolio) : emptyForm),
    [],
  );
  const getPortfolio = useCallback(
    (portfolio, form) => portfolioFromForm(portfolio, form),
    [],
  );
  const editor = usePortfolioEditor({
    moduleName: "globalPages",
    getForm,
    getPortfolio,
    validate: validateGlobalPages,
    successMessage: "Global pages updated successfully.",
  });
  const savedHomeName = editor.portfolio?.profile?.name ?? "";
  const usesHomeName = Boolean(savedHomeName)
    && editor.form.footerName.trim() === savedHomeName.trim();

  return (
    <section className="page">
      <div className="page-header">
        <p className="page-kicker">Global Content</p>
        <h1 className="page-title">Global Pages</h1>
        <p className="page-description">
          Manage shared portfolio content and utility pages section by section.
        </p>
      </div>

      <form className="content-editor global-pages-editor" onSubmit={editor.saveForm}>
        <section className="panel account-section global-pages-card">
          <div className="editor-section-heading">
            <div>
              <h3>Footer</h3>
              <p>Manage the footer identity, description, and copyright year.</p>
            </div>
            <span className="content-editor__badge">
              {editor.isLoading ? "Loading" : "Connected"}
            </span>
          </div>
          <div className="form-grid">
            <FormField label="Copyright Year" name="copyrightYear" value={editor.form.copyrightYear} onChange={editor.updateField} error={editor.errors.copyrightYear} helpText="Displayed as © YEAR Developed by NAME." inputMode="numeric" maxLength={4} required />
            <div className="availability-editor global-pages-name-editor">
              <FormField label="Developed By" name="footerName" value={editor.form.footerName} onChange={editor.updateField} error={editor.errors.footerName} maxLength={60} required />
              <label className="toggle-field global-pages-name-source">
                <input
                  type="checkbox"
                  checked={usesHomeName}
                  disabled={!savedHomeName}
                  onChange={(event) => {
                    if (!event.target.checked || !savedHomeName) return;
                    editor.updateForm((current) => ({
                      ...current,
                      footerName: savedHomeName,
                    }));
                  }}
                />
                <span><strong>Fetch from Home page</strong></span>
              </label>
            </div>
            <FormField label="Footer Description" name="footerTagline" className="form-group--wide" value={editor.form.footerTagline} onChange={editor.updateField} error={editor.errors.footerTagline} maxLength={180} required />
          </div>
        </section>

        <section className="panel account-section global-pages-card">
          <div className="editor-section-heading">
            <div>
              <h3>404 Error Page</h3>
              <p>Manage the fallback page shown when a portfolio route does not exist.</p>
            </div>
          </div>
          <div className="form-grid">
            <FormField label="Title" name="notFoundTitle" value={editor.form.notFoundTitle} onChange={editor.updateField} error={editor.errors.notFoundTitle} maxLength={90} required />
            <FormField label="Message" name="notFoundCopy" value={editor.form.notFoundCopy} onChange={editor.updateField} error={editor.errors.notFoundCopy} maxLength={240} required />
          </div>
        </section>

        <EditorActions status={editor.status} isDirty={editor.isDirty} isLoading={editor.isLoading} isSaving={editor.isSaving} onReset={editor.resetForm} />
      </form>
    </section>
  );
}

export default GlobalPages;
