import React, { useEffect, useMemo, useState } from 'react';
import adminRequest from '../services/AdminAPI';
import './SuccessStoriesAdmin.css';

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
  content: '',
  image_alt: '',
  published_at: new Date().toISOString().slice(0, 16),
  is_published: false,
};

const formatDate = (value) => {
  if (!value) return '';

  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 16);
};

const SuccessStoriesAdmin = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [showForm, setShowForm] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchStories = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await adminRequest('/admin/stories/');
      setStories(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err.message || 'Unable to load stories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      const matchesSearch =
        story.title.toLowerCase().includes(search.toLowerCase()) ||
        story.excerpt.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === 'All' ||
        story.category === categoryFilter;

      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Published' && story.is_published) ||
        (statusFilter === 'Draft' && !story.is_published);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [stories, search, categoryFilter, statusFilter]);

  const openCreateForm = () => {
    setEditingStory(null);
    setForm({
      ...emptyForm,
      published_at: formatDate(new Date().toISOString()),
    });
    setImageFile(null);
    setImagePreview('');
    setError('');
    setSuccess('');
    setShowForm(true);
  };

  const openEditForm = (story) => {
    setEditingStory(story);

    setForm({
      title: story.title || '',
      category: story.category || 'Community Development',
      content: story.content || '',
      image_alt: story.image_alt || '',
      published_at: formatDate(story.published_at),
      is_published: story.is_published,
    });

    setImageFile(null);
    setImagePreview(story.image_url || '');
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
    setEditingStory(null);
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const endpoint = editingStory
        ? `/admin/stories/${editingStory.id}/`
        : '/admin/stories/';

      await adminRequest(endpoint, {
        method: editingStory ? 'PATCH' : 'POST',
        body: formData,
      });

      closeForm();
      setSuccess(
        editingStory
          ? 'Story updated successfully.'
          : 'Story created successfully.'
      );

      await fetchStories();
    } catch (err) {
      setError(err.message || 'Unable to save story.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (story) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${story.title}"?`
    );

    if (!confirmed) return;

    setError('');
    setSuccess('');

    try {
      await adminRequest(`/admin/stories/${story.id}/`, {
        method: 'DELETE',
      });

      setStories((previous) =>
        previous.filter((item) => item.id !== story.id)
      );

      setSuccess('Story deleted successfully.');
    } catch (err) {
      setError(err.message || 'Unable to delete story.');
    }
  };

  const togglePublish = async (story) => {
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('is_published', String(!story.is_published));

    try {
      await adminRequest(`/admin/stories/${story.id}/`, {
        method: 'PATCH',
        body: formData,
      });

      setStories((previous) =>
        previous.map((item) =>
          item.id === story.id
            ? { ...item, is_published: !item.is_published }
            : item
        )
      );

      setSuccess(
        story.is_published
          ? 'Story moved to drafts.'
          : 'Story published successfully.'
      );
    } catch (err) {
      setError(err.message || 'Unable to update publication status.');
    }
  };

  return (
    <div className="stories-admin">
      <div className="stories-page-header">
        <div>
          <span className="stories-eyebrow">CONTENT MANAGEMENT</span>
          <h1>Success Stories</h1>
          <p>Create and manage stories highlighting SOCCODO's impact.</p>
        </div>

        <button
          type="button"
          className="stories-primary-button"
          onClick={openCreateForm}
        >
          + Add New Story
        </button>
      </div>

      {error && !showForm && (
        <div className="stories-alert stories-alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="stories-alert stories-alert-success">
          {success}
        </div>
      )}

      <div className="stories-toolbar">
        <input
          type="search"
          placeholder="Search stories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search stories"
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
          aria-label="Filter by publication status"
        >
          <option value="All">All Statuses</option>
          <option value="Published">Published</option>
          <option value="Draft">Drafts</option>
        </select>
      </div>

      <div className="stories-results-heading">
        <h2>All Stories</h2>
        <span>{filteredStories.length} stories found</span>
      </div>

      {loading ? (
        <div className="stories-empty">Loading stories...</div>
      ) : filteredStories.length === 0 ? (
        <div className="stories-empty">
          <h3>No stories found</h3>
          <p>Try another search or add a new success story.</p>
        </div>
      ) : (
        <div className="stories-table-wrapper">
          <table className="stories-table">
            <thead>
              <tr>
                <th>Story</th>
                <th>Category</th>
                <th>Publication</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStories.map((story) => (
                <tr key={story.id}>
                  <td>
                    <div className="stories-table-story">
                      {story.image_url ? (
                        <img src={story.image_url} alt={story.image_alt || story.title} />
                      ) : (
                        <div className="stories-image-placeholder">S</div>
                      )}

                      <div>
                        <strong>{story.title}</strong>
                        <span>{story.excerpt}</span>
                      </div>
                    </div>
                  </td>

                  <td>{story.category}</td>

                  <td>
                    <span
                      className={`stories-status ${
                        story.is_published ? 'published' : 'draft'
                      }`}
                    >
                      {story.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>

                  <td>
                    {story.published_at
                      ? new Date(story.published_at).toLocaleDateString()
                      : '—'}
                  </td>

                  <td>
                    <div className="stories-actions">
                      <button
                        type="button"
                        onClick={() => openEditForm(story)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => togglePublish(story)}
                      >
                        {story.is_published ? 'Unpublish' : 'Publish'}
                      </button>

                      <button
                        type="button"
                        className="stories-delete-button"
                        onClick={() => handleDelete(story)}
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
        <div className="stories-modal-backdrop">
          <div
            className="stories-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="story-form-title"
          >
            <div className="stories-modal-header">
              <div>
                <span className="stories-eyebrow">STORY DETAILS</span>
                <h2 id="story-form-title">
                  {editingStory ? 'Edit Story' : 'Create New Story'}
                </h2>
              </div>

              <button
                type="button"
                className="stories-close-button"
                onClick={closeForm}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            {error && (
              <div className="stories-alert stories-alert-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="stories-form-grid">
                <label className="stories-field stories-field-full">
                  Story Title *
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    maxLength={200}
                    required
                    placeholder="Enter the story title"
                  />
                </label>

                <label className="stories-field">
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

                <label className="stories-field">
                  Publication Date *
                  <input
                    type="datetime-local"
                    name="published_at"
                    value={form.published_at}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label className="stories-field stories-field-full">
                  Full Story *
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleInputChange}
                    rows={7}
                    required
                    placeholder="Write the full success story..."
                  />
                </label>

                <label className="stories-field stories-field-full">
                  Story Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <small>Choose a clear image that represents this story.</small>
                </label>

                {imagePreview && (
                  <div className="stories-image-preview stories-field-full">
                    <img src={imagePreview} alt="Story preview" />
                  </div>
                )}

                <label className="stories-field stories-field-full">
                  Image Alt Text
                  <input
                    name="image_alt"
                    value={form.image_alt}
                    onChange={handleInputChange}
                    maxLength={200}
                    placeholder="Describe the image for accessibility"
                  />
                </label>

                <label className="stories-publish-option stories-field-full">
                  <input
                    type="checkbox"
                    name="is_published"
                    checked={form.is_published}
                    onChange={handleInputChange}
                  />
                  <span>
                    <strong>Publish this story</strong>
                    <small>
                      Make this story visible on the public website.
                    </small>
                  </span>
                </label>
              </div>

              <div className="stories-form-actions">
                <button
                  type="button"
                  className="stories-cancel-button"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="stories-primary-button"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : editingStory
                      ? 'Save Changes'
                      : 'Create Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuccessStoriesAdmin;