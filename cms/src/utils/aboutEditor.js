import { isSupportedIcon } from '../data/iconCatalog'
import { updateSection } from './contentFormUtils'
import { validateForm, validators } from './validation'

export const aboutSuffixOptions = [
  { value: '+', label: '+ (Plus)' },
  { value: '', label: 'None' },
]

export const emptyAboutForm = {
  title: '',
  copy: '',
  bio: '',
  aboutImage: '',
  facts: [],
  stats: [],
}

export function aboutFormFromPortfolio(portfolio) {
  const profile = portfolio?.profile ?? {}
  const about = portfolio?.sections?.about ?? {}

  return {
    title: about.title ?? '',
    copy: about.copy ?? '',
    bio: profile.about ?? '',
    aboutImage: profile.aboutImage ?? '',
    facts: (about.facts ?? []).map((fact) => {
      const isLocation =
        String(fact?.label ?? '')
          .trim()
          .toLowerCase() === 'location'
      const useProfileLocation = fact?.useProfileLocation ?? isLocation

      return {
        label: fact?.label ?? '',
        value: useProfileLocation ? (profile.location ?? fact?.value ?? '') : (fact?.value ?? ''),
        icon: isSupportedIcon(fact?.icon) ? fact.icon : 'user',
        useProfileLocation,
      }
    }),
    stats: (portfolio?.stats ?? []).map((stat) => ({
      id: stat?.id ?? '',
      value: String(stat?.value ?? ''),
      suffix: aboutSuffixOptions.some((option) => option.value === stat?.suffix) ? stat.suffix : '',
      label: stat?.label ?? '',
    })),
  }
}

function createId(label, index) {
  const slug = String(label ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return slug || `stat-${index + 1}`
}

export function portfolioFromAboutForm(portfolio, form) {
  const facts = form.facts.map((fact) => ({
    label: fact.label.trim(),
    value: fact.value.trim(),
    icon: fact.icon,
    useProfileLocation: Boolean(fact.useProfileLocation),
  }))
  const stats = form.stats.map((stat, index) => ({
    id: stat.id || createId(stat.label, index),
    value: Number(stat.value),
    suffix: stat.suffix,
    label: stat.label.trim(),
  }))

  return updateSection(
    {
      ...portfolio,
      profile: {
        ...(portfolio.profile ?? {}),
        about: form.bio.trim(),
        aboutImage: form.aboutImage.trim(),
      },
      stats,
    },
    'about',
    {
      title: form.title.trim(),
      copy: form.copy.trim(),
      facts,
    },
  )
}

export function validateAboutForm(form) {
  return validateForm(form, {
    title: [validators.required('About title is required.'), validators.maxLength(140)],
    copy: [validators.required('Short description is required.'), validators.maxLength(280)],
    bio: [validators.required('Profile bio is required.'), validators.maxLength(1200)],
    aboutImage: validators.required('About image is required.'),
    facts: (facts) => {
      if (!Array.isArray(facts) || facts.length < 1 || facts.length > 6) {
        return 'Add between one and six fact cards.'
      }

      return facts.every(
        (fact) =>
          fact.label.trim() &&
          fact.value.trim() &&
          isSupportedIcon(fact.icon) &&
          typeof fact.useProfileLocation === 'boolean',
      )
        ? ''
        : 'Complete the label, value, and icon for every fact card.'
    },
    stats: (stats) => {
      if (!Array.isArray(stats) || stats.length < 1 || stats.length > 4) {
        return 'Add between one and four statistics.'
      }

      return stats.every(
        (stat) =>
          stat.label.trim() &&
          Number.isFinite(Number(stat.value)) &&
          Number(stat.value) >= 0 &&
          aboutSuffixOptions.some((option) => option.value === stat.suffix),
      )
        ? ''
        : 'Every statistic needs a label, non-negative number, and valid suffix.'
    },
  })
}
