<<<<<<< HEAD
import { useEffect, useState } from 'react'

const API_BASE = 'http://localhost:8000/api'

const Gallery = () => {
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

  return (
    <div className="gallery-page">
      <section className="page-header">
        <h1>Gallery</h1>
        <p>Images of our projects and activities, grouped by category.</p>
      </section>

      {loading ? (
        <p>Loading gallery...</p>
      ) : (
        categories.map((category) => (
          <div key={category.id} className="category-group">
            <h2>{category.name}</h2>
            <div className="gallery-grid">
              {category.images.length === 0 ? (
                <p>No images in this category yet.</p>
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
    </div>
  )
}

export default Gallery
=======

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Gallery.css';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const categories = [
  { label: 'Community Development', value: 'Community' },
  { label: 'Climate & Environment', value: 'Environment' },
  { label: 'Education & Youth', value: 'Education' },
  { label: 'Women & Social Welfare', value: 'Social Welfare' },
  { label: 'Water & Sanitation', value: 'Water & Sanitation' },
  { label: 'Disaster Relief', value: 'Disaster Relief' },
];

const normalizeCategory = (value) =>
  String(value ?? '').trim().toLowerCase();

// Match Navbar category values with the full names stored in the database.
const categoryAliases = {
  community: 'community development',
  'community development': 'community development',

  environment: 'climate & environment',
  'climate & environment': 'climate & environment',

  education: 'education & youth',
  'education & youth': 'education & youth',

  'social welfare': 'women & social welfare',
  'women & social welfare': 'women & social welfare',

  'water & sanitation': 'water & sanitation',

  'disaster relief': 'disaster relief',
};

const getCanonicalCategory = (value) => {
  const normalized = normalizeCategory(value);
  return categoryAliases[normalized] || normalized;
};

const Gallery = () => {
  const [searchParams] = useSearchParams();

  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const requestedCategory = searchParams.get('category')?.trim() || '';

  const activeCategory =
    categories.find(
      (category) =>
        getCanonicalCategory(category.value) ===
        getCanonicalCategory(requestedCategory)
    )?.label || 'All Photos';

  // Fetch published gallery images from the API.
  useEffect(() => {
    const controller = new AbortController();

    const fetchGallery = async () => {
      try {
        setLoading(true);
        setError('');
        setSelectedImage(null);

        const response = await fetch(`${API_BASE_URL}/gallery/`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Unable to load gallery. Server returned ${response.status}.`
          );
        }

        const data = await response.json();
        const results = Array.isArray(data) ? data : data.results;

        if (!Array.isArray(results)) {
          throw new Error(
            'The gallery API returned an unexpected response.'
          );
        }

        setGalleryImages(results);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load gallery.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchGallery();

    return () => controller.abort();
  }, []);

  // Filter images using matching category names.
  const filteredGalleryImages = requestedCategory
    ? galleryImages.filter(
        (item) =>
          getCanonicalCategory(item.category_name || item.category)
          === getCanonicalCategory(requestedCategory)
      )
    : galleryImages;

  // Scroll to the gallery when a category is selected.
  useEffect(() => {
    if (!requestedCategory) return;

    const timer = window.setTimeout(() => {
      document.getElementById('gallery-photos')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 200);

    return () => window.clearTimeout(timer);
  }, [requestedCategory]);

  // Find the selected image position in the filtered list.
  const selectedIndex = selectedImage
    ? filteredGalleryImages.findIndex(
        (item) => item.id === selectedImage.id
      )
    : -1;

  const showPreviousImage = () => {
    if (!filteredGalleryImages.length || selectedIndex < 0) return;

    const previousIndex =
      (selectedIndex - 1 + filteredGalleryImages.length) %
      filteredGalleryImages.length;

    setSelectedImage(filteredGalleryImages[previousIndex]);
  };

  const showNextImage = () => {
    if (!filteredGalleryImages.length || selectedIndex < 0) return;

    const nextIndex =
      (selectedIndex + 1) % filteredGalleryImages.length;

    setSelectedImage(filteredGalleryImages[nextIndex]);
  };

  // Lightbox keyboard controls.
  useEffect(() => {
    if (!selectedImage) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedImage(null);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showPreviousImage();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        showNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage, filteredGalleryImages]);

  return (
    <main className="gallery-page">

      {/* Gallery Hero */}
      <section className="gallery-hero" id="gallery">
        <div className="gallery-container">
          <span className="gallery-eyebrow">
            MOMENTS THAT MATTER
          </span>

          <h1>Our Gallery</h1>

          <p>
            Explore images that represent community life, learning,
            environmental awareness, and the spirit of working together.
          </p>

          <a href="#gallery-photos" className="gallery-hero-button">
            Explore Photos ↓
          </a>
        </div>
      </section>

      {/* Gallery Introduction */}
      <section className="gallery-intro" id="gallery-introduction">
        <div className="gallery-container">
          <h2>Stories Through Pictures</h2>

          <p>
            Every picture can tell a story. Select any image to view it
            in a larger preview.
          </p>
        </div>
      </section>

      {/* Gallery Listing */}
      <section className="gallery-listing" id="gallery-photos">
        <div className="gallery-container">

          <div className="gallery-heading">
            <div>
              <span className="gallery-eyebrow">
                EXPLORE OUR GALLERY
              </span>

              <h2>
                {activeCategory === 'All Photos'
                  ? ''
                  : `${activeCategory} Photos`}
              </h2>
            </div>

            <span className="gallery-count">
              {loading
                ? 'Loading…'
                : `${filteredGalleryImages.length} ${
                    filteredGalleryImages.length === 1
                      ? 'photo'
                      : 'photos'
                  }`}
            </span>
          </div>

          {/* Loading State */}
          {loading && (
            <p className="gallery-status" role="status">
              Loading photos from SOCCODO…
            </p>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="gallery-status gallery-error" role="alert">
              <p>{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Gallery Images */}
          {!loading && !error && filteredGalleryImages.length > 0 && (
            <div className="gallery-grid">
              {filteredGalleryImages.map((item) => (
                <button
                  className="gallery-card"
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedImage(item)}
                  aria-label={`Preview image: ${item.title}`}
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.alt_text || item.title}
                      loading="lazy"
                    />
                  ) : (
                    <span
                      className="gallery-image-placeholder"
                      role="img"
                      aria-label="No image uploaded"
                    >
                      SOCCODO
                    </span>
                  )}

                  <span className="gallery-card-overlay">
                    <span className="gallery-card-category">
                      {item.category}
                    </span>

                    <span className="gallery-card-title">
                      {item.title}
                    </span>

                    <span
                      className="gallery-view-icon"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredGalleryImages.length === 0 && (
            <p className="gallery-status">
              {requestedCategory
                ? `No published photos are available in ${activeCategory}.`
                : 'No photos have been published yet. Please check back soon.'}
            </p>
          )}

        </div>
      </section>

      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Image preview: ${selectedImage.title}`}
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="gallery-lightbox-close"
            type="button"
            aria-label="Close image preview"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>

          <button
            className="gallery-lightbox-nav gallery-lightbox-previous"
            type="button"
            aria-label="Previous image"
            onClick={(event) => {
              event.stopPropagation();
              showPreviousImage();
            }}
          >
            ‹
          </button>

          <div
            className="gallery-lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            {selectedImage.image_url && (
              <img
                src={selectedImage.image_url}
                alt={selectedImage.alt_text || selectedImage.title}
              />
            )}

            <div className="gallery-lightbox-caption">
              <span>{selectedImage.category_name || selectedImage.category}</span>

              <h2>{selectedImage.title}</h2>

              {selectedImage.caption && (
                <p>{selectedImage.caption}</p>
              )}

              <p>
                Image {selectedIndex + 1} of {filteredGalleryImages.length}
              </p>
            </div>
          </div>

          <button
            className="gallery-lightbox-nav gallery-lightbox-next"
            type="button"
            aria-label="Next image"
            onClick={(event) => {
              event.stopPropagation();
              showNextImage();
            }}
          >
            ›
          </button>
        </div>
      )}

    </main>
  );
};

export default Gallery;
>>>>>>> 1f78563f2196f66bdd04770135321f7e5fc3b148
