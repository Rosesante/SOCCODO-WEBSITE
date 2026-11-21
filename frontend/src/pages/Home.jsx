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
  )
}

export default Home
