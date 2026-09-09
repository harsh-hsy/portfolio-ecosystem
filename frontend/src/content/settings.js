import { profile } from './profile.js'
import { portfolioIdentity } from './portfolioIdentity.js'

export const siteSettings = {
  brandInitials: portfolioIdentity.brandInitials,
  copyrightPrefix: '©',
  developedByLabel: 'Developed by',
  footerName: '',
  footerDescription: '',
  loadingMark: portfolioIdentity.brandInitials,
  footerBackToTopLabel: 'Back to top',
  siteIdentity: {
    siteName: portfolioIdentity.siteName,
    titleSuffix: portfolioIdentity.titleSuffix,
    favicon: portfolioIdentity.favicon,
    authorName: portfolioIdentity.authorName,
    portfolioUrl: portfolioIdentity.portfolioUrl,
  },
  socialSharing: {
    openGraphTitle: `${profile.name} | ${profile.role}`,
    openGraphDescription: 'React developer and UI engineer building accessible, responsive, high-performance web experiences.',
    image: '',
    twitterCard: 'summary_large_image',
  },
  experience: {
    loadingEnabled: true,
    loadingDurationMs: 2400,
    desktopAnimations: true,
    mobileAnimations: false,
    smoothScroll: true,
    rotatingRole: true,
    stickyHeader: true,
    respectReducedMotion: true,
  },
  maintenance: {
    enabled: false,
    heading: 'Portfolio under maintenance',
    message: 'I am making a few improvements. Please check back shortly.',
    announcementEnabled: false,
    announcementText: '',
  },
  nav: {
    ariaLabel: 'Primary navigation',
    skipLabel: 'Skip to content',
    resumeLabel: 'Resume',
    menuToggleLabel: 'Toggle menu',
  },
}
