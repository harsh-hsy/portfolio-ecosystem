import { commandActions } from '../config/commands.js'
import { publicNavigation } from '../config/navigation.js'
import { getHomeStructuredData, getProjectSeo, siteSeo } from '../config/seo.js'
import { siteSettings } from '../content/settings.js'
import { uiContent } from '../content/ui.js'
import { defaultProfile, defaultProject, defaultSettings } from './contentDefaults.js'
import { ensureArray, withDefaults } from './contentValidation.js'
import { getPortfolio } from '../services/storage/portfolioRepository.js'

export function getSiteSettings() {
  return withDefaults(siteSettings, defaultSettings)
}

export function getProfileContent() {
  const portfolio = getPortfolio()
  return withDefaults(portfolio.profile, defaultProfile)
}

export function getNavigationContent() {
  return ensureArray(publicNavigation)
}

export function getHomeContent() {
  const portfolio = getPortfolio()

  return {
    profile: withDefaults(portfolio.profile, defaultProfile),
    socials: ensureArray(portfolio.socials),
    seo: siteSeo,
    structuredData: getHomeStructuredData(),
    sections: portfolio.sections,
    stats: ensureArray(portfolio.stats),
  }
}

export function getAboutContent() {
  const portfolio = getPortfolio()

  return {
    profile: withDefaults(portfolio.profile, defaultProfile),
    section: portfolio.sections.about,
    stats: ensureArray(portfolio.stats),
  }
}

export function getSkillsContent() {
  const portfolio = getPortfolio()

  return {
    profile: withDefaults(portfolio.profile, defaultProfile),
    section: portfolio.sections.skills,
    skills: ensureArray(portfolio.skills),
  }
}

export function getProjectsContent() {
  const portfolio = getPortfolio()

  return {
    section: portfolio.sections.projects,
    projects: ensureArray(portfolio.projects).map((project) =>
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

export function getExperienceContent() {
  const portfolio = getPortfolio()

  return {
    section: portfolio.sections.experience,
    timeline: ensureArray(portfolio.timeline),
  }
}

export function getCertificatesContent() {
  const portfolio = getPortfolio()

  return {
    section: portfolio.sections.certificates,
    certificates: ensureArray(portfolio.certificates),
  }
}

export function getServicesContent() {
  const portfolio = getPortfolio()

  return {
    section: portfolio.sections.services,
    services: ensureArray(portfolio.services),
  }
}

export function getAchievementsContent() {
  const portfolio = getPortfolio()

  return {
    section: portfolio.sections.achievements,
    achievements: ensureArray(portfolio.achievements),
  }
}

export function getMilestonesContent() {
  const portfolio = getPortfolio()

  return ensureArray(portfolio.milestones ?? [])
}

export function getContactContent() {
  const portfolio = getPortfolio()

  return {
    profile: withDefaults(portfolio.profile, defaultProfile),
    socials: ensureArray(portfolio.socials),
    section: portfolio.sections.contact,
  }
}

export function getCommandPaletteContent() {
  const portfolio = getPortfolio()

  return {
    actions: ensureArray(commandActions),
    profile: withDefaults(portfolio.profile, defaultProfile),
    projects: ensureArray(portfolio.projects),
    ui: uiContent.commandPalette,
  }
}

export function getProjectCardContent() {
  return uiContent.projectCard
}

export function getNotFoundContent() {
  const portfolio = getPortfolio()

  return {
    seoTitle: `Page Not Found${siteSeo.projectTitleSuffix}`,
    section: portfolio.sections.notFound,
  }
}