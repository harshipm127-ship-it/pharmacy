import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { couponApi } from '../services/adminService'

const statusLabels = {
  active: { label: 'Active', className: 'status-badge in-stock' },
  scheduled: { label: 'Scheduled', className: 'status-badge low-stock' },
  expired: { label: 'Expired', className: 'status-badge expired' },
  inactive: { label: 'Inactive', className: 'status-badge out-of-stock' },
}

const discountText = (coupon) => {
  if (coupon.coupon_type === 'percentage') return `${coupon.discount_percentage || 0}%`
  if (coupon.coupon_type === 'flat') return `₹${coupon.discount_amount || 0}`
  if (coupon.coupon_type === 'free_delivery') return 'Free Delivery'
  return '—'
}

const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString()
}

export default function CouponsList() {
  const navigate = useNavigate()
  const [coupons, setCoupons] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [page, setPage] = useState(1)
  const [analytics, setAnalytics] = useState(null)

  const limit = 12

  const loadAnalytics = async () => {
    try {
      const response = await couponApi.analytics()
      setAnalytics(response.data)
    } catch {
      setAnalytics(null)
    }
  }

  const loadCoupons = async () => {
    setLoading(true)
    try {
      const params = {
        skip: (page - 1) * limit,
        limit,
        search: search || undefined,
        status: statusFilter || undefined,
        coupon_type: typeFilter || undefined,
        sort_by: sortBy || undefined,
      }
      const response = await couponApi.list(params)
      setCoupons(response.data.items || [])
      setTotal(response.data.total || 0)
    } catch {
      setCoupons([])
      setTotal(0)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  useEffect(() => {
    loadCoupons()
  }, [search, statusFilter, typeFilter, sortBy, page])

  const refreshData = async () => {
    await Promise.all([loadCoupons(), loadAnalytics()])
  }

  const exportCsv = () => {
    if (!coupons.length) return

    const headers = [
      'Coupon Code',
      'Coupon Name',
      'Discount',
      'Coupon Type',
      'Minimum Order',
      'Usage Limit',
      'Usage Per User',
      'Validity',
      'Status',
      'Created Date',
    ]

    const rows = coupons.map((coupon) => [
      coupon.code,
      coupon.name,
      discountText(coupon),
      coupon.coupon_type,
      coupon.minimum_order_value || '0',
      coupon.usage_limit || 'Unlimited',
      coupon.usage_per_user || 'Any',
      `${formatDate(coupon.start_datetime)} - ${formatDate(coupon.end_datetime)}`,
      coupon.status,
      formatDate(coupon.created_at),
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map((item) => `"${String(item).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'coupons_export.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const callAction = async (url, method = 'POST') => {
    if (actionLoading) return
    setActionLoading(true)
    try {
      const response = await fetch(url, { method })
      if (response.ok) {
        await refreshData()
      } else {
        window.alert('Action failed')
      }
    } catch {
      window.alert('Action failed')
    }
    setActionLoading(false)
  }

  const confirmAndRun = (message, url, method = 'POST') => {
    if (window.confirm(message)) {
      callAction(url, method)
    }
  }

  const exportRedemptions = async (id, code) => {
    const ok = window.confirm(`Export redemptions for ${code} as CSV?`)
    if (!ok) return

    const res = await fetch(`/api/admin/coupons/${id}/redemptions?export=true`)
    if (!res.ok) {
      window.alert('Export failed')
      return
    }

    const blob = await res.blob()
    const href = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = href
    a.download = `redemptions_${code}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(href)
  }

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total])

  if (loading) {
    return <div>Loading coupons...</div>
  }

  if (!coupons.length) {
    return (
      <div className='admin-module-page'>
        <div className='admin-welcome'>
          <div>
            <h1>Coupons Management</h1>
            <p>Manage promotional coupons, discount codes, free delivery offers, and campaign rules.</p>
          </div>
          <div>
            <button className='primary-button' onClick={() => navigate('/admin/coupons/create')}>
              ➕ Create First Coupon
            </button>
          </div>
        </div>

        <div className='table-card' style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 18 }}>🎟</div>
          <h2>No Coupons Created Yet</h2>
          <p>Create promotional coupons to provide discounts, free delivery, or special offers to customers.</p>
          <button className='primary-button' onClick={() => navigate('/admin/coupons/create')}>
            ➕ Create First Coupon
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='admin-module-page'>
      <div className='admin-welcome'>
        <div>
          <h1>Coupons Management</h1>
          <p>Manage promotional coupons, discount codes, free delivery offers, and campaign rules.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className='ghost-button' onClick={refreshData}>🔄 Refresh</button>
          <button className='ghost-button' onClick={exportCsv}>📥 Export</button>
          <button className='primary-button' onClick={() => navigate('/admin/coupons/create')}>
            ➕ Create Coupon
          </button>
        </div>
      </div>

      <div className='toolbar-card'>
        <div className='toolbar-controls'>
          <label className='field-group'>
            <span>Search Coupon</span>
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              placeholder='Search name or code'
            />
          </label>
          <label className='field-group'>
            <span>Status</span>
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value)
                setPage(1)
              }}
            >
              <option value=''>All</option>
              <option value='active'>Active</option>
              <option value='scheduled'>Scheduled</option>
              <option value='expired'>Expired</option>
              <option value='inactive'>Inactive</option>
            </select>
          </label>
          <label className='field-group'>
            <span>Discount Type</span>
            <select
              value={typeFilter}
              onChange={(event) => {
                setTypeFilter(event.target.value)
                setPage(1)
              }}
            >
              <option value=''>All</option>
              <option value='percentage'>Percentage</option>
              <option value='flat'>Flat</option>
              <option value='free_delivery'>Free Delivery</option>
            </select>
          </label>
          <label className='field-group'>
            <span>Sort By</span>
            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value)
                setPage(1)
              }}
            >
              <option value='latest'>Latest</option>
              <option value='expiring_soon'>Expiring Soon</option>
              <option value='most_used'>Most Used</option>
            </select>
          </label>
        </div>
      </div>

      {analytics ? (
        <div className='stats-grid'>
          <div className='stat-card blue'>
            <span>Total Coupons</span>
            <strong>{analytics.total_coupons}</strong>
          </div>
          <div className='stat-card green'>
            <span>Active Coupons</span>
            <strong>{analytics.active_coupons}</strong>
          </div>
          <div className='stat-card purple'>
            <span>Scheduled Coupons</span>
            <strong>{analytics.scheduled_coupons}</strong>
          </div>
          <div className='stat-card orange'>
            <span>Expired Coupons</span>
            <strong>{analytics.expired_coupons}</strong>
          </div>
          <div className='stat-card teal'>
            <span>Total Coupon Uses</span>
            <strong>{analytics.total_redemptions}</strong>
          </div>
          <div className='stat-card red'>
            <span>Total Discount Given</span>
            <strong>₹{analytics.total_discount}</strong>
          </div>
        </div>
      ) : null}

      <div className='table-card'>
        <div className='table-wrapper'>
          <table className='data-table'>
            <thead>
              <tr>
                <th>Coupon Code</th>
                <th>Coupon Name</th>
                <th>Discount</th>
                <th>Coupon Type</th>
                <th>Minimum Order</th>
                <th>Usage</th>
                <th>Validity</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td>{coupon.code}</td>
                  <td>{coupon.name}</td>
                  <td>{discountText(coupon)}</td>
                  <td>{coupon.coupon_type.replace('_', ' ')}</td>
                  <td>₹{coupon.minimum_order_value || 0}</td>
                  <td>{coupon.usage_limit || 'Unlimited'} / {coupon.usage_per_user || 'Any'}</td>
                  <td>{formatDate(coupon.start_datetime)} - {formatDate(coupon.end_datetime)}</td>
                  <td>
                    <span className={statusLabels[coupon.status]?.className || 'status-badge'}>
                      {statusLabels[coupon.status]?.label || coupon.status}
                    </span>
                  </td>
                  <td>{formatDate(coupon.created_at)}</td>
                  <td>
                    <div className='action-buttons'>
                      <button className='ghost-button' type='button' onClick={() => navigate(`/admin/coupons/${coupon.id}`)}>
                        👁 View
                      </button>
                      <button className='ghost-button' type='button' onClick={() => navigate(`/admin/coupons/${coupon.id}/edit`)}>
                        ✏ Edit
                      </button>
                      <button className='ghost-button' type='button' onClick={() => confirmAndRun(`Duplicate ${coupon.code}?`, `/api/admin/coupons/${coupon.id}/duplicate`)}>
                        📄 Duplicate
                      </button>
                      {coupon.is_active ? (
                        <button className='ghost-button' type='button' onClick={() => confirmAndRun(`Deactivate ${coupon.code}?`, `/api/admin/coupons/${coupon.id}/deactivate`)}>
                          ⏸ Deactivate
                        </button>
                      ) : (
                        <button className='ghost-button' type='button' onClick={() => confirmAndRun(`Activate ${coupon.code}?`, `/api/admin/coupons/${coupon.id}/activate`)}>
                          ▶ Activate
                        </button>
                      )}
                      <button className='ghost-button' type='button' onClick={() => navigate('/admin/coupons/analytics')}>
                        📊 Analytics
                      </button>
                      <button className='ghost-button danger' type='button' onClick={() => confirmAndRun(`Archive ${coupon.code}?`, `/api/admin/coupons/${coupon.id}`,'DELETE')}>
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className='pagination-row'>
        <button className='ghost-button' type='button' disabled={page <= 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button className='ghost-button' type='button' disabled={page >= totalPages} onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}>
          Next
        </button>
      </div>
    </div>
  )
}
