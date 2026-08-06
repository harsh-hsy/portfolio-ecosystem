import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import {
  getNotFoundContent,
  getProjectDetailsContent,
  getProjectsContent,
  getSiteSettings,
} from '../../lib/contentSelectors.js'
import { usePortfolioContent } from '../../hooks/usePortfolioContent.js'
import { getProjectBySlug } from '../../lib/projects.js'

export default function SiteMetadata() {
  const location = useLocation()
  const contentState = usePortfolioContent()
  const portfolio = contentState?.portfolio
  const settings = getSiteSettings(portfolio)
  const identity = settings.siteIdentity ?? {}
  const sharing = settings.socialSharing ?? {}
  const seo = portfolio?.seo ?? {}
  const canonicalUrl = identity.portfolioUrl || seo.siteUrl || ''
  const titleSuffix = identity.titleSuffix || identity.siteName || 'Portfolio'
  let title = seo.title || identity.siteName || 'Portfolio'
  let description = seo.description || sharing.openGraphDescription || ''

  if (settings.maintenance?.enabled) {
    title = `Maintenance | ${titleSuffix}`
  } else if (location.pathname === '/projects') {
    const { section } = getProjectsContent(portfolio)
    title = `Projects | ${titleSuffix}`
    description = section?.copy || description
  } else if (location.pathname.startsWith('/projects/')) {
    const slug = decodeURIComponent(location.pathname.slice('/projects/'.length))
    const project = getProjectBySlug(slug, portfolio?.projects)
    if (project) {
      const projectMetadata = getProjectDetailsContent(project, portfolio).seo
      title = projectMetadata.title
      description = projectMetadata.description
    } else {
      title = getNotFoundContent(portfolio).seoTitle
    }
  } else if (location.pathname !== '/') {
    title = getNotFoundContent(portfolio).seoTitle
  }

  const robots = settings.maintenance?.enabled || seo.allowIndexing === false
    ? 'noindex, nofollow'
    : 'index, follow'

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={seo.keywords || 'Harsh Singh, Harsh Kumar Singh, Harsh HSY, harsh-hsy, harsh.hsy, codewithharshsingh, Frontend Developer, React Developer, JavaScript Developer, MERN Stack Developer, Web Developer, UI Developer, Portfolio, Kanpur, Uttar Pradesh, India, Responsive Web Design, HTML, CSS, JavaScript, React, Vite, Node.js, Express.js, MongoDB, GitHub, QR Fusion, QR Code Generator, harsh-hsy portfolio, harsh-hsy.netlify.app, harsh-hsy.onrender.com'} />
      <meta name="author" content={seo.author || identity.authorName || ''} />
      <meta name="robots" content={robots} />
      <meta name="google-site-verification" content="aDkIUPjc1UqjW4B3wzo26s3p0zA_lhH79-khjETxgII" />
      {seo.bingVerification ? <meta name="msvalidate.01" content={seo.bingVerification} /> : null}
      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}
      {identity.favicon ? <link rel="icon" href={identity.favicon} /> : null}
      <meta property="og:title" content={location.pathname === '/' ? sharing.openGraphTitle || title : title} />
      <meta property="og:description" content={location.pathname === '/' ? sharing.openGraphDescription || description : description} />
      <meta property="og:type" content="website" />
      {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
      {sharing.image ? <meta property="og:image" content={sharing.image} /> : null}
      <meta name="twitter:card" content={sharing.twitterCard || 'summary_large_image'} />
      <meta name="twitter:title" content={location.pathname === '/' ? sharing.openGraphTitle || title : title} />
      <meta name="twitter:description" content={location.pathname === '/' ? sharing.openGraphDescription || description : description} />
      {sharing.image ? <meta name="twitter:image" content={sharing.image} /> : null}
    </Helmet>
  )
}
