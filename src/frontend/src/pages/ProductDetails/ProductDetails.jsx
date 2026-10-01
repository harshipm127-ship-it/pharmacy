import { useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import cartService from '../../services/cartService'
import customerApi from '../../services/customerApi'
import './ProductDetails.css'

// Removed fallback/sample product and related product mock data.

function formatPrice(value) {
  const numericValue = Number(value || 0)

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(numericValue)
}

function getStockState(stock) {
  if (stock <= 0) {
    return { label: 'Out of Stock', className: 'out-of-stock' }
  }

  if (stock <= 25) {
    return { label: 'Limited Stock', className: 'limited-stock' }
  }

  return { label: 'In Stock', className: 'in-stock' }
}

function ProductDetails() {
  const auth = useContext(AuthContext)
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadProduct = async () => {
      try {
        const apiProduct = await customerApi.products.get(id)
        if (!isMounted) return
        setProduct(apiProduct)
        setSelectedImage(apiProduct.image_url || apiProduct.images?.[0]?.url || null)
      } catch (err) {
        if (!isMounted) return
        setProduct(null)
        setSelectedImage(null)
        setError('Unable to load product details.')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadProduct()
    return () => {
      isMounted = false
    }
  }, [id])

  const displayImages = useMemo(() => {
    if (!product) return []
    const gallery = product.images?.length ? product.images : [{ url: product.image_url }]
    return gallery.map((image) => image.url || image.image_url).filter(Boolean)
  }, [product])

  const productPrice = Number(product.selling_price || product.final_price || product.mrp || product.price || 0)
  const originalPrice = Number(product.mrp || product.selling_price || product.final_price || product.price || productPrice)
  const discountPercent = Number(product.discount || 0)
  const discountedPrice = Math.max(0, productPrice - (productPrice * discountPercent) / 100)
  const amountSaved = productPrice - discountedPrice
  const stockState = getStockState(product.stock || 0)
  const expiryDate = product.expiry_date || '2028-12-31'
  const expiryLabel = new Date(expiryDate) > new Date(Date.now() + 1000 * 60 * 60 * 24 * 180)
    ? 'Fresh stock'
    : 'Expiring soon'

  const addToCart = async () => {
    if (!product) return
    if (auth?.isAuthenticated) {
      try {
        await customerApi.cart.add(product.id, 1)
        return
      } catch {
        // if API cart add fails, fall back to local cart
      }
    }

    cartService.addToCart(product)
  }

  if (loading) {
    return <div className='status-text'>Loading product details...</div>
  }

  if (!product) {
    return (
      <section className='product-details-page'>
        <div className='empty-state'>
          <h2>Product not found</h2>
          <p>{error || 'This product is not available.'}</p>
        </div>
      </section>
    )
  }

  return (
    <section className='product-details-page'>
      <div className='product-layout'>
        <div className='product-gallery-card'>
          <div className='product-gallery'>
            <div className='main-image-frame'>
              <img src={selectedImage} alt={product.name} />
            </div>

            <div className='thumbnail-row'>
              {displayImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type='button'
                  className={`thumbnail ${selectedImage === image ? 'active' : ''}`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img src={image} alt={`${product.name} view ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className='product-summary-card'>
          <div className='product-summary'>
            <div className='badge-row'>
              <span className='badge'>Doctor Recommended</span>
              <span className='badge'>Prescription Friendly</span>
            </div>

            <h1>{product.name}</h1>

            <div className='meta-row'>
              <span className='rating-pill'>⭐ 4.8 / 5</span>
              <span className={`stock-pill ${stockState.className}`}>{stockState.label}</span>
            </div>

            <div className='inline-stats'>
              <span><strong>Brand:</strong> {product.brand?.name || product.brand || 'Trusted Brand'}</span>
              <span><strong>Manufacturer:</strong> {product.manufacturer || 'Careline Labs'}</span>
              <span><strong>Category:</strong> {product.category?.name || 'Healthcare'}</span>
            </div>

            <div className='price-block'>
              <div className='price-tile'>
                <span>Original Price</span>
                <strong>{formatPrice(originalPrice)}</strong>
              </div>
              <div className='price-tile'>
                <span>Discount</span>
                <strong>{discountPercent}%</strong>
              </div>
              <div className='price-tile'>
                <span>Discounted Price</span>
                <strong>{formatPrice(discountedPrice)}</strong>
              </div>
              <div className='price-tile'>
                <span>Amount Saved</span>
                <strong>{formatPrice(amountSaved)}</strong>
              </div>
            </div>

            <div className='action-row'>
              <button
                className='primary-action'
                type='button'
                onClick={() => {
                  if (auth?.isAuthenticated) {
                    addToCart()
                  } else {
                    auth.requireAuth(addToCart)
                  }
                }}
              >
                Add to Cart
              </button>
              <button className='secondary-action' type='button'>Buy Now</button>
              <button className='wishlist-action' type='button'>Add to Wishlist</button>
              <button className='share-action' type='button'>Share Product</button>
            </div>

            <div className='info-grid'>
              <div className='info-card'>
                <p className='kicker'>Offers</p>
                <strong>Free Delivery on ₹499+</strong>
                <p>Bank offer + 20% off on first order</p>
              </div>
              <div className='info-card'>
                <p className='kicker'>Availability</p>
                <strong>{product.stock ?? '—'}</strong>
                <p>Ships in 24 hours</p>
              </div>
              <div className='info-card'>
                <p className='kicker'>Expiry</p>
                <strong>{expiryLabel}</strong>
                <p>Expires on {expiryDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='content-card'>
        <h2>Product Description</h2>
        <p className='detail-copy'>{product.description || 'No description available.'}</p>
        <ul>
          <li>Supports daily immunity and overall wellness.</li>
          <li>Suitable for regular preventive care routines.</li>
          <li>Store in a cool, dry place away from direct sunlight.</li>
        </ul>
      </div>

      <div className='content-card'>
        <h2>Ingredients</h2>
        <table className='ingredient-table'>
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Strength / Composition</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {(product.ingredients || []).map((ingredient) => (
              <tr key={ingredient.name}>
                <td>{ingredient.name}</td>
                <td>{ingredient.strength}</td>
                <td>{ingredient.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='content-card'>
        <h2>Dosage Information</h2>
        <div className='dosage-card'>
          <p><strong>Recommended dosage:</strong> {product.dosage || '1 tablet daily after meals or as advised.'}</p>
          <p><strong>Timing:</strong> After food</p>
          <p><strong>Frequency:</strong> Once daily</p>
          <p><strong>Age restrictions:</strong> Adults and children above 12 years unless directed by a physician.</p>
        </div>
      </div>

      <div className='content-card'>
        <h2>Side Effects & Safety</h2>
        <div className='warning-card'>
          <p><strong>Common Side Effects:</strong> Mild stomach upset or nausea.</p>
          <p><strong>Serious Side Effects:</strong> Seek medical help if you notice signs of allergies or unusual symptoms.</p>
          <p><strong>Precautions:</strong> Keep out of reach of children. Inform your doctor if pregnant or under treatment.</p>
          <ul>
            <li>Consult a healthcare provider before combining with other prescription medicines.</li>
            <li>Do not exceed the prescribed dosage.</li>
          </ul>
        </div>
      </div>

      <div className='content-card'>
        <h2>Ratings & Reviews</h2>
        <div className='review-summary'>
          <div className='review-score'>4.8</div>
          <div>
            <p>Based on 124 verified purchases</p>
            <span className='badge'>Verified Purchase</span>
          </div>
        </div>

        <div className='info-grid'>
          <div className='review-item'>
            <div className='review-breakdown'>
              <div className='breakdown-row'><span>5★</span><div className='breakdown-bar'><span style={{ width: '78%' }}></span></div><span>78%</span></div>
              <div className='breakdown-row'><span>4★</span><div className='breakdown-bar'><span style={{ width: '14%' }}></span></div><span>14%</span></div>
              <div className='breakdown-row'><span>3★</span><div className='breakdown-bar'><span style={{ width: '5%' }}></span></div><span>5%</span></div>
            </div>
          </div>
          <div className='review-item'>
            <p>“Easy to order and delivered on time. Product quality is excellent.”</p>
            <small>Verified customer • 2 days ago</small>
          </div>
          <div className='review-item'>
            <p>“Helpful for daily wellness and very convenient for repeat orders.”</p>
            <small>Verified customer • 1 week ago</small>
          </div>
        </div>

        <div className='action-row'>
          <button className='primary-action' type='button'>Write a Review</button>
        </div>
      </div>

      <div className='related-card'>
        <h2>Related Products</h2>
        <div className='related-grid'>
          <div className='empty-state'>No related products available.</div>
        </div>
      </div>
    </section>
  )
}

export default ProductDetails
