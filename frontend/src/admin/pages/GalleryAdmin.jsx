import React, { useEffect, useMemo, useState } from 'react';
import adminRequest from '../services/AdminAPI';
import './GalleryAdmin.css';

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
  category: '',
  caption: '',
  alt_text: '',
  is_published: false,
};

const GalleryAdmin = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const fetchCategories = async () => {
    try {
      const data = await adminRequest('/categories/');
      setCategories(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err.message || 'Unable to load categories.');
    }
  };

  const fetchImages = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await adminRequest('/category-admin/gallery/');
      setImages(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err.message || 'Unable to load gallery images.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchCategories();
  fetchImages();
}, []);

  const filteredImages = useMemo(() => {
    return images.filter((image) => {
      const query = search.toLowerCase();

      const matchesSearch =
        image.title.toLowerCase().includes(query) ||
        (image.caption || '').toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === 'All' ||
        String(image.category) === categoryFilter;

      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Published' && image.is_published) ||
        (statusFilter === 'Draft' && !image.is_published);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [images, search, categoryFilter, statusFilter]);

  const openCreateForm = () => {
    setEditingImage(null);
    setForm({
      ...emptyForm,
      category: categories.length ? String(categories[0].id) : '',
    });
    setImageFile(null);
    setImagePreview('');
    setError('');
    setSuccess('');
    setShowForm(true);
  };

  const openEditForm = (image) => {
    setEditingImage(image);

    setForm({
      title: image.title || '',
      category: String(image.category || ''),
      caption: image.caption || '',
      alt_text: image.alt_text || '',
      is_published: image.is_published,
    });

    setImageFile(null);
    setImagePreview(image.image_url || '');
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
    setEditingImage(null);
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
      } else if (!editingImage) {
        throw new Error('Please select an image to upload.');
      }

      const endpoint = editingImage
        ? `/category-admin/gallery/${editingImage.id}/`
        : '/category-admin/gallery/';

      await adminRequest(endpoint, {
        method: editingImage ? 'PATCH' : 'POST',
        body: formData,
      });

      closeForm();
      setSuccess(
        editingImage
          ? 'Gallery image updated successfully.'
          : 'Gallery image uploaded successfully.'
      );

      await fetchImages();
    } catch (err) {
      setError(err.message || 'Unable to save gallery image.');
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (image) => {
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('is_published', String(!image.is_published));

    try {
      await adminRequest(`/category-admin/gallery/${image.id}/`, {
        method: 'PATCH',
        body: formData,
      });

      setImages((previous) =>
        previous.map((item) =>
          item.id === image.id
            ? { ...item, is_published: !item.is_published }
            : item
        )
      );

      setSuccess(
        image.is_published
          ? 'Image moved to drafts.'
          : 'Image published successfully.'
      );
    } catch (err) {
      setError(err.message || 'Unable to update image status.');
    }
  };

  const handleDelete = async (image) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${image.title}"?`
    );

    if (!confirmed) return;

    setError('');
    setSuccess('');

    try {
      await adminRequest(`/category-admin/gallery/${image.id}/`, {
        method: 'DELETE',
      });

      setImages((previous) =>
        previous.filter((item) => item.id !== image.id)
      );

      setSuccess('Gallery image deleted successfully.');
    } catch (err) {
      setError(err.message || 'Unable to delete gallery image.');
    }
  };

  return (
    <div className="gallery-admin">
      <div className="gallery-page-header">
        <div>
          <span className="gallery-eyebrow">CONTENT MANAGEMENT</span>
          <h1>Gallery Management</h1>
          <p>Upload and organize photos from SOCCODO activities.</p>
        </div>

        <button
          type="button"
          className="gallery-primary-button"
          onClick={openCreateForm}
        >
          + Upload Image
        </button>
      </div>

      {error && !showForm && (
        <div className="gallery-alert gallery-alert-error">{error}</div>
      )}

      {success && (
        <div className="gallery-alert gallery-alert-success">{success}</div>
      )}

      <div className="gallery-toolbar">
        <input
          type="search"
          placeholder="Search gallery..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search gallery"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="All">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={String(category.id)}>
              {category.name}
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

      <div className="gallery-results-heading">
        <h2>Gallery Images</h2>
        <span>{filteredImages.length} images found</span>
      </div>

      {loading ? (
        <div className="gallery-empty">Loading gallery images...</div>
      ) : filteredImages.length === 0 ? (
        <div className="gallery-empty">
          <h3>No images found</h3>
          <p>Upload an image or try changing your filters.</p>
        </div>
      ) : (
        <div className="gallery-admin-grid">
          {filteredImages.map((image) => (
            <article className="gallery-admin-card" key={image.id}>
              <div className="gallery-admin-image">
                {image.image_url ? (
                  <img
                    src={image.image_url}
                    alt={image.alt_text || image.title}
                  />
                ) : (
                  <div className="gallery-no-image">No image available</div>
                )}

                <span
                  className={`gallery-status ${
                    image.is_published ? 'published' : 'draft'
                  }`}
                >
                  {image.is_published ? 'Published' : 'Draft'}
                </span>
              </div>

              <div className="gallery-admin-card-content">
                <span className="gallery-category">
                  {image.category_name}
                </span>

                <h3>{image.title}</h3>
                <p>{image.caption || 'No caption provided.'}</p>

                <div className="gallery-card-date">
                  {image.created_at
                    ? new Date(image.created_at).toLocaleDateString()
                    : ''}
                </div>

                <div className="gallery-card-actions">
                  <button
                    type="button"
                    onClick={() => openEditForm(image)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => togglePublish(image)}
                  >
                    {image.is_published ? 'Unpublish' : 'Publish'}
                  </button>

                  <button
                    type="button"
                    className="gallery-delete-button"
                    onClick={() => handleDelete(image)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {showForm && (
        <div className="gallery-modal-backdrop">
          <div
            className="gallery-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-form-title"
          >
            <div className="gallery-modal-header">
              <div>
                <span className="gallery-eyebrow">GALLERY DETAILS</span>
                <h2 id="gallery-form-title">
                  {editingImage ? 'Edit Gallery Image' : 'Upload New Image'}
                </h2>
              </div>

              <button
                type="button"
                className="gallery-close-button"
                onClick={closeForm}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            {error && (
              <div className="gallery-alert gallery-alert-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="gallery-form-grid">
                <label className="gallery-field gallery-field-full">
                  Image Title *
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter image title"
                  />
                </label>

                <label className="gallery-field gallery-field-full">
                  Category *
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={String(category.id)}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="gallery-field gallery-field-full">
                  Caption
                  <textarea
                    name="caption"
                    value={form.caption}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Describe the activity or moment..."
                  />
                </label>

                <label className="gallery-field gallery-field-full">
                  Select Image {!editingImage && '*'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!editingImage}
                  />
                  <small>
                    Select a clear photo representing the activity.
                  </small>
                </label>

                {imagePreview && (
                  <div className="gallery-image-preview gallery-field-full">
                    <img src={imagePreview} alt="Selected image preview" />
                  </div>
                )}

                <label className="gallery-field gallery-field-full">
                  Alt Text
                  <input
                    name="alt_text"
                    value={form.alt_text}
                    onChange={handleInputChange}
                    placeholder="Describe the image for accessibility"
                  />
                </label>

                <label className="gallery-publish-option gallery-field-full">
                  <input
                    type="checkbox"
                    name="is_published"
                    checked={form.is_published}
                    onChange={handleInputChange}
                  />

                  <span>
                    <strong>Publish this image</strong>
                    <small>
                      Make this image visible on the public website.
                    </small>
                  </span>
                </label>
              </div>

              <div className="gallery-form-actions">
                <button
                  type="button"
                  className="gallery-cancel-button"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="gallery-primary-button"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : editingImage
                      ? 'Save Changes'
                      : 'Upload Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryAdmin;