import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { inventoryApi, inventoryBatchApi } from '../services/adminService'
import '../styles/admin.css'

const emptyForm = {
  inventoryPublicId: '', batchNumber: '', manufacturingDate: '', expiryDate: '',
  purchasePrice: '', mrp: '', sellingPrice: '', receivedQuantity: '', active: true,
}

const errorMessage = (error, fallback) => error?.response?.data?.message || error?.response?.data?.detail || fallback

function InventoryBatchFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [inventories, setInventories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const isEdit = Boolean(id)

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const requests = [inventoryApi.list({ page: 0, size: 200, sortBy: 'createdAt', direction: 'desc' })]
        if (isEdit) requests.push(inventoryBatchApi.get(id))
        const [inventoryResponse, batchResponse] = await Promise.all(requests)
        if (!active) return
        setInventories((inventoryResponse.data?.data?.content || []).filter((item) => item.active))
        if (batchResponse) {
          const batch = batchResponse.data?.data
          setForm({
            inventoryPublicId: batch.inventoryPublicId || '', batchNumber: batch.batchNumber || '',
            manufacturingDate: batch.manufacturingDate || '', expiryDate: batch.expiryDate || '',
            purchasePrice: batch.purchasePrice ?? '', mrp: batch.mrp ?? '',
            sellingPrice: batch.sellingPrice ?? '', receivedQuantity: batch.receivedQuantity ?? '',
            active: batch.active ?? true,
          })
        }
      } catch (requestError) {
        if (active) setError(errorMessage(requestError, 'Unable to load inventory batch data.'))
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [id, isEdit])

  const change = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const validate = () => {
    if (!isEdit && !form.inventoryPublicId) return 'Select an inventory record.'
    if (!form.batchNumber.trim()) return 'Batch number is required.'
    if (!form.expiryDate) return 'Expiry date is required.'
    if (form.manufacturingDate && form.manufacturingDate > form.expiryDate) return 'Manufacturing date cannot be after expiry date.'
    if ([form.purchasePrice, form.mrp, form.sellingPrice].some((value) => !value || Number(value) <= 0)) return 'All prices must be greater than zero.'
    if (Number(form.purchasePrice) > Number(form.sellingPrice)) return 'Selling price cannot be less than purchase price.'
    if (Number(form.sellingPrice) > Number(form.mrp)) return 'Selling price cannot be greater than MRP.'
    if (!isEdit && (!form.receivedQuantity || Number(form.receivedQuantity) <= 0)) return 'Received quantity must be greater than zero.'
    return ''
  }

  const submit = async (event) => {
    event.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    setSaving(true); setError('')
    const common = {
      batchNumber: form.batchNumber.trim(), manufacturingDate: form.manufacturingDate || null,
      expiryDate: form.expiryDate, purchasePrice: Number(form.purchasePrice),
      mrp: Number(form.mrp), sellingPrice: Number(form.sellingPrice),
    }
    try {
      if (isEdit) {
        await inventoryBatchApi.update(id, { ...common, active: form.active })
      } else {
        await inventoryBatchApi.create({ ...common, inventoryPublicId: form.inventoryPublicId, receivedQuantity: Number(form.receivedQuantity) })
      }
      navigate('/admin/inventory-management')
    } catch (requestError) {
      setError(errorMessage(requestError, `Unable to ${isEdit ? 'update' : 'create'} the inventory batch.`))
    } finally { setSaving(false) }
  }

  if (loading) return <div className='admin-page'><p>Loading inventory batch...</p></div>

  return <div className='admin-form-page'>
    <div className='page-header-row'><div><div className='page-breadcrumbs'><Link to='/admin/inventory-management'>Inventory Management</Link><span className='breadcrumb-separator'>›</span><span>{isEdit ? 'Edit batch' : 'New batch'}</span></div><h1>{isEdit ? 'Edit Inventory Batch' : 'Add Inventory Batch'}</h1></div></div>
    {error && <div className='admin-error-box'>{error}</div>}
    <form className='form-card' onSubmit={submit}>
      <div className='form-grid'>
        {!isEdit && <label className='field-group field-full'><span>Inventory record *</span><select value={form.inventoryPublicId} onChange={(event) => change('inventoryPublicId', event.target.value)}><option value=''>Select product and store</option>{inventories.map((item) => <option key={item.publicId} value={item.publicId}>{item.productName} ({item.productSku}) — {item.storeName}</option>)}</select>{inventories.length === 0 && <small>No active inventory records. <Link to='/admin/inventory-management/inventory/create'>Create one first.</Link></small>}</label>}
        <label className='field-group'><span>Batch number *</span><input value={form.batchNumber} onChange={(event) => change('batchNumber', event.target.value)} /></label>
        <label className='field-group'><span>Manufacturing date</span><input type='date' value={form.manufacturingDate} onChange={(event) => change('manufacturingDate', event.target.value)} /></label>
        <label className='field-group'><span>Expiry date *</span><input type='date' value={form.expiryDate} onChange={(event) => change('expiryDate', event.target.value)} /></label>
        <label className='field-group'><span>Purchase price *</span><input type='number' min='0.01' step='0.01' value={form.purchasePrice} onChange={(event) => change('purchasePrice', event.target.value)} /></label>
        <label className='field-group'><span>MRP *</span><input type='number' min='0.01' step='0.01' value={form.mrp} onChange={(event) => change('mrp', event.target.value)} /></label>
        <label className='field-group'><span>Selling price *</span><input type='number' min='0.01' step='0.01' value={form.sellingPrice} onChange={(event) => change('sellingPrice', event.target.value)} /></label>
        {!isEdit && <label className='field-group'><span>Received quantity *</span><input type='number' min='1' step='1' value={form.receivedQuantity} onChange={(event) => change('receivedQuantity', event.target.value)} /></label>}
        {isEdit && <label className='field-group'><span>Status</span><select value={String(form.active)} onChange={(event) => change('active', event.target.value === 'true')}><option value='true'>Active</option><option value='false'>Inactive</option></select></label>}
      </div>
      <div className='form-actions'><button type='button' className='ghost-button' onClick={() => navigate('/admin/inventory-management')}>Cancel</button><button className='primary-button' disabled={saving}>{saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Batch'}</button></div>
    </form>
  </div>
}

export default InventoryBatchFormPage
