import Reveal from './Reveal.jsx'

export default function SectionHeader({ eyebrow, title, copy, headingAs: Heading = 'h2' }) {
  return (
    <Reveal className="section-header">
      <span className="eyebrow">{eyebrow}</span>
      <Heading>{title}</Heading>
      {copy && <p>{copy}</p>}
    </Reveal>
  )
}
