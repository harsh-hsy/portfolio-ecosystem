export default function Testimonials({ items = [] }) {
  if (!items.length) return null
  return (
    <section id="testimonials" className="section">
      <div className="container testimonials-grid">
        {items.map((item) => <blockquote key={item.name}>{item.quote}<cite>{item.name}</cite></blockquote>)}
      </div>
    </section>
  )
}
