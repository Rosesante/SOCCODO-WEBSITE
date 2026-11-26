import React, { useState, useEffect } from 'react'
import './Contact.css'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

const supportOptions = [
  'Donation',
  'Volunteer',
  'Partnership',
  'Supplies',
  'Other Support',
]


const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    supportType: '',
    message: '',
  })

  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))

    setStatus('')
  }

  useEffect(() => {
    if (!status) return

    const timer = setTimeout(() => {
      setStatus('')
    }, 4000)

    return () => clearTimeout(timer)
  }, [status])

  const handleSubmit = async (event) => {
    event.preventDefault()

    setStatus('')
    setIsSubmitting(true)

    const payload = {
      full_name: formData.fullName.trim(),
      email: formData.email.trim(),
      support_type: formData.supportType,
      message: formData.message.trim(),
    }

    try {
      const response = await fetch(`${API_BASE_URL}/contact/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        const errorMessage = Object.entries(data)
          .map(([field, errors]) => {
            const messages = Array.isArray(errors)
              ? errors.join(' ')
              : String(errors)

            return `${field}: ${messages}`
          })
          .join(' ')

        throw new Error(
          errorMessage || 'Unable to send your message. Please try again.'
        )
      }

      setStatus('Your message has been sent successfully! Thank you for contacting SOCCODO.')

      setFormData({
        fullName: '',
        email: '',
        supportType: '',
        message: '',
      })
    } catch (error) {
      setStatus(
        error.message ||
          'Unable to send your message. Please check your connection and try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-container">
          <span className="contact-eyebrow">
            WE WOULD LOVE TO HEAR FROM YOU
          </span>
          <h1>Contact Us</h1>
          <p>
            Have a question, idea, or interest in working with SOCCODO?
            Reach out and let us start a conversation.
          </p>
        </div>
      </section>

      <section className="contact-main">
        <div className="contact-container">
          <div className="contact-heading">
            <span className="contact-eyebrow">GET IN TOUCH</span>
            <h2>Let's Connect</h2>
            <p>
              Contact us to learn more about our organization, community
              development interests, and opportunities to collaborate.
            </p>
          </div>

          <div className="contact-layout">
            <aside className="contact-information">
              <h3>Contact Information</h3>
              <p className="contact-information-intro">
                Choose a contact method or send us a message using the form.
              </p>

              <div className="contact-detail">
                <span className="contact-detail-icon" aria-hidden="true">
                  @
                </span>
                <div>
                  <h4>Email</h4>
                  <p>info@soccodo.or.tz</p>
                </div>
              </div>

              <div className="contact-detail">
                <span className="contact-detail-icon" aria-hidden="true">
                  T
                </span>
                <div>
                  <h4>Phone</h4>
                  <p>+255 684 247 713</p>
                  <p>+255 752 409 990</p>
                </div>
              </div>

              <div className="contact-detail">
                <span className="contact-detail-icon" aria-hidden="true">
                  +
                </span>
                <div>
                  <h4>Location</h4>
                  <p> Songwe Region, Tanzania</p>
                </div>
              </div>

              <div className="contact-side-note">
                <h4>Let's work together</h4>
                <p>
                  We welcome genuine inquiries and opportunities to
                  collaborate for positive community development.
                </p>
              </div>
            </aside>

            <div className="contact-form-wrapper">
              <h3>Send Us a Message</h3>
              <p className="contact-form-intro">
                Tell us a little about yourself and how we can connect.
              </p>

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form-row">
                  <div className="contact-field">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className="contact-field">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="contact-field">
                  <label htmlFor="supportType">
                    How Would You Like to Support SOCCODO?
                  </label>
                  <select
                    id="supportType"
                    name="supportType"
                    value={formData.supportType}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select a way to support us
                    </option>

                    {supportOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="contact-field">
                  <label htmlFor="message">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  className="contact-submit"
                  type="submit"
                  disabled={isSubmitting}
                 >
                  {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                  {!isSubmitting && <span aria-hidden="true"> →</span>}
                </button>

                {status && (
                  <p className="contact-status" role="status">
                    {status}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-location">
       
        <div className="contact-container">
          <span className="contact-eyebrow">OUR LOCATION</span>

          <h2>Based in Tanzania</h2>

          <p>
            SOCCODO primarily operates its field activities and community
            training programs within Songwe Region, Tanzania.
          </p>

          <div className="contact-location-panel">
            <span aria-hidden="true">⌖</span>

            <h3>Songwe Region</h3>

            <p>Tanzania</p>
          </div>
        </div>

      </section>

    </main>
  )
}

export default Contact