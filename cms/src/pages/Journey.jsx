import { useCallback } from "react";

import EditorActions from "../components/common/EditorActions";
import FormField from "../components/editor/FormField";
import StructuredEntriesEditor from "../components/editor/StructuredEntriesEditor";
import { usePortfolioEditor } from "../hooks/usePortfolioEditor";
import { updateSection } from "../utils/contentFormUtils";
import {
  cleanStructuredEntries,
  validateStructuredEntries,
} from "../utils/structuredEntries";
import { validateForm, validators } from "../utils/validation";

const emptyForm = {
  title: "",
  copy: "",
  timeline: [],
};

function formFromPortfolio(portfolio) {
  const section = portfolio?.sections?.experience ?? {};

  return {
    title: section.title ?? "",
    copy: section.copy ?? "",
    timeline: cleanStructuredEntries(portfolio?.timeline ?? []),
  };
}

function portfolioFromForm(portfolio, form) {
  return updateSection(
    {
      ...portfolio,
      timeline: cleanStructuredEntries(form.timeline),
    },
    "experience",
    {
      title: form.title.trim(),
      copy: form.copy.trim(),
    },
  );
}

function validateJourneyForm(form) {
  return validateForm(form, {
    title: [validators.required("Journey title is required."), validators.maxLength(140)],
    copy: [
      validators.required("Journey description is required."),
      validators.maxLength(280),
    ],
    timeline: (entries) =>
      validateStructuredEntries(entries, {
        collectionLabel: "timeline entries",
        itemLabel: "timeline entry",
      }),
  });
}

function Journey() {
  const getForm = useCallback(
    (portfolio) => (portfolio ? formFromPortfolio(portfolio) : emptyForm),
    [],
  );
  const getPortfolio = useCallback(
    (portfolio, form) => portfolioFromForm(portfolio, form),
    [],
  );
  const editor = usePortfolioEditor({
    moduleName: "journey",
    getForm,
    getPortfolio,
    validate: validateJourneyForm,
    successMessage: "Journey content updated successfully.",
  });

  return (
    <section className="page">
      <form
        className="panel content-editor structured-content-editor journey-editor"
        onSubmit={editor.saveForm}
      >
        <div className="content-editor__header">
          <div>
            <span className="content-editor__eyebrow">Journey preview</span>
            <h2>{editor.form.title || "Journey title"}</h2>
            <p>{editor.form.timeline?.length ?? 0} timeline entries</p>
          </div>
          <span className="content-editor__badge">
            {editor.isLoading ? "Loading" : "Connected"}
          </span>
        </div>

        <div className="content-editor__section">
          <h3>Section Content</h3>
          <div className="form-grid">
            <FormField
              label="Journey Title"
              name="title"
              className="form-group--wide"
              value={editor.form.title}
              onChange={editor.updateField}
              error={editor.errors.title}
              maxLength={140}
              required
            />
            <FormField
              label="Journey Description"
              name="copy"
              as="textarea"
              className="form-group--wide structured-section-copy"
              value={editor.form.copy}
              onChange={editor.updateField}
              error={editor.errors.copy}
              maxLength={280}
              required
            />
          </div>
        </div>

        <div className="content-editor__section">
          <div className="editor-section-heading">
            <div>
              <h3>Timeline Entries</h3>
              <p>Arrange the cards in the same order used on the public portfolio.</p>
            </div>
          </div>

          <StructuredEntriesEditor
            className="journey-entries-editor"
            label="Journey Timeline"
            items={editor.form.timeline ?? []}
            onChange={(timeline) =>
              editor.updateForm((current) => ({ ...current, timeline }))
            }
            addLabel="Add Timeline Entry"
            itemName="Timeline Entry"
          />
          {editor.errors.timeline ? (
            <p className="form-error" role="alert">{editor.errors.timeline}</p>
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

export default Journey;
