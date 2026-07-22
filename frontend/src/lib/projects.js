function resolveProjects(projects) {
  return (projects ?? []).filter((project) => project.visible !== false)
}

export function getProjectBySlug(slug, projects) {
  return resolveProjects(projects).find((project) => project.slug === slug)
}

export function getRelatedProjects(currentSlug, limit = 3, projects) {
  return resolveProjects(projects).filter((project) => project.slug !== currentSlug).slice(0, limit)
}
