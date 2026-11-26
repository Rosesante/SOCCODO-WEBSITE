<<<<<<< HEAD
import { useEffect, useState } from 'react'

const API_BASE = 'http://localhost:8000/api'

const Home = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE}/gallery/by-category/`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const featured = categories.flatMap((cat) =>
    cat.images.filter((img) => img.is_featured)
  )

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>SOCCODO</h1>
          <p>Social, Climate and Community Development Organization</p>
          <p>Empowering communities. Creating sustainable change.</p>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="featured">
          <h2>Featured</h2>
          <div className="gallery-grid">
            {featured.map((image) => (
              <figure key={image.id} className="gallery-item">
                <img src={image.image_url} alt={image.title} loading="lazy" />
                <figcaption>{image.title}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="gallery-by-category">
        <h2>Gallery</h2>
        {loading ? (
          <p>Loading gallery...</p>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="category-group">
              <h3>{category.name}</h3>
              <div className="gallery-grid">
                {category.images.length === 0 ? (
                  <p>No images yet.</p>
                ) : (
                  category.images.map((image) => (
                    <figure key={image.id} className="gallery-item">
                      <img src={image.image_url} alt={image.title} loading="lazy" />
                      <figcaption>{image.title}</figcaption>
                    </figure>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
=======
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

import Ardhi from '../assets/Ardhi.jpg'
import Ardhi5 from '../assets/Ardhi5.jpg'
import Ardhi6 from '../assets/Ardhi6.jpg'
import Ardhi7 from '../assets/Ardhi7.jpg'

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'
).replace(/\/+$/, '')

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/i, '')

const focusAreas = [
  {
    id: 'community',
    number: '01',
    title: 'Community Development',
    description:
      'Encouraging community participation and sustainable solutions to local development challenges.',
  },
  {
    id: 'education',
    number: '02',
    title: 'Education & Youth',
    description:
      'Promoting education, skills development, and opportunities for young people.',
  },
  {
    id: 'environment',
    number: '03',
    title: 'Climate & Environment',
    description:
      'Supporting environmental awareness, climate action, and sustainable natural resource management.',
  },
  {
    id: 'women',
    number: '04',
    title: 'Women & Social Welfare',
    description:
      'Encouraging inclusion, empowerment, and the wellbeing of vulnerable community members.',
  },
  {
    id: 'water',
    number: '05',
    title: 'Water & Sanitation',
    description:
      'Promoting safe water, sanitation, and the protection of community water sources.',
  },
  {
    id: 'disaster',
    number: '06',
    title: 'Disaster Response',
    description:
      'Supporting community preparedness, resilience, and responses to emergencies.',
  },
]

const heroImages = [
  { id: 'community', src: Ardhi, alt: 'Community development activities' },
  { id: 'education', src: Ardhi5, alt: 'Education and youth development' },
  { id: 'environment', src: Ardhi6, alt: 'Environmental protection activities' },
  { id: 'social-welfare', src: Ardhi7, alt: 'Community social welfare activities' },
]

// Find the image URL using common Django serializer field names.
const getImagePath = (item) => {
  const value =
    item?.image ??
    item?.image_url ??
    item?.photo ??
    item?.photo_url ??
    item?.file ??
    ''

  if (typeof value === 'string') return value
  if (value && typeof value === 'object') {
    return value.url || value.image || ''
  }

  return ''
}

// Convert Django image paths into browser-accessible URLs.
const getGalleryImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') return ''

  const path = imagePath.trim()
  if (!path) return ''

  if (/^(https?:)?\/\//i.test(path)) {
    return path.startsWith('//')
      ? `${window.location.protocol}${path}`
      : path
  }

  if (path.startsWith('/')) {
    return `${API_ORIGIN}${path}`
  }

  if (path.startsWith('media/')) {
    return `${API_ORIGIN}/${path}`
  }

  return `${API_ORIGIN}/media/${path}`
}

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0)
  const [galleryImages, setGalleryImages] = useState([])
  const [galleryLoading, setGalleryLoading] = useState(true)
  const [galleryError, setGalleryError] = useState(false)

  // Automatically rotate the hero images every six seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroImages.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  // Fetch gallery images from Django.
  useEffect(() => {
    const controller = new AbortController()

    const fetchGalleryImages = async () => {
      try {
        setGalleryLoading(true)
        setGalleryError(false)

        const response = await fetch(`${API_BASE_URL}/gallery/`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Gallery request failed: ${response.status}`)
        }

        const data = await response.json()

        const images = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : Array.isArray(data?.images)
              ? data.images
              : Array.isArray(data?.data)
                ? data.data
                : []

        setGalleryImages(images)
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Homepage gallery error:', error)
          setGalleryError(true)
        }
      } finally {
        if (!controller.signal.aborted) {
          setGalleryLoading(false)
        }
      }
    }

    fetchGalleryImages()

    return () => controller.abort()
  }, [])

  const showPreviousSlide = () => {
    setActiveSlide(
      (current) => (current - 1 + heroImages.length) % heroImages.length
    )
  }

  const showNextSlide = () => {
    setActiveSlide((current) => (current + 1) % heroImages.length)
  }

  return (
    <main className="home-page">
      {/* HERO SLIDESHOW */}
      <section className="home-hero" id="home">
        <div className="hero-slides" aria-hidden="true">
          {heroImages.map((image, index) => (
            <div
              key={image.id}
              className={`hero-slide ${index === activeSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url("${image.src}")` }}
            />
          ))}
        </div>
        <div className="hero-overlay">
          <div className="home-container hero-content">
            <span className="hero-label">
              SOCIAL • CLIMATE • COMMUNITY
            </span>
            <h1>
              Building Stronger Communities for a
              <span> Better Tomorrow</span>
            </h1>
            <p>
              Working together for inclusive communities, sustainable
              development, and a better future for people and the environment.
            </p>
            <div className="hero-actions">
              <a href="#about" className="home-button primary-button">
                Discover SOCCODO
              </a>
              <a href="#what-we-do" className="home-button outline-button">
                Explore What We Do
              </a>
            </div>
            <div className="hero-controls" aria-label="Hero image navigation">
              <button
                type="button"
                onClick={showPreviousSlide}
                aria-label="Previous slide"
              >
                ←
              </button>

              {heroImages.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  className={index === activeSlide ? 'active' : ''}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show slide ${index + 1}`}
                  aria-current={index === activeSlide ? 'true' : undefined}
                />
              ))}

              <button
                type="button"
                onClick={showNextSlide}
                aria-label="Next slide"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* WHO WE ARE */}
      <section className="home-about section-padding" id="about">
        <div className="home-container about-grid">
          <div className="about-heading">
            <span className="section-label">WHO WE ARE</span>
            <h2>Working Together for Lasting Community Change</h2>
          </div>
          <div className="about-description">
            <p>
              SOCCODO stands for Social, Climate and Community Development
              Organization. Our focus is on community development, social
              wellbeing, environmental responsibility, and sustainable solutions.
            </p>
            <a href="#mission" className="text-link">
              Learn About Our Mission <span>→</span>
            </a>
          </div>
        </div>
      </section>
      {/* MISSION, VISION AND VALUES */}
      <section className="home-principles section-padding" id="mission">
        <div className="home-container">
          <div className="section-heading">
            <span className="section-label">OUR FOUNDATION</span>
            <h2>What Guides Our Work</h2>
            <p>
              Our work is guided by a commitment to people, communities, and a
              sustainable environment.
            </p>
          </div>
          <div className="principles-grid">
            <article className="principle-card">
              <div className="principle-icon">◎</div>
              <h3>Our Mission</h3>
              <p>
                To contribute to inclusive social and community development
                while promoting environmental responsibility and sustainable
                livelihoods.
              </p>
            </article>
            <article className="principle-card" id="vision">
              <div className="principle-icon">↗</div>
              <h3>Our Vision</h3>
              <p>
                Communities that are empowered, inclusive, resilient, and able
                to pursue sustainable development opportunities.
              </p>
            </article>
            <article className="principle-card" id="values">
              <div className="principle-icon">✳</div>
              <h3>Our Values</h3>
              <p>
                Inclusion, integrity, accountability, collaboration, community
                participation, and sustainability.
              </p>
            </article>
          </div>
        </div>
      </section>
      {/* WHAT WE DO */}
      <section className="home-focus section-padding" id="what-we-do">
        <div className="home-container">
          <div className="section-heading">
            <span className="section-label">WHAT WE DO</span>
            <h2>Our Areas of Focus</h2>
            <p>
              Explore the areas where community-centered initiatives can support
              social progress and environmental sustainability.
            </p>
          </div>
          <div className="focus-grid">
            {focusAreas.map((area) => (
              <article className="focus-card" key={area.id}>
                <span className="focus-number">{area.number}</span>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
                <a href="#contact" className="focus-link">
                  Learn More <span>→</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
      {/* OUR APPROACH */}
      <section className="home-approach section-padding" id="team">
        <div className="home-container approach-grid">
          <div className="approach-content">
            <span className="section-label">OUR APPROACH</span>
            <h2>Change Begins With Communities</h2>
            <p>
              Sustainable development starts by listening to communities,
              understanding local challenges, and working together to find
              practical solutions.
            </p>
            <a href="#contact" className="home-button primary-button">
              Work With Us
            </a>
          </div>
          <div className="approach-highlight">
            <span className="highlight-symbol">“</span>
            <h3>Stronger communities. Sustainable futures.</h3>
            <p>Working together to create meaningful and lasting change.</p>
          </div>
        </div>
      </section>
      {/* NEWS AND STORIES */}
      <section className="home-news section-padding" id="news">
        <div className="home-container news-content">
          <div>
            <span className="section-label">NEWS &amp; STORIES</span>
            <h2>Stories From Our Communities</h2>
            <p>
              Discover updates, activities, and community stories as verified
              SOCCODO news and publications become available.
            </p>
          </div>
          <a href="#contact" className="home-button primary-button">
            Stay Connected
          </a>
        </div>
      </section>
      {/* HOMEPAGE GALLERY PREVIEW */}
      <section className="home-gallery section-padding" id="gallery">
        <div className="home-container gallery-content">
          <span className="section-label">OUR GALLERY</span>
          <h2>Moments That Matter</h2>
          <p>
            A glimpse of our community activities and the difference
            we are working together to make.
          </p>

          {galleryLoading && (
            <p role="status">Loading photos...</p>
          )}

          {!galleryLoading && galleryError && (
            <p>Gallery photos are temporarily unavailable.</p>
          )}

          {!galleryLoading &&
            !galleryError &&
            galleryImages.length > 0 && (
              <>
                <div className="homepage-gallery-grid">
                  {galleryImages.slice(0, 4).map((image, index) => {
                    const imageUrl = getGalleryImageUrl(
                      image.image || image.image_url || image.photo
                    )

                    const shortCaption =
                      image.caption ||
                      image.title ||
                      'A moment from SOCCODO community activities'

                    return (
                      <Link
                        to="/gallery"
                        className="homepage-gallery-card"
                        key={image.id ?? index}
                        aria-label={`View gallery: ${shortCaption}`}
                      >
                        <img
                          src={imageUrl}
                          alt={image.alt_text || image.title || shortCaption}
                          loading="lazy"
                        />

                        <div className="homepage-gallery-caption">
                          <p>{shortCaption}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>

                <div className="homepage-gallery-action">
                  <Link
                    to="/gallery"
                    className="home-button primary-button"
                  >
                    Explore Our Gallery →
                  </Link>
                </div>
              </>
            )}

          {!galleryLoading &&
            !galleryError &&
            galleryImages.length === 0 && (
              <p>No gallery photos are available yet.</p>
            )}
        </div>
      </section>


      {/* CONTACT */}
      <section className="home-contact section-padding" id="contact">
        <div className="home-container contact-content">
          <span className="section-label">GET INVOLVED</span>
          <h2>Let's Build Better Communities Together</h2>
          <p>
            Interested in community development or exploring a potential
            partnership? Connect with SOCCODO.
          </p>
          <Link to="/contact" className="btn btn-primary">
            Contact SOCCODO
          </Link>
        </div>
      </section>
    </main>
>>>>>>> 1f78563f2196f66bdd04770135321f7e5fc3b148
  )
}

export default Home
