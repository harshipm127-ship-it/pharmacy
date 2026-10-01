import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { paymentApi } from '../services/adminService'
import '../styles/admin.css'
import '../styles/payments.css'

const paymentStatuses = ['pending', 'processing', 'successful', 'failed', 'cancelled', 'refunded', 'partial_refund']
const refundStatuses = ['none', 'pending', 'approved', 'rejected', 'refunded', 'partial_refund']
const paymentMethods = ['card', 'upi', 'netbanking', 'wallet', 'cod']
const gateways = ['Razorpay', 'PhonePe', 'Paytm', 'Cashfree', 'Stripe']
const sortOptions = [
  { value: 'latest', label: 'Latest Payments' },
  { value: 'oldest', label: 'Oldest Payments' },
  { value: 'highest_amount', label: 'Highest Amount' },
  { value: 'lowest_amount', label: 'Lowest Amount' },
]

function PaymentsManagement() {
  const navigate = useNavigate()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [refundStatus, setRefundStatus] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [gateway, setGateway] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(8)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadPayments = async () => {
    setLoading(true)
    try {
      const response = await paymentApi.list({
        search: search || undefined,
        payment_status: paymentStatus || undefined,
        refund_status: refundStatus || undefined,
        payment_method: paymentMethod || undefined,
        gateway: gateway || undefined,
        sort_by: sortBy,
        skip: (page - 1) * pageSize,
        limit: pageSize,
      })
      setPayments(response.data || [])
    } catch (err) {
      setError('Unable to load payments. Please try again.')
      setPayments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadPayments() }, [search, paymentStatus, refundStatus, paymentMethod, gateway, sortBy, page])

  const pagedPayments = useMemo(() => payments, [payments])

  const openDetail = (payment) => {
    navigate(`/admin/payments/view/${payment.id}`)
  }

  const openRefund = (payment) => {
    navigate(`/admin/payments/refund/${payment.id}`)
  }

  const downloadReceipt = async (payment) => {
    try {
      const response = await paymentApi.downloadReceipt(payment.id)
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `receipt-${payment.id}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('Unable to download receipt.')
    }
  }

  const retryPayment = (payment) => {
    setError('Retry payment action is not yet implemented.')
  }

  const exportPayments = () => {
    const rows = payments.map((item) => [
      item.id,
      item.order_id,
      item.customer?.name || 'Unknown',
      item.transaction_id || '—',
      item.payment_mode,
      item.gateway || '—',
      item.amount,
      item.payment_status,
      item.refund_status,
      item.payment_date ? new Date(item.payment_date).toLocaleString() : '—',
    ])
    const header = ['Payment ID', 'Order ID', 'Customer', 'Transaction ID', 'Method', 'Gateway', 'Amount', 'Status', 'Refund', 'Date']
    const csv = [header, ...rows].map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'payments.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className='admin-module-page'>
      <div className='admin-welcome'>
        <div>
          <h1>Payments Management</h1>
          <p>Manage customer payments, monitor payment transactions, process refunds, generate settlement reports, and monitor payment gateway activity.</p>
        </div>
      </div>

      <div className='toolbar-card'>
        <div className='toolbar-controls'>
          <label className='field-group'><span>Search Payment</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder='Payment ID, Order ID, Customer, Transaction ID' /></label>
          <label className='field-group'><span>Payment Status</span><select value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value)}><option value=''>All</option>{paymentStatuses.map((status) => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}</select></label>
          <label className='field-group'><span>Refund Status</span><select value={refundStatus} onChange={(event) => setRefundStatus(event.target.value)}><option value=''>All</option>{refundStatuses.map((status) => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}</select></label>
          <label className='field-group'><span>Payment Method</span><select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}><option value=''>All</option>{paymentMethods.map((method) => <option key={method} value={method}>{method.toUpperCase()}</option>)}</select></label>
          <label className='field-group'><span>Gateway</span><select value={gateway} onChange={(event) => setGateway(event.target.value)}><option value=''>All</option>{gateways.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className='field-group'><span>Sort By</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>{sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        </div>
        <button className='primary-button' onClick={exportPayments}>Export Payments</button>
      </div>

      {error ? <div className='admin-error-box'>{error}</div> : null}
      {success ? <div className='admin-success-box'>{success}</div> : null}

      <div className='table-card'>
        {loading ? <p>Loading payments...</p> : payments.length === 0 ? <p>No payments found.</p> : (
          <div className='table-wrapper'>
            <table className='data-table'>
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Transaction ID</th>
                  <th>Method</th>
                  <th>Gateway</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Refund</th>
                  <th>Payment Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>#{payment.id}</td>
                    <td>#{payment.order_id}</td>
                    <td>{payment.customer?.name || 'Unknown'}</td>
                    <td>{payment.transaction_id || '—'}</td>
                    <td>{payment.payment_mode}</td>
                    <td>{payment.gateway || '—'}</td>
                    <td>{payment.amount}</td>
                    <td><span className={`status-badge ${payment.payment_status === 'successful' ? 'in-stock' : payment.payment_status === 'failed' ? 'out-of-stock' : 'low-stock'}`}>{payment.payment_status || 'pending'}</span></td>
                    <td><span className='status-badge'>{payment.refund_status || 'none'}</span></td>
                    <td>{payment.payment_date ? new Date(payment.payment_date).toLocaleString() : '—'}</td>
                    <td>
                      <div className='action-buttons'>
                        <button className='ghost-button' onClick={() => openDetail(payment)}>View</button>
                        <button className='ghost-button' onClick={() => downloadReceipt(payment)}>Receipt</button>
                        {payment.payment_status === 'failed' ? <button className='ghost-button' onClick={() => retryPayment(payment)}>Retry</button> : null}
                        <button className='ghost-button' onClick={() => openRefund(payment)}>Refund</button>
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
        <button className='ghost-button' disabled={page * pageSize >= payments.length} onClick={() => setPage((value) => value + 1)}>Next</button>
      </div>

    </div>
  )
}

export default PaymentsManagement
