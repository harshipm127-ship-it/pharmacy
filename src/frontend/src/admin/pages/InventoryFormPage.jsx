import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { inventoryApi, productApi, storeApi } from '../services/adminService'
import '../styles/admin.css'

function InventoryFormPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [stores, setStores] = useState([])
  const [form, setForm] = useState({ productPublicId: '', storePublicId: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([productApi.list({ page: 0, size: 200 }), storeApi.list({ page: 0, size: 200 })])
      .then(([productResponse, storeResponse]) => {
        if (!active) return
        const productData = productResponse.data?.data
        setProducts((productData?.content || productData?.products || []).filter((item) => item.active))
        setStores((storeResponse.data?.data?.content || []).filter((item) => item.active))
      })
      .catch((requestError) => active && setError(requestError?.response?.data?.message || 'Unable to load products and stores.'))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  const submit = async (event) => {
    event.preventDefault()
    if (!form.productPublicId || !form.storePublicId) { setError('Select both a product and a store.'); return }
    setSaving(true); setError('')
    try {
      await inventoryApi.create(form)
      navigate('/admin/inventory-management/batches/create')
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError?.response?.data?.detail || 'Unable to create the inventory record.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className='admin-page'><p>Loading products and stores...</p></div>
  return <div className='admin-form-page'>
    <div className='page-header-row'><div><div className='page-breadcrumbs'><Link to='/admin/inventory-management'>Inventory Management</Link><span className='breadcrumb-separator'>›</span><span>New inventory record</span></div><h1>Create Inventory Record</h1><p>Link an active product to an active store before adding its first batch.</p></div></div>
    {error && <div className='admin-error-box'>{error}</div>}
    <form className='form-card' onSubmit={submit}><div className='form-grid'>
      <label className='field-group'><span>Product *</span><select value={form.productPublicId} onChange={(event) => setForm((current) => ({ ...current, productPublicId: event.target.value }))}><option value=''>Select product</option>{products.map((product) => <option key={product.publicId} value={product.publicId}>{product.name} ({product.sku})</option>)}</select></label>
      <label className='field-group'><span>Store *</span><select value={form.storePublicId} onChange={(event) => setForm((current) => ({ ...current, storePublicId: event.target.value }))}><option value=''>Select store</option>{stores.map((store) => <option key={store.publicId} value={store.publicId}>{store.name} ({store.code})</option>)}</select></label>
    </div><div className='form-actions'><button type='button' className='ghost-button' onClick={() => navigate('/admin/inventory-management')}>Cancel</button><button className='primary-button' disabled={saving}>{saving ? 'Creating...' : 'Create and Add Batch'}</button></div></form>
  </div>
}

export default InventoryFormPage
