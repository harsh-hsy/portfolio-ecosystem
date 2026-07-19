import { defaultPortfolio } from '../data/defaultPortfolio.js'
import { PortfolioContent } from '../models/PortfolioContent.js'
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
  home: ['name', 'fullName', 'role', 'rotatingRoles', 'location', 'image', 'tagline'],
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

const modules = {
  home: {
    model: HomeContent,
    extract: (content) => ({
      profile: pick(content.profile, profileFields.home),
      section: content.sections?.hero ?? {},
      stats: content.stats ?? [],
    }),
  },
  about: {
    model: AboutContent,
    extract: (content) => ({
      profile: pick(content.profile, profileFields.about),
      section: content.sections?.about ?? {},
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
    extract: (content) => ({ items: content.milestones ?? [] }),
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
      section: content.sections?.notFound ?? {},
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
  sections: ['home', 'about', 'skills', 'projects', 'certificates', 'journey', 'services', 'achievements', 'contact', 'settings'],
  stats: ['home'],
  settings: ['settings'],
  navigation: ['settings'],
  commands: ['settings'],
  ui: ['settings'],
  seo: ['settings'],
}

const editorModules = {
  home: ['home', 'links'],
  about: ['about'],
  skills: ['skills'],
  projects: ['projects'],
  certificates: ['certificates'],
  journey: ['journey', 'milestones'],
  services: ['services'],
  achievements: ['achievements'],
  contact: ['contact', 'links'],
  links: ['links'],
  settings: ['settings'],
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

async function writeModules(content, names = Object.keys(modules)) {
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
        { $set: { data: definition.extract(content), status: 'published' } },
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
      services: services.section ?? {},
      achievements: achievements.section ?? {},
      contact: contact.section ?? {},
      notFound: settings.section ?? {},
    },
    stats: home.stats ?? [],
    settings: settings.settings ?? {},
    navigation: settings.navigation ?? [],
    commands: settings.commands ?? [],
    ui: settings.ui ?? {},
    seo: settings.seo ?? {},
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
  return composePortfolio(await ensureModuleDocuments())
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
  await writeModules(content, names)
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
  return getPublishedPortfolio()
}

export async function replacePublishedPortfolio(content) {
  await writeModules(content)
  return getPublishedPortfolio()
}

export async function resetPublishedPortfolio() {
  await writeModules(defaultPortfolio)
  return getPublishedPortfolio()
}
