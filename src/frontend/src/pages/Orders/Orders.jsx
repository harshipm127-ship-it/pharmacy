import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import customerApi from '../../services/customerApi'
import './Orders.css'

function formatPrice(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(value || 0))
}

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadOrders = async () => {
      try {
        const response = await customerApi.orders.list()
        if (isMounted) {
          setOrders(response)
        }
      } catch {
        if (isMounted) {
          setOrders([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadOrders()
    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return (
      <section className='orders-page'>
        <p>Loading your orders...</p>
      </section>
    )
  }

  if (orders.length === 0) {
    return (
      <section className='orders-page'>
        <h1>Your Orders</h1>
        <p>No orders found yet.</p>
        <Link className='cta-btn' to='/products'>Browse products</Link>
      </section>
    )
  }

  return (
    <section className='orders-page'>
      <h1>Your Orders</h1>
      <div className='orders-list'>
        {orders.map((order) => (
          <article className='order-card' key={order.id}>
            <div className='order-header'>
              <div>
                <h2>Order #{order.id}</h2>
                <p>{new Date(order.order_date).toLocaleDateString()}</p>
              </div>
              <span className='order-status'>{order.order_status}</span>
            </div>
            <div className='order-details'>
              <span>{order.items.length} items</span>
              <span>{order.payment_status}</span>
              <strong>{formatPrice(order.total_amount)}</strong>
            </div>
            <div className='order-actions'>
              <Link className='secondary-btn' to={`/orders/${order.id}`}>View details</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Orders
