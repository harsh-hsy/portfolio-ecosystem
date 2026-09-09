import { portfolioIdentity } from './portfolioIdentity.js'

export const siteSettings = {
  "brandInitials": portfolioIdentity.brandInitials,
  "copyrightPrefix": "©",
  "developedByLabel": "Developed by",
  "footerName": "Harsh Singh",
  "footerDescription": "Building polished, accessible, high-performance web experiences.",
  "loadingMark": portfolioIdentity.brandInitials,
  "footerBackToTopLabel": "Back to top",
  "siteIdentity": {
    "siteName": portfolioIdentity.siteName,
    "titleSuffix": portfolioIdentity.titleSuffix,
    "favicon": portfolioIdentity.favicon,
    "authorName": portfolioIdentity.authorName,
    "portfolioUrl": portfolioIdentity.portfolioUrl
  },
  "experience": {
    "loadingEnabled": true,
    "loadingDurationMs": 2400,
    "desktopAnimations": true,
    "mobileAnimations": false,
    "smoothScroll": true,
    "rotatingRole": true,
    "stickyHeader": true,
    "respectReducedMotion": true
  },
  "maintenance": {
    "enabled": false,
    "heading": "Portfolio under maintenance",
    "message": "Updates are currently in progress. Please check back soon.",
    "announcementEnabled": false,
    "announcementText": ""
  },
  "nav": {
    "ariaLabel": "Primary navigation",
    "skipLabel": "Skip to content",
    "resumeLabel": "Resume",
    "menuToggleLabel": "Toggle menu"
  }
}
