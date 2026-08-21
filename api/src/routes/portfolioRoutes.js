import { Router } from 'express'
import { ensurePublishedPortfolio } from '../services/portfolioContentService.js'

const router = Router()

function normalizeAppUrl(value) {
  try {
    const url = new URL(String(value ?? '').trim())
    return new URL('/', url).toString()
  } catch {
    return 'https://harsh-hsy-cms.onrender.com/'
  }
}

function cloudinaryIconUrl(source, size) {
  if (!source.includes('/upload/')) return source
  return source.replace('/upload/', `/upload/f_png,c_fill,g_auto,w_${size},h_${size}/`)
}

function createManifestIcons(icon, cmsUrl) {
  const source = String(icon ?? '').trim()

  if (!source) {
    return [{
      src: new URL('/favicon.svg', cmsUrl).toString(),
      sizes: 'any',
      type: 'image/svg+xml',
      purpose: 'any',
    }]
  }

  if (source.includes('/upload/')) {
    return [192, 512].map((size) => ({
      src: cloudinaryIconUrl(source, size),
      sizes: `${size}x${size}`,
      type: 'image/png',
      purpose: 'any maskable',
    }))
  }

  return [{ src: source, sizes: 'any', purpose: 'any maskable' }]
}

router.get('/cms-manifest.webmanifest', async (req, res) => {
  const content = await ensurePublishedPortfolio()
  const config = content.settings?.cmsManifest ?? {}
  const cmsUrl = normalizeAppUrl(config.cmsUrl)
  const manifest = {
    id: cmsUrl,
    name: config.name || 'Portfolio CMS',
    short_name: config.shortName || 'CMS',
    description: config.description || 'Private portfolio content management dashboard.',
    start_url: cmsUrl,
    scope: cmsUrl,
    display: config.display || 'standalone',
    background_color: config.backgroundColor || '#080c14',
    theme_color: config.themeColor || '#111827',
    icons: createManifestIcons(config.icon, cmsUrl),
  }

  res
    .status(200)
    .set({
      'Content-Type': 'application/manifest+json; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
    })
    .send(JSON.stringify(manifest))
})

router.get('/', async (req, res) => {
  const content = await ensurePublishedPortfolio()
  // Portfolio content is edited independently of the frontend deployment. Do not
  // let a browser or an intermediate CDN keep serving the previous CMS snapshot.
  res
    .set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      Pragma: 'no-cache',
      Expires: '0',
    })
    .json({ content })
})

export default router
