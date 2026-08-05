import { useCallback } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";

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
  cmsAppName: "Portfolio CMS",
  cmsShortName: "CMS",
  cmsDescription: "",
  cmsUrl: "",
  cmsDisplay: "standalone",
  cmsThemeColor: "#111827",
  cmsBackgroundColor: "#080c14",
  cmsIcon: "",
  cmsDefaultTheme: "system",
  cmsDesktopAnimations: true,
  cmsMobileAnimations: false,
  cmsStickyHeader: true,
  cmsRespectReducedMotion: true,
  cmsMobileSidebarMode: "compact",
  cmsOpenGraphTitle: "",
  cmsOpenGraphDescription: "",
  cmsSocialImage: "",
  cmsTwitterCard: "summary_large_image",
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
  const cmsManifest = settings.cmsManifest ?? {};
  const cmsExperience = settings.cmsExperience ?? {};
  const cmsSocialSharing = settings.cmsSocialSharing ?? {};
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
    cmsAppName: cmsManifest.name ?? "Portfolio CMS",
    cmsShortName: cmsManifest.shortName ?? "CMS",
    cmsDescription: cmsManifest.description ?? "Private content management dashboard for the Harsh Singh portfolio.",
    cmsUrl: cmsManifest.cmsUrl ?? "https://harsh-hsy-cms.onrender.com",
    cmsDisplay: cmsManifest.display ?? "standalone",
    cmsThemeColor: cmsManifest.themeColor ?? "#111827",
    cmsBackgroundColor: cmsManifest.backgroundColor ?? "#080c14",
    cmsIcon: cmsManifest.icon ?? "",
    cmsDefaultTheme: cmsExperience.defaultTheme ?? "system",
    cmsDesktopAnimations: cmsExperience.desktopAnimations ?? true,
    cmsMobileAnimations: cmsExperience.mobileAnimations ?? false,
    cmsStickyHeader: cmsExperience.stickyHeader ?? true,
    cmsRespectReducedMotion: cmsExperience.respectReducedMotion ?? true,
    cmsMobileSidebarMode: cmsExperience.mobileSidebarMode ?? "compact",
    cmsOpenGraphTitle: cmsSocialSharing.openGraphTitle ?? "Portfolio CMS | Harsh Singh",
    cmsOpenGraphDescription: cmsSocialSharing.openGraphDescription ?? "Private content management dashboard for the Harsh Singh portfolio.",
    cmsSocialImage: cmsSocialSharing.image ?? "",
    cmsTwitterCard: cmsSocialSharing.twitterCard ?? "summary_large_image",
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
      cmsManifest: {
        ...(portfolio.settings?.cmsManifest ?? {}),
        name: form.cmsAppName.trim(),
        shortName: form.cmsShortName.trim(),
        description: form.cmsDescription.trim(),
        cmsUrl: form.cmsUrl.trim().replace(/\/$/, ""),
        display: form.cmsDisplay,
        themeColor: form.cmsThemeColor,
        backgroundColor: form.cmsBackgroundColor,
        icon: form.cmsIcon,
      },
      cmsExperience: {
        ...(portfolio.settings?.cmsExperience ?? {}),
        defaultTheme: form.cmsDefaultTheme,
        desktopAnimations: form.cmsDesktopAnimations,
        mobileAnimations: form.cmsMobileAnimations,
        stickyHeader: form.cmsStickyHeader,
        respectReducedMotion: form.cmsRespectReducedMotion,
        mobileSidebarMode: form.cmsMobileSidebarMode,
      },
      cmsSocialSharing: {
        ...(portfolio.settings?.cmsSocialSharing ?? {}),
        openGraphTitle: form.cmsOpenGraphTitle.trim(),
        openGraphDescription: form.cmsOpenGraphDescription.trim(),
        image: form.cmsSocialImage,
        twitterCard: form.cmsTwitterCard,
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

function validHexColor(value) {
  return /^#[0-9a-f]{6}$/i.test(String(value).trim())
    ? ""
    : "Use a six-digit hex color, for example #111827.";
}

function validateSettings(form) {
  return validateForm(form, {
    siteName: [validators.required(), validators.maxLength(80)],
    brandInitials: [validators.required(), validators.maxLength(4)],
    titleSuffix: [validators.required(), validators.maxLength(60)],
    authorName: [validators.required(), validators.maxLength(80)],
    portfolioUrl: [validators.required(), validHttpUrl],
    cmsAppName: [validators.required(), validators.maxLength(80)],
    cmsShortName: [validators.required(), validators.maxLength(24)],
    cmsDescription: [validators.required(), validators.maxLength(180)],
    cmsUrl: [validators.required(), validHttpUrl],
    cmsThemeColor: [validators.required(), validHexColor],
    cmsBackgroundColor: [validators.required(), validHexColor],
    cmsOpenGraphTitle: [validators.required(), validators.maxLength(70)],
    cmsOpenGraphDescription: [validators.required(), validators.maxLength(200)],
    metaTitle: [validators.required(), validators.maxLength(70)],
    metaDescription: [validators.required(), validators.maxLength(180)],
    seoKeywords: [validators.required(), validators.maxLength(1000)],
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

function ConnectionBadge({ isLoading }) {
  return <span className="content-editor__badge">{isLoading ? "Loading" : "Connected"}</span>;
}

const pageConfig = {
  "portfolio-identity": {
    kicker: "Portfolio",
    title: "Portfolio Identity",
    description: "Manage the public portfolio brand, browser identity, and primary URL.",
    deployTarget: "frontend",
  },
  "portfolio-experience": {
    kicker: "Portfolio",
    title: "Portfolio Experience",
    description: "Control public-site motion, loading, navigation, and accessibility preferences.",
  },
  "portfolio-social-sharing": {
    kicker: "Portfolio",
    title: "Portfolio Social Sharing",
    description: "Manage link previews used by LinkedIn, WhatsApp, X, Telegram, and Facebook.",
    deployTarget: "frontend",
  },
  "cms-identity": {
    kicker: "CMS",
    title: "CMS Identity",
    description: "Manage the CMS installed-app identity, launch appearance, and icon.",
    deployTarget: "cms",
  },
  "cms-experience": {
    kicker: "CMS",
    title: "CMS Experience",
    description: "Keep the dashboard comfortable and lightweight across desktop and mobile devices.",
  },
  "cms-social-sharing": {
    kicker: "CMS",
    title: "CMS Social Sharing",
    description: "Control the preview displayed when the private CMS link is shared.",
    deployTarget: "cms",
  },
  seo: {
    kicker: "Discoverability",
    title: "SEO Defaults",
    description: "Manage fallback metadata and public search-engine visibility.",
    deployTarget: "frontend",
  },
  maintenance: {
    kicker: "Availability",
    title: "Maintenance & Announcement",
    description: "Temporarily replace the public site or display a lightweight announcement.",
  },
};

function Settings({ section }) {
  const currentPage = pageConfig[section] ?? pageConfig["portfolio-identity"];
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
    successMessage: `${currentPage.title} updated successfully.`,
    deployTarget: currentPage.deployTarget,
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
      <Link className="settings-back-link" to="/settings"><FiArrowLeft /> Back to Settings</Link>

      <form className="content-editor settings-editor" onSubmit={editor.saveForm}>
        {section === "portfolio-identity" ? <section className="panel account-section settings-card">
          <div className="editor-section-heading">
            <div>
              <h2 className="account-section__title">Site Identity</h2>
              <p>Control the public brand and browser identity used across the portfolio.</p>
            </div>
            <ConnectionBadge isLoading={editor.isLoading} />
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
        </section> : null}

        {section === "cms-identity" ? <section className="panel account-section settings-card">
          <div className="editor-section-heading">
            <div>
              <h2 className="account-section__title">CMS App Identity</h2>
              <p>Control how the CMS appears when it is installed on a desktop or mobile device.</p>
            </div>
            <ConnectionBadge isLoading={editor.isLoading} />
          </div>
          <div className="form-grid">
            <FormField label="App Name" name="cmsAppName" value={editor.form.cmsAppName} onChange={editor.updateField} error={editor.errors.cmsAppName} maxLength={80} required />
            <FormField label="Short Name" name="cmsShortName" value={editor.form.cmsShortName} onChange={editor.updateField} error={editor.errors.cmsShortName} helpText="Used below the installed app icon." maxLength={24} required />
            <FormField label="App Description" name="cmsDescription" className="form-group--wide" value={editor.form.cmsDescription} onChange={editor.updateField} error={editor.errors.cmsDescription} maxLength={180} required />
            <FormField label="Primary CMS URL" name="cmsUrl" type="url" value={editor.form.cmsUrl} onChange={editor.updateField} error={editor.errors.cmsUrl} helpText="The installed app opens at this address." required />
            <FormField
              label="Display Mode"
              name="cmsDisplay"
              as="select"
              value={editor.form.cmsDisplay}
              onChange={editor.updateField}
              options={[
                { value: "standalone", label: "Standalone app" },
                { value: "minimal-ui", label: "Minimal browser controls" },
                { value: "browser", label: "Browser tab" },
              ]}
              required
            />
            <FormField label="Theme Color" name="cmsThemeColor" type="color" className="settings-color-field" value={editor.form.cmsThemeColor} onChange={editor.updateField} error={editor.errors.cmsThemeColor} helpText={editor.form.cmsThemeColor} required />
            <FormField label="Launch Background" name="cmsBackgroundColor" type="color" className="settings-color-field" value={editor.form.cmsBackgroundColor} onChange={editor.updateField} error={editor.errors.cmsBackgroundColor} helpText={editor.form.cmsBackgroundColor} required />
            <div className="form-group form-group--wide settings-manifest-layout">
              <ImageUploader
                value={editor.form.cmsIcon}
                onChange={(value) => editor.updateForm((current) => ({ ...current, cmsIcon: value }))}
                label="CMS App Icon"
                section="settings"
                aspectRatio={1}
                outputWidth={512}
                outputHeight={512}
                alt="CMS app icon"
                previewMaxWidth="240px"
              />
              <article className="manifest-preview-card" style={{ backgroundColor: editor.form.cmsBackgroundColor }}>
                <div className="manifest-preview-card__icon" style={{ backgroundColor: editor.form.cmsThemeColor }}>
                  {editor.form.cmsIcon ? (
                    <img src={resolveMediaUrl(editor.form.cmsIcon)} alt="" />
                  ) : (
                    <span>{editor.form.cmsShortName || "CMS"}</span>
                  )}
                </div>
                <strong>{editor.form.cmsAppName || "Portfolio CMS"}</strong>
                <small>Installed app preview</small>
              </article>
            </div>
          </div>
        </section> : null}

        {section === "seo" ? <section className="panel account-section settings-card">
          <div className="editor-section-heading">
            <div>
              <h2 className="account-section__title">SEO Defaults</h2>
              <p>Fallback metadata used when a project or certificate does not provide its own values.</p>
            </div>
            <ConnectionBadge isLoading={editor.isLoading} />
          </div>
          <div className="form-grid">
            <FormField label="Default Meta Title" name="metaTitle" value={editor.form.metaTitle} onChange={editor.updateField} error={editor.errors.metaTitle} maxLength={70} required />
            <FormField label="SEO Keywords" name="seoKeywords" value={editor.form.seoKeywords} onChange={editor.updateField} error={editor.errors.seoKeywords} maxLength={1000} required />
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
        </section> : null}

        {section === "portfolio-social-sharing" ? <section className="panel account-section settings-card">
          <div className="editor-section-heading">
            <div>
              <h2 className="account-section__title">Social Sharing</h2>
              <p>Default LinkedIn, WhatsApp, X, and Facebook preview metadata.</p>
            </div>
            <ConnectionBadge isLoading={editor.isLoading} />
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
        </section> : null}

        {section === "portfolio-experience" ? <section className="panel account-section settings-card">
          <div className="editor-section-heading">
            <div>
              <h2 className="account-section__title">Website Experience</h2>
              <p>Use recommended defaults to keep the portfolio smooth on mobile devices.</p>
            </div>
            <ConnectionBadge isLoading={editor.isLoading} />
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
        </section> : null}

        {section === "cms-experience" ? <section className="panel account-section settings-card">
          <div className="editor-section-heading">
            <div>
              <h2 className="account-section__title">CMS Experience</h2>
              <p>Choose lightweight dashboard defaults for desktop and mobile devices.</p>
            </div>
            <ConnectionBadge isLoading={editor.isLoading} />
          </div>
          <div className="form-grid">
            <FormField
              label="Default Theme"
              name="cmsDefaultTheme"
              as="select"
              value={editor.form.cmsDefaultTheme}
              onChange={editor.updateField}
              options={[
                { value: "system", label: "Follow device" },
                { value: "dark", label: "Dark" },
                { value: "light", label: "Light" },
              ]}
              helpText="A manually selected theme still takes priority on that device."
              required
            />
            <FormField
              label="Mobile Sidebar"
              name="cmsMobileSidebarMode"
              as="select"
              value={editor.form.cmsMobileSidebarMode}
              onChange={editor.updateField}
              options={[
                { value: "compact", label: "Compact by default" },
                { value: "expanded", label: "Expanded by default" },
              ]}
              required
            />
          </div>
          <div className="settings-toggle-grid settings-toggle-grid--spaced">
            <ToggleField checked={editor.form.cmsDesktopAnimations} label="Desktop transitions" description="Keep lightweight dashboard transitions on larger screens." recommended="Enabled" onChange={(value) => updateToggle("cmsDesktopAnimations", value)} />
            <ToggleField checked={editor.form.cmsMobileAnimations} label="Mobile transitions" description="Enable decorative dashboard motion on phones." recommended="Disabled" warning="Disabling motion gives the smoothest mobile editing experience." onChange={(value) => updateToggle("cmsMobileAnimations", value)} />
            <ToggleField checked={editor.form.cmsStickyHeader} label="Sticky CMS header" description="Keep the toolbar visible while editing long pages." recommended="Enabled" onChange={(value) => updateToggle("cmsStickyHeader", value)} />
            <ToggleField checked={editor.form.cmsRespectReducedMotion} label="Respect reduced-motion preference" description="Follow the accessibility preference configured on the device." recommended="Enabled" onChange={(value) => updateToggle("cmsRespectReducedMotion", value)} />
          </div>
        </section> : null}

        {section === "cms-social-sharing" ? <section className="panel account-section settings-card">
          <div className="editor-section-heading">
            <div>
              <h2 className="account-section__title">CMS Social Sharing</h2>
              <p>Set the preview shown when the CMS address is shared in a private conversation.</p>
            </div>
            <ConnectionBadge isLoading={editor.isLoading} />
          </div>
          <div className="form-grid">
            <FormField label="Open Graph Title" name="cmsOpenGraphTitle" value={editor.form.cmsOpenGraphTitle} onChange={editor.updateField} error={editor.errors.cmsOpenGraphTitle} maxLength={70} required />
            <FormField label="Twitter Card Type" name="cmsTwitterCard" as="select" value={editor.form.cmsTwitterCard} onChange={editor.updateField} options={[{ value: "summary_large_image", label: "Large image" }, { value: "summary", label: "Compact summary" }]} required />
            <FormField label="Open Graph Description" name="cmsOpenGraphDescription" className="form-group--wide" value={editor.form.cmsOpenGraphDescription} onChange={editor.updateField} error={editor.errors.cmsOpenGraphDescription} maxLength={200} required />
            <div className="form-group form-group--wide settings-social-layout">
              <ImageUploader
                value={editor.form.cmsSocialImage}
                onChange={(value) => editor.updateForm((current) => ({ ...current, cmsSocialImage: value }))}
                label="CMS Social-sharing Image"
                section="settings"
                aspectRatio={1200 / 630}
                outputWidth={1200}
                outputHeight={630}
                alt="CMS social sharing preview"
                previewMaxWidth="560px"
              />
              <article className="social-preview-card">
                <div className="social-preview-card__image">
                  {editor.form.cmsSocialImage ? <img src={resolveMediaUrl(editor.form.cmsSocialImage)} alt="" /> : <span>1200 × 630 preview</span>}
                </div>
                <div>
                  <small>{editor.form.cmsUrl || "cms.example"}</small>
                  <strong>{editor.form.cmsOpenGraphTitle || "CMS preview title"}</strong>
                  <p>{editor.form.cmsOpenGraphDescription || "CMS preview description"}</p>
                </div>
              </article>
            </div>
          </div>
        </section> : null}

        {section === "maintenance" ? <section className={`panel account-section settings-card settings-card--maintenance ${editor.form.maintenanceEnabled ? "is-enabled" : ""}`}>
          <div className="editor-section-heading">
            <div>
              <h2 className="account-section__title">Maintenance and Announcement</h2>
              <p>Temporarily replace the public site or display a lightweight announcement.</p>
            </div>
            <ConnectionBadge isLoading={editor.isLoading} />
          </div>
          <div className="form-grid">
            <ToggleField checked={editor.form.maintenanceEnabled} label="Maintenance mode" description="Visitors will see only the maintenance message." onChange={changeMaintenanceMode} />
            <ToggleField checked={editor.form.announcementEnabled} label="Show announcement" description="Display a small banner above the portfolio navigation." onChange={(value) => updateToggle("announcementEnabled", value)} />
            <FormField label="Maintenance Heading" name="maintenanceHeading" value={editor.form.maintenanceHeading} onChange={editor.updateField} error={editor.errors.maintenanceHeading} maxLength={90} required />
            <FormField label="Maintenance Message" name="maintenanceMessage" value={editor.form.maintenanceMessage} onChange={editor.updateField} error={editor.errors.maintenanceMessage} maxLength={240} required />
            <FormField label="Announcement Text" name="announcementText" className="form-group--wide" value={editor.form.announcementText} onChange={editor.updateField} error={editor.errors.announcementText} maxLength={180} disabled={!editor.form.announcementEnabled} required={editor.form.announcementEnabled} />
          </div>
        </section> : null}

        <EditorActions status={editor.status} isDirty={editor.isDirty} isLoading={editor.isLoading} isSaving={editor.isSaving} onReset={editor.resetForm} />
      </form>
    </section>
  );
}

export default Settings;
