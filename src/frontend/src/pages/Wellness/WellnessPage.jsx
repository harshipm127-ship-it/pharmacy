import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import customerApi, { getImageUrl } from '../../services/customerApi'
import cartService from '../../services/cartService'

function formatPrice(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

function WellnessPage() {
  const [heroSlides, setHeroSlides] = useState([])
  const [categories, setCategories] = useState([])
  const [concerns, setConcerns] = useState([])
  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeHero, setActiveHero] = useState(0)

  useEffect(() => {
    let mounted = true

    async function loadWellnessContent() {
      try {
        const [bannersResponse, categoriesResponse, brandsResponse, productsResponse] = await Promise.all([
          customerApi.banners.home().catch(() => []),
          customerApi.categories.homepage().catch(() => []),
          customerApi.brands.list({ limit: 12 }).catch(() => []),
          customerApi.products.list({ limit: 16, status: 'active', publish_status: 'published' }).catch(() => []),
        ])

        if (!mounted) {
          return
        }

        const normalizedSlides = (Array.isArray(bannersResponse) ? bannersResponse : [])
          .filter((item) => item?.image_url || item?.image)
          .slice(0, 5)
          .map((item) => ({
            id: item.id || item.title,
            title: item.title || 'Wellness essentials',
            subtitle: item.description || 'Care for your wellbeing every day.',
            image: getImageUrl(item.image_url || item.image),
            badge: item.badge || 'Featured',
            href: item.link_url || '/wellness',
          }))

        const normalizedCategories = (Array.isArray(categoriesResponse) ? categoriesResponse : [])
          .filter((item) => item?.name)
          .slice(0, 12)
          .map((item) => ({
            id: item.id,
            name: item.name,
            slug: item.slug,
            image: getImageUrl(item.image_url || item.image) || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=500&q=80',
            route: `/category/${item.slug || item.id}`,
          }))

        const normalizedBrands = (Array.isArray(brandsResponse) ? brandsResponse : [])
          .slice(0, 10)
          .map((item) => ({
            id: item.id,
            name: item.name || item.brand_name || 'Wellness Brand',
            logo: getImageUrl(item.logo_url || item.image_url || item.image) || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=300&q=80',
          }))

        const normalizedProducts = (Array.isArray(productsResponse) ? productsResponse : [])
          .filter((item) => item?.name)
          .slice(0, 8)
          .map((item) => ({
            id: item.id,
            name: item.name,
            brand: item.brand?.name || item.brand || 'Wellness Brand',
            image: getImageUrl(item.image_url || item.image) || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80',
            price: Number(item.selling_price || item.final_price || item.mrp || item.price || 0),
            originalPrice: Number(item.mrp || item.selling_price || item.final_price || item.price || 0),
            discount: Number(item.discount || 0),
            rating: Number(item.rating || 4.5),
            stock: Number(item.stock || 0),
            category: item.category?.name || item.category || 'Wellness',
            slug: item.slug,
          }))

        setHeroSlides(normalizedSlides.length ? normalizedSlides : [
          { id: 'vitamins', title: 'Vitamins & Supplements', subtitle: 'Support immunity, energy, and everyday wellbeing.', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=80', badge: 'New', href: '/category/vitamins-supplements' },
          { id: 'immunity', title: 'Immunity Boosters', subtitle: 'Daily nutrition for stronger wellness routines.', image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1400&q=80', badge: 'Trending', href: '/category/immunity' },
          { id: 'protein', title: 'Protein Nutrition', subtitle: 'Fuel your fitness and recovery the smart way.', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=80', badge: 'Best Seller', href: '/category/protein' }
        ])
        setCategories(normalizedCategories.length ? normalizedCategories : [
          { id: 1, name: 'Vitamins', slug: 'vitamins', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80', route: '/category/vitamins' },
          { id: 2, name: 'Protein', slug: 'protein', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=500&q=80', route: '/category/protein' },
          { id: 3, name: 'Immunity', slug: 'immunity', image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=500&q=80', route: '/category/immunity' },
          { id: 4, name: 'Diabetes Care', slug: 'diabetes-care', image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=500&q=80', route: '/category/diabetes-care' }
        ])
        setConcerns([
          { id: 'immunity', title: 'Immunity', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80', route: '/category/immunity' },
          { id: 'heart', title: 'Heart Care', image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80', route: '/category/heart-care' },
          { id: 'joint', title: 'Joint Pain', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80', route: '/category/joint-pain' },
          { id: 'stress', title: 'Stress Relief', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80', route: '/category/stress-relief' }
        ])
        setBrands(normalizedBrands.length ? normalizedBrands : [
          { id: 1, name: 'Himalaya', logo: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=300&q=80' },
          { id: 2, name: 'Dabur', logo: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=300&q=80' },
          { id: 3, name: 'Organic India', logo: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=300&q=80' }
        ])
        setProducts(normalizedProducts)
      } catch {
        setHeroSlides([])
        setCategories([])
        setConcerns([])
        setBrands([])
        setProducts([])
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadWellnessContent()

    const interval = window.setInterval(() => {
      setActiveHero((current) => (current + 1) % Math.max(heroSlides.length, 1))
    }, 5000)

    return () => {
      mounted = false
      window.clearInterval(interval)
    }
  }, [heroSlides.length])

  const featuredProducts = useMemo(() => products.slice(0, 6), [products])
  const bestSellers = useMemo(() => products.slice(0, 4), [products])
  const newArrivals = useMemo(() => products.slice(4, 8), [products])
  const recommended = useMemo(() => products.slice(2, 8), [products])

  const handleAddToCart = (product) => {
    cartService.addToCart(product)
  }

  return (
    <div className='wellness-page'>
      <section className='wellness-hero-section'>
        <div className='wellness-hero-carousel'>
          {(heroSlides.length ? heroSlides : [{ id: 'placeholder', title: 'Wellness Essentials', subtitle: 'Care for your well-being every day.', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=80', badge: 'New', href: '/wellness' }]).map((slide, index) => (
            <Link key={slide.id || index} to={slide.href || '/wellness'} className={`wellness-hero-slide ${index === activeHero ? 'active' : ''}`}>
              <img src={slide.image} alt={slide.title} />
              <div className='wellness-hero-overlay'>
                <span className='wellness-badge'>{slide.badge}</span>
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
                <button type='button' className='wellness-primary-btn'>Shop Now</button>
              </div>
            </Link>
          ))}
        </div>
        <div className='wellness-hero-dots'>
          {heroSlides.map((slide, index) => (
            <button key={slide.id || index} type='button' className={`wellness-dot ${index === activeHero ? 'active' : ''}`} onClick={() => setActiveHero(index)} />
          ))}
        </div>
      </section>

      <section className='wellness-section'>
        <div className='wellness-section-header'>
          <h2>Explore Categories</h2>
          <Link to='/categories'>View all</Link>
        </div>
        <div className='wellness-category-grid'>
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => <div key={index} className='wellness-category-skeleton' />)
          ) : categories.map((category) => (
            <Link key={category.id} to={category.route} className='wellness-category-card'>
              <img src={category.image} alt={category.name} />
              <span>{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className='wellness-section'>
        <div className='wellness-section-header'>
          <h2>Shop by Health Concern</h2>
        </div>
        <div className='wellness-concern-grid'>
          {concerns.map((concern) => (
            <Link key={concern.id} to={concern.route} className='wellness-concern-card'>
              <img src={concern.image} alt={concern.title} />
              <div className='wellness-concern-overlay'>
                <h3>{concern.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className='wellness-section'>
        <div className='wellness-section-header'>
          <h2>Featured Wellness Products</h2>
          <Link to='/products'>View all</Link>
        </div>
        <div className='wellness-product-row'>
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => <div key={index} className='wellness-product-skeleton' />)
          ) : featuredProducts.map((product) => (
            <article key={product.id} className='wellness-product-card'>
              <button type='button' className='wellness-wishlist'>♥</button>
              <img src={product.image} alt={product.name} />
              <div className='wellness-product-content'>
                <span className='wellness-product-brand'>{product.brand}</span>
                <h3>{product.name}</h3>
                <div className='wellness-rating'>⭐ {product.rating}</div>
                <div className='wellness-price-row'>
                  <span className='wellness-price'>{formatPrice(product.price)}</span>
                  <span className='wellness-original-price'>{formatPrice(product.originalPrice)}</span>
                </div>
                <div className='wellness-product-actions'>
                  <button type='button' className='wellness-primary-btn small' onClick={() => handleAddToCart(product)}>Add to Cart</button>
                  <button type='button' className='wellness-secondary-btn small'>Quick View</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className='wellness-section'>
        <div className='wellness-section-header'>
          <h2>Top Brands</h2>
        </div>
        <div className='wellness-brand-row'>
          {brands.map((brand) => (
            <div key={brand.id} className='wellness-brand-card'>
              <img src={brand.logo} alt={brand.name} />
              <span>{brand.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className='wellness-section'>
        <div className='wellness-section-header'>
          <h2>Best Sellers</h2>
        </div>
        <div className='wellness-product-grid'>
          {bestSellers.map((product) => (
            <article key={product.id} className='wellness-product-card compact'>
              <img src={product.image} alt={product.name} />
              <div className='wellness-product-content'>
                <h3>{product.name}</h3>
                <div className='wellness-price-row'>
                  <span className='wellness-price'>{formatPrice(product.price)}</span>
                  <span className='wellness-original-price'>{formatPrice(product.originalPrice)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className='wellness-section'>
        <div className='wellness-section-header'>
          <h2>New Arrivals</h2>
        </div>
        <div className='wellness-product-grid'>
          {newArrivals.map((product) => (
            <article key={product.id} className='wellness-product-card compact'>
              <span className='wellness-new-badge'>NEW</span>
              <img src={product.image} alt={product.name} />
              <div className='wellness-product-content'>
                <h3>{product.name}</h3>
                <div className='wellness-price-row'>
                  <span className='wellness-price'>{formatPrice(product.price)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className='wellness-section'>
        <div className='wellness-section-header'>
          <h2>Recommended For You</h2>
        </div>
        <div className='wellness-product-grid'>
          {recommended.map((product) => (
            <article key={product.id} className='wellness-product-card compact'>
              <img src={product.image} alt={product.name} />
              <div className='wellness-product-content'>
                <h3>{product.name}</h3>
                <div className='wellness-price-row'>
                  <span className='wellness-price'>{formatPrice(product.price)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className='wellness-section'>
        <div className='wellness-section-header'>
          <h2>Customer Reviews</h2>
        </div>
        <div className='wellness-review-grid'>
          {[
            { id: 1, name: 'Asha R.', rating: 5, review: 'Great quality and fast delivery. My daily supplements arrived well packaged.', product: 'Immunity Boost Gummies' },
            { id: 2, name: 'Nikhil S.', rating: 4, review: 'Really helpful wellness range and attractive pricing.', product: 'Protein Nutrition Shake' },
            { id: 3, name: 'Meera P.', rating: 5, review: 'Loved the curated selection and easy checkout experience.', product: 'Diabetes Care Pack' }
          ].map((review) => (
            <article key={review.id} className='wellness-review-card'>
              <div className='wellness-review-top'>
                <div className='wellness-review-avatar'>{review.name.split(' ')[0][0]}</div>
                <div>
                  <h3>{review.name}</h3>
                  <div className='wellness-rating'>⭐ {review.rating}.0</div>
                </div>
              </div>
              <p>{review.review}</p>
              <span className='wellness-review-product'>{review.product}</span>
            </article>
          ))}
        </div>
      </section>

      <section className='wellness-section'>
        <div className='wellness-section-header'>
          <h2>Wellness Tips & Articles</h2>
        </div>
        <div className='wellness-article-grid'>
          {[
            { id: 1, title: 'Improve Immunity Naturally', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80' },
            { id: 2, title: 'Best Vitamins for Women', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80' },
            { id: 3, title: 'Healthy Lifestyle Tips', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80' }
          ].map((article) => (
            <article key={article.id} className='wellness-article-card'>
              <img src={article.image} alt={article.title} />
              <div className='wellness-article-content'>
                <h3>{article.title}</h3>
                <Link to='/wellness'>Read More</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default WellnessPage
