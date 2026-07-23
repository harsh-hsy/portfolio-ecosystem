import { useState } from 'react'
import { FiCheck, FiLoader, FiMail, FiMapPin, FiSend } from 'react-icons/fi'
import SectionHeader from '../common/SectionHeader.jsx'
import MagneticButton from '../common/MagneticButton.jsx'
import { getContactContent } from '../../lib/contentSelectors.js'
import { getIcon } from '../../lib/icons.js'
import { usePortfolioContent } from '../../hooks/usePortfolioContent.js'

const initialForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const contentState = usePortfolioContent()
  const { profile, socials, section } = getContactContent(contentState?.portfolio)

  const update = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const submit = async (event) => {
    event.preventDefault()

    setError('')

    if (!form.name || !form.email || !form.subject || !form.message) {
      setError(section.errorMessage)
      return
    }

    setStatus('loading')

    try {
      const formData = new FormData()

      formData.append('entry.776139951', form.name)
      formData.append('entry.1749418244', form.email)
      formData.append('entry.776092775', form.subject)
      formData.append('entry.2127724635', form.message)

      await fetch(
        'https://docs.google.com/forms/d/e/1FAIpQLSdO-2ZSZHM1GH9KtZvQnBfba5JKAsvZXJLvaFP4RQLIassPhA/formResponse',
        {
          method: 'POST',
          mode: 'no-cors',
          body: formData,
        },
      )

      setStatus('success')
      setForm(initialForm)
    } catch (err) {
      console.error(err)
      setStatus('idle')
      setError(section.failureMessage)
    }
  }

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <SectionHeader
          eyebrow={section.eyebrow}
          title={section.title}
          copy={section.copy}
        />

        <div className="contact-grid">
          <aside className="contact-panel">
            <span className="availability">{section.availability}</span>

            <h3>{section.panelTitle}</h3>

            <a href={`mailto:${profile.email}`}>
              <FiMail />
              {profile.email}
            </a>

            <a
              href={profile.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.location)}`}
              target="_blank"
              rel="noreferrer"
            >
              <FiMapPin />
              {profile.location}
            </a>

            <div className="hero-socials">
              {socials.map((social) => {
                const Icon = getIcon(social.icon)

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target={
                      social.href.startsWith('mailto:')
                        ? undefined
                        : '_blank'
                    }
                    rel="noreferrer"
                    aria-label={social.label}
                  >
                    <Icon />
                  </a>
                )
              })}
            </div>
          </aside>

          <form className="contact-form" onSubmit={submit}>
            <label>
              <span>{section.fields.name}</span>

              <input
                name="name"
                value={form.name}
                onChange={update}
                autoComplete="name"
                required
              />
            </label>

            <label>
              <span>{section.fields.email}</span>

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={update}
                autoComplete="email"
                required
              />
            </label>

            <label>
              <span>{section.fields.subject}</span>

              <input
                name="subject"
                value={form.subject}
                onChange={update}
                required
              />
            </label>

            <label>
              <span>{section.fields.message}</span>

              <textarea
                name="message"
                rows="5"
                value={form.message}
                onChange={update}
                required
              />
            </label>

            {error && (
              <p className="form-error">
                {error}
              </p>
            )}

            {status === 'success' && (
              <p className="form-success">
                <FiCheck />
                {section.successMessage}
              </p>
            )}

            <MagneticButton
              type="submit"
              className="primary"
              disabled={status === 'loading'}
            >
              {status === 'loading'
                ? <FiLoader className="spin" />
                : <FiSend />
              }

              {status === 'loading'
                ? 'Sending...'
                : section.submitLabel}
            </MagneticButton>
          </form>
        </div>
      </div>
    </section>
  )
}
