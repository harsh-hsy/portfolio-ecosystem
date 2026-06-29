import { FiArrowUp } from 'react-icons/fi'
import { profile, socials } from '../../data/portfolio.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <a className="brand footer-brand" href="#home"><span>HS</span><strong>Harsh Singh</strong></a>
        <p>Building polished, accessible, high-performance web experiences.</p>
      </div>
      <div className="footer-links">
        {socials.map((social) => {
          const Icon = social.icon
          return (
            <a key={social.label} href={social.href} target={social.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">
              <Icon /> {social.label}
            </a>
          )
        })}
      </div>
      <div className="footer-bottom">
        <span>Copyright 2026 Developed by {profile.name}.</span>
        <a href="#home" className="back-top" aria-label="Back to top"><FiArrowUp /></a>
      </div>
    </footer>
  )
}
