import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ordersApi, paymentApi } from '../services/adminService'
import '../styles/admin.css'

const orderStatuses = ['pending', 'confirmed', 'packed', 'ready_for_shipment', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded']
const deliveryStatuses = ['pending', 'assigned', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled']
const paymentStatuses = ['pending', 'completed', 'failed', 'refunded']

function OrdersManagement() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState('')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('')
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('')
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 8

  const loadOrders = async () => {
    setLoading(true)
    try {
      const response = await ordersApi.list({ search, order_status: orderStatusFilter || undefined, payment_status: paymentStatusFilter || undefined, payment_method: paymentMethodFilter || undefined, delivery_status: deliveryStatusFilter || undefined, sort_by: sortBy })
      setOrders(response.data || [])
    } catch {
      setOrders([])
      setError('Unable to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadOrders() }, [search, orderStatusFilter, paymentStatusFilter, paymentMethodFilter, deliveryStatusFilter, sortBy])

  const filteredOrders = useMemo(() => orders, [orders])
  const pagedOrders = useMemo(() => filteredOrders.slice((page - 1) * pageSize, page * pageSize), [filteredOrders, page])

  const openDetails = (order) => {
    navigate(`/admin/orders/view/${order.id}`)
  }

  const openStatusEditor = (order) => {
    navigate(`/admin/orders/update/${order.id}`)
  }

  const cancelOrder = async (order) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return
    try {
      await ordersApi.cancel(order.id, { reason: 'cancelled by admin' })
      setSuccess('Order cancelled')
      loadOrders()
    } catch {
      setError('Unable to cancel order')
    }
  }

  const refundOrder = async (order) => {
    try {
      await ordersApi.refund(order.id, { status: 'pending', amount: order.total_amount })
      setSuccess('Refund requested')
      loadOrders()
    } catch {
      setError('Unable to process refund')
    }
  }

  const exportOrders = () => {
    const rows = orders.map((order) => [order.id, order.user?.name || '', order.user?.phone || '', order.order_date || '', order.order_items?.length || 0, order.total_amount, order.payment_method || '', order.payment_status, order.order_status, order.delivery_status, order.delivery_partner || ''])
    const csv = [['Order ID', 'Customer Name', 'Phone Number', 'Order Date', 'Items', 'Total Amount', 'Payment Method', 'Payment Status', 'Order Status', 'Delivery Status', 'Delivery Partner'], ...rows].map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'orders.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className='admin-module-page'>
      <div className='admin-welcome'>
        <div>
          <h1>Orders Management</h1>
          <p>Manage customer orders, monitor order status, process deliveries, handle cancellations, and generate invoices.</p>
        </div>
      </div>

      <div className='toolbar-card'>
        <div className='toolbar-controls'>
          <label className='field-group'><span>Search Order</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder='Order ID, customer, phone' /></label>
          <label className='field-group'><span>Filter by Order Status</span><select value={orderStatusFilter} onChange={(event) => setOrderStatusFilter(event.target.value)}><option value=''>All</option>{orderStatuses.map((status) => <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>)}</select></label>
          <label className='field-group'><span>Filter by Payment Status</span><select value={paymentStatusFilter} onChange={(event) => setPaymentStatusFilter(event.target.value)}><option value=''>All</option>{paymentStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
          <label className='field-group'><span>Filter by Payment Method</span><select value={paymentMethodFilter} onChange={(event) => setPaymentMethodFilter(event.target.value)}><option value=''>All</option><option value='cod'>Cash on Delivery</option><option value='card'>Card</option><option value='upi'>UPI</option></select></label>
          <label className='field-group'><span>Filter by Delivery Status</span><select value={deliveryStatusFilter} onChange={(event) => setDeliveryStatusFilter(event.target.value)}><option value=''>All</option>{deliveryStatuses.map((status) => <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>)}</select></label>
          <label className='field-group'><span>Sort By</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value='latest'>Latest</option><option value='oldest'>Oldest</option><option value='highest_amount'>Highest Amount</option><option value='lowest_amount'>Lowest Amount</option></select></label>
        </div>
        <button className='primary-button' onClick={exportOrders}>Export Orders</button>
      </div>

      {error ? <div className='admin-error-box'>{error}</div> : null}
      {success ? <div className='admin-success-box'>{success}</div> : null}

      <div className='table-card'>
        {loading ? <p>Loading orders...</p> : orders.length === 0 ? <p>No orders found.</p> : (
          <div className='table-wrapper'>
            <table className='data-table'>
              <thead>
                <tr>
                  <th>Order ID</th><th>Customer</th><th>Phone</th><th>Date</th><th>Items</th><th>Total</th><th>Payment</th><th>Payment Status</th><th>Order Status</th><th>Delivery Status</th><th>Partner</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.user?.name || '—'}</td>
                    <td>{order.user?.phone || '—'}</td>
                    <td>{order.order_date ? new Date(order.order_date).toLocaleDateString() : '—'}</td>
                    <td>{order.order_items?.length || 0}</td>
                    <td>{order.total_amount}</td>
                    <td>{order.payment_method || '—'}</td>
                    <td><span className='status-badge in-stock'>{order.payment_status || 'pending'}</span></td>
                    <td><span className='status-badge low-stock'>{order.order_status || 'pending'}</span></td>
                    <td><span className='status-badge in-stock'>{order.delivery_status || 'pending'}</span></td>
                    <td>{order.delivery_partner || '—'}</td>
                    <td>
                      <div className='action-buttons'>
                        <button className='ghost-button' onClick={() => openDetails(order)}>View</button>
                        <button className='ghost-button' onClick={() => openStatusEditor(order)}>Update</button>
                        <button className='ghost-button' onClick={() => cancelOrder(order)}>Cancel</button>
                        {order.payment_status === 'completed' ? <button className='ghost-button' onClick={() => refundOrder(order)}>Refund</button> : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className='pagination-row'>
        <button className='ghost-button' disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button>
        <span>Page {page}</span>
        <button className='ghost-button' disabled={page * pageSize >= filteredOrders.length} onClick={() => setPage((value) => value + 1)}>Next</button>
      </div>

    </div>
  )
}

export default OrdersManagement
