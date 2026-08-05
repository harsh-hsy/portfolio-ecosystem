import { useCallback } from "react";

import EditorActions from "../components/common/EditorActions";
import FormField from "../components/editor/FormField";
import RepeaterField from "../components/editor/RepeaterField";
import { usePortfolioEditor } from "../hooks/usePortfolioEditor";
import { updateSection } from "../utils/contentFormUtils";
import { validateForm, validators } from "../utils/validation";

const emptyForm = {
  title: "",
  achievements: [],
};

function cleanList(items) {
  return (Array.isArray(items) ? items : [])
    .map((item) => String(item ?? "").trim())
    .filter(Boolean);
}

function formFromPortfolio(portfolio) {
  const section = portfolio?.sections?.achievements ?? {};
  return {
    title: section.title ?? "",
    achievements: cleanList(portfolio?.achievements ?? []),
  };
}

function portfolioFromForm(portfolio, form) {
  return updateSection(
    {
      ...portfolio,
      achievements: cleanList(form.achievements),
    },
    "achievements",
    {
      ...(portfolio.sections?.achievements ?? {}),
      title: form.title.trim(),
    },
  );
}

function validateList(items) {
  const cleaned = cleanList(items);
  if (!cleaned.length) return "Add at least one achievement.";
  if (cleaned.length > 12) return "Use 12 achievements or fewer.";
  if (cleaned.some((item) => item.length > 140)) {
    return "Each achievement must use 140 characters or fewer.";
  }
  return "";
}

function validateAchievementsForm(form) {
  return validateForm(form, {
    title: [validators.required("Achievements title is required."), validators.maxLength(100)],
    achievements: validateList,
  });
}

function Achievements() {
  const getForm = useCallback(
    (portfolio) => (portfolio ? formFromPortfolio(portfolio) : emptyForm),
    [],
  );
  const getPortfolio = useCallback(
    (portfolio, form) => portfolioFromForm(portfolio, form),
    [],
  );
  const editor = usePortfolioEditor({
    moduleName: "achievements",
    getForm,
    getPortfolio,
    validate: validateAchievementsForm,
    successMessage: "Achievements updated successfully.",
  });

  return (
    <section className="page">
      <form className="panel content-editor list-content-editor" onSubmit={editor.saveForm}>
        <div className="content-editor__header">
          <div>
            <span className="content-editor__eyebrow">Achievements preview</span>
            <h2>{editor.form.title || "Achievements title"}</h2>
            <p>{editor.form.achievements?.length ?? 0} achievement cards</p>
          </div>
          <span className="content-editor__badge">
            {editor.isLoading ? "Loading" : "Connected"}
          </span>
        </div>

        <div className="content-editor__section">
          <h3>Section Content</h3>
          <div className="form-grid">
            <FormField
              label="Achievements Title"
              name="title"
              className="form-group--wide"
              value={editor.form.title}
              onChange={editor.updateField}
              error={editor.errors.title}
              maxLength={100}
              required
            />
          </div>
        </div>

        <div className="content-editor__section">
          <div className="editor-section-heading">
            <div>
              <h3>Achievement Cards</h3>
              <p>Arrange the achievements in the same order used on the public portfolio.</p>
            </div>
          </div>

          <RepeaterField
            className="content-list-repeater achievement-list-repeater"
            label="Achievements"
            items={editor.form.achievements ?? []}
            onChange={(achievements) =>
              editor.updateForm((current) => ({ ...current, achievements }))
            }
            createItem={() => ""}
            addLabel="Add Achievement"
            itemLabel="Achievement"
            maxItems={12}
            renderItem={({ item, index, updateItem }) => (
              <FormField
                label={`Achievement ${index + 1}`}
                value={item}
                onChange={(event) => updateItem(event.target.value)}
                as="textarea"
                maxLength={140}
                required
              />
            )}
          />
          {editor.errors.achievements ? (
            <p className="form-error" role="alert">{editor.errors.achievements}</p>
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

export default Achievements;
