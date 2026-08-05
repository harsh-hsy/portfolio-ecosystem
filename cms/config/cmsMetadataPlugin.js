function absoluteUrl(value, baseUrl) {
  const text = String(value ?? '').trim()
  if (!text) return ''

  try {
    return new URL(text, `${String(baseUrl ?? '').replace(/\/$/, '')}/`).href
  } catch {
    return text
  }
}

async function fetchPortfolio(apiBaseUrl) {
  if (!apiBaseUrl) return null

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/portfolio`, {
      signal: controller.signal,
    })
    if (!response.ok) throw new Error(`Portfolio API returned ${response.status}`)
    const payload = await response.json()
    return payload.content ?? null
  } catch (error) {
    console.warn(`[cms-metadata] Using local defaults: ${error.message}`)
    return null
  } finally {
    clearTimeout(timeout)
  }
}

function meta(attrs) {
  return { tag: 'meta', attrs, injectTo: 'head' }
}

export function cmsMetadataPlugin({ apiBaseUrl, defaults }) {
  return {
    name: 'cms-crawler-metadata',
    async transformIndexHtml(html) {
      const content = await fetchPortfolio(apiBaseUrl)
      const manifest = content?.settings?.cmsManifest ?? defaults.manifest
      const sharing = content?.settings?.cmsSocialSharing ?? defaults.sharing
      const cmsUrl = String(manifest.cmsUrl || defaults.manifest.cmsUrl).replace(/\/$/, '')
      const title = sharing.openGraphTitle || manifest.name || defaults.sharing.openGraphTitle
      const description = sharing.openGraphDescription || manifest.description || defaults.sharing.openGraphDescription
      const image = absoluteUrl(sharing.image, cmsUrl)
      const favicon = absoluteUrl(manifest.icon || '/favicon.svg', cmsUrl)
      const tags = [
        { tag: 'title', children: title, injectTo: 'head' },
        meta({ name: 'description', content: description }),
        meta({ name: 'robots', content: 'noindex, nofollow, noarchive' }),
        { tag: 'link', attrs: { rel: 'canonical', href: cmsUrl }, injectTo: 'head' },
        { tag: 'link', attrs: { rel: 'icon', href: favicon }, injectTo: 'head' },
        meta({ property: 'og:type', content: 'website' }),
        meta({ property: 'og:site_name', content: manifest.name || defaults.manifest.name }),
        meta({ property: 'og:title', content: title }),
        meta({ property: 'og:description', content: description }),
        meta({ property: 'og:url', content: cmsUrl }),
        meta({ name: 'twitter:card', content: sharing.twitterCard || 'summary_large_image' }),
        meta({ name: 'twitter:title', content: title }),
        meta({ name: 'twitter:description', content: description }),
      ]

      if (image) {
        tags.push(
          meta({ property: 'og:image', content: image }),
          meta({ property: 'og:image:secure_url', content: image }),
          meta({ property: 'og:image:width', content: '1200' }),
          meta({ property: 'og:image:height', content: '630' }),
          meta({ property: 'og:image:alt', content: title }),
          meta({ name: 'twitter:image', content: image }),
          meta({ name: 'twitter:image:alt', content: title }),
        )
      }

      return { html, tags }
    },
  }
}
