import { useCallback } from "react";

import EditorActions from "../components/common/EditorActions";
import FormField from "../components/editor/FormField";
import RepeaterField from "../components/editor/RepeaterField";
import { usePortfolioEditor } from "../hooks/usePortfolioEditor";
import { updateSection } from "../utils/contentFormUtils";
import { validateForm, validators } from "../utils/validation";

const emptyForm = {
  title: "",
  services: [],
};

function cleanList(items) {
  return (Array.isArray(items) ? items : [])
    .map((item) => String(item ?? "").trim())
    .filter(Boolean);
}

function formFromPortfolio(portfolio) {
  const section = portfolio?.sections?.services ?? {};
  return {
    title: section.title ?? "",
    services: cleanList(portfolio?.services ?? []),
  };
}

function portfolioFromForm(portfolio, form) {
  return updateSection(
    {
      ...portfolio,
      services: cleanList(form.services),
    },
    "services",
    {
      ...(portfolio.sections?.services ?? {}),
      title: form.title.trim(),
    },
  );
}

function validateList(items, label) {
  const cleaned = cleanList(items);
  if (!cleaned.length) return `Add at least one ${label}.`;
  if (cleaned.length > 12) return `Use 12 ${label}s or fewer.`;
  if (cleaned.some((item) => item.length > 70)) return `Each ${label} must use 70 characters or fewer.`;
  return "";
}

function validateServicesForm(form) {
  return validateForm(form, {
    title: [validators.required("Services title is required."), validators.maxLength(90)],
    services: (items) => validateList(items, "service"),
  });
}

function Services() {
  const getForm = useCallback(
    (portfolio) => (portfolio ? formFromPortfolio(portfolio) : emptyForm),
    [],
  );
  const getPortfolio = useCallback(
    (portfolio, form) => portfolioFromForm(portfolio, form),
    [],
  );
  const editor = usePortfolioEditor({
    moduleName: "services",
    getForm,
    getPortfolio,
    validate: validateServicesForm,
    successMessage: "Services updated successfully.",
  });

  return (
    <section className="page">
      <form className="panel content-editor list-content-editor" onSubmit={editor.saveForm}>
        <div className="content-editor__header">
          <div>
            <span className="content-editor__eyebrow">Services preview</span>
            <h2>{editor.form.title || "Services title"}</h2>
            <p>{editor.form.services?.length ?? 0} service cards</p>
          </div>
          <span className="content-editor__badge">
            {editor.isLoading ? "Loading" : "Connected"}
          </span>
        </div>

        <div className="content-editor__section">
          <h3>Section Content</h3>
          <div className="form-grid">
            <FormField
              label="Services Title"
              name="title"
              className="form-group--wide"
              value={editor.form.title}
              onChange={editor.updateField}
              error={editor.errors.title}
              maxLength={90}
              required
            />
          </div>
        </div>

        <div className="content-editor__section">
          <div className="editor-section-heading">
            <div>
              <h3>Service Cards</h3>
              <p>Arrange the services in the same order used on the public portfolio.</p>
            </div>
          </div>

          <RepeaterField
            className="content-list-repeater"
            label="Services"
            items={editor.form.services ?? []}
            onChange={(services) =>
              editor.updateForm((current) => ({ ...current, services }))
            }
            createItem={() => ""}
            addLabel="Add Service"
            itemLabel="Service"
            maxItems={12}
            renderItem={({ item, index, updateItem }) => (
              <FormField
                label={`Service ${index + 1}`}
                value={item}
                onChange={(event) => updateItem(event.target.value)}
                maxLength={70}
                required
              />
            )}
          />
          {editor.errors.services ? (
            <p className="form-error" role="alert">{editor.errors.services}</p>
          ) : null}
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

export default Services;
