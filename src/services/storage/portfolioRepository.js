import { loadPortfolio, savePortfolio } from './portfolioStorage'

import { profile, socials } from '../../content/profile'
import { skills } from '../../content/skills'
import { projects } from '../../content/projects'
import { certificates } from '../../content/certificates'
import { timeline } from '../../content/timeline'
import { achievements } from '../../content/achievements'
import { milestones } from '../../content/milestones'
import { services } from '../../content/services'
import { sectionContent, stats } from '../../content/sections'

const defaultPortfolio = {
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
}

export function getPortfolio() {
  return loadPortfolio() ?? defaultPortfolio
}

export function updatePortfolio(data) {
  savePortfolio(data)
}

export function resetPortfolio() {
  savePortfolio(defaultPortfolio)
}