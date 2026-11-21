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
