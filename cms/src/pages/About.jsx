import { useCallback, useMemo, useState } from "react";

import EditorActions from "../components/common/EditorActions";
import FormField from "../components/editor/FormField";
import IconPicker from "../components/editor/IconPicker";
import RepeaterField from "../components/editor/RepeaterField";
import { isSupportedIcon } from "../data/iconCatalog";
import { usePortfolioEditor } from "../hooks/usePortfolioEditor";
import { updateSection } from "../utils/contentFormUtils";
import { validateForm, validators } from "../utils/validation";

const suffixOptions = [
  { value: "+", label: "+ (Plus)" },
  { value: "", label: "None" },
];

const emptyForm = {
  title: "",
  copy: "",
  bio: "",
  aboutImage: "",
  facts: [],
  stats: [],
};

function formFromPortfolio(portfolio) {
  const profile = portfolio?.profile ?? {};
  const about = portfolio?.sections?.about ?? {};

  return {
    title: about.title ?? "",
    copy: about.copy ?? "",
    bio: profile.about ?? "",
    aboutImage: profile.aboutImage ?? "",
    facts: (about.facts ?? []).map((fact) => {
      const isLocation = String(fact?.label ?? "").trim().toLowerCase() === "location";
      const useProfileLocation = fact?.useProfileLocation ?? isLocation;

      return {
        label: fact?.label ?? "",
        value: useProfileLocation
          ? profile.location ?? fact?.value ?? ""
          : fact?.value ?? "",
        icon: isSupportedIcon(fact?.icon) ? fact.icon : "user",
        useProfileLocation,
      };
    }),
    stats: (portfolio?.stats ?? []).map((stat) => ({
      id: stat?.id ?? "",
      value: String(stat?.value ?? ""),
      suffix: suffixOptions.some((option) => option.value === stat?.suffix)
        ? stat.suffix
        : "",
      label: stat?.label ?? "",
    })),
  };
}

function createId(label, index) {
  const slug = String(label ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || `stat-${index + 1}`;
}

function portfolioFromForm(portfolio, form) {
  const facts = form.facts.map((fact) => ({
    label: fact.label.trim(),
    value: fact.value.trim(),
    icon: fact.icon,
    useProfileLocation: Boolean(fact.useProfileLocation),
  }));
  const stats = form.stats.map((stat, index) => ({
    id: stat.id || createId(stat.label, index),
    value: Number(stat.value),
    suffix: stat.suffix,
    label: stat.label.trim(),
  }));

  return updateSection(
    {
      ...portfolio,
      profile: {
        ...(portfolio.profile ?? {}),
        about: form.bio.trim(),
        aboutImage: form.aboutImage.trim(),
      },
      stats,
    },
    "about",
    {
      title: form.title.trim(),
      copy: form.copy.trim(),
      facts,
    },
  );
}

function validateAboutForm(form) {
  return validateForm(form, {
    title: [validators.required("About title is required."), validators.maxLength(140)],
    copy: [
      validators.required("Short description is required."),
      validators.maxLength(280),
    ],
    bio: [validators.required("Profile bio is required."), validators.maxLength(1200)],
    aboutImage: validators.required("About image is required."),
    facts: (facts) => {
      if (!Array.isArray(facts) || facts.length < 1 || facts.length > 6) {
        return "Add between one and six fact cards.";
      }

      return facts.every(
        (fact) =>
          fact.label.trim() &&
          fact.value.trim() &&
          isSupportedIcon(fact.icon) && typeof fact.useProfileLocation === "boolean",
      )
        ? ""
        : "Complete the label, value, and icon for every fact card.";
    },
    stats: (stats) => {
      if (!Array.isArray(stats) || stats.length < 1 || stats.length > 4) {
        return "Add between one and four statistics.";
      }

      return stats.every(
        (stat) =>
          stat.label.trim() &&
          Number.isFinite(Number(stat.value)) &&
          Number(stat.value) >= 0 &&
          suffixOptions.some((option) => option.value === stat.suffix),
      )
        ? ""
        : "Every statistic needs a label, non-negative number, and valid suffix.";
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

function ImagePreview({ source, alt }) {
  const [hasError, setHasError] = useState(false);


  if (!source || hasError) {
    return <span>{hasError ? "Image unavailable" : "Image preview"}</span>;
  }

  return <img src={source} alt={alt} onError={() => setHasError(true)} />;
}

function About() {
  const getForm = useCallback(
    (portfolio) => (portfolio ? formFromPortfolio(portfolio) : emptyForm),
    [],
  );
  const getPortfolio = useCallback(
    (portfolio, form) => portfolioFromForm(portfolio, form),
    [],
  );

  const editor = usePortfolioEditor({
    moduleName: "about",
    getForm,
    getPortfolio,
    validate: validateAboutForm,
    successMessage: "About content updated successfully.",
  });

  const previewImage = useMemo(
    () => resolvePreviewUrl(editor.form.aboutImage),
    [editor.form.aboutImage],
  );

  return (
    <section className="page">
      <div className="page-header">
        <p className="page-kicker">Content Module</p>
        <h1 className="page-title">About</h1>
        <p className="page-description">
          Manage the visible About copy, profile image, fact cards, and statistics.
        </p>
      </div>

      <form className="panel content-editor about-editor" onSubmit={editor.saveForm}>
        <div className="content-editor__header">
          <div>
            <span className="content-editor__eyebrow">About preview</span>
            <h2>{editor.form.title || "About title"}</h2>
            <p>
              {editor.form.facts.length} fact cards &middot; {editor.form.stats.length} statistics
            </p>
          </div>
          <span className="content-editor__badge">
            {editor.isLoading ? "Loading" : "Connected"}
          </span>
        </div>

        <div className="content-editor__section">
          <h3>Section Content</h3>
          <div className="form-grid">
            <FormField
              label="About Title"
              name="title"
              className="form-group--wide"
              value={editor.form.title}
              onChange={editor.updateField}
              error={editor.errors.title}
              maxLength={140}
              required
            />

            <FormField
              label="Short Description"
              name="copy"
              as="textarea"
              className="form-group--wide about-copy-field"
              value={editor.form.copy}
              onChange={editor.updateField}
              error={editor.errors.copy}
              maxLength={280}
              required
            >
              <span className="form-character-count">
                {editor.form.copy.length}/280
              </span>
            </FormField>

            <FormField
              label="Profile Bio"
              name="bio"
              as="textarea"
              className="form-group--wide about-bio-field"
              value={editor.form.bio}
              onChange={editor.updateField}
              error={editor.errors.bio}
              maxLength={1200}
              required
            >
              <span className="form-character-count">
                {editor.form.bio.length}/1200
              </span>
            </FormField>
          </div>
        </div>

        <div className="content-editor__section">
          <h3>About Image</h3>
          <div className="about-image-editor">
            <div className="about-image-editor__preview">
              <ImagePreview
                source={previewImage}
                alt={`${editor.form.title || "About"} preview`}
              />
            </div>

            <div className="about-image-editor__control">
              <FormField
                label="About Image"
                name="aboutImage"
                value={editor.form.aboutImage}
                onChange={editor.updateField}
                error={editor.errors.aboutImage}
                helpText="Use an existing public image URL or frontend asset path."
                required
              />
            </div>
          </div>
        </div>

        <div className="content-editor__section">
          <div className="editor-section-heading">
            <div>
              <h3>Fact Cards</h3>
              <p>Manage the information cards shown beside the About image.</p>
            </div>
          </div>

          <RepeaterField
            className="about-facts-editor"
            label="About Facts"
            items={editor.form.facts}
            onChange={(facts) =>
              editor.updateForm((current) => ({ ...current, facts }))
            }
            createItem={() => ({ label: "", value: "", icon: "user", useProfileLocation: false })}
            getItemKey={(_, index) => index}
            addLabel={editor.form.facts.length >= 6 ? "Maximum 6 Fact Cards" : "Add Fact Card"}
            itemLabel="Fact Card"
            maxItems={6}
            renderItem={({ item, updateItem }) => {
              const isLocation = item.label.trim().toLowerCase() === "location";

              return (
                <div className="about-fact-fields">
                  <FormField
                    label="Label"
                    value={item.label}
                    onChange={(event) =>
                      updateItem({ ...item, label: event.target.value })
                    }
                    required
                  />
                  <IconPicker
                    label="Icon"
                    value={item.icon}
                    onChange={(icon) => updateItem({ ...item, icon })}
                    required
                  />
                  <FormField
                    label="Value"
                    className="about-fact-value"
                    value={item.value}
                    onChange={(event) =>
                      updateItem({ ...item, value: event.target.value })
                    }
                    disabled={isLocation && item.useProfileLocation}
                    required
                  />
                  {isLocation ? (
                    <label className="about-location-source">
                      <input
                        type="checkbox"
                        checked={item.useProfileLocation}
                        onChange={(event) =>
                          updateItem({
                            ...item,
                            useProfileLocation: event.target.checked,
                            value: event.target.checked
                              ? editor.portfolio?.profile?.location ?? item.value
                              : item.value,
                          })
                        }
                      />
                      <span>
                        <strong>Use Home location</strong>
                        <small>Keep this value synchronized with the Home location badge.</small>
                      </span>
                    </label>
                  ) : null}
                </div>
              );
            }}
          />
          {editor.errors.facts ? (
            <p className="form-error" role="alert">{editor.errors.facts}</p>
          ) : null}
        </div>

        <div className="content-editor__section">
          <div className="editor-section-heading">
            <div>
              <h3>Statistics</h3>
              <p>Manage up to four numeric cards displayed below the About section.</p>
            </div>
          </div>

          <RepeaterField
            className="about-stats-editor"
            label="About Statistics"
            items={editor.form.stats}
            onChange={(stats) =>
              editor.updateForm((current) => ({ ...current, stats }))
            }
            createItem={() => ({ id: "", value: "0", suffix: "+", label: "" })}
            getItemKey={(_, index) => index}
            addLabel={editor.form.stats.length >= 4 ? "Maximum 4 Statistics" : "Add Statistic"}
            itemLabel="Statistic"
            maxItems={4}
            renderItem={({ item, updateItem }) => (
              <div className="about-stat-fields">
                <FormField
                  label="Number"
                  type="number"
                  min="0"
                  value={item.value}
                  onChange={(event) =>
                    updateItem({ ...item, value: event.target.value })
                  }
                  required
                />
                <FormField
                  label="Suffix"
                  as="select"
                  options={suffixOptions}
                  value={item.suffix}
                  onChange={(event) =>
                    updateItem({ ...item, suffix: event.target.value })
                  }
                />
                <FormField
                  label="Label"
                  className="about-stat-label"
                  value={item.label}
                  onChange={(event) =>
                    updateItem({ ...item, label: event.target.value })
                  }
                  required
                />
              </div>
            )}
          />
          {editor.errors.stats ? (
            <p className="form-error" role="alert">{editor.errors.stats}</p>
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

export default About;
