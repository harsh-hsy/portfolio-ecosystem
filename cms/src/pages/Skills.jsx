import { useCallback, useMemo, useState } from "react";

import EditorActions from "../components/common/EditorActions";
import FormField from "../components/editor/FormField";
import IconPicker from "../components/editor/IconPicker";
import RepeaterField from "../components/editor/RepeaterField";
import { isSupportedIcon } from "../data/iconCatalog";
import { usePortfolioEditor } from "../hooks/usePortfolioEditor";
import { updateSection } from "../utils/contentFormUtils";
import { validateForm, validators } from "../utils/validation";

const emptyForm = {
  title: "",
  copy: "",
  skillsImage: "",
  skills: [],
};

function normalizeSkills(skills = []) {
  return skills.map((group) => ({
    category: group?.category ?? "",
    items: (group?.items ?? []).map((skill) => ({
      name: skill?.name ?? "",
      icon: isSupportedIcon(skill?.icon) ? skill.icon : "code",
    })),
  }));
}

function formFromPortfolio(portfolio) {
  const profile = portfolio?.profile ?? {};
  const section = portfolio?.sections?.skills ?? {};

  return {
    title: section.title ?? "",
    copy: section.copy ?? "",
    skillsImage: profile.skillsImage ?? "",
    skills: normalizeSkills(portfolio?.skills),
  };
}

function portfolioFromForm(portfolio, form) {
  const skills = form.skills.map((group) => ({
    category: group.category.trim(),
    items: group.items.map((skill) => ({
      name: skill.name.trim(),
      icon: skill.icon,
    })),
  }));

  return updateSection(
    {
      ...portfolio,
      profile: {
        ...(portfolio.profile ?? {}),
        skillsImage: form.skillsImage.trim(),
      },
      skills,
    },
    "skills",
    {
      title: form.title.trim(),
      copy: form.copy.trim(),
    },
  );
}

function hasDuplicates(values) {
  const normalized = values.map((value) => value.trim().toLowerCase());
  return new Set(normalized).size !== normalized.length;
}

function validateSkillsForm(form) {
  return validateForm(form, {
    title: [validators.required("Skills title is required."), validators.maxLength(140)],
    copy: [
      validators.required("Skills description is required."),
      validators.maxLength(280),
    ],
    skillsImage: validators.required("Skills image is required."),
    skills: (groups) => {
      if (!Array.isArray(groups) || groups.length < 1 || groups.length > 6) {
        return "Add between one and six skill categories.";
      }

      if (hasDuplicates(groups.map((group) => group.category))) {
        return "Category names must be unique.";
      }

      for (const group of groups) {
        if (!group.category.trim() || group.category.trim().length > 50) {
          return "Every category needs a name using 50 characters or fewer.";
        }

        if (!Array.isArray(group.items) || group.items.length < 1 || group.items.length > 16) {
          return "Each category must contain between one and sixteen skills.";
        }

        if (hasDuplicates(group.items.map((skill) => skill.name))) {
          return `Skill names in ${group.category.trim()} must be unique.`;
        }

        if (group.items.some((skill) =>
          !skill.name.trim() || skill.name.trim().length > 40 || !isSupportedIcon(skill.icon)
        )) {
          return "Every skill needs a name using 40 characters or fewer and a supported icon.";
        }
      }

      return "";
    },
  });
}

function resolvePreviewUrl(source) {
  const value = String(source ?? "").trim();
  if (!value) return "";
  if (/^(https?:|data:|blob:)/i.test(value)) return value;

  const portfolioUrl = import.meta.env.VITE_PORTFOLIO_URL || "http://localhost:5173";

  try {
    return new URL(value, `${portfolioUrl.replace(/\/$/, "")}/`).href;
  } catch {
    return value;
  }
}

function SkillsImagePreview({ source }) {
  const [hasError, setHasError] = useState(false);
  const previewUrl = resolvePreviewUrl(source);

  if (!previewUrl || hasError) return <span>Image preview</span>;

  return (
    <img
      src={previewUrl}
      alt="Skills section preview"
      onLoad={() => setHasError(false)}
      onError={() => setHasError(true)}
    />
  );
}

function Skills() {
  const getForm = useCallback(
    (portfolio) => portfolio ? formFromPortfolio(portfolio) : emptyForm,
    [],
  );
  const getPortfolio = useCallback(
    (portfolio, form) => portfolioFromForm(portfolio, form),
    [],
  );

  const editor = usePortfolioEditor({
    moduleName: "skills",
    getForm,
    getPortfolio,
    validate: validateSkillsForm,
    successMessage: "Skills content updated successfully.",
  });
  const skillCount = useMemo(
    () => editor.form.skills.reduce((total, group) => total + group.items.length, 0),
    [editor.form.skills],
  );

  return (
    <section className="page">
      <div className="page-header">
        <p className="page-kicker">Content Module</p>
        <h1 className="page-title">Skills</h1>
        <p className="page-description">
          Manage the Skills section content, image, categories, and individual skills.
        </p>
      </div>

      <form className="panel content-editor skills-editor" onSubmit={editor.saveForm}>
        <div className="content-editor__header">
          <div>
            <span className="content-editor__eyebrow">Skills Preview</span>
            <h2>{editor.form.title || "Skills title"}</h2>
            <p>{editor.form.skills.length} categories &middot; {skillCount} skills</p>
          </div>
          <span className="content-editor__badge">
            {editor.isLoading ? "Loading" : "Connected"}
          </span>
        </div>

        <div className="content-editor__section">
          <h3>Section Content</h3>
          <div className="form-grid">
            <FormField
              label="Title"
              name="title"
              className="form-group--wide"
              value={editor.form.title}
              onChange={editor.updateField}
              error={editor.errors.title}
              required
            />
            <FormField
              label="Description"
              name="copy"
              as="textarea"
              className="form-group--wide"
              value={editor.form.copy}
              onChange={editor.updateField}
              error={editor.errors.copy}
              required
            />
          </div>
        </div>

        <div className="content-editor__section">
          <h3>Skills Image</h3>
          <div className="hero-image-editor skills-image-editor">
            <div className="hero-image-editor__preview">
              <SkillsImagePreview source={editor.form.skillsImage} />
            </div>
            <FormField
              label="Image URL or Path"
              name="skillsImage"
              value={editor.form.skillsImage}
              onChange={editor.updateField}
              error={editor.errors.skillsImage}
              required
            />
          </div>
        </div>

        <div className="content-editor__section">
          <div className="editor-section-heading">
            <div>
              <h3>Skill Categories</h3>
              <p>Organize related skills into the groups displayed on the portfolio.</p>
            </div>
          </div>

          <RepeaterField
            className="skills-categories-editor"
            label="Categories"
            items={editor.form.skills}
            onChange={(skills) =>
              editor.updateForm((current) => ({ ...current, skills }))
            }
            createItem={() => ({
              category: "New Category",
              items: [{ name: "New Skill", icon: "code" }],
            })}
            duplicateItem={(group) => ({
              category: `${group.category} Copy`,
              items: group.items.map((skill) => ({ ...skill })),
            })}
            getItemKey={(_, index) => index}
            addLabel={editor.form.skills.length >= 6 ? "Maximum 6 Categories" : "Add Category"}
            itemLabel="Category"
            maxItems={6}
            renderItem={({ item: group, updateItem: updateGroup }) => (
              <div className="skill-category-fields">
                <FormField
                  label="Category Name"
                  value={group.category}
                  onChange={(event) =>
                    updateGroup({ ...group, category: event.target.value })
                  }
                  required
                />

                <RepeaterField
                  className="skills-items-editor"
                  label="Skills"
                  items={group.items}
                  onChange={(items) => updateGroup({ ...group, items })}
                  createItem={() => ({ name: "New Skill", icon: "code" })}
                  duplicateItem={(skill) => ({
                    ...skill,
                    name: `${skill.name} Copy`,
                  })}
                  getItemKey={(_, index) => index}
                  addLabel={group.items.length >= 16 ? "Maximum 16 Skills" : "Add Skill"}
                  itemLabel="Skill"
                  maxItems={16}
                  renderItem={({ item: skill, updateItem: updateSkill }) => (
                    <div className="skill-item-fields">
                      <FormField
                        label="Skill Name"
                        value={skill.name}
                        onChange={(event) =>
                          updateSkill({ ...skill, name: event.target.value })
                        }
                        required
                      />
                      <IconPicker
                        label="Icon"
                        value={skill.icon}
                        onChange={(icon) => updateSkill({ ...skill, icon })}
                        required
                      />
                    </div>
                  )}
                />
              </div>
            )}
          />
          {editor.errors.skills ? (
            <p className="form-error" role="alert">{editor.errors.skills}</p>
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

export default Skills;
