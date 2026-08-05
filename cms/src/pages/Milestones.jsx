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
  milestones: [],
};

function formFromPortfolio(portfolio) {
  const section = portfolio?.sections?.milestones ?? {};

  return {
    title: section.title ?? "",
    copy: section.copy ?? "",
    milestones: cleanStructuredEntries(portfolio?.milestones ?? []),
  };
}

function portfolioFromForm(portfolio, form) {
  return updateSection(
    {
      ...portfolio,
      milestones: cleanStructuredEntries(form.milestones),
    },
    "milestones",
    {
      title: form.title.trim(),
      copy: form.copy.trim(),
    },
  );
}

function validateMilestonesForm(form) {
  return validateForm(form, {
    title: [validators.required("Milestones title is required."), validators.maxLength(140)],
    copy: [
      validators.required("Milestones description is required."),
      validators.maxLength(280),
    ],
    milestones: (entries) =>
      validateStructuredEntries(entries, {
        collectionLabel: "milestones",
        itemLabel: "milestone",
      }),
  });
}

function Milestones() {
  const getForm = useCallback(
    (portfolio) => (portfolio ? formFromPortfolio(portfolio) : emptyForm),
    [],
  );
  const getPortfolio = useCallback(
    (portfolio, form) => portfolioFromForm(portfolio, form),
    [],
  );
  const editor = usePortfolioEditor({
    moduleName: "milestones",
    getForm,
    getPortfolio,
    validate: validateMilestonesForm,
    successMessage: "Milestones updated successfully.",
  });

  return (
    <section className="page">
      <form
        className="panel content-editor structured-content-editor milestones-editor"
        onSubmit={editor.saveForm}
      >
        <div className="content-editor__header">
          <div>
            <span className="content-editor__eyebrow">Milestones preview</span>
            <h2>{editor.form.title || "Milestones title"}</h2>
            <p>{editor.form.milestones?.length ?? 0} milestone cards</p>
          </div>
          <span className="content-editor__badge">
            {editor.isLoading ? "Loading" : "Connected"}
          </span>
        </div>

        <div className="content-editor__section">
          <h3>Section Content</h3>
          <div className="form-grid">
            <FormField
              label="Milestones Title"
              name="title"
              className="form-group--wide"
              value={editor.form.title}
              onChange={editor.updateField}
              error={editor.errors.title}
              maxLength={140}
              required
            />
            <FormField
              label="Milestones Description"
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
              <h3>Milestone Cards</h3>
              <p>Arrange the cards in the same order used on the public portfolio.</p>
            </div>
          </div>

          <StructuredEntriesEditor
            className="milestone-entries-editor"
            label="Portfolio Milestones"
            items={editor.form.milestones ?? []}
            onChange={(milestones) =>
              editor.updateForm((current) => ({ ...current, milestones }))
            }
            addLabel="Add Milestone"
            itemName="Milestone"
          />
          {editor.errors.milestones ? (
            <p className="form-error" role="alert">{editor.errors.milestones}</p>
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

export default Milestones;
