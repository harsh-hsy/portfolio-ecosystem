import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  getProjectDetailsContent,
  getProjectsContent,
  getSiteSettings,
} from '../content/contentSelectors.js'
import { portfolioIdentity } from '../content/portfolioIdentity.js'
import { usePortfolioContent } from '../hooks/usePortfolioContent.js'
import { getProjectBySlug } from '../utils/projects.js'

const defaultTitle = `${portfolioIdentity.titleSuffix} | Frontend Developer`
const notFoundTitle = `Page Not Found | ${portfolioIdentity.titleSuffix}`
const defaultDescription =
  'React developer and UI engineer building accessible, responsive, high-performance web experiences.'

function updateMeta(selector, content) {
  document.querySelector(selector)?.setAttribute('content', content)
}

export default function SiteMetadata() {
  // Static home metadata lives in index.html; only route-dependent values change here.
  const location = useLocation()
  const contentState = usePortfolioContent()
  const portfolio = contentState?.portfolio
  const settings = getSiteSettings(portfolio)
  let title = defaultTitle
  let description = defaultDescription

  if (settings.maintenance?.enabled) {
    title = `Maintenance | ${portfolioIdentity.titleSuffix}`
  } else if (location.pathname === '/projects') {
    const { section } = getProjectsContent(portfolio)
    title = `Projects | ${portfolioIdentity.titleSuffix}`
    description = section?.copy || description
  } else if (location.pathname.startsWith('/projects/')) {
    const slug = decodeURIComponent(location.pathname.slice('/projects/'.length))
    const project = getProjectBySlug(slug, portfolio?.projects)
    if (project) {
      const projectMetadata = getProjectDetailsContent(project, portfolio).seo
      title = projectMetadata.title
      description = projectMetadata.description
    } else {
      title = notFoundTitle
    }
  } else if (location.pathname !== '/') {
    title = notFoundTitle
  }

  useEffect(() => {
    const canonicalUrl = `${portfolioIdentity.portfolioUrl}${
      location.pathname === '/' ? '' : location.pathname
    }`
    const robots = settings.maintenance?.enabled ? 'noindex, nofollow' : 'index, follow'

    document.title = title
    updateMeta('meta[name="description"]', description)
    updateMeta('meta[name="author"]', portfolioIdentity.authorName)
    updateMeta('meta[name="robots"]', robots)
    updateMeta('meta[property="og:site_name"]', portfolioIdentity.siteName)
    updateMeta('meta[property="og:title"]', title)
    updateMeta('meta[property="og:description"]', description)
    updateMeta('meta[property="og:url"]', canonicalUrl)
    updateMeta('meta[name="twitter:title"]', title)
    updateMeta('meta[name="twitter:description"]', description)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl)
    document.querySelector('link[rel="icon"]')?.setAttribute('href', portfolioIdentity.favicon)
  }, [description, location.pathname, settings.maintenance?.enabled, title])

  return null
}
