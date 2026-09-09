import { useCallback } from "react";

import EditorActions from "../components/common/EditorActions";
import FormField from "../components/editor/FormField";
import { usePortfolioEditor } from "../hooks/usePortfolioEditor";
import { validateForm, validators } from "../utils/validation";

const emptyForm = {
  maintenanceEnabled: false,
  maintenanceHeading: "",
  maintenanceMessage: "",
  announcementEnabled: false,
  announcementText: "",
};

function formFromPortfolio(portfolio) {
  const maintenance = portfolio?.settings?.maintenance ?? {};

  return {
    maintenanceEnabled: maintenance.enabled ?? false,
    maintenanceHeading: maintenance.heading ?? "Portfolio under maintenance",
    maintenanceMessage:
      maintenance.message ?? "I am making a few improvements. Please check back shortly.",
    announcementEnabled: maintenance.announcementEnabled ?? false,
    announcementText: maintenance.announcementText ?? "",
  };
}

function portfolioFromForm(portfolio, form) {
  return {
    ...portfolio,
    settings: {
      ...(portfolio.settings ?? {}),
      maintenance: {
        ...(portfolio.settings?.maintenance ?? {}),
        enabled: form.maintenanceEnabled,
        heading: form.maintenanceHeading.trim(),
        message: form.maintenanceMessage.trim(),
        announcementEnabled: form.announcementEnabled,
        announcementText: form.announcementText.trim(),
      },
    },
  };
}

function validateSettings(form) {
  return validateForm(form, {
    maintenanceHeading: [validators.required(), validators.maxLength(90)],
    maintenanceMessage: [validators.required(), validators.maxLength(240)],
    announcementText: [
      (value, values) =>
        values.announcementEnabled && !String(value).trim()
          ? "Announcement text is required while visible."
          : "",
      validators.maxLength(180),
    ],
  });
}

function ToggleField({ checked, label, description, onChange }) {
  return (
    <label className="toggle-field settings-toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>
        <strong>{label}</strong>
        {description ? <small>{description}</small> : null}
      </span>
    </label>
  );
}

export default function Settings() {
  const getForm = useCallback(
    (portfolio) => (portfolio ? formFromPortfolio(portfolio) : emptyForm),
    [],
  );
  const getPortfolio = useCallback((portfolio, form) => portfolioFromForm(portfolio, form), []);
  const editor = usePortfolioEditor({
    moduleName: "settings",
    getForm,
    getPortfolio,
    validate: validateSettings,
    successMessage: "Maintenance settings updated successfully.",
  });

  const updateToggle = (name, value) => {
    editor.updateForm((current) => ({ ...current, [name]: value }));
  };

  const changeMaintenanceMode = (enabled) => {
    if (
      enabled &&
      !window.confirm(
        "Enable maintenance mode? Public visitors will see only the maintenance page.",
      )
    ) {
      return;
    }

    updateToggle("maintenanceEnabled", enabled);
  };

  return (
    <section className="page settings-page">
      <form className="content-editor settings-editor" onSubmit={editor.saveForm}>
        <section
          className={`panel account-section settings-card settings-card--maintenance ${editor.form.maintenanceEnabled ? "is-enabled" : ""}`}
        >
          <div className="editor-section-heading">
            <div>
              <h2 className="account-section__title">Maintenance and Announcement</h2>
              <p>Temporarily replace the public site or display a lightweight announcement.</p>
            </div>
            <span className="content-editor__badge">
              {editor.isLoading ? "Loading" : "Connected"}
            </span>
          </div>

          <div className="form-grid">
            <ToggleField
              checked={editor.form.maintenanceEnabled}
              label="Maintenance mode"
              description="Visitors will see only the maintenance message."
              onChange={changeMaintenanceMode}
            />
            <ToggleField
              checked={editor.form.announcementEnabled}
              label="Show announcement"
              description="Display a small banner above the portfolio navigation."
              onChange={(value) => updateToggle("announcementEnabled", value)}
            />
            <FormField
              label="Maintenance Heading"
              name="maintenanceHeading"
              value={editor.form.maintenanceHeading}
              onChange={editor.updateField}
              error={editor.errors.maintenanceHeading}
              maxLength={90}
              required
            />
            <FormField
              label="Maintenance Message"
              name="maintenanceMessage"
              value={editor.form.maintenanceMessage}
              onChange={editor.updateField}
              error={editor.errors.maintenanceMessage}
              maxLength={240}
              required
            />
            <FormField
              label="Announcement Text"
              name="announcementText"
              className="form-group--wide"
              value={editor.form.announcementText}
              onChange={editor.updateField}
              error={editor.errors.announcementText}
              maxLength={180}
              disabled={!editor.form.announcementEnabled}
              required={editor.form.announcementEnabled}
            />
          </div>
        </section>

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
