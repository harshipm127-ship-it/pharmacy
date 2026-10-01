import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { inventoryBatchApi } from '../services/adminService'
import '../styles/admin.css'

const formatCurrency = (value) => value == null ? '—' : `₹${Number(value).toFixed(2)}`

function InventoryBatchDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [batch, setBatch] = useState(null)
  const [error, setError] = useState('')
  const [working, setWorking] = useState(false)

  const load = () => inventoryBatchApi.get(id).then((response) => setBatch(response.data?.data)).catch((requestError) => setError(requestError?.response?.data?.message || 'Unable to load the inventory batch.'))
  useEffect(() => { load() }, [id])

  const toggleStatus = async () => {
    if (!batch) return
    setWorking(true); setError('')
    try {
      if (batch.active) await inventoryBatchApi.delete(id)
      else await inventoryBatchApi.restore(id)
      load()
    } catch (requestError) { setError(requestError?.response?.data?.message || 'Unable to update batch status.') }
    finally { setWorking(false) }
  }

  if (!batch && !error) return <div className='admin-page'><p>Loading inventory batch...</p></div>
  if (!batch) return <div className='admin-page'><div className='admin-error-box'>{error}</div><Link to='/admin/inventory-management'>Back to inventory</Link></div>
  const fields = [['Product', batch.productName], ['SKU', batch.productSku], ['Store', batch.storeName], ['Batch number', batch.batchNumber], ['Manufacturing date', batch.manufacturingDate || '—'], ['Expiry date', batch.expiryDate], ['Purchase price', formatCurrency(batch.purchasePrice)], ['MRP', formatCurrency(batch.mrp)], ['Selling price', formatCurrency(batch.sellingPrice)], ['Received quantity', batch.receivedQuantity], ['Available quantity', batch.availableQuantity]]
  return <div className='admin-form-page'>
    <div className='page-header-row'><div><div className='page-breadcrumbs'><Link to='/admin/inventory-management'>Inventory Management</Link><span className='breadcrumb-separator'>›</span><span>Batch details</span></div><h1>Inventory Batch Details</h1></div><div className='action-buttons'><button className='ghost-button' onClick={() => navigate(`/admin/inventory-management/batches/${id}/edit`)}>Edit</button><button className='ghost-button' disabled={working} onClick={toggleStatus}>{batch.active ? 'Deactivate' : 'Restore'}</button></div></div>
    {error && <div className='admin-error-box'>{error}</div>}
    <div className='form-card'><div className='form-grid'>{fields.map(([label, value]) => <div className='field-group' key={label}><span>{label}</span><strong>{value ?? '—'}</strong></div>)}<div className='field-group'><span>Status</span><strong>{batch.active ? 'Active' : 'Inactive'}</strong></div></div><div className='form-actions'><Link className='ghost-button' to='/admin/inventory-management'>Back to Inventory</Link></div></div>
  </div>
}

export default InventoryBatchDetailsPage
