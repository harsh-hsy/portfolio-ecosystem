export function createSocials(profile) {
  return [
    { label: 'GitHub', href: profile.github, icon: 'github' },
    { label: 'LinkedIn', href: profile.linkedin, icon: 'linkedin' },
    { label: 'Email', href: `mailto:${profile.email}`, icon: 'email' },
  ]
}

export function updateSection(portfolio, key, section) {
  return {
    ...portfolio,
    sections: {
      ...(portfolio.sections ?? {}),
      [key]: {
        ...(portfolio.sections?.[key] ?? {}),
        ...section,
      },
    },
  }
}
