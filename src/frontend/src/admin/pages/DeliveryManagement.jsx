import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deliveryApi } from '../services/adminService'
import '../styles/admin.css'

const deliveryStatuses = ['pending', 'assigned', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'delivery_failed', 'cancelled', 'returned']
const deliveryTypes = ['standard', 'express', 'same_day', 'next_day']
const sortOptions = [
  { value: 'latest', label: 'Latest Deliveries' },
  { value: 'oldest', label: 'Oldest Deliveries' },
  { value: 'eta', label: 'ETA' },
  { value: 'delivery_status', label: 'Delivery Status' },
]
const exceptionTypes = ['Customer Not Available', 'Incorrect Address', 'Delivery Refused', 'Package Damaged', 'Lost Shipment']
const delayReasons = ['Weather Delay', 'Traffic', 'Stock Transfer', 'Customer Requested', 'Other']

function DeliveryManagement() {
  const navigate = useNavigate()
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deliveryStatus, setDeliveryStatus] = useState('')
  const [deliveryPartner, setDeliveryPartner] = useState('')
  const [deliveryType, setDeliveryType] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(8)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  const loadDeliveries = async () => {
    setLoading(true)
    setFormError('')
    try {
      const response = await deliveryApi.list({
        search: search || undefined,
        delivery_status: deliveryStatus || undefined,
        delivery_partner: deliveryPartner || undefined,
        delivery_type: deliveryType || undefined,
        start_date: dateFrom || undefined,
        end_date: dateTo || undefined,
        sort_by: sortBy,
        skip: (page - 1) * pageSize,
        limit: pageSize,
      })
      setDeliveries(response.data || [])
    } catch (error) {
      setDeliveries([])
      setFormError('Unable to load deliveries. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadDeliveries() }, [search, deliveryStatus, deliveryPartner, deliveryType, dateFrom, dateTo, sortBy, page])

  const pagedDeliveries = useMemo(() => deliveries, [deliveries])

  const openDetail = (delivery) => {
    navigate(`/admin/delivery-management/view/${delivery.id}`)
  }

  const openAssign = (delivery) => {
    navigate(`/admin/delivery-management/assign/${delivery.id}`)
  }

  const openTracking = (delivery) => {
    navigate(`/admin/delivery-management/tracking/${delivery.id}`)
  }

  const openEta = (delivery) => {
    navigate(`/admin/delivery-management/eta/${delivery.id}`)
  }

  const openException = (delivery) => {
    navigate(`/admin/delivery-management/exception/${delivery.id}`)
  }


  const markDelivered = async (delivery) => {
    if (!window.confirm('Mark this delivery as delivered?')) return
    try {
      await deliveryApi.updateStatus(delivery.id, { delivery_status: 'delivered', remarks: 'Marked delivered by admin' })
      setFormSuccess('Delivery marked as delivered.')
      loadDeliveries()
    } catch {
      setFormError('Unable to update delivery status.')
    }
  }

  const cancelDelivery = async (delivery) => {
    if (!window.confirm('Cancel this delivery?')) return
    try {
      await deliveryApi.cancel(delivery.id, { reason: 'Cancelled by admin' })
      setFormSuccess('Delivery cancelled.')
      loadDeliveries()
    } catch {
      setFormError('Unable to cancel delivery.')
    }
  }

  const exportDeliveries = () => {
    const rows = deliveries.map((item) => [
      item.id,
      item.order_id,
      item.customer_name || 'Unknown',
      item.customer_phone || 'Unknown',
      item.delivery_address || 'Unknown',
      item.delivery_partner || '—',
      item.rider_name || '—',
      item.tracking_number || '—',
      item.estimated_delivery_date ? new Date(item.estimated_delivery_date).toLocaleString() : '—',
      item.delivery_status,
      item.updated_at ? new Date(item.updated_at).toLocaleString() : '—',
    ])
    const header = ['Delivery ID', 'Order ID', 'Customer', 'Phone', 'Address', 'Partner', 'Rider', 'Tracking', 'ETA', 'Status', 'Updated At']
    const csv = [header, ...rows].map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'deliveries.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className='admin-module-page'>
      <div className='admin-welcome'>
        <div>
          <h1>Delivery Management</h1>
          <p>Manage deliveries, assign delivery partners, monitor shipment status, track orders, update estimated delivery times, and handle delivery exceptions.</p>
        </div>
      </div>

      <div className='toolbar-card'>
        <div className='toolbar-controls'>
          <label className='field-group'><span>Search Delivery</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder='Order ID, Tracking Number, Customer, Phone' /></label>
          <label className='field-group'><span>Delivery Status</span><select value={deliveryStatus} onChange={(event) => setDeliveryStatus(event.target.value)}><option value=''>All</option>{deliveryStatuses.map((status) => <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>)}</select></label>
          <label className='field-group'><span>Delivery Partner</span><input value={deliveryPartner} onChange={(event) => setDeliveryPartner(event.target.value)} placeholder='Partner name' /></label>
          <label className='field-group'><span>Delivery Type</span><select value={deliveryType} onChange={(event) => setDeliveryType(event.target.value)}><option value=''>All</option>{deliveryTypes.map((type) => <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>)}</select></label>
          <label className='field-group'><span>Date From</span><input type='date' value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} /></label>
          <label className='field-group'><span>Date To</span><input type='date' value={dateTo} onChange={(event) => setDateTo(event.target.value)} /></label>
          <label className='field-group'><span>Sort By</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>{sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        </div>
        <button className='primary-button' onClick={exportDeliveries}>Export Deliveries</button>
      </div>

      {formError ? <div className='admin-error-box'>{formError}</div> : null}
      {formSuccess ? <div className='admin-success-box'>{formSuccess}</div> : null}

      <div className='table-card'>
        {loading ? <p>Loading deliveries...</p> : deliveries.length === 0 ? <p>No deliveries found.</p> : (
          <div className='table-wrapper'>
            <table className='data-table'>
              <thead>
                <tr>
                  <th>Delivery ID</th>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Partner</th>
                  <th>Rider</th>
                  <th>Tracking</th>
                  <th>ETA</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedDeliveries.map((delivery) => (
                  <tr key={delivery.id}>
                    <td>#{delivery.id}</td>
                    <td>#{delivery.order_id}</td>
                    <td>{delivery.customer_name || '—'}</td>
                    <td>{delivery.customer_phone || '—'}</td>
                    <td>{delivery.delivery_address || '—'}</td>
                    <td>{delivery.delivery_partner || '—'}</td>
                    <td>{delivery.rider_name || '—'}</td>
                    <td>{delivery.tracking_number || '—'}</td>
                    <td>{delivery.estimated_delivery_date ? new Date(delivery.estimated_delivery_date).toLocaleString() : '—'}</td>
                    <td><span className={`status-badge ${delivery.delivery_status === 'delivered' ? 'in-stock' : delivery.delivery_status === 'cancelled' ? 'out-of-stock' : 'low-stock'}`}>{delivery.delivery_status.replace(/_/g, ' ')}</span></td>
                    <td>{delivery.updated_at ? new Date(delivery.updated_at).toLocaleString() : '—'}</td>
                    <td>
                      <div className='action-buttons'>
                        <button className='ghost-button' onClick={() => openDetail(delivery)}>View</button>
                        <button className='ghost-button' onClick={() => openAssign(delivery)}>Assign</button>
                        <button className='ghost-button' onClick={() => openTracking(delivery)}>Track</button>
                        <button className='ghost-button' onClick={() => openEta(delivery)}>ETA</button>
                        <button className='ghost-button' onClick={() => markDelivered(delivery)}>Delivered</button>
                        <button className='ghost-button danger' onClick={() => cancelDelivery(delivery)}>Cancel</button>
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
        <button className='ghost-button' disabled={page * pageSize >= deliveries.length} onClick={() => setPage((value) => value + 1)}>Next</button>
      </div>
    </div>
  )
}

export default DeliveryManagement
