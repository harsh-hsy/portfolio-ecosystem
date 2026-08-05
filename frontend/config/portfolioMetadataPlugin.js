function absoluteUrl(value, baseUrl) {
  const text = String(value ?? '').trim()
  if (!text) return ''

  try {
    return new URL(text, `${String(baseUrl ?? '').replace(/\/$/, '')}/`).href
  } catch {
    return text
  }
}

function normalizePortfolioUrl(value, fallback) {
  const normalized = String(value ?? '').replace(/\/$/, '')
  return normalized === 'https://harsh-hsy.netlify.app' ? fallback : normalized
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
    console.warn(`[portfolio-metadata] Using local defaults: ${error.message}`)
    return null
  } finally {
    clearTimeout(timeout)
  }
}

function metadataFrom(content, defaults) {
  const profile = content?.profile ?? defaults.profile
  const settings = content?.settings ?? defaults.settings
  const identity = settings.siteIdentity ?? defaults.settings.siteIdentity
  const sharing = settings.socialSharing ?? defaults.settings.socialSharing
  const seo = content?.seo ?? defaults.seo
  const defaultSiteUrl = String(defaults.seo.siteUrl).replace(/\/$/, '')
  const siteUrl = normalizePortfolioUrl(identity.portfolioUrl || seo.siteUrl || defaultSiteUrl, defaultSiteUrl)
  const title = seo.title || sharing.openGraphTitle || identity.siteName
  const description = seo.description || sharing.openGraphDescription || profile.tagline

  return {
    author: seo.author || identity.authorName || profile.name,
    bingVerification: seo.bingVerification || defaults.seo.bingVerification || '',
    description,
    favicon: absoluteUrl(identity.favicon || '/favicon.svg', siteUrl),
    image: absoluteUrl(sharing.image, siteUrl),
    keywords: seo.keywords || '',
    robots: seo.allowIndexing === false ? 'noindex, nofollow' : 'index, follow',
    siteName: identity.siteName,
    siteUrl,
    title,
    twitterCard: sharing.twitterCard || 'summary_large_image',
  }
}

function meta(attrs) {
  return { tag: 'meta', attrs: { ...attrs, 'data-build-seo': 'true' }, injectTo: 'head' }
}

export function portfolioMetadataPlugin({ apiBaseUrl, defaults }) {
  return {
    name: 'portfolio-crawler-metadata',
    async transformIndexHtml(html) {
      const content = await fetchPortfolio(apiBaseUrl)
      const metadata = metadataFrom(content, defaults)
      const tags = [
        { tag: 'title', attrs: { 'data-build-seo': 'true' }, children: metadata.title, injectTo: 'head' },
        meta({ name: 'description', content: metadata.description }),
        meta({ name: 'keywords', content: metadata.keywords }),
        meta({ name: 'author', content: metadata.author }),
        meta({ name: 'robots', content: metadata.robots }),
        { tag: 'link', attrs: { rel: 'canonical', href: metadata.siteUrl, 'data-build-seo': 'true' }, injectTo: 'head' },
        { tag: 'link', attrs: { rel: 'icon', href: metadata.favicon, 'data-build-seo': 'true' }, injectTo: 'head' },
        meta({ property: 'og:type', content: 'website' }),
        meta({ property: 'og:site_name', content: metadata.siteName }),
        meta({ property: 'og:title', content: metadata.title }),
        meta({ property: 'og:description', content: metadata.description }),
        meta({ property: 'og:url', content: metadata.siteUrl }),
        meta({ name: 'twitter:card', content: metadata.twitterCard }),
        meta({ name: 'twitter:title', content: metadata.title }),
        meta({ name: 'twitter:description', content: metadata.description }),
      ]

      if (metadata.bingVerification) {
        tags.push(meta({ name: 'msvalidate.01', content: metadata.bingVerification }))
      }

      if (metadata.image) {
        tags.push(
          meta({ property: 'og:image', content: metadata.image }),
          meta({ property: 'og:image:secure_url', content: metadata.image }),
          meta({ property: 'og:image:width', content: '1200' }),
          meta({ property: 'og:image:height', content: '630' }),
          meta({ property: 'og:image:alt', content: metadata.title }),
          meta({ name: 'twitter:image', content: metadata.image }),
          meta({ name: 'twitter:image:alt', content: metadata.title }),
        )
      }

      return { html, tags }
    },
  }
}
