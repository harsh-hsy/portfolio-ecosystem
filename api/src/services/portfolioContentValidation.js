import { validateAboutContent } from '../validation/aboutContent.js'
import { validateCertificatesContent } from '../validation/certificateContent.js'
import { validateContactContent, validateLinksContent } from '../validation/contactContent.js'
import { validateFooterContent } from '../validation/footerContent.js'
import { validateHomeContent } from '../validation/homeContent.js'
import { validateJourneyContent, validateMilestonesContent } from '../validation/journeyContent.js'
import { validateAchievementsContent, validateServicesContent } from '../validation/listContent.js'
import { validateProjectsContent } from '../validation/projectContent.js'
import { validateSettingsContent } from '../validation/settingsContent.js'
import { validateSkillsContent } from '../validation/skillsContent.js'

const validators = {
  home: validateHomeContent,
  about: validateAboutContent,
  journey: validateJourneyContent,
  milestones: validateMilestonesContent,
  projects: validateProjectsContent,
  certificates: validateCertificatesContent,
  skills: validateSkillsContent,
  services: validateServicesContent,
  achievements: validateAchievementsContent,
  contact: validateContactContent,
  links: validateLinksContent,
}

export function validatePortfolioModules(content, names, editorName) {
  names.forEach((name) => validators[name]?.(content))
  if (!names.includes('settings')) return

  if (editorName === 'footer') {
    validateFooterContent(content)
    return
  }

  if (editorName === 'settings') {
    validateSettingsContent(content)
    return
  }

  validateFooterContent(content)
  validateSettingsContent(content)
}
