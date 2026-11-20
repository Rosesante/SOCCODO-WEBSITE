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

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const getImageUrl = (event) => {
    if (!event.image_url) return null;

    return event.image_url.startsWith('http')
      ? event.image_url
      : `${API_BASE_URL.replace('/api', '')}${event.image_url}`;
  };

  const pageTitle = {
    all: 'All Events',
    upcoming: 'Upcoming Events',
    ongoing: 'Ongoing Events',
    past: 'Past Events',
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
              {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'}
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
                  {getImageUrl(event) ? (
                    <img
                      src={getImageUrl(event)}
                      alt={event.image_alt || event.title}
                      className="event-image"
                    />
                  ) : (
                    <div className="event-image-placeholder">
                      SOCCODO
                    </div>
                  )}

                  <span className={`event-status ${event.status}`}>
                    {event.status}
                  </span>
                </div>

                <div className="event-content">
                  <span className="event-category">{event.category}</span>

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