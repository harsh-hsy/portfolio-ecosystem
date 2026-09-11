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
import {
  pickProfileFields,
  withoutCodeOwnedIdentity,
  withoutContactFormText,
} from './portfolioContentTransforms.js'

export const portfolioModules = {
  home: {
    model: HomeContent,
    extract: (content) => ({
      profile: pickProfileFields(content.profile, 'home'),
      section: content.sections?.hero ?? {},
    }),
  },
  about: {
    model: AboutContent,
    extract: (content) => ({
      profile: pickProfileFields(content.profile, 'about'),
      section: content.sections?.about ?? {},
      stats: content.stats ?? [],
    }),
  },
  skills: {
    model: SkillsContent,
    extract: (content) => ({
      profile: pickProfileFields(content.profile, 'skills'),
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
    extract: (content) => ({ section: withoutContactFormText(content.sections?.contact) }),
  },
  links: {
    model: LinksContent,
    extract: (content) => ({
      profile: pickProfileFields(content.profile, 'links'),
      socials: content.socials ?? [],
    }),
  },
  settings: {
    model: SettingsContent,
    extract: (content) => ({
      profile: pickProfileFields(content.profile, 'settings'),
      settings: withoutCodeOwnedIdentity(content.settings ?? {}),
      commands: content.commands ?? [],
      ui: content.ui ?? {},
    }),
  },
}

export const editorModules = {
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
  footer: ['settings'],
}
