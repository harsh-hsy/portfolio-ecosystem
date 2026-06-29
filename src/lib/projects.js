import { projects } from '../content/projects.js'

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug)
}

export function getRelatedProjects(currentSlug, limit = 3) {
  return projects.filter((project) => project.slug !== currentSlug).slice(0, limit)
}
