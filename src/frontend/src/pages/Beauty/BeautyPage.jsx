import { Link } from 'react-router-dom'
import BannerSlider from '../../components/common/BannerSlider'
import BeautyCategoryCard from '../../components/common/BeautyCategoryCard'
import BeautyProductCard from '../../components/common/BeautyProductCard'
import BrandSection from '../../components/common/BrandSection'
import OfferCard from '../../components/common/OfferCard'
import {
  beautyCategories,
  beautyHeroSlides,
  winterEssentials,
  glowEssentials,
  featuredBeautyProducts,
  trendingBrands,
  bestSellerProducts,
  beautyOffers,
  recentlyViewedItems
} from '../../data/beautyLandingData'

function BeautyPage() {
  return (
    <div className='beauty-page'>
      <section className='beauty-section beauty-category-section'>
        <div className='beauty-section-header'>
          <h2>Beauty Categories</h2>
        </div>
        <div className='beauty-category-grid'>
          {beautyCategories.map((category) => (
            <BeautyCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className='beauty-section beauty-hero-section'>
        <BannerSlider slides={beautyHeroSlides} />
      </section>

      <section className='beauty-section'>
        <div className='beauty-section-header'>
          <h2>Winter Essentials ❄️</h2>
          <Link to='/beauty/winter-essentials'>View all</Link>
        </div>
        <div className='beauty-horizontal-scroll'>
          {winterEssentials.map((item) => (
            <Link key={item.id} to={item.route} className='beauty-scroll-card'>
              <img src={item.image} alt={item.name} />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className='beauty-section'>
        <div className='beauty-section-header'>
          <h2>Time for a Glow ✨</h2>
          <Link to='/beauty/time-for-a-glow'>View all</Link>
        </div>
        <div className='beauty-glow-grid'>
          {glowEssentials.map((item) => (
            <Link key={item.id} to={item.route} className='beauty-glow-card' style={{ background: item.accent }}>
              <div className='beauty-glow-copy'>
                <span>{item.name}</span>
                <p>{item.tagline}</p>
              </div>
              <img src={item.image} alt={item.name} />
            </Link>
          ))}
        </div>
      </section>

      <section className='beauty-section'>
        <div className='beauty-section-header'>
          <h2>Featured Beauty Products</h2>
          <Link to='/products'>View all</Link>
        </div>
        <div className='beauty-product-grid'>
          {featuredBeautyProducts.map((product) => (
            <BeautyProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <BrandSection brands={trendingBrands} />

      <section className='beauty-section'>
        <div className='beauty-section-header'>
          <h2>Best Sellers</h2>
          <Link to='/beauty/best-sellers'>View all</Link>
        </div>
        <div className='beauty-horizontal-scroll beauty-best-sellers-row'>
          {bestSellerProducts.map((item) => (
            <article key={item.id} className='beauty-best-card'>
              <div className='beauty-best-card-image'>
                <img src={item.image} alt={item.name} />
              </div>
              <div className='beauty-best-card-body'>
                <h3>{item.name}</h3>
                <div className='beauty-best-meta'>
                  <span>⭐ {item.rating}</span>
                  <span>₹{item.price}</span>
                </div>
                <div className='beauty-best-footer'>
                  <span>Save {item.discount}%</span>
                  <button type='button' className='beauty-cart-button'>Add to Cart</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className='beauty-section'>
        <div className='beauty-section-header'>
          <h2>Special Offers</h2>
        </div>
        <div className='beauty-offer-grid'>
          {beautyOffers.map((offer) => <OfferCard key={offer.id} offer={offer} />)}
        </div>
      </section>

      <section className='beauty-section'>
        <div className='beauty-section-header'>
          <h2>Recently Viewed</h2>
        </div>
        <div className='beauty-recent-grid'>
          {recentlyViewedItems.map((item) => (
            <div key={item.id} className='beauty-recent-card'>
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <div className='beauty-best-meta'>
                <span>₹{item.price}</span>
                <span>⭐ {item.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default BeautyPage
