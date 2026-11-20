
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './Success-stories.css';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const categories = [
  'All Stories',
  'Community Development',
  'Climate & Environment',
  'Education & Youth',
  'Women & Social Welfare',
  'Water & Sanitation',
  'Disaster Relief',
];

// Normalize category names to make matching consistent.
const normalizeCategory = (value) =>
  String(value ?? '').trim().toLowerCase();

// Match short Navbar values with full database category names.
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

const formatDate = (date) => {
  if (!date) return 'SOCCODO Story';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'SOCCODO Story';
  }

  return parsedDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const SuccessStories = () => {
  const [searchParams] = useSearchParams();

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStory, setSelectedStory] = useState(null);

  // Read the selected category from the Navbar URL.
  const requestedCategory = searchParams.get('category')?.trim() || '';

  const canonicalRequestedCategory =
    getCanonicalCategory(requestedCategory);

  const activeCategory =
    categories.find(
      (category) =>
        category !== 'All Stories' &&
        getCanonicalCategory(category) === canonicalRequestedCategory
    ) || 'All Stories';

  // Fetch stories from the Django API.
  useEffect(() => {
    const controller = new AbortController();

    const fetchStories = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`${API_BASE_URL}/stories/`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Unable to load stories. Server returned ${response.status}.`
          );
        }

        const data = await response.json();

        // Supports both a normal list and a paginated API response.
        const results = Array.isArray(data) ? data : data.results;

        if (!Array.isArray(results)) {
          throw new Error(
            'The stories API returned an unexpected response.'
          );
        }

        setStories(results);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(
            err.message || 'Unable to load stories. Please try again.'
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchStories();

    return () => controller.abort();
  }, []);

  // Filter stories using the category aliases.
  const filteredStories = !requestedCategory
    ? stories
    : stories.filter(
        (story) =>
          getCanonicalCategory(story.category) ===
          canonicalRequestedCategory
      );

  // Scroll to the stories section when a category is selected.
  useEffect(() => {
    if (!requestedCategory) return;

    const timer = window.setTimeout(() => {
      document.getElementById('latest-stories')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 150);

    return () => window.clearTimeout(timer);
  }, [requestedCategory]);

  // Handle story modal and Escape key.
  useEffect(() => {
    if (!selectedStory) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedStory(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedStory]);

  return (
    <main className="news-page">

      {/* HERO SECTION */}
      <section className="news-hero" id="success-stories">
        <div className="news-container news-hero-content">
          <span className="news-eyebrow">
            OUR COMMUNITY IMPACT
          </span>

          <h2>Success Stories</h2>

          <p>
            Discover stories of community progress, positive change, and
            the difference that community development initiatives can make.
          </p>

          <a href="#latest-stories" className="news-hero-button">
            Explore Stories <span>↓</span>
          </a>
        </div>
      </section>

      {/* INTRODUCTION SECTION */}
      <section className="news-intro" id="story-introduction">
        <div className="news-container">
          <span className="news-eyebrow">STAY INFORMED</span>

          <h2>Success Stories</h2>

          <p>
            Discover SOCCODO activities, community experiences, and
            published stories about our work and its impact.
          </p>
        </div>
      </section>

      {/* STORIES LISTING */}
      <section className="news-listing" id="latest-stories">
        <div className="news-container">

          <div className="news-listing-heading">
            <div>
              <span className="news-eyebrow">
                EXPLORE OUR IMPACT
              </span>

              <h2>
                {activeCategory === 'All Stories'
                  ? 'Inspiring Success Stories'
                  : `${activeCategory} Stories`}
              </h2>

              <p>
                Discover SOCCODO activities, community experiences, and
                published stories about our work and its impact.
              </p>
            </div>

            <span className="news-story-count">
              {loading
                ? 'Loading...'
                : `${filteredStories.length} ${
                    filteredStories.length === 1 ? 'Story' : 'Stories'
                  }`}
            </span>
          </div>

          {/* LOADING MESSAGE */}
          {loading && (
            <p className="news-status" role="status">
              Loading stories from SOCCODO…
            </p>
          )}

          {/* ERROR MESSAGE */}
          {!loading && error && (
            <div className="news-status news-error" role="alert">
              <p>{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          )}

          {/* STORY CARDS */}
          {!loading && !error && filteredStories.length > 0 && (
            <div className="news-grid">
              {filteredStories.map((story) => (
                <article className="news-card" key={story.id}>

                  <div className="news-card-image">
                    {story.image_url ? (
                      <img
                        src={story.image_url}
                        alt={story.image_alt || story.title}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="news-image-placeholder"
                        role="img"
                        aria-label="No story image available"
                      >
                        SOCCODO
                      </div>
                    )}

                    <span className="news-card-category">
                      {story.category}
                    </span>
                  </div>

                  <div className="news-card-content">
                    <span className="news-card-date">
                      {formatDate(story.published_at)}
                    </span>

                    <h3>{story.title}</h3>

                    <p>{story.excerpt}</p>

                    <button
                      className="news-read-more news-read-more-button"
                      type="button"
                      onClick={() => setSelectedStory(story)}
                      aria-label={`Read full story: ${story.title}`}
                    >
                      Read Full Story{' '}
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>

                </article>
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && !error && filteredStories.length === 0 && (
            <p className="news-status">
              {stories.length === 0
                ? 'No stories have been published yet. Please check back soon.'
                : `No stories are available in ${activeCategory} yet.`}
            </p>
          )}

        </div>
      </section>

      {/* FULL STORY MODAL */}
      {selectedStory && (
        <div
          className="news-story-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="news-story-modal-title"
          onClick={() => setSelectedStory(null)}
        >
          <button
            className="news-story-modal-close"
            type="button"
            aria-label="Close story"
            onClick={() => setSelectedStory(null)}
          >
            ×
          </button>

          <article
            className="news-story-modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            {selectedStory.image_url && (
              <img
                className="news-story-modal-image"
                src={selectedStory.image_url}
                alt={selectedStory.image_alt || selectedStory.title}
              />
            )}

            <div className="news-story-modal-body">
              <span className="news-story-modal-category">
                {selectedStory.category} ·{' '}
                {formatDate(selectedStory.published_at)}
              </span>

              <h2 id="news-story-modal-title">
                {selectedStory.title}
              </h2>

              <p className="news-story-modal-excerpt">
                {selectedStory.excerpt}
              </p>

              <div className="news-story-modal-full">
                {selectedStory.content
                  ?.split('\n')
                  .filter((paragraph) => paragraph.trim())
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
              </div>

              <button
                type="button"
                className="news-story-modal-done"
                onClick={() => setSelectedStory(null)}
              >
                Close Story
              </button>
            </div>
          </article>
        </div>
      )}

      {/* CALL TO ACTION */}
      <section className="news-cta" id="stories-contact">
        <div className="news-container">
          <span className="news-eyebrow">
            CONNECT WITH SOCCODO
          </span>

          <h2>Be part of positive community change</h2>

          <p>
            Learn more about our organization and the areas of development
            we aim to support.
          </p>

          <div className="news-cta-actions">
            <Link to="/who-we-are" className="news-cta-primary">
              Who We Are
            </Link>

            <Link to="/what-we-do" className="news-cta-secondary">
              What We Do
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
};

export default SuccessStories;
