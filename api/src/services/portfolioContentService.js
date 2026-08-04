import { defaultPortfolio } from '../data/defaultPortfolio.js'
import { PortfolioContent } from '../models/PortfolioContent.js'
import { validateAboutContent } from '../validation/aboutContent.js'
import { validateCertificatesContent } from '../validation/certificateContent.js'
import { validateHomeContent } from '../validation/homeContent.js'
import {
  validateJourneyContent,
  validateMilestonesContent,
} from '../validation/journeyContent.js'
import {
  validateAchievementsContent,
  validateServicesContent,
} from '../validation/listContent.js'
import {
  validateContactContent,
  validateLinksContent,
} from '../validation/contactContent.js'
import { validateProjectsContent } from '../validation/projectContent.js'
import { validateSkillsContent } from '../validation/skillsContent.js'
import { validateGlobalPagesContent } from '../validation/globalPagesContent.js'
import { validateSettingsContent } from '../validation/settingsContent.js'
import {
  ensureCertificateResources,
  listPublishedCertificates,
  replaceCertificateResources,
} from './certificateService.js'
import {
  ensureProjectResources,
  listPublishedProjects,
  replaceProjectResources,
} from './projectService.js'
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
} from '../models/PortfolioModule.js'

const profileFields = {
  home: ['name', 'fullName', 'role', 'rotatingRoles', 'location', 'mapUrl', 'image', 'tagline'],
  about: ['about', 'aboutImage'],
  skills: ['skillsImage'],
  links: ['github', 'linkedin', 'email', 'resume'],
  settings: ['copyrightYear'],
}

function pick(source, fields) {
  return Object.fromEntries(
    fields.filter((field) => source?.[field] !== undefined).map((field) => [field, source[field]]),
  )
}

const legacyPortfolioUrls = new Set([
  'https://harsh-hsy.netlify.app',
  'https://harsh-hsy.netlify.app/',
])

function normalizePortfolioUrl(value) {
  const url = String(value ?? '').trim()
  if (!url || legacyPortfolioUrls.has(url)) return defaultPortfolio.settings.siteIdentity.portfolioUrl
  return url.replace(/\/$/, '')
}

function withoutEyebrow(section = {}) {
  return Object.fromEntries(
    Object.entries(section).filter(([key]) => key !== 'eyebrow'),
  )
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
    extract: (content) => ({ section: content.sections?.contact ?? {} }),
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
      section: withoutEyebrow(content.sections?.notFound),
      settings: content.settings ?? defaultPortfolio.settings,
      navigation: content.navigation ?? defaultPortfolio.navigation,
      commands: content.commands ?? defaultPortfolio.commands,
      ui: content.ui ?? defaultPortfolio.ui,
      seo: content.seo ?? defaultPortfolio.seo,
    }),
  },
}

const editableFields = new Set([
  'profile',
  'socials',
  'skills',
  'projects',
  'certificates',
  'timeline',
  'achievements',
  'milestones',
  'services',
  'sections',
  'stats',
  'settings',
  'navigation',
  'commands',
  'ui',
  'seo',
])

const fieldModules = {
  profile: ['home', 'about', 'skills', 'links', 'settings'],
  socials: ['links'],
  skills: ['skills'],
  projects: ['projects'],
  certificates: ['certificates'],
  timeline: ['journey'],
  achievements: ['achievements'],
  milestones: ['milestones'],
  services: ['services'],
  sections: ['home', 'about', 'skills', 'projects', 'certificates', 'journey', 'milestones', 'services', 'achievements', 'contact', 'settings'],
  stats: ['about'],
  settings: ['settings'],
  navigation: ['settings'],
  commands: ['settings'],
  ui: ['settings'],
  seo: ['settings'],
}

const editorModules = {
  home: ['home'],
  about: ['about'],
  skills: ['skills'],
  projects: ['projects'],
  certificates: ['certificates'],
  journey: ['journey'],
  milestones: ['milestones'],
  services: ['services'],
  achievements: ['achievements'],
  contact: ['contact', 'links'],
  links: ['links', 'home', 'settings'],
  settings: ['settings'],
  globalPages: ['settings'],
}

function sanitizeLegacyContent(content) {
  const resume = content.profile?.resume
  if (!resume) return content

  return {
    ...content,
    certificates: (content.certificates ?? []).map((certificate) => ({
      ...certificate,
      file: certificate.file === resume ? '' : certificate.file,
      credentialUrl: certificate.credentialUrl === resume ? '' : certificate.credentialUrl,
    })),
  }
}

async function readModuleDocuments() {
  const entries = await Promise.all(
    Object.entries(modules).map(async ([name, definition]) => {
      const document = await definition.model.findOne({ status: 'published' }).lean()
      return [name, document]
    }),
  )

  return Object.fromEntries(entries)
}

async function writeModules(content, names = Object.keys(modules), editorName = '') {
  const normalizedContent = {
    ...content,
    settings: {
      ...defaultPortfolio.settings,
      ...(content.settings ?? {}),
      siteIdentity: {
        ...defaultPortfolio.settings.siteIdentity,
        ...(content.settings?.siteIdentity ?? {}),
      },
      socialSharing: {
        ...defaultPortfolio.settings.socialSharing,
        ...(content.settings?.socialSharing ?? {}),
      },
      experience: {
        ...defaultPortfolio.settings.experience,
        ...(content.settings?.experience ?? {}),
      },
      maintenance: {
        ...defaultPortfolio.settings.maintenance,
        ...(content.settings?.maintenance ?? {}),
      },
    },
    seo: {
      ...defaultPortfolio.seo,
      ...(content.seo ?? {}),
    },
    sections: {
      ...defaultPortfolio.sections,
      ...(content.sections ?? {}),
    },
  }

  if (names.includes('home')) validateHomeContent(normalizedContent)
  if (names.includes('about')) validateAboutContent(normalizedContent)
  if (names.includes('journey')) validateJourneyContent(normalizedContent)
  if (names.includes('milestones')) validateMilestonesContent(normalizedContent)
  if (names.includes('projects')) validateProjectsContent(normalizedContent)
  if (names.includes('certificates')) validateCertificatesContent(normalizedContent)
  if (names.includes('skills')) validateSkillsContent(normalizedContent)
  if (names.includes('services')) validateServicesContent(normalizedContent)
  if (names.includes('achievements')) validateAchievementsContent(normalizedContent)
  if (names.includes('contact')) validateContactContent(normalizedContent)
  if (names.includes('links')) validateLinksContent(normalizedContent)
  if (names.includes('settings')) {
    if (editorName === 'globalPages') validateGlobalPagesContent(normalizedContent)
    else if (editorName === 'settings') validateSettingsContent(normalizedContent)
    else {
      validateGlobalPagesContent(normalizedContent)
      validateSettingsContent(normalizedContent)
    }
  }

  await Promise.all(
    names.map((name) => {
      const definition = modules[name]
      if (!definition) {
        const error = new Error(`Unsupported portfolio module: ${name}`)
        error.statusCode = 400
        throw error
      }

      return definition.model.findOneAndUpdate(
        { status: 'published' },
        { $set: { data: definition.extract(normalizedContent), status: 'published' } },
        { upsert: true, returnDocument: 'after', runValidators: true },
      )
    }),
  )
}

function composePortfolio(documents) {
  const data = (name) => documents[name]?.data ?? modules[name].extract(defaultPortfolio)

  const home = data('home')
  const about = data('about')
  const skills = data('skills')
  const projects = data('projects')
  const certificates = data('certificates')
  const journey = data('journey')
  const milestones = data('milestones')
  const services = data('services')
  const achievements = data('achievements')
  const contact = data('contact')
  const links = data('links')
  const settings = data('settings')
  const rawSettings = settings.settings ?? {}
  const rawIdentity = rawSettings.siteIdentity ?? {}
  const rawSeo = settings.seo ?? {}
  const portfolioSettings = {
    ...defaultPortfolio.settings,
    ...rawSettings,
    siteIdentity: {
      ...defaultPortfolio.settings.siteIdentity,
      ...rawIdentity,
      portfolioUrl: normalizePortfolioUrl(rawIdentity.portfolioUrl),
    },
    socialSharing: {
      ...defaultPortfolio.settings.socialSharing,
      ...(rawSettings.socialSharing ?? {}),
    },
    experience: {
      ...defaultPortfolio.settings.experience,
      ...(rawSettings.experience ?? {}),
    },
    maintenance: {
      ...defaultPortfolio.settings.maintenance,
      ...(rawSettings.maintenance ?? {}),
    },
  }
  const portfolioSeo = {
    ...defaultPortfolio.seo,
    ...rawSeo,
    siteUrl: normalizePortfolioUrl(rawSeo.siteUrl),
  }

  return {
    profile: {
      ...defaultPortfolio.profile,
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
      milestones: milestones.section ?? defaultPortfolio.sections.milestones,
      services: services.section ?? {},
      achievements: achievements.section ?? {},
      contact: contact.section ?? {},
      notFound: settings.section ?? {},
    },
    stats: about.stats ?? home.stats ?? [],
    settings: portfolioSettings,
    navigation: settings.navigation ?? [],
    commands: settings.commands ?? [],
    ui: settings.ui ?? {},
    seo: portfolioSeo,
  }
}

async function ensureModuleDocuments() {
  const documents = await readModuleDocuments()
  const missingNames = Object.keys(modules).filter((name) => !documents[name])
  if (missingNames.length === 0) return documents

  const legacy = await PortfolioContent.findOne({ status: 'published' }).lean()
  const migrationSource = sanitizeLegacyContent(legacy ?? defaultPortfolio)
  await writeModules(migrationSource, missingNames)

  return readModuleDocuments()
}

export function getEditableFields() {
  return [...editableFields]
}

export function isEditableField(field) {
  return editableFields.has(field)
}

export function isEditorModule(moduleName) {
  return Boolean(editorModules[moduleName])
}

export async function getPublishedPortfolio() {
  const content = composePortfolio(await ensureModuleDocuments())
  await ensureProjectResources(content.projects)
  await ensureCertificateResources(content.certificates)

  return {
    ...content,
    projects: await listPublishedProjects(),
    certificates: await listPublishedCertificates(),
  }
}

export async function ensurePublishedPortfolio() {
  return getPublishedPortfolio()
}

export async function updatePortfolioModule(moduleName, content) {
  const names = editorModules[moduleName]
  if (!names) {
    const error = new Error('Unsupported portfolio module')
    error.statusCode = 400
    throw error
  }

  await ensureModuleDocuments()
  await writeModules(content, names, moduleName)
  if (moduleName === 'projects') await replaceProjectResources(content.projects)
  return getPublishedPortfolio()
}

export async function updatePortfolioField(field, value) {
  if (!isEditableField(field)) {
    const error = new Error('Unsupported portfolio field')
    error.statusCode = 400
    throw error
  }

  const content = await getPublishedPortfolio()
  const nextContent = { ...content, [field]: value }
  await writeModules(nextContent, fieldModules[field])
  if (field === 'projects') await replaceProjectResources(value)
  if (field === 'certificates') await replaceCertificateResources(value)
  return getPublishedPortfolio()
}

export async function replacePublishedPortfolio(content) {
  await writeModules(content)
  await replaceProjectResources(content.projects)
  await replaceCertificateResources(content.certificates)
  return getPublishedPortfolio()
}

export async function resetPublishedPortfolio() {
  await writeModules(defaultPortfolio)
  await replaceProjectResources(defaultPortfolio.projects)
  await replaceCertificateResources(defaultPortfolio.certificates)
  return getPublishedPortfolio()
}
