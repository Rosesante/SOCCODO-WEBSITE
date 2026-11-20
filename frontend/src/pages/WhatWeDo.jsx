
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './WhatWeDo.css'

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'
).replace(/\/$/, '')

const fallbackAreas = [
  {
    id: 'community',
    title: 'Community Development',
    category: 'COMMUNITY',
    description:
      'Supporting community participation, local initiatives, and practical solutions that improve people’s quality of life.',
  },
  {
    id: 'education',
    title: 'Education and Youth Empowerment',
    category: 'EDUCATION',
    description:
      'Encouraging learning, skills development, and opportunities that help young people participate in community progress.',
  },
  {
    id: 'environment',
    title: 'Climate and Environment',
    category: 'ENVIRONMENT',
    description:
      'Promoting environmental awareness, conservation, climate action, and responsible use of natural resources.',
  },
  {
    id: 'women',
    title: 'Women and Social Welfare',
    category: 'SOCIAL WELFARE',
    description:
      'Promoting inclusion, women’s participation, and support for vulnerable community members.',
  },
  {
    id: 'water',
    title: 'Water and Sanitation',
    category: 'WATER',
    description:
      'Encouraging good sanitation practices, protection of water sources, and awareness about clean water.',
  },
  {
    id: 'disaster',
    title: 'Disaster Relief and Community Support',
    category: 'RESILIENCE',
    description:
      'Supporting community preparedness, awareness, and collaborative responses to local emergencies and disasters.',
  },
]

const WhatWeDo = () => {
  const [focusAreas, setFocusAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    const fetchActivities = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/activities/`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Unable to load activities')
        }

        const data = await response.json()
        const activities = Array.isArray(data) ? data : data.results || []

        setFocusAreas(
          activities.map((activity, index) => ({
            ...activity,
            number: String(index + 1).padStart(2, '0'),
            id: activity.id,
            category: activity.category || 'OUR WORK',
            image: activity.image_url,
            imageAlt: activity.image_alt || activity.title,
          })),
        )
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error loading activities:', err)
          setError(true)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchActivities()

    return () => controller.abort()
  }, [])

  return (
    <main className="what-we-do-page">
      {/* Keep your existing Hero, Introduction, Approach and CTA sections */}

      {/* Focus Areas */}
      <section className="what-we-do-focus" id="focus-areas">
        <div className="what-we-do-container">
          <div className="what-we-do-section-heading">
            <span className="what-we-do-eyebrow">
              HOW WE CONTRIBUTE
            </span>

            <h2>Our Focus Areas</h2>

            <p>
              Explore the key areas through which we aim to support
              communities and sustainable development.
            </p>
          </div>

          {loading && (
            <p role="status">Loading our activities...</p>
          )}

          {!loading && error && (
            <p role="alert">
              We could not load our activities. Please try again later.
            </p>
          )}

          {!loading && !error && focusAreas.length === 0 && (
            <p>Our activities will be published here soon.</p>
          )}

          {!loading && !error && focusAreas.length > 0 && (
            <div className="what-we-do-grid">
              {focusAreas.map((area, index) => (
                <article
                  className="what-we-do-card"
                  id={`activity-${area.id}`}
                  key={area.id}
                >
                  <div className="what-we-do-image-wrapper">
                    {area.image ? (
                      <img
                        src={area.image}
                        alt={area.imageAlt}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="what-we-do-image-placeholder"
                        role="img"
                        aria-label="No activity photo uploaded yet"
                      >
                        Photo coming soon
                      </div>
                    )}

                    <span className="what-we-do-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="what-we-do-card-content">
                    <span className="what-we-do-category">
                      {area.category}
                    </span>

                    <h3>{area.title}</h3>

                    <p>{area.description}</p>

                    <span className="what-we-do-card-bottom">
                      Community-focused development
                      <span aria-hidden="true">↗</span>
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Restore your existing Hero, Introduction, Approach and CTA JSX here.
          Keep their original markup and content unchanged. */}
    </main>
  )
}

export default WhatWeDo
