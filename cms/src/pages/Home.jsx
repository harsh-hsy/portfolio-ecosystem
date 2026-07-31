import { useCallback, useMemo } from "react";

import EditorActions from "../components/common/EditorActions";
import FormField from "../components/editor/FormField";
import IconPicker from "../components/editor/IconPicker";
import ImageUploader from "../components/editor/ImageUploader";
import RepeaterField from "../components/editor/RepeaterField";
import { isSupportedIcon } from "../data/iconCatalog";
import { usePortfolioEditor } from "../hooks/usePortfolioEditor";
import { updateSection } from "../utils/contentFormUtils";
import { validateForm, validators } from "../utils/validation";

const emptyForm = {
  name: "",
  rotatingRoles: [],
  heroDescription: "",
  showAvailability: true,
  heroAvailability: "",
  heroImage: "",
  location: "",
  heroLocationIcon: "mapPin",
  heroOrbitRole: "",
  heroStrip: [],
};

function cleanList(items = []) {
  return items.map((item) => String(item).trim()).filter(Boolean);
}

function formFromPortfolio(portfolio) {
  const profile = portfolio?.profile ?? {};
  const hero = portfolio?.sections?.hero ?? {};

  return {
    name: profile.name ?? "",
    rotatingRoles: [...(profile.rotatingRoles ?? [])],
    heroDescription: hero.description ?? "",
    showAvailability: hero.showAvailability !== false,
    heroAvailability: hero.availability ?? "",
    heroImage: profile.image ?? "",
    location: profile.location ?? "",
    heroLocationIcon: isSupportedIcon(hero.orbitLocationIcon) ? hero.orbitLocationIcon : "mapPin",
    heroOrbitRole: hero.orbitRole ?? "",
    heroStrip: [...(hero.strip ?? [])],
  };
}

function portfolioFromForm(portfolio, form) {
  const rotatingRoles = cleanList(form.rotatingRoles);
  const highlights = cleanList(form.heroStrip);
  const location = form.location.trim();

  return updateSection(
    {
      ...portfolio,
      profile: {
        ...(portfolio.profile ?? {}),
        name: form.name.trim(),
        rotatingRoles,
        image: form.heroImage.trim(),
        location,
      },
    },
    "hero",
    {
      description: form.heroDescription.trim(),
      showAvailability: form.showAvailability,
      availability: form.heroAvailability.trim(),
      orbitLocation: location,
      orbitLocationIcon: form.heroLocationIcon,
      orbitRole: form.heroOrbitRole.trim(),
      strip: highlights,
    },
  );
}

function validateList(minimum, maximum, message) {
  return (value) => {
    const count = cleanList(value).length;
    return count >= minimum && count <= maximum ? "" : message;
  };
}

function validateHomeForm(form) {
  return validateForm(form, {
    name: [validators.required("Display name is required."), validators.maxLength(60)],
    rotatingRoles: validateList(1, 5, "Add between one and five job titles."),
    heroDescription: [
      validators.required("Hero description is required."),
      validators.maxLength(280),
    ],
    heroAvailability: (value, currentForm) =>
      currentForm.showAvailability && !String(value ?? "").trim()
        ? "Availability badge text is required while visible."
        : validators.maxLength(60)(value),
    heroImage: validators.required("Hero profile image is required."),
    location: validators.required("Location badge is required."),
    heroLocationIcon: (value) => isSupportedIcon(value) ? "" : "Select a supported location badge icon.",
    heroOrbitRole: [
      validators.required("Image role badge is required."),
      validators.maxLength(50),
    ],
    heroStrip: validateList(1, 6, "Add between one and six expertise highlights."),
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

function Home() {
  const getForm = useCallback(
    (portfolio) => (portfolio ? formFromPortfolio(portfolio) : emptyForm),
    [],
  );
  const getPortfolio = useCallback(
    (portfolio, form) => portfolioFromForm(portfolio, form),
    [],
  );

  const editor = usePortfolioEditor({
    moduleName: "home",
    getForm,
    getPortfolio,
    validate: validateHomeForm,
    successMessage: "Home content updated successfully.",
  });

  const previewName = editor.form.name || "Portfolio owner";
  const previewRole = editor.form.rotatingRoles[0] || "Job title will appear here";
  const publishedPreviewName = editor.savedForm.name || "Portfolio owner";
  const publishedPreviewImage = useMemo(
    () => resolvePreviewUrl(editor.savedForm.heroImage),
    [editor.savedForm.heroImage],
  );

  return (
    <section className="page">
      <div className="page-header">
        <p className="page-kicker">Content Module</p>
        <h1 className="page-title">Home</h1>
        <p className="page-description">
          Manage the visible hero identity, profile image, badges, rotating titles,
          and expertise highlights.
        </p>
      </div>

      <form className="panel content-editor home-editor" onSubmit={editor.saveForm}>
        <div className="content-editor__header">
          <div>
            <span className="content-editor__eyebrow">Hero preview</span>
            <h2>{previewName}</h2>
            <p>{previewRole}</p>
          </div>

          <span className="content-editor__badge">
            {editor.isLoading ? "Loading" : "Connected"}
          </span>
        </div>

        <div className="content-editor__section">
          <h3>Hero Content</h3>

          <div className="form-grid">
            <FormField
              label="Display Name"
              name="name"
              value={editor.form.name}
              onChange={editor.updateField}
              error={editor.errors.name}
              required
            />

            <div className="availability-editor">
              <FormField
                label="Availability Badge"
                name="heroAvailability"
                value={editor.form.heroAvailability}
                onChange={editor.updateField}
                error={editor.errors.heroAvailability}
                disabled={!editor.form.showAvailability}
                required={editor.form.showAvailability}
              />

              <label className="toggle-field">
                <input
                  type="checkbox"
                  checked={editor.form.showAvailability}
                  onChange={(event) =>
                    editor.updateForm((current) => ({
                      ...current,
                      showAvailability: event.target.checked,
                    }))
                  }
                />
                <span>
                  <strong>Show Availability Badge</strong>
                  <small>Display the availability badge in the hero.</small>
                </span>
              </label>
            </div>

            <FormField
              label="Hero Description"
              name="heroDescription"
              as="textarea"
              className="form-group--wide"
              value={editor.form.heroDescription}
              onChange={editor.updateField}
              error={editor.errors.heroDescription}
              maxLength={280}
              required
            />
          </div>

          <RepeaterField
            label="Rotating Job Titles"
            items={editor.form.rotatingRoles}
            onChange={(rotatingRoles) =>
              editor.updateForm((current) => ({ ...current, rotatingRoles }))
            }
            createItem={() => ""}
            addLabel="Add Job Title"
            itemLabel="Job Title"
            compact
          />
          {editor.errors.rotatingRoles ? (
            <p className="form-error" role="alert">{editor.errors.rotatingRoles}</p>
          ) : null}
        </div>

        <div className="content-editor__section">
          <h3>Hero Image and Badges</h3>

          <div className="hero-image-editor media-editor-layout">
            <div className="media-current-card">
              <div className="media-current-card__heading">
                <span>Current image</span>
                <small>Published preview</small>
              </div>
              <div className="hero-image-editor__preview">
                {publishedPreviewImage ? (
                  <img src={publishedPreviewImage} alt={`${publishedPreviewName} portrait`} />
                ) : (
                  <span>Image preview</span>
                )}
              </div>
            </div>

            <ImageUploader
              value={editor.form.heroImage}
              onChange={(heroImage) => editor.updateForm((current) => ({ ...current, heroImage }))}
              label="Edit hero image"
              section="home"
              aspectRatio={1}
              previewMaxWidth="100%"
              error={editor.errors.heroImage}
              alt={`${previewName} portrait`}
              required
            />
          </div>

          <div className="form-grid hero-badges-editor">
              <IconPicker
                label="Location Badge Icon"
                value={editor.form.heroLocationIcon}
                onChange={(heroLocationIcon) =>
                  editor.updateForm((current) => ({ ...current, heroLocationIcon }))
                }
                error={editor.errors.heroLocationIcon}
                required
              />

              <FormField
                label="Location Badge"
                name="location"
                value={editor.form.location}
                onChange={editor.updateField}
                error={editor.errors.location}
                required
              />

              <FormField
                label="Image Role Badge"
                name="heroOrbitRole"
                className="form-group--wide"
                value={editor.form.heroOrbitRole}
                onChange={editor.updateField}
                error={editor.errors.heroOrbitRole}
                required
              />
          </div>
        </div>

        <div className="content-editor__section">
          <h3>Expertise Highlights</h3>
          <RepeaterField
            label="Highlights"
            items={editor.form.heroStrip}
            onChange={(heroStrip) =>
              editor.updateForm((current) => ({ ...current, heroStrip }))
            }
            createItem={() => ""}
            addLabel="Add Highlight"
            itemLabel="Highlight"
            compact
          />
          {editor.errors.heroStrip ? (
            <p className="form-error" role="alert">{editor.errors.heroStrip}</p>
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

export default Home;
