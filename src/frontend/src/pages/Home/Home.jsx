import { useEffect, useMemo, useState, useContext } from 'react'
import cartService from '../../services/cartService'
import customerApi from '../../services/customerApi'
import { AuthContext } from '../../context/AuthContext'
import './Home.css'

const heroSlides = [
  {
    
  },
  {
    
  },
  {
    
  }
]





const bestSellerNames = []

const offers = [
  
]

const reviews = [
  {
    
  },
  {
    
  }
]

const healthTips = [
 
]

const brands = []

const searchSuggestions = []

function formatPrice(value) {
  const numericValue = Number(value || 0)

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(numericValue)
}

function getProductImage(product) {
  return product.image || product.image_url || product.images?.[0]?.url || product.images?.[0]?.image_url 
}

function Home() {
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const auth = useContext(AuthContext)

  useEffect(() => {
    customerApi.products.list({ limit: 8 }).then(setProducts)
    const intervalId = window.setInterval(() => {
  useEffect(() => {
  customerApi.products.list({ limit: 8 })
    .then((items) => setProducts(Array.isArray(items) ? items : []))
    .catch(() => setProducts([]))
    .finally(() => setLoading(false))
  }, [])
      setActiveSlide((current) => (current + 1) % heroSlides.length)
    }, 5000)

    return () => window.clearInterval(intervalId)
  }, [])

  const displayProducts = useMemo(() => {
    if (products.length > 0) {
      return products
    }

    return fallbackProducts
  }, [products])

  const featuredProducts = useMemo(() => {
    return displayProducts.slice(0, 4).map((product, index) => ({
      id: product.id || index + 1,
      name: product.name || 'Premium Healthcare Product',
      brand: product.brand?.name || product.manufacturer || product.brand || 'Trusted Brand',
      price: formatPrice(product.price),
      discountPrice: formatPrice(Math.max(1, Number(product.price || 0) - Math.round(Number(product.price || 0) * 0.1))),
      discount: product.discount ? `${product.discount}% off` : 'Best deal',
      rating: product.rating || (4.5 + (index * 0.1)).toFixed(1),
      stock: product.stock || 'In stock',
      image: getProductImage(product)
    }))
  }, [displayProducts])

  const bestSellers = useMemo(() => {
    return displayProducts.slice(0, 6).map((product, index) => ({
      id: product.id || index + 1,
      name: product.name || bestSellerNames[index] || 'Medicine',
      rating: product.rating || (4.4 + (index * 0.1)).toFixed(1),
      price: formatPrice(product.price),
      image: getProductImage(product)
    }))
  }, [displayProducts])

  const suggestions = useMemo(() => {
    if (!query.trim()) {
      return []
    }

    const source = products.length > 0 ? products.map((product) => product.name) : searchSuggestions

    return source
      .filter((item) => item.toLowerCase().includes(query.trim().toLowerCase()))
      .slice(0, 5)
  }, [products, query])

  return (
    <div className='home-page'>
      <section className='hero-section'>
        <div className='hero-slide'>
          <div className='hero-copy'>
            <span className='eyebrow'>unTrusted medical delivery</span>
            <h1>{heroSlides[activeSlide].title}</h1>
            <p>{heroSlides[activeSlide].description}</p>
            <div className='hero-actions'>
              <button className='primary-btn' type='button'>Shop Now</button>
              <button className='secondary-btn' type='button'>Explore Deals</button>
            </div>
            <div className='hero-badges'>
              <span className='hero-badge'>{heroSlides[activeSlide].discount}</span>
              <span className='hero-badge alt'>Certified Pharma</span>
            </div>
            {loading ? <p className='status-text'>Loading live product catalog...</p> : null}
          </div>

          <div className='hero-media'>
            <img src={heroSlides[activeSlide].image} alt={heroSlides[activeSlide].title} />
          </div>
        </div>

        <div className='slider-dots' aria-label='Hero banner controls'>
          {heroSlides.map((slide, index) => (
            <button
              key={slide.title}
              type='button'
              className={index === activeSlide ? 'dot active' : 'dot'}
              onClick={() => setActiveSlide(index)}
              aria-label={`Show slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className='section-card'>
        <div className='section-head'>
          <div>
            <h2>Shop by Category</h2>
            <p>Medical essentials for every stage of life.</p>
          </div>
        </div>

        <div className='category-grid'>
          {categories.map((category) => (
            <article className={`category-card ${category.accent}`} key={category.name}>
              <div className='category-icon'>{category.icon}</div>
              <h3>{category.name}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className='section-card'>
        <div className='section-head'>
          <div>
            <h2>Featured Products</h2>
            <p>{products.length > 0 ? 'Live products from the catalog.' : 'Hand-picked favorites for daily wellness.'}</p>
          </div>
        </div>

        <div className='featured-grid'>
          {featuredProducts.map((product) => (
            <article className='product-card' key={product.id}>
              <img className='product-image' src={product.image} alt={product.name} />
              <div className='product-meta'>
                <span>{product.brand}</span>
                <span className='badge'>{product.discount}</span>
              </div>
              <h3>{product.name}</h3>
              <div className='rating-row'>
                <span>⭐ {product.rating}</span>
                <span className='stock-pill'>{product.stock}</span>
              </div>
              <div className='price-row'>
                <div>
                  <div className='price'>{product.price}</div>
                  <small className='discount-price'>{product.discountPrice}</small>
                </div>
                <button className='add-cart-btn' type='button' onClick={() => auth.requireAuth(() => cartService.addToCart(product))}>Add</button>
              </div>
              <div className='card-actions'>
                <button className='detail-btn' type='button' onClick={() => auth.requireAuth(() => console.log('wishlist', product))}>Wishlist</button>
                <button className='detail-btn' type='button' onClick={() => auth.requireAuth(() => cartService.addToCart(product))}>Buy Now</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className='section-card'>
        <div className='section-head'>
          <div>
            <h2>Best Sellers</h2>
            <p>Top-selling medicines from trusted brands.</p>
          </div>
        </div>

        <div className='best-grid'>
          {bestSellers.map((product) => (
            <article className='best-card' key={product.id}>
              <div className='bestseller-badge'>Bestseller</div>
              <img className='product-image small' src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <div className='rating-row'>
                <span>⭐ {product.rating}</span>
              </div>
              <div className='price-row'>
                <span className='price'>{product.price}</span>
                <button className='add-cart-btn' type='button' onClick={() => auth.requireAuth(() => cartService.addToCart(product))}>Add</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className='section-card'>
        <div className='section-head'>
          <div>
            <h2>Offers & Discounts</h2>
            <p>Exclusive benefits crafted for your next order.</p>
          </div>
        </div>

        <div className='offer-grid'>
          {offers.map((offer) => (
            <article className='offer-card' key={offer.code}>
              <strong>{offer.title}</strong>
              <span>Coupon: {offer.code}</span>
              <button className='offer-btn' type='button'>{offer.action}</button>
            </article>
          ))}
        </div>
      </section>

      <section className='section-card'>
        <div className='section-head'>
          <div>
            <h2>Healthcare Products</h2>
            <p>Monitor your wellness with specialist devices and support tools.</p>
          </div>
        </div>

        <div className='health-grid'>
          {healthCategories.map((item) => (
            <article className='health-card' key={item}>
              <div className='health-icon'>🩺</div>
              <h3>{item}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className='section-card'>
        <div className='section-head'>
          <div>
            <h2>Recently Viewed</h2>
            <p>Pick up where you left off on your last visit.</p>
          </div>
        </div>

        <div className='recent-grid'>
          {recentlyViewed.map((product) => (
            <article className='product-card' key={product.name}>
              <img className='product-image' src={product.image} alt={product.name} />
              <div className='product-meta'>
                <span>{product.brand}</span>
                <span className='rating-pill'>⭐ {product.rating}</span>
              </div>
              <h3>{product.name}</h3>
              <div className='price-row'>
                <span className='price'>{product.price}</span>
                <button className='detail-btn' type='button'>View</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className='section-card'>
        <div className='section-head'>
          <div>
            <h2>Why Choose Us</h2>
            <p>Trusted pharmacy care built around convenience and confidence.</p>
          </div>
        </div>

        <div className='feature-grid'>
          {['Genuine Medicines', 'Fast Delivery', 'Licensed Pharmacy', 'Easy Returns', 'Secure Payments', '24×7 Support'].map((item) => (
            <article className='feature-card' key={item}>
              <div className='feature-icon'>✓</div>
              <h3>{item}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className='section-card'>
        <div className='section-head'>
          <div>
            <h2>Customer Reviews</h2>
            <p>Real stories from customers who trust our medical delivery.</p>
          </div>
        </div>

        <div className='testimonial-grid'>
          {reviews.map((review) => (
            <article className='review-card' key={review.name}>
              <img src={review.image} alt={review.name} />
              <div>
                <h3>{review.name}</h3>
                <p className='review-role'>{review.role}</p>
                <p>{review.review}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className='section-card'>
        <div className='section-head'>
          <div>
            <h2>Health Tips</h2>
            <p>Practical guidance for everyday wellness.</p>
          </div>
        </div>

        <div className='tips-grid'>
          {healthTips.map((tip) => (
            <article className='tip-card' key={tip.title}>
              <img src={tip.image} alt={tip.title} />
              <div className='tip-content'>
                <h3>{tip.title}</h3>
                <button className='detail-btn' type='button'>Read More</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className='section-card'>
        <div className='section-head'>
          <div>
            <h2>Popular Brands</h2>
            <p>Trusted names for everyday healthcare.</p>
          </div>
        </div>

        <div className='brands-grid'>
          {brands.map((brand) => (
            <article className='brand-pill' key={brand}>{brand}</article>
          ))}
        </div>
      </section>

      <section className='section-card app-card'>
        <div className='app-copy'>
          <span className='eyebrow'>Download the app</span>
          <h2>Get medicine reminders, offers, and seamless checkout on the go.</h2>
          <div className='hero-actions'>
            <button className='primary-btn' type='button'>Get it on Play Store</button>
            <button className='secondary-btn' type='button'>Download on App Store</button>
          </div>
        </div>
        <div className='app-mockup'>
          <div className='phone-screen'>
            <div className='phone-bar' />
            <div className='phone-card'>Care at your fingertips</div>
          </div>
        </div>
      </section>

      <section className='section-card newsletter-card'>
        <div>
          <h2>Stay healthy with expert tips and offers.</h2>
          <p>Subscribe to receive health updates, medicine alerts, and exclusive promo codes.</p>
        </div>
        <div className='newsletter-form'>
          <input type='email' placeholder='Enter your email address' />
          <button className='primary-btn' type='button'>Subscribe</button>
        </div>
      </section>
    </div>
  )
}

export default Home
