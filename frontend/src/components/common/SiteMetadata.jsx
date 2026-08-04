import { Helmet } from 'react-helmet-async'
import { getSiteSettings } from '../../lib/contentSelectors.js'
import { usePortfolioContent } from '../../hooks/usePortfolioContent.js'

export default function SiteMetadata() {
  const contentState = usePortfolioContent()
  const portfolio = contentState?.portfolio
  const settings = getSiteSettings(portfolio)
  const identity = settings.siteIdentity ?? {}
  const sharing = settings.socialSharing ?? {}
  const seo = portfolio?.seo ?? {}
  const canonicalUrl = identity.portfolioUrl || seo.siteUrl || ''
  const title = seo.title || identity.siteName || 'Portfolio'
  const description = seo.description || sharing.openGraphDescription || ''
  const robots = seo.allowIndexing === false ? 'noindex, nofollow' : 'index, follow'

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={seo.keywords || ''} />
      <meta name="author" content={seo.author || identity.authorName || ''} />
      <meta name="robots" content={robots} />
      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}
      {identity.favicon ? <link rel="icon" href={identity.favicon} /> : null}
      <meta property="og:title" content={sharing.openGraphTitle || title} />
      <meta property="og:description" content={sharing.openGraphDescription || description} />
      <meta property="og:type" content="website" />
      {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
      {sharing.image ? <meta property="og:image" content={sharing.image} /> : null}
      <meta name="twitter:card" content={sharing.twitterCard || 'summary_large_image'} />
      <meta name="twitter:title" content={sharing.openGraphTitle || title} />
      <meta name="twitter:description" content={sharing.openGraphDescription || description} />
      {sharing.image ? <meta name="twitter:image" content={sharing.image} /> : null}
    </Helmet>
  )
}
