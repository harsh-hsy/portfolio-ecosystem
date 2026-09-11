import { portfolioIdentity } from "../config/portfolioIdentity.js";
import { validateAboutContent } from "../validation/aboutContent.js";
import { validateCertificatesContent } from "../validation/certificateContent.js";
import { validateHomeContent } from "../validation/homeContent.js";
import {
  validateJourneyContent,
  validateMilestonesContent,
} from "../validation/journeyContent.js";
import {
  validateAchievementsContent,
  validateServicesContent,
} from "../validation/listContent.js";
import {
  validateContactContent,
  validateLinksContent,
} from "../validation/contactContent.js";
import { validateProjectsContent } from "../validation/projectContent.js";
import { validateSkillsContent } from "../validation/skillsContent.js";
import { validateFooterContent } from "../validation/footerContent.js";
import { validateSettingsContent } from "../validation/settingsContent.js";
import {
  ensureCertificateResources,
  listPublishedCertificates,
} from "./certificateService.js";
import {
  ensureProjectResources,
  listPublishedProjects,
  replaceProjectResources,
} from "./projectService.js";
import {
  AboutContent,
  AchievementsContent,
  CertificatesContent,
  ContactContent,
  HomeContent,
  JourneyContent,
  LinksContent,
  MilestonesContent,
  ProjectsContent,
  ServicesContent,
  SettingsContent,
  SkillsContent,
} from "../models/PortfolioModule.js";

const profileFields = {
  home: [
    "name",
    "fullName",
    "role",
    "rotatingRoles",
    "location",
    "mapUrl",
    "image",
    "tagline",
  ],
  about: ["about", "aboutImage"],
  skills: ["skillsImage"],
  links: ["github", "linkedin", "email", "resume"],
  settings: ["copyrightYear"],
};

function pick(source, fields) {
  return Object.fromEntries(
    fields
      .filter((field) => source?.[field] !== undefined)
      .map((field) => [field, source[field]]),
  );
}

function withoutContactFormText(section = {}) {
  const {
    fields: _fields,
    submitLabel: _submitLabel,
    successMessage: _successMessage,
    errorMessage: _errorMessage,
    failureMessage: _failureMessage,
    ...content
  } = section;

  return content;
}

function withCodeOwnedIdentity(settings = {}) {
  const {
    experience: _experience,
    cmsManifest: _cmsManifest,
    cmsExperience: _cmsExperience,
    cmsSocialSharing: _cmsSocialSharing,
    socialSharing: _socialSharing,
    ...settingsWithoutCmsConfiguration
  } = settings;

  return {
    ...settingsWithoutCmsConfiguration,
    brandInitials: portfolioIdentity.brandInitials,
    loadingMark: portfolioIdentity.brandInitials,
    siteIdentity: {
      siteName: portfolioIdentity.siteName,
      titleSuffix: portfolioIdentity.titleSuffix,
      favicon: portfolioIdentity.favicon,
      authorName: portfolioIdentity.authorName,
      portfolioUrl: portfolioIdentity.portfolioUrl,
    },
  };
}

function withoutCodeOwnedIdentity(settings = {}) {
  const {
    experience: _experience,
    brandInitials: _brandInitials,
    loadingMark: _loadingMark,
    siteIdentity: _siteIdentity,
    cmsManifest: _cmsManifest,
    cmsExperience: _cmsExperience,
    cmsSocialSharing: _cmsSocialSharing,
    socialSharing: _socialSharing,
    ...cmsManagedSettings
  } = settings;

  return cmsManagedSettings;
}

const modules = {
  home: {
    model: HomeContent,
    extract: (content) => ({
      profile: pick(content.profile, profileFields.home),
      section: content.sections?.hero ?? {},
    }),
  },
  about: {
    model: AboutContent,
    extract: (content) => ({
      profile: pick(content.profile, profileFields.about),
      section: content.sections?.about ?? {},
      stats: content.stats ?? [],
    }),
  },
  skills: {
    model: SkillsContent,
    extract: (content) => ({
      profile: pick(content.profile, profileFields.skills),
      section: content.sections?.skills ?? {},
      items: content.skills ?? [],
    }),
  },
  projects: {
    model: ProjectsContent,
    extract: (content) => ({
      section: content.sections?.projects ?? {},
      items: content.projects ?? [],
    }),
  },
  certificates: {
    model: CertificatesContent,
    extract: (content) => ({
      section: content.sections?.certificates ?? {},
      items: content.certificates ?? [],
    }),
  },
  journey: {
    model: JourneyContent,
    extract: (content) => ({
      section: content.sections?.experience ?? {},
      timeline: content.timeline ?? [],
    }),
  },
  milestones: {
    model: MilestonesContent,
    extract: (content) => ({
      section: content.sections?.milestones ?? {},
      items: content.milestones ?? [],
    }),
  },
  services: {
    model: ServicesContent,
    extract: (content) => ({
      section: content.sections?.services ?? {},
      items: content.services ?? [],
    }),
  },
  achievements: {
    model: AchievementsContent,
    extract: (content) => ({
      section: content.sections?.achievements ?? {},
      items: content.achievements ?? [],
    }),
  },
  contact: {
    model: ContactContent,
    extract: (content) => ({
      section: withoutContactFormText(content.sections?.contact),
    }),
  },
  links: {
    model: LinksContent,
    extract: (content) => ({
      profile: pick(content.profile, profileFields.links),
      socials: content.socials ?? [],
    }),
  },
  settings: {
    model: SettingsContent,
    extract: (content) => ({
      profile: pick(content.profile, profileFields.settings),
      settings: withoutCodeOwnedIdentity(content.settings ?? {}),
      commands: content.commands ?? [],
      ui: content.ui ?? {},
    }),
  },
};

const editorModules = {
  home: ["home"],
  about: ["about"],
  skills: ["skills"],
  projects: ["projects"],
  certificates: ["certificates"],
  journey: ["journey"],
  milestones: ["milestones"],
  services: ["services"],
  achievements: ["achievements"],
  contact: ["contact", "links"],
  links: ["links", "home", "settings"],
  settings: ["settings"],
  footer: ["settings"],
};

async function readModuleDocuments() {
  const entries = await Promise.all(
    Object.entries(modules).map(async ([name, definition]) => {
      const document = await definition.model
        .findOne({ status: "published" })
        .lean();
      return [name, document];
    }),
  );

  return Object.fromEntries(entries);
}

async function writeModules(
  content,
  names = Object.keys(modules),
  editorName = "",
) {
  const normalizedContent = {
    ...content,
    settings: withCodeOwnedIdentity({
      ...(content.settings ?? {}),
      maintenance: {
        ...(content.settings?.maintenance ?? {}),
      },
    }),
    sections: {
      ...(content.sections ?? {}),
    },
  };

  if (names.includes("home")) validateHomeContent(normalizedContent);
  if (names.includes("about")) validateAboutContent(normalizedContent);
  if (names.includes("journey")) validateJourneyContent(normalizedContent);
  if (names.includes("milestones"))
    validateMilestonesContent(normalizedContent);
  if (names.includes("projects")) validateProjectsContent(normalizedContent);
  if (names.includes("certificates"))
    validateCertificatesContent(normalizedContent);
  if (names.includes("skills")) validateSkillsContent(normalizedContent);
  if (names.includes("services")) validateServicesContent(normalizedContent);
  if (names.includes("achievements"))
    validateAchievementsContent(normalizedContent);
  if (names.includes("contact")) validateContactContent(normalizedContent);
  if (names.includes("links")) validateLinksContent(normalizedContent);
  if (names.includes("settings")) {
    if (editorName === "footer") validateFooterContent(normalizedContent);
    else if (editorName === "settings")
      validateSettingsContent(normalizedContent);
    else {
      validateFooterContent(normalizedContent);
      validateSettingsContent(normalizedContent);
    }
  }

  await Promise.all(
    names.map((name) => {
      const definition = modules[name];
      if (!definition) {
        const error = new Error(`Unsupported portfolio module: ${name}`);
        error.statusCode = 400;
        throw error;
      }

      return definition.model.findOneAndUpdate(
        { status: "published" },
        {
          $set: {
            data: definition.extract(normalizedContent),
            status: "published",
          },
        },
        { upsert: true, returnDocument: "after", runValidators: true },
      );
    }),
  );
}

function composePortfolio(documents) {
  const data = (name) => documents[name].data ?? {};

  const home = data("home");
  const about = data("about");
  const skills = data("skills");
  const projects = data("projects");
  const certificates = data("certificates");
  const journey = data("journey");
  const milestones = data("milestones");
  const services = data("services");
  const achievements = data("achievements");
  const contact = data("contact");
  const links = data("links");
  const settings = data("settings");
  const rawSettings = settings.settings ?? {};
  const portfolioSettings = withCodeOwnedIdentity({
    ...rawSettings,
    maintenance: {
      ...(rawSettings.maintenance ?? {}),
    },
  });
  return {
    profile: {
      ...home.profile,
      ...about.profile,
      ...skills.profile,
      ...links.profile,
      ...settings.profile,
    },
    socials: links.socials ?? [],
    skills: skills.items ?? [],
    projects: projects.items ?? [],
    certificates: certificates.items ?? [],
    timeline: journey.timeline ?? [],
    achievements: achievements.items ?? [],
    milestones: milestones.items ?? [],
    services: services.items ?? [],
    sections: {
      hero: home.section ?? {},
      about: about.section ?? {},
      skills: skills.section ?? {},
      projects: projects.section ?? {},
      certificates: certificates.section ?? {},
      experience: journey.section ?? {},
      milestones: milestones.section ?? {},
      services: services.section ?? {},
      achievements: achievements.section ?? {},
      contact: withoutContactFormText(contact.section),
    },
    stats: about.stats ?? home.stats ?? [],
    settings: portfolioSettings,
    commands: settings.commands ?? [],
    ui: settings.ui ?? {},
  };
}

async function requireModuleDocuments() {
  const documents = await readModuleDocuments();
  const missingNames = Object.keys(modules).filter((name) => !documents[name]);
  if (missingNames.length === 0) return documents;

  const error = new Error(
    `Portfolio content is incomplete. Missing published modules: ${missingNames.join(", ")}`,
  );
  error.statusCode = 503;
  throw error;
}

export async function getPublishedPortfolio() {
  const content = composePortfolio(await requireModuleDocuments());
  await ensureProjectResources(content.projects);
  await ensureCertificateResources(content.certificates);

  return {
    ...content,
    projects: await listPublishedProjects(),
    certificates: await listPublishedCertificates(),
  };
}

export async function updatePortfolioModule(moduleName, content) {
  const names = editorModules[moduleName];
  if (!names) {
    const error = new Error("Unsupported portfolio module");
    error.statusCode = 400;
    throw error;
  }

  await requireModuleDocuments();
  await writeModules(content, names, moduleName);
  if (moduleName === "projects")
    await replaceProjectResources(content.projects);
  return getPublishedPortfolio();
}
