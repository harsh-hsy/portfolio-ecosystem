function resolveProjects(projects) {
  return projects ?? []
}

export function getProjectBySlug(slug, projects) {
  return resolveProjects(projects).find((project) => project.slug === slug)
}

export function getRelatedProjects(currentSlug, limit = 3, projects) {
  return resolveProjects(projects).filter((project) => project.slug !== currentSlug).slice(0, limit)
}
