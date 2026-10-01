import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import customerApi from '../../services/customerApi'
import './OrderDetails.css'

function formatPrice(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(value || 0))
}

function OrderDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadOrder = async () => {
      try {
        const response = await customerApi.orders.get(id)
        if (!isMounted) return
        setOrder(response)
      } catch (err) {
        if (!isMounted) return
        setError('Unable to load the order details. Please try again.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadOrder()
    return () => {
      isMounted = false
    }
  }, [id])

  const itemCount = useMemo(() => {
    return order?.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0
  }, [order])

  if (loading) {
    return (
      <section className='order-details-page'>
        <p>Loading order details...</p>
      </section>
    )
  }

  if (error || !order) {
    return (
      <section className='order-details-page'>
        <div className='order-error-card'>
          <p>{error || 'Order not found.'}</p>
          <button type='button' className='cta-btn' onClick={() => navigate('/orders')}>Back to Orders</button>
        </div>
      </section>
    )
  }

  return (
    <section className='order-details-page'>
      <div className='order-details-card'>
        <div className='order-header'>
          <div>
            <h1>Order #{order.id}</h1>
            <p>{new Date(order.order_date).toLocaleString()}</p>
          </div>
          <span className='order-status-pill'>{order.order_status}</span>
        </div>

        <div className='order-summary'>
          <div>
            <p><strong>Items</strong></p>
            <p>{itemCount} products</p>
          </div>
          <div>
            <p><strong>Payment</strong></p>
            <p>{order.payment_status}</p>
          </div>
          <div>
            <p><strong>Total</strong></p>
            <p>{formatPrice(order.total_amount)}</p>
          </div>
        </div>

        <div className='order-items'>
          <h2>Order items</h2>
          {order.items?.map((item) => (
            <div key={item.id} className='order-item-row'>
              <div>
                <strong>Product #{item.product_id}</strong>
                <p>Quantity: {item.quantity}</p>
              </div>
              <span>{formatPrice(item.subtotal)}</span>
            </div>
          ))}
        </div>

        <div className='order-details-actions'>
          <button type='button' className='cta-btn' onClick={() => navigate('/orders')}>Back to Orders</button>
        </div>
      </div>
    </section>
  )
}

export default OrderDetails
