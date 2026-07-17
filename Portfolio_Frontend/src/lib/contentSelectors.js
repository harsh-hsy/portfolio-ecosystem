import { commandActions } from '../config/commands.js'
import { publicNavigation } from '../config/navigation.js'
import { getHomeStructuredData, getProjectSeo, siteSeo } from '../config/seo.js'
import { siteSettings } from '../content/settings.js'
import { uiContent } from '../content/ui.js'
import { defaultProfile, defaultProject, defaultSettings } from './contentDefaults.js'
import { ensureArray, withDefaults } from './contentValidation.js'
import { getPortfolio } from '../services/storage/portfolioRepository.js'

function resolvePortfolio(portfolio) {
  return portfolio ?? getPortfolio()
}

export function getSiteSettings() {
  return withDefaults(siteSettings, defaultSettings)
}

export function getProfileContent(portfolio) {
  const resolvedPortfolio = resolvePortfolio(portfolio)
  return withDefaults(resolvedPortfolio.profile, defaultProfile)
}

export function getNavigationContent() {
  return ensureArray(publicNavigation)
}

export function getHomeContent(portfolio) {
  const resolvedPortfolio = resolvePortfolio(portfolio)

  return {
    profile: withDefaults(resolvedPortfolio.profile, defaultProfile),
    socials: ensureArray(resolvedPortfolio.socials),
    seo: siteSeo,
    structuredData: getHomeStructuredData(),
    sections: resolvedPortfolio.sections,
    stats: ensureArray(resolvedPortfolio.stats),
  }
}

export function getAboutContent(portfolio) {
  const resolvedPortfolio = resolvePortfolio(portfolio)

  return {
    profile: withDefaults(resolvedPortfolio.profile, defaultProfile),
    section: resolvedPortfolio.sections.about,
    stats: ensureArray(resolvedPortfolio.stats),
  }
}

export function getSkillsContent(portfolio) {
  const resolvedPortfolio = resolvePortfolio(portfolio)

  return {
    profile: withDefaults(resolvedPortfolio.profile, defaultProfile),
    section: resolvedPortfolio.sections.skills,
    skills: ensureArray(resolvedPortfolio.skills),
  }
}

export function getProjectsContent(portfolio) {
  const resolvedPortfolio = resolvePortfolio(portfolio)

  return {
    section: resolvedPortfolio.sections.projects,
    projects: ensureArray(resolvedPortfolio.projects).map((project) =>
      withDefaults(project, defaultProject),
    ),
    ui: uiContent.projectCard,
  }
}

export function getProjectDetailsContent(project) {
  const safeProject = withDefaults(project, defaultProject)

  return {
    project: safeProject,
    seo: getProjectSeo(safeProject),
    ui: uiContent.projectDetails,
  }
}

export function getExperienceContent(portfolio) {
  const resolvedPortfolio = resolvePortfolio(portfolio)

  return {
    section: resolvedPortfolio.sections.experience,
    timeline: ensureArray(resolvedPortfolio.timeline),
  }
}

export function getCertificatesContent(portfolio) {
  const resolvedPortfolio = resolvePortfolio(portfolio)

  return {
    section: resolvedPortfolio.sections.certificates,
    certificates: ensureArray(resolvedPortfolio.certificates),
  }
}

export function getServicesContent(portfolio) {
  const resolvedPortfolio = resolvePortfolio(portfolio)

  return {
    section: resolvedPortfolio.sections.services,
    services: ensureArray(resolvedPortfolio.services),
  }
}

export function getAchievementsContent(portfolio) {
  const resolvedPortfolio = resolvePortfolio(portfolio)

  return {
    section: resolvedPortfolio.sections.achievements,
    achievements: ensureArray(resolvedPortfolio.achievements),
  }
}

export function getMilestonesContent(portfolio) {
  const resolvedPortfolio = resolvePortfolio(portfolio)

  return ensureArray(resolvedPortfolio.milestones ?? [])
}

export function getContactContent(portfolio) {
  const resolvedPortfolio = resolvePortfolio(portfolio)

  return {
    profile: withDefaults(resolvedPortfolio.profile, defaultProfile),
    socials: ensureArray(resolvedPortfolio.socials),
    section: resolvedPortfolio.sections.contact,
  }
}

export function getCommandPaletteContent(portfolio) {
  const resolvedPortfolio = resolvePortfolio(portfolio)

  return {
    actions: ensureArray(commandActions),
    profile: withDefaults(resolvedPortfolio.profile, defaultProfile),
    projects: ensureArray(resolvedPortfolio.projects),
    ui: uiContent.commandPalette,
  }
}

export function getProjectCardContent() {
  return uiContent.projectCard
}

export function getNotFoundContent(portfolio) {
  const resolvedPortfolio = resolvePortfolio(portfolio)

  return {
    seoTitle: `Page Not Found${siteSeo.projectTitleSuffix}`,
    section: resolvedPortfolio.sections.notFound,
  }
}
