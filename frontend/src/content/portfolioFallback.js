import { achievements } from './achievements.js'
import { certificates } from './certificates.js'
import { commandActions } from '../config/commands.js'
import { milestones } from './milestones.js'
import { publicNavigation } from '../config/navigation.js'
import { profile, socials } from './profile.js'
import { projects } from './projects.js'
import { sectionContent, stats } from './sections.js'
import { services } from './services.js'
import { siteSettings } from './settings.js'
import { skills } from './skills.js'
import { timeline } from './timeline.js'
import { uiContent } from './ui.js'

// This is the single offline snapshot consumed when the published API cannot be reached.
export const portfolioFallback = {
  profile,
  socials,
  skills,
  projects,
  certificates,
  timeline,
  achievements,
  milestones,
  services,
  sections: sectionContent,
  stats,
  settings: siteSettings,
  navigation: publicNavigation,
  commands: commandActions,
  ui: uiContent,
}
