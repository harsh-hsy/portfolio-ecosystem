import { useCallback, useMemo } from "react";

import EditorActions from "../components/common/EditorActions";
import FormField from "../components/editor/FormField";
import { usePortfolioEditor } from "../hooks/usePortfolioEditor";
import {
  createSocials,
  csvToList,
  listToCsv,
  updateSection,
} from "../utils/contentFormUtils";
import { validateForm, validators } from "../utils/validation";

const emptyForm = {
  name: "",
  fullName: "",
  role: "",
  rotatingRoles: "",
  tagline: "",
  location: "",
  email: "",
  heroImage: "",
  heroAvailability: "",
  heroIntro: "",
  heroDescription: "",
  heroPrimaryAction: "",
  heroSecondaryAction: "",
  heroContactAction: "",
  heroOrbitRole: "",
  heroStrip: "",
  projectCount: "",
  technologyCount: "",
  disciplineCount: "",
  internshipCount: "",
};

function formFromPortfolio(portfolio) {
  const profile = portfolio?.profile ?? {};
  const hero = portfolio?.sections?.hero ?? {};
  const stats = portfolio?.stats ?? [];

  return {
    name: profile.name ?? "",
    fullName: profile.fullName ?? "",
    role: profile.role ?? "",
    rotatingRoles: listToCsv(profile.rotatingRoles ?? []),
    tagline: profile.tagline ?? "",
    location: profile.location ?? "",
    email: profile.email ?? "",
    heroImage: profile.image ?? "",
    heroAvailability: hero.availability ?? "",
    heroIntro: hero.intro ?? "",
    heroDescription: hero.description ?? "",
    heroPrimaryAction: hero.primaryAction ?? "",
    heroSecondaryAction: hero.secondaryAction ?? "",
    heroContactAction: hero.contactAction ?? "",
    heroOrbitRole: hero.orbitRole ?? "",
    heroStrip: listToCsv(hero.strip ?? []),
    projectCount: String(stats.find((item) => item.id === "projects")?.value ?? ""),
    technologyCount: String(stats.find((item) => item.id === "technologies")?.value ?? ""),
    disciplineCount: String(stats.find((item) => item.id === "disciplines")?.value ?? ""),
    internshipCount: String(stats.find((item) => item.id === "internship")?.value ?? ""),
  };
}

function statValue(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function portfolioFromForm(portfolio, form) {
  const nextProfile = {
    ...(portfolio.profile ?? {}),
    name: form.name.trim(),
    fullName: form.fullName.trim(),
    role: form.role.trim(),
    rotatingRoles: csvToList(form.rotatingRoles),
    tagline: form.tagline.trim(),
    location: form.location.trim(),
    email: form.email.trim(),
    image: form.heroImage.trim(),
  };

  return updateSection(
    {
      ...portfolio,
      profile: nextProfile,
      socials: createSocials(nextProfile),
      stats: [
        { id: "projects", value: statValue(form.projectCount), suffix: "+", label: "Projects Completed" },
        { id: "technologies", value: statValue(form.technologyCount), suffix: "+", label: "Technologies Practiced" },
        { id: "disciplines", value: statValue(form.disciplineCount), suffix: "+", label: "Core UI Disciplines" },
        { id: "internship", value: statValue(form.internshipCount), suffix: "+", label: "Internship Experience" },
      ],
    },
    "hero",
    {
      availability: form.heroAvailability.trim(),
      intro: form.heroIntro.trim(),
      description: form.heroDescription.trim(),
      primaryAction: form.heroPrimaryAction.trim(),
      secondaryAction: form.heroSecondaryAction.trim(),
      contactAction: form.heroContactAction.trim(),
      orbitLocation: form.location.trim(),
      orbitRole: form.heroOrbitRole.trim(),
      strip: csvToList(form.heroStrip),
    },
  );
}

function validateHomeForm(form) {
  return validateForm(form, {
    name: validators.required("Display name is required."),
    fullName: validators.required("Full name is required."),
    role: validators.required("Primary role is required."),
    email: [
      validators.required("Public email is required."),
      validators.email(),
    ],
  });
}

function Home() {
  const getForm = useCallback((portfolio) => portfolio ? formFromPortfolio(portfolio) : emptyForm, []);
  const getPortfolio = useCallback((portfolio, form) => portfolioFromForm(portfolio, form), []);

  const editor = usePortfolioEditor({
    moduleName: "home",
    getForm,
    getPortfolio,
    validate: validateHomeForm,
    successMessage: "Home content updated successfully.",
  });

  const previewName = useMemo(
    () => editor.form.name || editor.form.fullName || "Portfolio owner",
    [editor.form.fullName, editor.form.name],
  );

  return (
    <section className="page">
      <div className="page-header">
        <p className="page-kicker">Content Module</p>
        <h1 className="page-title">Home</h1>
        <p className="page-description">
          Manage the public home hero, identity, headline, stats, image path,
          and the hero strip shown on the frontend.
        </p>
      </div>

      <form className="panel content-editor" onSubmit={editor.saveForm}>
        <div className="content-editor__header">
          <div>
            <span className="content-editor__eyebrow">Public preview</span>
            <h2>{previewName}</h2>
            <p>{editor.form.role || "Role will appear here"}</p>
          </div>

          <span className="content-editor__badge">
            {editor.isLoading ? "Loading" : "Connected"}
          </span>
        </div>

        <div className="content-editor__section">
          <h3>Identity</h3>
          <div className="form-grid">
            <FormField
              label="Display Name"
              name="name"
              value={editor.form.name}
              onChange={editor.updateField}
              error={editor.errors.name}
              required
            />

            <FormField
              label="Full Name"
              name="fullName"
              value={editor.form.fullName}
              onChange={editor.updateField}
              error={editor.errors.fullName}
              required
            />

            <FormField
              label="Primary Role"
              name="role"
              value={editor.form.role}
              onChange={editor.updateField}
              error={editor.errors.role}
              required
            />

            <label className="form-group">
              <span className="form-label">Rotating Roles</span>
              <input className="form-input" name="rotatingRoles" value={editor.form.rotatingRoles} onChange={editor.updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">Location</span>
              <input className="form-input" name="location" value={editor.form.location} onChange={editor.updateField} />
            </label>

            <FormField
              label="Public Email"
              name="email"
              type="email"
              value={editor.form.email}
              onChange={editor.updateField}
              error={editor.errors.email}
              required
            />

            <label className="form-group form-group--wide">
              <span className="form-label">Tagline</span>
              <input className="form-input" name="tagline" value={editor.form.tagline} onChange={editor.updateField} />
            </label>
          </div>
        </div>

        <div className="content-editor__section">
          <h3>Hero</h3>
          <div className="form-grid">
            <label className="form-group">
              <span className="form-label">Hero Image Path</span>
              <input className="form-input" name="heroImage" value={editor.form.heroImage} onChange={editor.updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">Availability</span>
              <input className="form-input" name="heroAvailability" value={editor.form.heroAvailability} onChange={editor.updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">Intro Text</span>
              <input className="form-input" name="heroIntro" value={editor.form.heroIntro} onChange={editor.updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">Orbit Role</span>
              <input className="form-input" name="heroOrbitRole" value={editor.form.heroOrbitRole} onChange={editor.updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">Primary Button</span>
              <input className="form-input" name="heroPrimaryAction" value={editor.form.heroPrimaryAction} onChange={editor.updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">Secondary Button</span>
              <input className="form-input" name="heroSecondaryAction" value={editor.form.heroSecondaryAction} onChange={editor.updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">Contact Button</span>
              <input className="form-input" name="heroContactAction" value={editor.form.heroContactAction} onChange={editor.updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">Hero Strip Items</span>
              <input className="form-input" name="heroStrip" value={editor.form.heroStrip} onChange={editor.updateField} />
            </label>

            <label className="form-group form-group--wide">
              <span className="form-label">Hero Description</span>
              <textarea className="form-input form-textarea" name="heroDescription" value={editor.form.heroDescription} onChange={editor.updateField} />
            </label>
          </div>
        </div>

        <div className="content-editor__section">
          <h3>Stats</h3>
          <div className="form-grid">
            <label className="form-group">
              <span className="form-label">Projects Completed</span>
              <input className="form-input" name="projectCount" value={editor.form.projectCount} onChange={editor.updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">Technologies Practiced</span>
              <input className="form-input" name="technologyCount" value={editor.form.technologyCount} onChange={editor.updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">Core UI Disciplines</span>
              <input className="form-input" name="disciplineCount" value={editor.form.disciplineCount} onChange={editor.updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">Internship Experience</span>
              <input className="form-input" name="internshipCount" value={editor.form.internshipCount} onChange={editor.updateField} />
            </label>
          </div>
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
