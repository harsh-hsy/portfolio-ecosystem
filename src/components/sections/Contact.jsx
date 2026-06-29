import { useState } from 'react'
import emailjs from 'emailjs-com'
import { FiCheck, FiLoader, FiMail, FiMapPin, FiSend } from 'react-icons/fi'
import SectionHeader from '../common/SectionHeader.jsx'
import MagneticButton from '../common/MagneticButton.jsx'
import { profile, socials } from '../../data/portfolio.js'

const initialForm = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError('Please complete every field.')
      return
    }
    setStatus('loading')
    try {
      const service = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const template = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      const key = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      if (service && template && key) {
        await emailjs.send(service, template, form, key)
      } else {
        window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`${form.message}\n\nFrom: ${form.name} <${form.email}>`)}`
      }
      setStatus('success')
      setForm(initialForm)
    } catch {
      setStatus('idle')
      setError('Something went wrong. Please email Harsh directly.')
    }
  }

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <SectionHeader eyebrow="Contact" title="Let's build something amazing." copy="Open to frontend development, React applications, responsive websites, and polished UI work." />
        <div className="contact-grid">
          <aside className="contact-panel">
            <span className="availability">Available for opportunities</span>
            <h3>Send a message and Harsh will get back soon.</h3>
            <a href={`mailto:${profile.email}`}><FiMail /> {profile.email}</a>
            <a href="https://www.google.com/maps/place/Kanpur" target="_blank" rel="noreferrer"><FiMapPin /> {profile.location}</a>
            <div className="hero-socials">
              {socials.map((social) => {
                const Icon = social.icon
                return <a key={social.label} href={social.href} target={social.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer" aria-label={social.label}><Icon /></a>
              })}
            </div>
          </aside>
          <form className="contact-form" onSubmit={submit}>
            <label><span>Name</span><input name="name" value={form.name} onChange={update} autoComplete="name" required /></label>
            <label><span>Email</span><input name="email" value={form.email} onChange={update} type="email" autoComplete="email" required /></label>
            <label><span>Subject</span><input name="subject" value={form.subject} onChange={update} required /></label>
            <label><span>Message</span><textarea name="message" value={form.message} onChange={update} rows="5" required /></label>
            {error && <p className="form-error">{error}</p>}
            {status === 'success' && <p className="form-success"><FiCheck /> Message flow opened successfully.</p>}
            <MagneticButton type="submit" className="primary">{status === 'loading' ? <FiLoader className="spin" /> : <FiSend />} Send Message</MagneticButton>
          </form>
        </div>
      </div>
    </section>
  )
}
