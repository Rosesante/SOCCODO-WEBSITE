import React, { useEffect, useMemo, useState } from 'react';
import adminRequest from '../services/AdminAPI';
import './EventsAdmin.css';

const CATEGORIES = [
  'Community Development',
  'Climate & Environment',
  'Education & Youth',
  'Women & Social Welfare',
  'Water & Sanitation',
  'Disaster Relief',
];

const emptyForm = {
  title: '',
  category: 'Community Development',
  description: '',
  location: '',
  start_at: '',
  end_at: '',
  image_alt: '',
  is_published: false,
};

const formatDateTime = (value) => {
  if (!value) return '';

  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 16);
};

const EventsAdmin = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await adminRequest('/admin/events/');
      setEvents(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err.message || 'Unable to load events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const query = search.toLowerCase();

      const matchesSearch =
        (event.title || '').toLowerCase().includes(query) ||
        (event.location || '').toLowerCase().includes(query) ||
        (event.description || '').toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === 'All' ||
        event.category === categoryFilter;

      const matchesStatus =
        statusFilter === 'All' ||
        event.status === statusFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [events, search, categoryFilter, statusFilter]);

  const openCreateForm = () => {
    setEditingEvent(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview('');
    setError('');
    setSuccess('');
    setShowForm(true);
  };

  const openEditForm = (event) => {
    setEditingEvent(event);

    setForm({
      title: event.title || '',
      category: event.category || 'Community Development',
      description: event.description || '',
      location: event.location || '',
      start_at: formatDateTime(event.start_at),
      end_at: formatDateTime(event.end_at),
      image_alt: event.image_alt || '',
      is_published: event.is_published,
    });

    setImageFile(null);
    setImagePreview(event.image_url || '');
    setError('');
    setSuccess('');
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingEvent(null);
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    if (
      form.start_at &&
      form.end_at &&
      new Date(form.end_at) < new Date(form.start_at)
    ) {
      setError('Event ending time cannot be earlier than starting time.');
      setSaving(false);
      return;
    }

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const endpoint = editingEvent
        ? `/admin/events/${editingEvent.id}/`
        : '/admin/events/';

      await adminRequest(endpoint, {
        method: editingEvent ? 'PATCH' : 'POST',
        body: formData,
      });

      closeForm();
      setSuccess(
        editingEvent
          ? 'Event updated successfully.'
          : 'Event created successfully.'
      );

      await fetchEvents();
    } catch (err) {
      setError(err.message || 'Unable to save event.');
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (event) => {
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('is_published', String(!event.is_published));

    try {
      await adminRequest(`/admin/events/${event.id}/`, {
        method: 'PATCH',
        body: formData,
      });

      setEvents((previous) =>
        previous.map((item) =>
          item.id === event.id
            ? { ...item, is_published: !item.is_published }
            : item
        )
      );

      setSuccess(
        event.is_published
          ? 'Event moved to drafts.'
          : 'Event published successfully.'
      );
    } catch (err) {
      setError(err.message || 'Unable to update event status.');
    }
  };

  const handleDelete = async (event) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${event.title}"?`
    );

    if (!confirmed) return;

    setError('');
    setSuccess('');

    try {
      await adminRequest(`/admin/events/${event.id}/`, {
        method: 'DELETE',
      });

      setEvents((previous) =>
        previous.filter((item) => item.id !== event.id)
      );

      setSuccess('Event deleted successfully.');
    } catch (err) {
      setError(err.message || 'Unable to delete event.');
    }
  };

  const getStatusClass = (status) => {
    if (status === 'upcoming') return 'upcoming';
    if (status === 'ongoing') return 'ongoing';
    return 'past';
  };

  return (
    <div className="events-admin">
      <div className="events-page-header">
        <div>
          <span className="events-eyebrow">CONTENT MANAGEMENT</span>
          <h1>Events Management</h1>
          <p>Create and manage SOCCODO events and activities.</p>
        </div>

        <button
          type="button"
          className="events-primary-button"
          onClick={openCreateForm}
        >
          + Create Event
        </button>
      </div>

      {error && !showForm && (
        <div className="events-alert events-alert-error">{error}</div>
      )}

      {success && (
        <div className="events-alert events-alert-success">{success}</div>
      )}

      <div className="events-toolbar">
        <input
          type="search"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search events"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by event status"
        >
          <option value="All">All Event Statuses</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="past">Past</option>
        </select>
      </div>

      <div className="events-results-heading">
        <h2>All Events</h2>
        <span>{filteredEvents.length} events found</span>
      </div>

      {loading ? (
        <div className="events-empty">Loading events...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="events-empty">
          <h3>No events found</h3>
          <p>Create a new event or change your search filters.</p>
        </div>
      ) : (
        <div className="events-table-wrapper">
          <table className="events-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Category</th>
                <th>Event Status</th>
                <th>Publication</th>
                <th>Start Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event.id}>
                  <td>
                    <div className="events-table-item">
                      {event.image_url ? (
                        <img
                          src={event.image_url}
                          alt={event.image_alt || event.title}
                        />
                      ) : (
                        <div className="events-image-placeholder">E</div>
                      )}

                      <div>
                        <strong>{event.title}</strong>
                        <span>{event.location || 'Location not specified'}</span>
                      </div>
                    </div>
                  </td>

                  <td>{event.category}</td>

                  <td>
                    <span
                      className={`events-status ${getStatusClass(event.status)}`}
                    >
                      {event.status || 'Unknown'}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`events-publication ${
                        event.is_published ? 'published' : 'draft'
                      }`}
                    >
                      {event.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>

                  <td>
                    {event.start_at
                      ? new Date(event.start_at).toLocaleDateString()
                      : '—'}
                  </td>

                  <td>
                    <div className="events-actions">
                      <button
                        type="button"
                        onClick={() => openEditForm(event)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => togglePublish(event)}
                      >
                        {event.is_published ? 'Unpublish' : 'Publish'}
                      </button>

                      <button
                        type="button"
                        className="events-delete-button"
                        onClick={() => handleDelete(event)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="events-modal-backdrop">
          <div
            className="events-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-form-title"
          >
            <div className="events-modal-header">
              <div>
                <span className="events-eyebrow">EVENT DETAILS</span>
                <h2 id="event-form-title">
                  {editingEvent ? 'Edit Event' : 'Create New Event'}
                </h2>
              </div>

              <button
                type="button"
                className="events-close-button"
                onClick={closeForm}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            {error && (
              <div className="events-alert events-alert-error">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="events-form-grid">
                <label className="events-field events-field-full">
                  Event Title *
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    maxLength={200}
                    required
                    placeholder="Enter event title"
                  />
                </label>

                <label className="events-field">
                  Category *
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                    required
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="events-field">
                  Location *
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter event location"
                  />
                </label>

                <label className="events-field">
                  Start Date & Time *
                  <input
                    type="datetime-local"
                    name="start_at"
                    value={form.start_at}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label className="events-field">
                  End Date & Time *
                  <input
                    type="datetime-local"
                    name="end_at"
                    value={form.end_at}
                    onChange={handleInputChange}
                    min={form.start_at || undefined}
                    required
                  />
                </label>

                <label className="events-field events-field-full">
                  Description *
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    rows={5}
                    required
                    placeholder="Describe the event..."
                  />
                </label>

                <label className="events-field events-field-full">
                  Event Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <small>Select an image representing this event.</small>
                </label>

                {imagePreview && (
                  <div className="events-image-preview events-field-full">
                    <img src={imagePreview} alt="Event preview" />
                  </div>
                )}

                <label className="events-field events-field-full">
                  Image Alt Text
                  <input
                    name="image_alt"
                    value={form.image_alt}
                    onChange={handleInputChange}
                    maxLength={200}
                    placeholder="Describe the image for accessibility"
                  />
                </label>

                <label className="events-publish-option events-field-full">
                  <input
                    type="checkbox"
                    name="is_published"
                    checked={form.is_published}
                    onChange={handleInputChange}
                  />

                  <span>
                    <strong>Publish this event</strong>
                    <small>
                      Make this event visible on the public website.
                    </small>
                  </span>
                </label>
              </div>

              <div className="events-form-actions">
                <button
                  type="button"
                  className="events-cancel-button"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="events-primary-button"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : editingEvent
                      ? 'Save Changes'
                      : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsAdmin;