import { portfolioIdentity } from '../config/portfolioIdentity.js'

const profileFields = {
  home: ['name', 'fullName', 'role', 'rotatingRoles', 'location', 'mapUrl', 'image', 'tagline'],
  about: ['about', 'aboutImage'],
  skills: ['skillsImage'],
  links: ['github', 'linkedin', 'email', 'resume'],
  settings: ['copyrightYear'],
}

export function pickProfileFields(source, moduleName) {
  const fields = profileFields[moduleName] ?? []
  return Object.fromEntries(
    fields.filter((field) => source?.[field] !== undefined).map((field) => [field, source[field]]),
  )
}

export function withoutContactFormText(section = {}) {
  const {
    fields: _fields,
    submitLabel: _submitLabel,
    successMessage: _successMessage,
    errorMessage: _errorMessage,
    failureMessage: _failureMessage,
    ...content
  } = section

  return content
}

export function withCodeOwnedIdentity(settings = {}) {
  const {
    experience: _experience,
    cmsManifest: _cmsManifest,
    cmsExperience: _cmsExperience,
    cmsSocialSharing: _cmsSocialSharing,
    socialSharing: _socialSharing,
    ...settingsWithoutCmsConfiguration
  } = settings

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
  }
}

export function withoutCodeOwnedIdentity(settings = {}) {
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
  } = settings

  return cmsManagedSettings
}

export function composePortfolio(documents) {
  const data = (name) => documents[name].data ?? {}
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
  const portfolioSettings = withCodeOwnedIdentity({
    ...rawSettings,
    maintenance: { ...rawSettings.maintenance },
  })

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
  }
}
