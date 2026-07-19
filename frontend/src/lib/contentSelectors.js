import { defaultProfile, defaultProject, defaultSettings } from './contentDefaults.js'
import { ensureArray, withDefaults } from './contentValidation.js'

const emptyPortfolio = {
  profile: { ...defaultProfile, rotatingRoles: [''] },
  socials: [],
  skills: [],
  projects: [],
  certificates: [],
  timeline: [],
  achievements: [],
  milestones: [],
  services: [],
  stats: [],
  sections: {
    hero: { strip: [] },
    about: { facts: [] },
    skills: {},
    projects: {},
    experience: {},
    certificates: {},
    services: {},
    achievements: {},
    contact: { fields: {} },
    notFound: {},
  },
  settings: defaultSettings,
  navigation: [],
  commands: [],
  ui: {
    commandPalette: {},
    projectCard: {},
    projectDetails: { detailCards: [] },
  },
  seo: {},
}

function resolvePortfolio(portfolio) {
  return portfolio ?? emptyPortfolio
}

function getStructuredData(profile) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.fullName,
    jobTitle: profile.role,
    email: profile.email,
    address: profile.location,
    sameAs: [profile.github, profile.linkedin].filter(Boolean),
  }
}

export function getSiteSettings(portfolio) {
  return withDefaults(resolvePortfolio(portfolio).settings, defaultSettings)
}

export function getProfileContent(portfolio) {
  return withDefaults(resolvePortfolio(portfolio).profile, defaultProfile)
}

export function getNavigationContent(portfolio) {
  return ensureArray(resolvePortfolio(portfolio).navigation)
}

export function getHomeContent(portfolio) {
  const resolvedPortfolio = resolvePortfolio(portfolio)
  const profile = withDefaults(resolvedPortfolio.profile, defaultProfile)

  return {
    profile,
    socials: ensureArray(resolvedPortfolio.socials),
    seo: resolvedPortfolio.seo ?? {},
    structuredData: getStructuredData(profile),
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
    ui: resolvedPortfolio.ui?.projectCard ?? {},
  }
}

export function getProjectDetailsContent(project, portfolio) {
  const safeProject = withDefaults(project, defaultProject)
  const resolvedPortfolio = resolvePortfolio(portfolio)

  return {
    project: safeProject,
    seo: {
      title: `${safeProject.shortTitle}${resolvedPortfolio.seo?.projectTitleSuffix ?? ''}`,
      description: safeProject.desc,
    },
    ui: resolvedPortfolio.ui?.projectDetails ?? emptyPortfolio.ui.projectDetails,
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
  return ensureArray(resolvePortfolio(portfolio).milestones)
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
    actions: ensureArray(resolvedPortfolio.commands),
    profile: withDefaults(resolvedPortfolio.profile, defaultProfile),
    projects: ensureArray(resolvedPortfolio.projects),
    ui: resolvedPortfolio.ui?.commandPalette ?? emptyPortfolio.ui.commandPalette,
  }
}

export function getProjectCardContent(portfolio) {
  return resolvePortfolio(portfolio).ui?.projectCard ?? emptyPortfolio.ui.projectCard
}

export function getNotFoundContent(portfolio) {
  const resolvedPortfolio = resolvePortfolio(portfolio)

  return {
    seoTitle: `Page Not Found${resolvedPortfolio.seo?.projectTitleSuffix ?? ''}`,
    section: resolvedPortfolio.sections.notFound,
  }
}
