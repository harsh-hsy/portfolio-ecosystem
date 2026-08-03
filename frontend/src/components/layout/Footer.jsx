import { FiArrowUp } from 'react-icons/fi'
import { getHomeContent, getSiteSettings } from '../../lib/contentSelectors.js'
import { getIcon } from '../../lib/icons.js'
import { usePortfolioContent } from '../../hooks/usePortfolioContent.js'

export default function Footer() {
  const contentState = usePortfolioContent()
  const { profile, socials } = getHomeContent(contentState?.portfolio)
  const settings = getSiteSettings(contentState?.portfolio)
  const footerName = settings.footerName || profile.name
  const footerDescription = settings.footerDescription || profile.tagline

  return (
    <footer className="footer">
      <div>
        <a className="brand footer-brand" href="#home"><span>{settings.brandInitials}</span><strong>{footerName}</strong></a>
        <p>{footerDescription}</p>
      </div>
      <div className="footer-links">
        {socials.map((social) => {
          const Icon = getIcon(social.icon)
          return (
            <a key={social.label} href={social.href} target={social.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">
              <Icon /> {social.label}
            </a>
          )
        })}
      </div>
      <div className="footer-bottom">
        <span>© {profile.copyrightYear} Developed by {footerName}.</span>
        <a href="#home" className="back-top" aria-label="Back to top"><FiArrowUp /></a>
      </div>
    </footer>
  )
}
