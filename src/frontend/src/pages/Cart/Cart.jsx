import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import BeautyProductCard from '../../components/common/BeautyProductCard'
import cartService from '../../services/cartService'
import customerApi from '../../services/customerApi'
import './Cart.css'

const couponCatalog = {
  MEDCART10: { type: 'percent', value: 10, message: '10% off applied successfully.' },
  SAVE25: { type: 'percent', value: 25, message: '25% off applied successfully.' },
  FLAT150: { type: 'fixed', value: 150, message: '₹150 discount applied successfully.' }
}

const fallbackCatalog = [
  { id: 401, name: 'Hydra Bloom Face Cream', brand: 'Cetaphil', price: 599, originalPrice: 799, discount: 25, stock: 50, image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=700&q=80', description: 'Daily hydration support for soft and radiant skin.', category: 'Skin Care', rating: 4.5 },
  { id: 402, name: 'Rose Velvet Lip Balm', brand: 'Lakme', price: 189, originalPrice: 249, discount: 24, stock: 60, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=80', description: 'Velvety moisture for smooth and nourished lips.', category: 'Beauty', rating: 4.4 },
  { id: 403, name: 'Daily Glow Serum', brand: 'Sebamed', price: 899, originalPrice: 1199, discount: 25, stock: 70, image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&q=80', description: 'Brightening serum designed for everyday glow.', category: 'Skin Care', rating: 4.7 },
  { id: 404, name: 'Cleanse & Hydrate Duo', brand: 'Mamaearth', price: 749, originalPrice: 999, discount: 25, stock: 45, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=80', description: 'Gentle cleanse and hydration combo for all-day comfort.', category: 'Personal Care', rating: 4.3 },
  { id: 405, name: 'Daily Shield Sunscreen', brand: 'Himalaya', price: 479, originalPrice: 649, discount: 26, stock: 48, image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=80', description: 'Broad-spectrum everyday UV protection for daily use.', category: 'Skin Care', rating: 4.6 },
  { id: 406, name: 'Intense Moisture Lotion', brand: 'Nivea', price: 329, originalPrice: 399, discount: 18, stock: 40, image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=700&q=80', description: 'Long-lasting hydration for soft, smooth skin.', category: 'Personal Care', rating: 4.2 },
  { id: 407, name: 'Radiant Skin Serum', brand: 'Himalaya', price: 449, originalPrice: 529, discount: 15, stock: 55, image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=80', description: 'Nourishing serum to support a healthy-looking glow.', category: 'Skin Care', rating: 4.5 },
  { id: 408, name: 'Soft Care Face Mask', brand: 'Biotique', price: 279, originalPrice: 349, discount: 20, stock: 52, image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=700&q=80', description: 'A calming mask for fresh and rejuvenated skin.', category: 'Skin Care', rating: 4.1 }
]

const topBrandTiles = [
  { name: 'Dlova', tag: 'Glow Essentials' },
  { name: 'Himalaya', tag: 'Daily Wellness' },
  { name: 'Mamaearth', tag: 'Gentle Care' },
  { name: 'Nivea', tag: 'Trusted Everyday' }
]

const wellnessBannerTiles = [
  { title: 'Immunity Boost', description: 'Daily nutrition and wellness essentials.' },
  { title: 'Better Sleep', description: 'Restorative solutions for calm evenings.' },
  { title: 'Digestive Care', description: 'Gentle support for everyday gut comfort.' }
]

function formatPrice(value) {
  const amount = Number(value ?? 0)

  return `₹ ${new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(amount)}`
}

function getStockState(stock) {
  if (stock <= 0) {
    return { label: 'Out of Stock', className: 'out-of-stock' }
  }

  if (stock <= 15) {
    return { label: 'Low Stock', className: 'low-stock' }
  }

  return { label: 'In Stock', className: 'in-stock' }
}

function buildCardProduct(product) {
  return {
    id: product.id,
    name: product.name,
    brand: product.brand?.name || product.brand || product.manufacturer || 'Trusted Brand',
    price: Number(product.price || 0),
    originalPrice: Number(product.originalPrice || product.mrp || product.price || 0),
    discount: Number(product.discount || 0),
    image: product.image_url || product.image || product.images?.[0]?.image_url || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80',
    stock: Number(product.stock || 55),
    rating: Number(product.rating || 4.4),
    category: product.category
  }
}

export function resolveCartItems({ isAuthenticated, backendItems = [], localItems = [], hasBackendError = false }) {
  if (!isAuthenticated) {
    return localItems
  }

  if (hasBackendError) {
    return []
  }

  return backendItems
}

function normalizeCartItem(item) {
  const product = item.product || {}
  return {
    id: item.id,
    product_id: item.product_id,
    name: product.name || item.name || 'Medicine',
    brand: product.brand?.name || product.brand || item.brand || 'Trusted Brand',
    category: product.category?.name || item.category || 'General',
    description: product.description || item.description || 'Healthcare essentials for daily use.',
    price: Number(product.selling_price || product.final_price || product.mrp || item.price || 0),
    originalPrice: Number(product.mrp || product.selling_price || product.final_price || item.originalPrice || item.price || 0),
    discount: Number(product.discount || item.discount || 0),
    stock: Number(product.stock || item.stock || 0),
    image: product.image_url || product.image || item.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80',
    quantity: Number(item.quantity || 1),
    deliveryDate: product.delivery_date || item.deliveryDate || 'Tomorrow'
  }
}

function ProductCarouselSection({ title, subtitle, products }) {
  const scrollRef = useRef(null)
  const [showArrows, setShowArrows] = useState(false)

  useEffect(() => {
    const element = scrollRef.current
    if (!element) {
      return undefined
    }

    const updateVisibility = () => {
      setShowArrows(element.scrollWidth > element.clientWidth + 2)
    }

    updateVisibility()
    window.addEventListener('resize', updateVisibility)

    return () => window.removeEventListener('resize', updateVisibility)
  }, [products])

  const scrollCards = (direction) => {
    const element = scrollRef.current
    if (!element) {
      return
    }

    element.scrollBy({
      left: direction * 280,
      behavior: 'smooth'
    })
  }

  return (
    <section className='cart-recommendation-section'>
      <div className='recommendation-header'>
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>

        {showArrows && (
          <div className='carousel-arrows'>
            <button className='slider-arrow' type='button' onClick={() => scrollCards(-1)} aria-label='Scroll left'>←</button>
            <button className='slider-arrow' type='button' onClick={() => scrollCards(1)} aria-label='Scroll right'>→</button>
          </div>
        )}
      </div>

      <div className='recommendation-slider' ref={scrollRef}>
        {products.length > 0 ? (
          products.map((product) => (
            <div className='recommendation-slide' key={product.id}>
              <div className='recommendation-add-pill'>
                <button
                  type='button'
                  onClick={() => auth.requireAuth(async () => {
                    try {
                      await customerApi.cart.add(product.id, 1)
                    } catch {
                      cartService.addToCart(product)
                    }
                  })}
                >+ Add</button>
              </div>
              <BeautyProductCard product={buildCardProduct(product)} />
            </div>
          ))
        ) : (
          <div className='product-placeholder'>No products available right now.</div>
        )}
      </div>
    </section>
  )
}

function Cart() {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [savedItems, setSavedItems] = useState(() => cartService.getSavedForLater())
  const [catalogProducts, setCatalogProducts] = useState([])
  const [couponCode, setCouponCode] = useState('')
  const [couponMessage, setCouponMessage] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [isBackendCart, setIsBackendCart] = useState(false)
  const [isLoadingCart, setIsLoadingCart] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadCart = async () => {
      if (auth?.isAuthenticated) {
        try {
          const response = await customerApi.cart.list()
          if (!isMounted) return
          setItems(resolveCartItems({
            isAuthenticated: true,
            backendItems: response.map(normalizeCartItem),
            localItems: [],
            hasBackendError: false,
          }))
          setIsBackendCart(true)
        } catch {
          if (!isMounted) return
          setItems(resolveCartItems({
            isAuthenticated: true,
            backendItems: [],
            localItems: [],
            hasBackendError: true,
          }))
          setIsBackendCart(true)
        }
      } else {
        setItems(resolveCartItems({
          isAuthenticated: false,
          backendItems: [],
          localItems: cartService.getCart(),
          hasBackendError: false,
        }))
        setIsBackendCart(false)
      }

      if (isMounted) {
        setSavedItems(cartService.getSavedForLater())
        setIsLoadingCart(false)
      }
    }

    loadCart()
    window.addEventListener('cart-updated', loadCart)

    return () => {
      isMounted = false
      window.removeEventListener('cart-updated', loadCart)
    }
  }, [auth?.isAuthenticated])

  useEffect(() => {
    let isMounted = true

    const loadCatalogProducts = async () => {
      try {
        const response = await customerApi.products.list({ limit: 8 })
        if (isMounted && Array.isArray(response) && response.length > 0) {
          setCatalogProducts(response)
        } else if (isMounted) {
          setCatalogProducts(fallbackCatalog)
        }
      } catch {
        if (isMounted) {
          setCatalogProducts(fallbackCatalog)
        }
      }
    }

    loadCatalogProducts()

    return () => {
      isMounted = false
    }
  }, [])

  const recommendationSections = useMemo(() => {
    const normalizedCatalog = catalogProducts.length > 0 ? catalogProducts.map((product) => buildCardProduct(product)) : fallbackCatalog.map((product) => buildCardProduct(product))

    const cartCategories = items.map((item) => item.category).filter(Boolean)
    const cartBrands = items.map((item) => item.brand).filter(Boolean)

    const recommended = normalizedCatalog.filter((product) => {
      const matchesCategory = cartCategories.includes(product.category || product.brand)
      const matchesBrand = cartBrands.includes(product.brand)
      return matchesCategory || matchesBrand
    })

    return {
      recentlyViewed: normalizedCatalog.slice(0, 5),
      recommendedProducts: recommended.length > 0 ? recommended.slice(0, 5) : normalizedCatalog.slice(0, 5),
      frequentlyBoughtTogether: normalizedCatalog.slice(2, 7),
      trendingProducts: normalizedCatalog.slice(1, 6),
      youMayAlsoLike: normalizedCatalog.slice(3, 8)
    }
  }, [catalogProducts, items])

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0)
  }, [items])

  const mrpTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.originalPrice || item.price || 0) * Number(item.quantity || 0), 0)
  }, [items])

  const productDiscount = useMemo(() => {
    return Math.max(mrpTotal - subtotal, 0)
  }, [mrpTotal, subtotal])

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) {
      return 0
    }

    if (appliedCoupon.type === 'percent') {
      return Math.round(subtotal * (appliedCoupon.value / 100))
    }

    return appliedCoupon.value
  }, [appliedCoupon, subtotal])

  const deliveryCharges = subtotal > 499 ? 0 : 79
  const platformFee = subtotal > 999 ? 0 : 29
  const gst = Math.round((subtotal - couponDiscount + deliveryCharges + platformFee) * 0.05)
  const totalSavings = productDiscount + couponDiscount
  const grandTotal = subtotal - couponDiscount + deliveryCharges + platformFee + gst

  const handleAddToCart = async (product) => {
    if (auth?.isAuthenticated) {
      try {
        await customerApi.cart.add(product.id, 1)
        const response = await customerApi.cart.list()
        setItems(resolveCartItems({
          isAuthenticated: true,
          backendItems: response.map(normalizeCartItem),
          localItems: [],
          hasBackendError: false,
        }))
        setIsBackendCart(true)
        return
      } catch {
        setItems([])
        setIsBackendCart(true)
        return
      }
    }

    cartService.addToCart(product)
    setItems(cartService.getCart())
  }

  const updateQuantity = async (itemId, nextQuantity) => {
    const safeQuantity = Math.max(1, Number(nextQuantity) || 1)

    if (isBackendCart && auth?.isAuthenticated) {
      setItems((current) => current.map((item) => {
        const matches = (item.product_id ?? item.id) === itemId
        return matches ? { ...item, quantity: safeQuantity } : item
      }))

      try {
        await customerApi.cart.update(itemId, safeQuantity)
        const refreshed = await customerApi.cart.list()
        setItems(resolveCartItems({
          isAuthenticated: true,
          backendItems: refreshed.map(normalizeCartItem),
          localItems: [],
          hasBackendError: false,
        }))
        return
      } catch {
        setItems([])
        return
      }
    }

    const updatedItems = cartService.getCart().map((item) => {
      const matches = (item.product_id ?? item.id) === itemId
      return matches ? { ...item, quantity: safeQuantity } : item
    })
    cartService.saveCart(updatedItems)
    setItems(updatedItems)
  }

  const removeItem = async (itemId) => {
    if (isBackendCart && auth?.isAuthenticated) {
      const currentItems = items.filter((item) => (item.product_id ?? item.id) !== itemId)
      setItems(currentItems)

      try {
        await customerApi.cart.remove(itemId)
        const refreshed = await customerApi.cart.list()
        setItems(resolveCartItems({
          isAuthenticated: true,
          backendItems: refreshed.map(normalizeCartItem),
          localItems: [],
          hasBackendError: false,
        }))
        return
      } catch {
        setItems([])
        return
      }
    }

    const updatedItems = cartService.getCart().filter((item) => (item.product_id ?? item.id) !== itemId)
    cartService.saveCart(updatedItems)
    setItems(updatedItems)
  }

  const saveForLater = (id) => {
    const result = cartService.saveForLater(id)
    setItems(result.cart)
    setSavedItems(result.saved)
  }

  const moveToCart = (id) => {
    const result = cartService.moveToCart(id)
    setItems(result.cart)
    setSavedItems(result.saved)
  }

  const handleApplyCoupon = async () => {
    const normalizedCode = couponCode.trim().toUpperCase()
    if (!normalizedCode) {
      setCouponMessage('Please enter a coupon code.')
      setAppliedCoupon(null)
      return
    }

    const orderAmount = subtotal
    const productIds = items.map((item) => item.product_id || item.id)
    const deliveryCharge = deliveryCharges

    try {
      const response = await customerApi.coupons.validate({
        code: normalizedCode,
        user_id: null,
        order_amount: orderAmount,
        product_ids: productIds,
        delivery_charge: deliveryCharge
      })

      if (response.valid) {
        setAppliedCoupon({ code: normalizedCode, value: Number(response.discount_amount || 0), type: response.coupon_type })
        setCouponMessage(response.message || 'Coupon validated successfully.')
      } else {
        setAppliedCoupon(null)
        setCouponMessage(response.message || 'Coupon is invalid or not applicable.')
      }
    } catch {
      setCouponMessage('Unable to validate coupon. Please try again later.')
      setAppliedCoupon(null)
    }
  }

  const handleProceedToCheckout = () => {
    if (!auth?.isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } })
      return
    }

    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <section className='cart-page'>
        <div className='empty-card'>
          <div className='empty-illustration' aria-hidden='true'>🛒</div>
          <h2>Your cart is empty.</h2>
          <p>Browse trusted medicines and health essentials to get started.</p>
          <div className='empty-actions'>
            <Link className='cta-btn' to='/'>Continue Shopping</Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className='cart-page'>
        <div className='cart-card'>
          <div className='cart-header'>
            <h1>Your Cart</h1>
            <span>{items.length} items</span>
          </div>

          <div className='cart-items'>
            {items.map((item) => {
              const stockState = getStockState(item.stock || 0)
              const discountPercent = Number(item.discount || 0)
              const itemKey = item.product_id ?? item.id

              return (
                <article className='cart-item' key={itemKey}>
                  <img src={item.image} alt={item.name} />

                  <div className='cart-item-main'>
                    <div className='cart-item-badges'>
                      <span className='category-chip'>{item.category || 'General'}</span>
                      <span className={`stock-pill ${stockState.className}`}>{stockState.label}</span>
                    </div>
                    <h3>{item.name}</h3>
                    <small>{item.brand}</small>
                    <p className='item-description'>{item.description}</p>
                    <div className='price-row'>
                      <strong>{formatPrice(item.price)}</strong>
                      <span className='original-price'>{formatPrice(item.originalPrice || item.price)}</span>
                      <span className='discount-tag'>{discountPercent}% OFF</span>
                    </div>
                    <div className='delivery-row'>
                      <span>Expected delivery</span>
                      <strong>{item.deliveryDate}</strong>
                    </div>
                  </div>

                  <div className='cart-item-controls'>
                    <div className='quantity-row'>
                      <button className='qty-btn' type='button' onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <strong>{item.quantity}</strong>
                      <button className='qty-btn' type='button' onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button className='remove-btn' type='button' onClick={() => removeItem(item.id)}>Remove</button>
                    <button className='save-btn' type='button' onClick={() => saveForLater(item.id)}>Save for Later</button>
                  </div>
                </article>
              )
            })}
          </div>

          {savedItems.length > 0 && (
            <div className='saved-card'>
              <div className='saved-header'>
                <h2>Saved for Later</h2>
              </div>

              <div className='saved-list'>
                {savedItems.map((item) => (
                  <article className='saved-item' key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <small>{item.brand}</small>
                    </div>
                    <button className='save-btn' type='button' onClick={() => moveToCart(item.id)}>Move to Cart</button>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className='summary-card'>
          <div className='summary-header'>
            <h2>Payment Details</h2>
            <span>Secure checkout</span>
          </div>

          {!auth?.isAuthenticated && (
            <div className='login-notice'>
              <p>Please login to proceed with your order.</p>
              <Link className='secondary-btn' to='/login' state={{ from: '/cart' }}>Login</Link>
            </div>
          )}

          <div className='summary-list'>
            <div className='summary-row'>
              <span>MRP Total</span>
              <span>{formatPrice(mrpTotal)}</span>
            </div>
            <div className='summary-row'>
              <span>Product Discount</span>
              <span>-{formatPrice(productDiscount)}</span>
            </div>
            <div className='summary-row'>
              <span>Coupon Discount</span>
              <span>-{formatPrice(couponDiscount)}</span>
            </div>
            <div className='summary-row'>
              <span>Delivery Charges</span>
              <span>{formatPrice(deliveryCharges)}</span>
            </div>
            <div className='summary-row'>
              <span>Platform Fee</span>
              <span>{formatPrice(platformFee)}</span>
            </div>
            <div className='summary-row'>
              <span>GST</span>
              <span>{formatPrice(gst)}</span>
            </div>
            <div className='summary-row total-savings'>
              <span>Total Savings</span>
              <span>{formatPrice(totalSavings)}</span>
            </div>
            <div className='summary-row total'>
              <span>Grand Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
          </div>

          <div className='action-stack'>
            <Link className='secondary-btn' to='/'>Continue Shopping</Link>
            <button className='cta-btn' type='button' onClick={handleProceedToCheckout}>Proceed to Checkout</button>
          </div>
        </aside>
      </section>

      <div className='cart-page-appendix'>
        <div className='cart-recommendation-stack'>
          <ProductCarouselSection
            title='Recently Viewed'
            subtitle='Pick up where you left off on your last visit.'
            products={recommendationSections.recentlyViewed}
          />
          <ProductCarouselSection
            title='Frequently Bought Together / Recommended Products'
            subtitle='Popular additions and curated picks personalized for your cart.'
            products={recommendationSections.recommendedProducts}
          />
          <ProductCarouselSection
            title='Trending Products'
            subtitle='Top picks customers are loving right now.'
            products={recommendationSections.trendingProducts}
          />
          <ProductCarouselSection
            title='You May Also Like'
            subtitle='Hand-picked care essentials worth exploring.'
            products={recommendationSections.youMayAlsoLike}
          />
        </div>

        <section className='brand-spotlight'>
          <div className='section-title-row'>
            <h3>Top Brands</h3>
            <span>Trusted names in wellness and daily care</span>
          </div>

          <div className='brand-grid'>
            {topBrandTiles.map((brand) => (
              <article className='brand-card' key={brand.name}>
                <h4>{brand.name}</h4>
                <p>{brand.tag}</p>
              </article>
            ))}
          </div>
        </section>

        <section className='wellness-banner-spotlight'>
          <div className='section-title-row'>
            <h3>Health & Wellness Banners</h3>
            <span>Care routines made simple</span>
          </div>

          <div className='wellness-banner-grid'>
            {wellnessBannerTiles.map((banner) => (
              <article className='wellness-banner-card' key={banner.title}>
                <h4>{banner.title}</h4>
                <p>{banner.description}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className='cart-page-footer'>
          <span>© 2026 HealthCart</span>
          <span>Trusted essentials for your everyday wellness routine.</span>
        </footer>
      </div>
    </>
  )
}

export default Cart
