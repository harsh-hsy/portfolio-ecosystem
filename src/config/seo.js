import { profile } from '../content/profile.js'

export const siteSeo = {
  siteUrl: 'https://harsh-hsy.netlify.app',
  title: 'Harsh Singh | Frontend Developer',
  description: 'React developer and UI engineer building accessible, responsive, high-performance web experiences.',
  projectTitleSuffix: ' | Harsh Singh',
}

export function getHomeStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.fullName,
    jobTitle: profile.role,
    email: profile.email,
    address: profile.location,
    sameAs: [profile.github, profile.linkedin],
  }
}

export function getProjectSeo(project) {
  return {
    title: `${project.shortTitle}${siteSeo.projectTitleSuffix}`,
    description: project.desc,
  }
}
