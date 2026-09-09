import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  getProjectDetailsContent,
  getProjectsContent,
  getSiteSettings,
} from '../content/contentSelectors.js'
import { usePortfolioContent } from '../hooks/usePortfolioContent.js'
import { getProjectBySlug } from '../utils/projects.js'

const siteUrl = 'https://harsh-hsy.onrender.com'
const defaultTitle = 'Harsh Singh | Frontend Developer'
const notFoundTitle = 'Page Not Found | Harsh Singh'
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
    title = 'Maintenance | Harsh Singh'
  } else if (location.pathname === '/projects') {
    const { section } = getProjectsContent(portfolio)
    title = 'Projects | Harsh Singh'
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
    const canonicalUrl = `${siteUrl}${location.pathname === '/' ? '' : location.pathname}`
    const robots = settings.maintenance?.enabled ? 'noindex, nofollow' : 'index, follow'

    document.title = title
    updateMeta('meta[name="description"]', description)
    updateMeta('meta[name="robots"]', robots)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl)
  }, [description, location.pathname, settings.maintenance?.enabled, title])

  return null
}
