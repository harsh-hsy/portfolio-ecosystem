import { useEffect, useMemo, useState } from "react";
import { FiRefreshCw, FiSave } from "react-icons/fi";

import PanelStatus from "../components/common/PanelStatus";
import {
  getAdminPortfolio,
  initializeAdminPortfolio,
  replaceAdminPortfolio,
} from "../services/portfolioService";

const initialForm = {
  name: "",
  fullName: "",
  role: "",
  rotatingRoles: "",
  tagline: "",
  location: "",
  email: "",
  github: "",
  linkedin: "",
  resume: "",
  image: "",
  aboutImage: "",
  skillsImage: "",
  about: "",
  heroAvailability: "",
  heroIntro: "",
  heroDescription: "",
  heroPrimaryAction: "",
  heroSecondaryAction: "",
  heroContactAction: "",
  aboutEyebrow: "",
  aboutTitle: "",
  aboutCopy: "",
  contactEyebrow: "",
  contactTitle: "",
  contactCopy: "",
};

function createSocials(profile) {
  return [
    { label: "GitHub", href: profile.github, icon: "github" },
    { label: "LinkedIn", href: profile.linkedin, icon: "linkedin" },
    { label: "Email", href: `mailto:${profile.email}`, icon: "email" },
  ];
}

function formFromPortfolio(portfolio) {
  const profile = portfolio?.profile ?? {};
  const sections = portfolio?.sections ?? {};
  const hero = sections.hero ?? {};
  const about = sections.about ?? {};
  const contact = sections.contact ?? {};

  return {
    name: profile.name ?? "",
    fullName: profile.fullName ?? "",
    role: profile.role ?? "",
    rotatingRoles: (profile.rotatingRoles ?? []).join(", "),
    tagline: profile.tagline ?? "",
    location: profile.location ?? "",
    email: profile.email ?? "",
    github: profile.github ?? "",
    linkedin: profile.linkedin ?? "",
    resume: profile.resume ?? "",
    image: profile.image ?? "",
    aboutImage: profile.aboutImage ?? "",
    skillsImage: profile.skillsImage ?? "",
    about: profile.about ?? "",
    heroAvailability: hero.availability ?? "",
    heroIntro: hero.intro ?? "",
    heroDescription: hero.description ?? "",
    heroPrimaryAction: hero.primaryAction ?? "",
    heroSecondaryAction: hero.secondaryAction ?? "",
    heroContactAction: hero.contactAction ?? "",
    aboutEyebrow: about.eyebrow ?? "",
    aboutTitle: about.title ?? "",
    aboutCopy: about.copy ?? "",
    contactEyebrow: contact.eyebrow ?? "",
    contactTitle: contact.title ?? "",
    contactCopy: contact.copy ?? "",
  };
}

function portfolioFromForm(portfolio, form) {
  const nextProfile = {
    ...(portfolio.profile ?? {}),
    name: form.name.trim(),
    fullName: form.fullName.trim(),
    role: form.role.trim(),
    rotatingRoles: form.rotatingRoles
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    tagline: form.tagline.trim(),
    location: form.location.trim(),
    email: form.email.trim(),
    github: form.github.trim(),
    linkedin: form.linkedin.trim(),
    resume: form.resume.trim(),
    image: form.image.trim(),
    aboutImage: form.aboutImage.trim(),
    skillsImage: form.skillsImage.trim(),
    about: form.about.trim(),
  };

  return {
    ...portfolio,
    profile: nextProfile,
    socials: createSocials(nextProfile),
    sections: {
      ...(portfolio.sections ?? {}),
      hero: {
        ...(portfolio.sections?.hero ?? {}),
        availability: form.heroAvailability.trim(),
        intro: form.heroIntro.trim(),
        description: form.heroDescription.trim(),
        primaryAction: form.heroPrimaryAction.trim(),
        secondaryAction: form.heroSecondaryAction.trim(),
        contactAction: form.heroContactAction.trim(),
        orbitLocation: form.location.trim(),
      },
      about: {
        ...(portfolio.sections?.about ?? {}),
        eyebrow: form.aboutEyebrow.trim(),
        title: form.aboutTitle.trim(),
        copy: form.aboutCopy.trim(),
      },
      contact: {
        ...(portfolio.sections?.contact ?? {}),
        eyebrow: form.contactEyebrow.trim(),
        title: form.contactTitle.trim(),
        copy: form.contactCopy.trim(),
      },
    },
  };
}

function Profile() {
  const [portfolio, setPortfolio] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ message: "", type: "success" });

  const hasPortfolio = Boolean(portfolio);

  const previewName = useMemo(
    () => form.name || form.fullName || "Portfolio owner",
    [form.fullName, form.name],
  );

  useEffect(() => {
    let active = true;

    async function loadPortfolio() {
      setIsLoading(true);
      setStatus({ message: "", type: "success" });

      try {
        const response = await getAdminPortfolio();
        const content = response.content
          ? response.content
          : (await initializeAdminPortfolio()).content;

        if (!active) return;
        setPortfolio(content);
        setForm(formFromPortfolio(content));
      } catch (error) {
        if (!active) return;
        setStatus({
          message: error.message || "Unable to load portfolio content.",
          type: "error",
        });
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadPortfolio();

    return () => {
      active = false;
    };
  }, []);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    if (!portfolio) return;
    setForm(formFromPortfolio(portfolio));
    setStatus({ message: "Unsaved profile edits discarded.", type: "warning" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!portfolio) return;

    setIsSaving(true);
    setStatus({ message: "", type: "success" });

    try {
      const nextPortfolio = portfolioFromForm(portfolio, form);
      const response = await replaceAdminPortfolio(nextPortfolio);
      setPortfolio(response.content);
      setForm(formFromPortfolio(response.content));
      setStatus({ message: "Profile content updated successfully.", type: "success" });
    } catch (error) {
      setStatus({
        message: error.message || "Unable to save profile content.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <p className="page-kicker">Content Module</p>
        <h1 className="page-title">Profile</h1>
        <p className="page-description">
          Manage the public identity, hero copy, about summary, contact intro,
          social links, resume URL, and image paths used by the portfolio.
        </p>
      </div>

      <form className="panel content-editor" onSubmit={handleSubmit}>
        <div className="content-editor__header">
          <div>
            <span className="content-editor__eyebrow">Public preview</span>
            <h2>{previewName}</h2>
            <p>{form.role || "Role will appear here"}</p>
          </div>

          <span className="content-editor__badge">
            {isLoading ? "Loading" : hasPortfolio ? "Connected" : "Offline"}
          </span>
        </div>

        <div className="content-editor__section">
          <h3>Core Identity</h3>
          <div className="form-grid">
            <label className="form-group">
              <span className="form-label">Display Name</span>
              <input className="form-input" name="name" value={form.name} onChange={updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">Full Name</span>
              <input className="form-input" name="fullName" value={form.fullName} onChange={updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">Primary Role</span>
              <input className="form-input" name="role" value={form.role} onChange={updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">Rotating Roles</span>
              <input
                className="form-input"
                name="rotatingRoles"
                value={form.rotatingRoles}
                onChange={updateField}
                placeholder="React Developer, UI Engineer"
              />
            </label>

            <label className="form-group">
              <span className="form-label">Location</span>
              <input className="form-input" name="location" value={form.location} onChange={updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">Email</span>
              <input className="form-input" name="email" type="email" value={form.email} onChange={updateField} />
            </label>
          </div>
        </div>

        <div className="content-editor__section">
          <h3>Links & Assets</h3>
          <div className="form-grid">
            <label className="form-group">
              <span className="form-label">GitHub URL</span>
              <input className="form-input" name="github" value={form.github} onChange={updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">LinkedIn URL</span>
              <input className="form-input" name="linkedin" value={form.linkedin} onChange={updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">Resume URL</span>
              <input className="form-input" name="resume" value={form.resume} onChange={updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">Hero Image Path</span>
              <input className="form-input" name="image" value={form.image} onChange={updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">About Image Path</span>
              <input className="form-input" name="aboutImage" value={form.aboutImage} onChange={updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">Skills Image Path</span>
              <input className="form-input" name="skillsImage" value={form.skillsImage} onChange={updateField} />
            </label>
          </div>
        </div>

        <div className="content-editor__section">
          <h3>Hero Content</h3>
          <div className="form-grid">
            <label className="form-group">
              <span className="form-label">Availability</span>
              <input className="form-input" name="heroAvailability" value={form.heroAvailability} onChange={updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">Intro Text</span>
              <input className="form-input" name="heroIntro" value={form.heroIntro} onChange={updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">Primary Button</span>
              <input className="form-input" name="heroPrimaryAction" value={form.heroPrimaryAction} onChange={updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">Secondary Button</span>
              <input className="form-input" name="heroSecondaryAction" value={form.heroSecondaryAction} onChange={updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">Contact Button</span>
              <input className="form-input" name="heroContactAction" value={form.heroContactAction} onChange={updateField} />
            </label>

            <label className="form-group form-group--wide">
              <span className="form-label">Hero Description</span>
              <textarea
                className="form-input form-textarea"
                name="heroDescription"
                value={form.heroDescription}
                onChange={updateField}
              />
            </label>
          </div>
        </div>

        <div className="content-editor__section">
          <h3>About & Contact Copy</h3>
          <div className="form-grid">
            <label className="form-group">
              <span className="form-label">About Eyebrow</span>
              <input className="form-input" name="aboutEyebrow" value={form.aboutEyebrow} onChange={updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">Contact Eyebrow</span>
              <input className="form-input" name="contactEyebrow" value={form.contactEyebrow} onChange={updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">About Title</span>
              <input className="form-input" name="aboutTitle" value={form.aboutTitle} onChange={updateField} />
            </label>

            <label className="form-group">
              <span className="form-label">Contact Title</span>
              <input className="form-input" name="contactTitle" value={form.contactTitle} onChange={updateField} />
            </label>

            <label className="form-group form-group--wide">
              <span className="form-label">About Profile Bio</span>
              <textarea className="form-input form-textarea" name="about" value={form.about} onChange={updateField} />
            </label>

            <label className="form-group form-group--wide">
              <span className="form-label">About Section Copy</span>
              <textarea className="form-input form-textarea" name="aboutCopy" value={form.aboutCopy} onChange={updateField} />
            </label>

            <label className="form-group form-group--wide">
              <span className="form-label">Contact Section Copy</span>
              <textarea className="form-input form-textarea" name="contactCopy" value={form.contactCopy} onChange={updateField} />
            </label>
          </div>
        </div>

        <div className="panel-footer">
          <PanelStatus message={status.message} type={status.type} />

          <div className="panel-actions">
            <button className="btn btn-secondary" type="button" onClick={resetForm} disabled={isLoading || isSaving || !hasPortfolio}>
              <FiRefreshCw />
              Reset
            </button>
            <button className="btn btn-primary" type="submit" disabled={isLoading || isSaving || !hasPortfolio}>
              <FiSave />
              {isSaving ? "Saving" : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default Profile;
