
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Events.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();

  const selectedStatus = searchParams.get('status') || 'all';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`${API_BASE_URL}/events/`);

        if (!response.ok) {
          throw new Error('Unable to load events.');
        }

        const data = await response.json();
        setEvents(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents =
    selectedStatus === 'all'
      ? events
      : events.filter(
          (event) => event.status?.toLowerCase() === selectedStatus
        );

  const formatDate = (date) => {
    if (!date) return '';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return '';

    return parsedDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Convert relative media URLs into absolute URLs.
  const getMediaUrl = (url) => {
    if (!url) return null;

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    const baseUrl = API_BASE_URL.replace(/\/api\/?$/, '');

    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const getImageUrl = (event) => getMediaUrl(event.image_url);

  // Extract the YouTube video ID from supported YouTube URL formats.
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;

    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname.replace(/^www\./, '');

      let videoId = null;

      if (hostname === 'youtu.be') {
        videoId = parsedUrl.pathname.split('/')[1];
      } else if (
        hostname === 'youtube.com' ||
        hostname === 'm.youtube.com' ||
        hostname === 'youtube-nocookie.com'
      ) {
        if (parsedUrl.pathname === '/watch') {
          videoId = parsedUrl.searchParams.get('v');
        } else {
          const parts = parsedUrl.pathname.split('/').filter(Boolean);

          if (['embed', 'shorts', 'live'].includes(parts[0])) {
            videoId = parts[1];
          }
        }
      }

      if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return null;
      }

      return `https://www.youtube-nocookie.com/embed/${videoId}`;
    } catch {
      return null;
    }
  };

  const pageTitle = {
    all: 'All Events',
    upcoming: 'Upcoming Events',
    ongoing: 'Ongoing Events',
    past: 'Past Events',
  };

  const renderEventMedia = (event) => {
    const uploadedVideo = getMediaUrl(event.video_url);
    const youtubeVideo = getYouTubeEmbedUrl(event.youtube_url);
    const image = getImageUrl(event);

    // Uploaded video takes priority.
    if (uploadedVideo) {
      return (
        <video
          className="event-video"
          controls
          preload="metadata"
          playsInline
        >
          <source src={uploadedVideo} />
          Your browser does not support video playback.
        </video>
      );
    }

    // Display YouTube video if no uploaded video exists.
    if (youtubeVideo) {
      return (
        <iframe
          className="event-youtube-video"
          src={youtubeVideo}
          title={`${event.title} video`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      );
    }

    // Keep the existing image functionality.
    if (image) {
      return (
        <img
          src={image}
          alt={event.image_alt || event.title}
          className="event-image"
          loading="lazy"
        />
      );
    }

    return (
      <div className="event-image-placeholder">
        SOCCODO
      </div>
    );
  };

  return (
    <main className="events-page">
      <section className="events-hero">
        <div className="events-hero-content">
          <span className="events-eyebrow">BE PART OF THE CHANGE</span>
          <h1>Our Events & Activities</h1>
          <p>
            Discover the events, initiatives and activities through which
            SOCCODO brings communities together and creates lasting impact.
          </p>
        </div>
      </section>

      <section className="events-container" id="events-list">
        <div className="events-heading">
          <div>
            <span className="events-section-label">OUR PROGRAMMES</span>
            <h2>{pageTitle[selectedStatus] || 'All Events'}</h2>
            <p>
              Explore our community engagements, programmes and milestones.
            </p>
          </div>

          {!loading && !error && (
            <span className="events-count">
              {filteredEvents.length}{' '}
              {filteredEvents.length === 1 ? 'Event' : 'Events'}
            </span>
          )}
        </div>

        {loading && (
          <div className="events-message">Loading events...</div>
        )}

        {error && (
          <div className="events-message events-error">{error}</div>
        )}

        {!loading && !error && filteredEvents.length === 0 && (
          <div className="events-message">
            <h3>No events found</h3>
            <p>There are currently no events in this category.</p>
          </div>
        )}

        {!loading && !error && filteredEvents.length > 0 && (
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <article className="event-card" key={event.id}>
                <div className="event-image-wrapper">
                  {renderEventMedia(event)}

                  <span className={`event-status ${event.status}`}>
                    {event.status}
                  </span>
                </div>

                <div className="event-content">
                  <span className="event-category">
                    {event.category}
                  </span>

                  <h3>{event.title}</h3>

                  <p className="event-description">
                    {event.description}
                  </p>

                  <div className="event-details">
                    <div className="event-detail">
                      <span>📅</span>
                      <span>
                        {formatDate(event.start_at)}
                        {event.end_at &&
                          event.end_at !== event.start_at &&
                          ` - ${formatDate(event.end_at)}`}
                      </span>
                    </div>

                    <div className="event-detail">
                      <span>📍</span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Events;
