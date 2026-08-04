import { Helmet } from 'react-helmet-async'

export default function MaintenancePage({ settings }) {
  const identity = settings.siteIdentity ?? {}
  const maintenance = settings.maintenance ?? {}

  return (
    <main className="maintenance-page">
      <Helmet>
        <title>{`Maintenance | ${identity.titleSuffix || identity.siteName || 'Portfolio'}`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <section className="maintenance-card" role="status">
        <span className="maintenance-card__mark">{settings.brandInitials || 'HS'}</span>
        <p>Maintenance</p>
        <h1>{maintenance.heading}</h1>
        <div>{maintenance.message}</div>
      </section>
    </main>
  )
}
