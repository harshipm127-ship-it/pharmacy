import { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import cartService from '../../services/cartService'
import customerApi from '../../services/customerApi'
import AddressModal from '../../components/common/AddressModal'
import './Checkout.css'

function formatPrice(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(value || 0))
}

function normalizeCartItem(item) {
  const product = item.product || {}
  return {
    id: item.id,
    product_id: item.product_id,
    name: product.name || item.name || 'Medicine',
    brand: product.brand?.name || product.brand || item.brand || 'Trusted Brand',
    category: product.category?.name || item.category || 'General',
    price: Number(product.selling_price || product.final_price || product.mrp || item.price || 0),
    originalPrice: Number(product.mrp || product.selling_price || product.final_price || item.originalPrice || item.price || 0),
    discount: Number(product.discount || item.discount || 0),
    stock: Number(product.stock || item.stock || 0),
    image: product.image_url || product.image || item.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80',
    quantity: Number(item.quantity || 1)
  }
}

function Checkout() {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [cartItems, setCartItems] = useState([])
  const [couponCode, setCouponCode] = useState('')
  const [couponMessage, setCouponMessage] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [selectedDelivery, setSelectedDelivery] = useState(null)
  const [showAddressModal, setShowAddressModal] = useState(false)

  useEffect(() => {
    if (location?.state?.selectedAddressId) {
      setSelectedAddressId(location.state.selectedAddressId)
    }
    let isMounted = true

    const loadCart = async () => {
      if (auth?.isAuthenticated) {
        try {
          const response = await customerApi.cart.list()
          if (!isMounted) return
          setCartItems(Array.isArray(response) ? response.map(normalizeCartItem) : [])
          return
        } catch {
          // fallback to local cart
        }
      }

      if (!isMounted) return
      setCartItems(cartService.getCart())
    }

    loadCart().finally(() => {
      if (isMounted) {
        setLoading(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [auth?.isAuthenticated])

  useEffect(() => {
    if (location?.state?.selectedAddressId) {
      setSelectedAddressId(location.state.selectedAddressId)
      return
    }
    try {
      const raw = localStorage.getItem('selected_delivery_address')
      if (raw) {
        const addr = JSON.parse(raw)
        if (addr && addr.id) setSelectedAddressId(addr.id)
      }
    } catch (e) {
      // ignore
    }
  }, [location])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('selected_delivery_address')
      if (raw) {
        const addr = JSON.parse(raw)
        if (addr) {
          if (addr.id) {
            setSelectedAddressId(addr.id)
          }
          setSelectedDelivery(addr)
        }
      }
    } catch (e) {
      // ignore
    }
  }, [])

  useEffect(() => {
    let mounted = true
    const loadAddresses = async () => {
      if (!auth?.isAuthenticated) return
      try {
        const resp = await customerApi.addresses.list()
        if (!mounted) return
        setAddresses(Array.isArray(resp) ? resp : [])
        const def = (resp || []).find((a) => a.is_default)
        if (def) setSelectedAddressId(def.id)
      } catch (err) {
        // ignore
      }
    }
    loadAddresses()
    return () => { mounted = false }
  }, [auth?.isAuthenticated])

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0)
  }, [cartItems])

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
  const grandTotal = subtotal - couponDiscount + deliveryCharges + platformFee + gst

  const handleApplyCoupon = async () => {
    const normalizedCode = couponCode.trim().toUpperCase()
    if (!normalizedCode) {
      setCouponMessage('Enter a coupon code to continue.')
      setAppliedCoupon(null)
      return
    }

    try {
      const response = await customerApi.coupons.validate({
        code: normalizedCode,
        order_amount: subtotal,
        product_ids: cartItems.map((item) => item.product_id || item.id),
        delivery_charge: deliveryCharges
      })

      if (response.valid) {
        setAppliedCoupon({ code: normalizedCode, value: Number(response.discount_amount || 0), type: response.coupon_type })
        setCouponMessage(response.message || 'Coupon validated successfully.')
      } else {
        setAppliedCoupon(null)
        setCouponMessage(response.message || 'Coupon is invalid or not applicable.')
      }
    } catch {
      setCouponMessage('Unable to validate coupon. Please try again.')
      setAppliedCoupon(null)
    }
  }

  const handleSubmitOrder = async () => {
    if (!auth?.isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } })
      return
    }

    if (cartItems.length === 0) {
      setOrderError('Your cart is empty. Add products before checking out.')
      return
    }

    if (!selectedAddressId && !selectedDelivery) {
      setShowAddressModal(true)
      return
    }

    setSubmitting(true)
    setOrderError('')

    const payload = {
      items: cartItems.map((item) => ({ product_id: item.product_id || item.id, quantity: item.quantity })),
      coupon_code: appliedCoupon?.code || undefined,
      delivery_charge: deliveryCharges,
      address_id: selectedAddressId || undefined
    }

    try {
      await customerApi.checkout.createOrder(payload)
      if (auth?.isAuthenticated) {
        await customerApi.cart.clear().catch(() => {})
      } else {
        cartService.clearCart()
      }
      navigate('/orders')
    } catch (error) {
      const message = error?.response?.data?.detail || error?.message || 'Unable to place the order. Please try again.'
      setOrderError(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <section className='checkout-page'>
        <div className='checkout-loading'>Loading checkout details...</div>
      </section>
    )
  }

  if (cartItems.length === 0) {
    // continue to render checkout UI which will show empty state inside the main return
  }

  // embed address modal so checkout can select address
  return (
    <>
      <section className='checkout-page'>
        <div className='checkout-layout'>
          <div className='checkout-summary'>
            <h1>Checkout</h1>

            <div className='checkout-section'>
              <h2>Order summary</h2>
              {cartItems.map((item) => (
                <div className='checkout-item' key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.quantity} × {formatPrice(item.price)}</p>
                  </div>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className='checkout-section'>
              <h2>Apply coupon</h2>
              <div className='coupon-row'>
                <input value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder='Coupon code' />
                <button type='button' className='secondary-btn' onClick={handleApplyCoupon}>Apply</button>
              </div>
              {couponMessage && <p className='coupon-message'>{couponMessage}</p>}
            </div>

            <div className='checkout-totals'>
              <div className='totals-row'><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className='totals-row'><span>Coupon discount</span><span>-{formatPrice(couponDiscount)}</span></div>
              <div className='totals-row'><span>Delivery charges</span><span>{formatPrice(deliveryCharges)}</span></div>
              <div className='totals-row'><span>Platform fee</span><span>{formatPrice(platformFee)}</span></div>
              <div className='totals-row'><span>GST</span><span>{formatPrice(gst)}</span></div>
              <div className='totals-row total'><strong>Total</strong><strong>{formatPrice(grandTotal)}</strong></div>
            </div>

            {orderError && <div className='checkout-error'>{orderError}</div>}

            <button className='cta-btn' type='button' onClick={handleSubmitOrder} disabled={submitting}>
              {submitting ? 'Placing order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </section>

      <AddressModal isOpen={showAddressModal} onClose={() => setShowAddressModal(false)} onSelect={(address) => {
        if (address?.id) setSelectedAddressId(address.id)
        if (address) setSelectedDelivery(address)
        setShowAddressModal(false)
      }} />
    </>
  )
}

export default Checkout
