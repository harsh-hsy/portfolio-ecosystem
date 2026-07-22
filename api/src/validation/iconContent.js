const supportedIconKeys = new Set([
  'user',
  'briefcase',
  'mapPin',
  'globe',
  'email',
  'github',
  'linkedin',
  'html',
  'css',
  'javascript',
  'react',
  'tailwind',
  'bootstrap',
  'vite',
  'node',
  'express',
  'mongodb',
  'git',
  'code',
  'figma',
  'canva',
  'paint',
])

export function isSupportedIconKey(key) {
  return supportedIconKeys.has(key)
}
