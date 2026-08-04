import { useCallback } from "react";

import EditorActions from "../components/common/EditorActions";
import FormField from "../components/editor/FormField";
import ImageUploader from "../components/editor/ImageUploader";
import { usePortfolioEditor } from "../hooks/usePortfolioEditor";
import { validateForm, validators } from "../utils/validation";
import { resolveMediaUrl } from "../utils/media";

const emptyForm = {
  siteName: "",
  brandInitials: "",
  titleSuffix: "",
  favicon: "",
  authorName: "",
  portfolioUrl: "",
  metaTitle: "",
  metaDescription: "",
  seoKeywords: "",
  allowIndexing: true,
  openGraphTitle: "",
  openGraphDescription: "",
  socialImage: "",
  twitterCard: "summary_large_image",
  loadingEnabled: true,
  loadingDurationSeconds: "2.4",
  desktopAnimations: true,
  mobileAnimations: false,
  smoothScroll: true,
  rotatingRole: true,
  stickyHeader: true,
  respectReducedMotion: true,
  maintenanceEnabled: false,
  maintenanceHeading: "",
  maintenanceMessage: "",
  announcementEnabled: false,
  announcementText: "",
};

function formFromPortfolio(portfolio) {
  const settings = portfolio?.settings ?? {};
  const identity = settings.siteIdentity ?? {};
  const sharing = settings.socialSharing ?? {};
  const experience = settings.experience ?? {};
  const maintenance = settings.maintenance ?? {};
  const seo = portfolio?.seo ?? {};

  return {
    siteName: identity.siteName ?? "Harsh Singh Portfolio",
    brandInitials: settings.brandInitials ?? "HS",
    titleSuffix: identity.titleSuffix ?? "Harsh Singh",
    favicon: identity.favicon ?? "",
    authorName: identity.authorName ?? portfolio?.profile?.name ?? "",
    portfolioUrl: identity.portfolioUrl ?? seo.siteUrl ?? "",
    metaTitle: seo.title ?? "",
    metaDescription: seo.description ?? "",
    seoKeywords: seo.keywords ?? "",
    allowIndexing: seo.allowIndexing ?? true,
    openGraphTitle: sharing.openGraphTitle ?? seo.title ?? "",
    openGraphDescription: sharing.openGraphDescription ?? seo.description ?? "",
    socialImage: sharing.image ?? "",
    twitterCard: sharing.twitterCard ?? "summary_large_image",
    loadingEnabled: experience.loadingEnabled ?? true,
    loadingDurationSeconds: String((experience.loadingDurationMs ?? 2400) / 1000),
    desktopAnimations: experience.desktopAnimations ?? true,
    mobileAnimations: experience.mobileAnimations ?? false,
    smoothScroll: experience.smoothScroll ?? true,
    rotatingRole: experience.rotatingRole ?? true,
    stickyHeader: experience.stickyHeader ?? true,
    respectReducedMotion: experience.respectReducedMotion ?? true,
    maintenanceEnabled: maintenance.enabled ?? false,
    maintenanceHeading: maintenance.heading ?? "Portfolio under maintenance",
    maintenanceMessage: maintenance.message ?? "I am making a few improvements. Please check back shortly.",
    announcementEnabled: maintenance.announcementEnabled ?? false,
    announcementText: maintenance.announcementText ?? "",
  };
}

function portfolioFromForm(portfolio, form) {
  const titleSuffix = form.titleSuffix.trim();
  const portfolioUrl = form.portfolioUrl.trim().replace(/\/$/, "");

  return {
    ...portfolio,
    settings: {
      ...(portfolio.settings ?? {}),
      brandInitials: form.brandInitials.trim(),
      loadingMark: form.brandInitials.trim(),
      siteIdentity: {
        ...(portfolio.settings?.siteIdentity ?? {}),
        siteName: form.siteName.trim(),
        titleSuffix,
        favicon: form.favicon,
        authorName: form.authorName.trim(),
        portfolioUrl,
      },
      socialSharing: {
        ...(portfolio.settings?.socialSharing ?? {}),
        openGraphTitle: form.openGraphTitle.trim(),
        openGraphDescription: form.openGraphDescription.trim(),
        image: form.socialImage,
        twitterCard: form.twitterCard,
      },
      experience: {
        ...(portfolio.settings?.experience ?? {}),
        loadingEnabled: form.loadingEnabled,
        loadingDurationMs: Math.round(Number(form.loadingDurationSeconds) * 1000),
        desktopAnimations: form.desktopAnimations,
        mobileAnimations: form.mobileAnimations,
        smoothScroll: form.smoothScroll,
        rotatingRole: form.rotatingRole,
        stickyHeader: form.stickyHeader,
        respectReducedMotion: form.respectReducedMotion,
      },
      maintenance: {
        ...(portfolio.settings?.maintenance ?? {}),
        enabled: form.maintenanceEnabled,
        heading: form.maintenanceHeading.trim(),
        message: form.maintenanceMessage.trim(),
        announcementEnabled: form.announcementEnabled,
        announcementText: form.announcementText.trim(),
      },
    },
    seo: {
      ...(portfolio.seo ?? {}),
      siteUrl: portfolioUrl,
      title: form.metaTitle.trim(),
      description: form.metaDescription.trim(),
      keywords: form.seoKeywords.trim(),
      author: form.authorName.trim(),
      allowIndexing: form.allowIndexing,
      projectTitleSuffix: titleSuffix ? ` | ${titleSuffix}` : "",
    },
  };
}

function validHttpUrl(value) {
  try {
    const url = new URL(String(value).trim());
    return ["http:", "https:"].includes(url.protocol)
      ? ""
      : "Use a valid HTTP or HTTPS URL.";
  } catch {
    return "Use a valid HTTP or HTTPS URL.";
  }
}

function validateSettings(form) {
  return validateForm(form, {
    siteName: [validators.required(), validators.maxLength(80)],
    brandInitials: [validators.required(), validators.maxLength(4)],
    titleSuffix: [validators.required(), validators.maxLength(60)],
    authorName: [validators.required(), validators.maxLength(80)],
    portfolioUrl: [validators.required(), validHttpUrl],
    metaTitle: [validators.required(), validators.maxLength(70)],
    metaDescription: [validators.required(), validators.maxLength(180)],
    seoKeywords: [validators.required(), validators.maxLength(300)],
    openGraphTitle: [validators.required(), validators.maxLength(70)],
    openGraphDescription: [validators.required(), validators.maxLength(200)],
    loadingDurationSeconds: [
      validators.required(),
      (value) => {
        const duration = Number(value);
        return Number.isFinite(duration) && duration >= 0 && duration <= 5
          ? ""
          : "Use a duration between 0 and 5 seconds.";
      },
    ],
    maintenanceHeading: [validators.required(), validators.maxLength(90)],
    maintenanceMessage: [validators.required(), validators.maxLength(240)],
    announcementText: [
      (value, values) => values.announcementEnabled && !String(value).trim()
        ? "Announcement text is required while visible."
        : "",
      validators.maxLength(180),
    ],
  });
}

function ToggleField({ checked, label, description, recommended, warning, onChange }) {
  return (
    <label className="toggle-field settings-toggle">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>
        <strong>{label}</strong>
        {description ? <small>{description}</small> : null}
        {recommended ? <small className="settings-toggle__recommended">Recommended: {recommended}</small> : null}
        {warning ? <small className="settings-toggle__warning">Performance impact: {warning}</small> : null}
      </span>
    </label>
  );
}

function Settings() {
  const getForm = useCallback(
    (portfolio) => (portfolio ? formFromPortfolio(portfolio) : emptyForm),
    [],
  );
  const getPortfolio = useCallback(
    (portfolio, form) => portfolioFromForm(portfolio, form),
    [],
  );
  const editor = usePortfolioEditor({
    moduleName: "settings",
    getForm,
    getPortfolio,
    validate: validateSettings,
    successMessage: "Website settings updated successfully.",
  });

  const updateToggle = (name, value) => {
    editor.updateForm((current) => ({ ...current, [name]: value }));
  };

  const changeMaintenanceMode = (enabled) => {
    if (enabled && !window.confirm("Enable maintenance mode? Public visitors will see only the maintenance page.")) return;
    updateToggle("maintenanceEnabled", enabled);
  };

  return (
    <section className="page settings-page">
      <div className="page-header">
        <p className="page-kicker">Configuration</p>
        <h1 className="page-title">Settings</h1>
        <p className="page-description">
          Configure site identity, discoverability, sharing, experience, and public availability.
        </p>
      </div>

      <form className="content-editor settings-editor" onSubmit={editor.saveForm}>
        <section className="panel account-section settings-card">
          <div className="editor-section-heading">
            <div>
              <h2 className="account-section__title">Site Identity</h2>
              <p>Control the public brand and browser identity used across the portfolio.</p>
            </div>
            <span className="content-editor__badge">{editor.isLoading ? "Loading" : "Connected"}</span>
          </div>
          <div className="form-grid">
            <FormField label="Site Name" name="siteName" value={editor.form.siteName} onChange={editor.updateField} error={editor.errors.siteName} maxLength={80} required />
            <FormField label="Brand Initials" name="brandInitials" value={editor.form.brandInitials} onChange={editor.updateField} error={editor.errors.brandInitials} maxLength={4} required />
            <FormField label="Browser Title Suffix" name="titleSuffix" value={editor.form.titleSuffix} onChange={editor.updateField} error={editor.errors.titleSuffix} helpText={`Preview: Projects | ${editor.form.titleSuffix || "Name"}`} maxLength={60} required />
            <FormField label="Default Author Name" name="authorName" value={editor.form.authorName} onChange={editor.updateField} error={editor.errors.authorName} maxLength={80} required />
            <FormField label="Primary Portfolio URL" name="portfolioUrl" type="url" className="form-group--wide" value={editor.form.portfolioUrl} onChange={editor.updateField} error={editor.errors.portfolioUrl} required />
            <div className="form-group form-group--wide">
              <ImageUploader
                value={editor.form.favicon}
                onChange={(value) => editor.updateForm((current) => ({ ...current, favicon: value }))}
                label="Favicon"
                section="settings"
                aspectRatio={1}
                outputWidth={512}
                outputHeight={512}
                alt="Portfolio favicon"
                previewMaxWidth="180px"
              />
            </div>
          </div>
        </section>

        <section className="panel account-section settings-card">
          <div className="editor-section-heading">
            <div>
              <h2 className="account-section__title">SEO Defaults</h2>
              <p>Fallback metadata used when a project or certificate does not provide its own values.</p>
            </div>
          </div>
          <div className="form-grid">
            <FormField label="Default Meta Title" name="metaTitle" value={editor.form.metaTitle} onChange={editor.updateField} error={editor.errors.metaTitle} maxLength={70} required />
            <FormField label="SEO Keywords" name="seoKeywords" value={editor.form.seoKeywords} onChange={editor.updateField} error={editor.errors.seoKeywords} maxLength={300} required />
            <FormField label="Default Meta Description" name="metaDescription" className="form-group--wide" value={editor.form.metaDescription} onChange={editor.updateField} error={editor.errors.metaDescription} maxLength={180} required />
            <div className="form-group form-group--wide settings-toggle-row">
              <ToggleField
                checked={editor.form.allowIndexing}
                label="Allow search engine indexing"
                description="Disable temporarily when the public portfolio should not appear in search results."
                recommended="Enabled"
                onChange={(value) => updateToggle("allowIndexing", value)}
              />
            </div>
          </div>
        </section>

        <section className="panel account-section settings-card">
          <div className="editor-section-heading">
            <div>
              <h2 className="account-section__title">Social Sharing</h2>
              <p>Default LinkedIn, WhatsApp, X, and Facebook preview metadata.</p>
            </div>
          </div>
          <div className="form-grid">
            <FormField label="Open Graph Title" name="openGraphTitle" value={editor.form.openGraphTitle} onChange={editor.updateField} error={editor.errors.openGraphTitle} maxLength={70} required />
            <FormField label="Twitter Card Type" name="twitterCard" as="select" value={editor.form.twitterCard} onChange={editor.updateField} options={[{ value: "summary_large_image", label: "Large image" }, { value: "summary", label: "Compact summary" }]} required />
            <FormField label="Open Graph Description" name="openGraphDescription" className="form-group--wide" value={editor.form.openGraphDescription} onChange={editor.updateField} error={editor.errors.openGraphDescription} maxLength={200} required />
            <div className="form-group form-group--wide settings-social-layout">
              <ImageUploader
                value={editor.form.socialImage}
                onChange={(value) => editor.updateForm((current) => ({ ...current, socialImage: value }))}
                label="Default Social-sharing Image"
                section="settings"
                aspectRatio={1200 / 630}
                outputWidth={1200}
                outputHeight={630}
                alt="Default social sharing preview"
                previewMaxWidth="560px"
              />
              <article className="social-preview-card">
                <div className="social-preview-card__image">
                  {editor.form.socialImage ? <img src={resolveMediaUrl(editor.form.socialImage)} alt="" /> : <span>1200 × 630 preview</span>}
                </div>
                <div>
                  <small>{editor.form.portfolioUrl || "portfolio.example"}</small>
                  <strong>{editor.form.openGraphTitle || "Open Graph title"}</strong>
                  <p>{editor.form.openGraphDescription || "Open Graph description"}</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="panel account-section settings-card">
          <div className="editor-section-heading">
            <div>
              <h2 className="account-section__title">Website Experience</h2>
              <p>Use recommended defaults to keep the portfolio smooth on mobile devices.</p>
            </div>
          </div>
          <div className="settings-toggle-grid">
            <ToggleField checked={editor.form.loadingEnabled} label="Loading animation" description="Show the short HS intro while content loads." recommended="Enabled" onChange={(value) => updateToggle("loadingEnabled", value)} />
            <FormField label="Loading Duration (seconds)" name="loadingDurationSeconds" type="number" min="0" max="5" step="0.1" value={editor.form.loadingDurationSeconds} onChange={editor.updateField} error={editor.errors.loadingDurationSeconds} disabled={!editor.form.loadingEnabled} required />
            <ToggleField checked={editor.form.desktopAnimations} label="Desktop animations" recommended="Enabled" onChange={(value) => updateToggle("desktopAnimations", value)} />
            <ToggleField checked={editor.form.mobileAnimations} label="Mobile animations" recommended="Disabled" warning="Enabling complex motion may reduce mobile smoothness." onChange={(value) => updateToggle("mobileAnimations", value)} />
            <ToggleField checked={editor.form.smoothScroll} label="Smooth scrolling" description="Desktop enhanced scrolling; mobile continues using native scrolling." recommended="Enabled" onChange={(value) => updateToggle("smoothScroll", value)} />
            <ToggleField checked={editor.form.rotatingRole} label="Rotating job title" recommended="Enabled" onChange={(value) => updateToggle("rotatingRole", value)} />
            <ToggleField checked={editor.form.stickyHeader} label="Sticky header" description="Keep navigation visible while scrolling." recommended="Enabled" onChange={(value) => updateToggle("stickyHeader", value)} />
            <ToggleField checked={editor.form.respectReducedMotion} label="Respect reduced-motion preference" description="Reduce animation for visitors who request it in their device settings." recommended="Enabled" onChange={(value) => updateToggle("respectReducedMotion", value)} />
          </div>
        </section>

        <section className={`panel account-section settings-card settings-card--maintenance ${editor.form.maintenanceEnabled ? "is-enabled" : ""}`}>
          <div className="editor-section-heading">
            <div>
              <h2 className="account-section__title">Maintenance and Announcement</h2>
              <p>Temporarily replace the public site or display a lightweight announcement.</p>
            </div>
          </div>
          <div className="form-grid">
            <ToggleField checked={editor.form.maintenanceEnabled} label="Maintenance mode" description="Visitors will see only the maintenance message." onChange={changeMaintenanceMode} />
            <ToggleField checked={editor.form.announcementEnabled} label="Show announcement" description="Display a small banner above the portfolio navigation." onChange={(value) => updateToggle("announcementEnabled", value)} />
            <FormField label="Maintenance Heading" name="maintenanceHeading" value={editor.form.maintenanceHeading} onChange={editor.updateField} error={editor.errors.maintenanceHeading} maxLength={90} required />
            <FormField label="Maintenance Message" name="maintenanceMessage" value={editor.form.maintenanceMessage} onChange={editor.updateField} error={editor.errors.maintenanceMessage} maxLength={240} required />
            <FormField label="Announcement Text" name="announcementText" className="form-group--wide" value={editor.form.announcementText} onChange={editor.updateField} error={editor.errors.announcementText} maxLength={180} disabled={!editor.form.announcementEnabled} required={editor.form.announcementEnabled} />
          </div>
        </section>

        <EditorActions status={editor.status} isDirty={editor.isDirty} isLoading={editor.isLoading} isSaving={editor.isSaving} onReset={editor.resetForm} />
      </form>
    </section>
  );
}

export default Settings;
