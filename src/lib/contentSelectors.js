import { commandActions } from '../config/commands.js'
import { publicNavigation } from '../config/navigation.js'
import { getHomeStructuredData, getProjectSeo, siteSeo } from '../config/seo.js'
import { achievements } from '../content/achievements.js'
import { certificates } from '../content/certificates.js'
import { milestones } from '../content/milestones.js'
import { profile, socials } from '../content/profile.js'
import { projects } from '../content/projects.js'
import { sectionContent, stats } from '../content/sections.js'
import { services } from '../content/services.js'
import { siteSettings } from '../content/settings.js'
import { skills } from '../content/skills.js'
import { timeline } from '../content/timeline.js'
import { uiContent } from '../content/ui.js'
import { defaultProfile, defaultProject, defaultSettings } from './contentDefaults.js'
import { ensureArray, withDefaults } from './contentValidation.js'

export function getSiteSettings() {
  return withDefaults(siteSettings, defaultSettings)
}

export function getProfileContent() {
  return withDefaults(profile, defaultProfile)
}

export function getNavigationContent() {
  return ensureArray(publicNavigation)
}

export function getHomeContent() {
  return {
    profile: getProfileContent(),
    socials: ensureArray(socials),
    seo: siteSeo,
    structuredData: getHomeStructuredData(),
    sections: sectionContent,
    stats: ensureArray(stats),
  }
}

export function getAboutContent() {
  return {
    profile: getProfileContent(),
    section: sectionContent.about,
    stats: ensureArray(stats),
  }
}

export function getSkillsContent() {
  return {
    profile: getProfileContent(),
    section: sectionContent.skills,
    skills: ensureArray(skills),
  }
}

export function getProjectsContent() {
  return {
    section: sectionContent.projects,
    projects: ensureArray(projects).map((project) => withDefaults(project, defaultProject)),
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
  return {
    section: sectionContent.experience,
    timeline: ensureArray(timeline),
  }
}

export function getCertificatesContent() {
  return {
    section: sectionContent.certificates,
    certificates: ensureArray(certificates),
  }
}

export function getServicesContent() {
  return {
    section: sectionContent.services,
    services: ensureArray(services),
  }
}

export function getAchievementsContent() {
  return {
    section: sectionContent.achievements,
    achievements: ensureArray(achievements),
  }
}

export function getMilestonesContent() {
  return ensureArray(milestones)
}

export function getContactContent() {
  return {
    profile: getProfileContent(),
    socials: ensureArray(socials),
    section: sectionContent.contact,
  }
}

export function getCommandPaletteContent() {
  return {
    actions: ensureArray(commandActions),
    profile: getProfileContent(),
    projects: ensureArray(projects),
    ui: uiContent.commandPalette,
  }
}

export function getProjectCardContent() {
  return uiContent.projectCard
}

export function getNotFoundContent() {
  return {
    seoTitle: `Page Not Found${siteSeo.projectTitleSuffix}`,
    section: sectionContent.notFound,
  }
}
