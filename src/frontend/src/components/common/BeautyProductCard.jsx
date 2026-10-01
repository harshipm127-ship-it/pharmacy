import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import cartService from '../../services/cartService'
import customerApi from '../../services/customerApi'

function BeautyProductCard({ product }) {
  const auth = useContext(AuthContext)
  const originalPrice = Number(product.originalPrice || product.price)
  const discount = Number(product.discount || 0)

  const handleAddToCart = async () => {
    if (auth?.isAuthenticated) {
      try {
        await customerApi.cart.add(product.id, 1)
        return
      } catch {
        // fallback to local cart
      }
    }
    cartService.addToCart(product)
  }

  return (
    <article className='beauty-product-card'>
      <button type='button' className='wishlist-button' aria-label='Wishlist'>♥</button>
      <div className='beauty-product-image-wrap'>
        <img src={product.image} alt={product.name} className='beauty-product-image' />
      </div>

      <div className='beauty-product-content'>
        <h3>{product.name}</h3>
        <p className='beauty-product-brand'>{product.brand || 'Beauty Brand'}</p>
        <div className='beauty-price-row'>
          <span className='beauty-price'>₹{product.price}</span>
          <span className='beauty-original-price'>₹{originalPrice}</span>
          <span className='beauty-discount'>Save {discount}%</span>
        </div>
        <div className='beauty-product-meta'>
          <span>⭐ {product.rating}</span>
          <span>{product.stock || 'In Stock'}</span>
        </div>
        <div className='beauty-product-actions'>
          <button type='button' className='beauty-cart-button' onClick={() => auth.requireAuth(handleAddToCart)}>Add to Cart</button>
          <Link to='/checkout' className='beauty-buy-button'>Buy Now</Link>
        </div>
      </div>
    </article>
  )
}

export default BeautyProductCard
