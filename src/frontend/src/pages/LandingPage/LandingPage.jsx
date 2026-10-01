import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import customerApi from '../../services/customerApi'

function LandingPage() {
  const location = useLocation()
  const [content, setContent] = useState(null)

  useEffect(() => {
    // Try to load a landing configuration from API if available; otherwise show neutral empty state
    customerApi.pages
      .get(location.pathname)
      .then((resp) => setContent(resp))
      .catch(() => setContent({
        heroTitle: 'Explore our curated categories',
        heroSubtitle: 'Find trending products, wellness essentials, and daily care picks.',
        highlightLabel: 'Landing page',
        featured: [],
        categories: [],
        sellers: []
      }))
  }, [location.pathname])

  const heroStyle = content.heroImage
    ? { backgroundImage: `linear-gradient(90deg, rgba(8, 25, 45, 0.72), rgba(8, 25, 45, 0.28)), url(${content.heroImage})` }
    : undefined

  return (
    <section className='landing-page'>
      <div className={`landing-hero ${content.heroImage ? 'hero-image-banner' : ''}`} style={heroStyle}>
        <div className='landing-hero-copy'>
          <span className='landing-highlight'>{content.highlightLabel}</span>
          <h1>{content.heroTitle}</h1>
          <p>{content.heroSubtitle}</p>
        </div>
      </div>

      <div className='landing-grid'>
        <div className='landing-column'>
          <h2>Featured products</h2>
          <div className='landing-list'>
            {content.featured.map((item) => (
              <div key={item} className='landing-card'>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className='landing-column'>
          <h2>Categories</h2>
          <div className='landing-list'>
            {content.categories.map((item) => (
              <div key={item} className='landing-card'>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className='landing-column'>
          <h2>Best sellers</h2>
          <div className='landing-list'>
            {content.sellers.map((item) => (
              <div key={item} className='landing-card'>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default LandingPage
