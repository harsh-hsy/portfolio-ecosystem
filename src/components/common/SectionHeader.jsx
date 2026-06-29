import Reveal from './Reveal.jsx'

export default function SectionHeader({ eyebrow, title, copy }) {
  return (
    <Reveal className="section-header">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </Reveal>
  )
}
