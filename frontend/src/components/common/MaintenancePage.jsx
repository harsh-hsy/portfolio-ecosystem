export default function MaintenancePage({ settings }) {
  const maintenance = settings.maintenance ?? {}

  return (
    <main className="maintenance-page">
      <section className="maintenance-card" role="status">
        <span className="maintenance-card__mark">{settings.brandInitials || 'HS'}</span>
        <p>Maintenance</p>
        <h1>{maintenance.heading}</h1>
        <div>{maintenance.message}</div>
      </section>
    </main>
  )
}
