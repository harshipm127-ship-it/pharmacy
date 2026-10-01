import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { categoryApi, productApi, productImageApi } from '../services/adminService'
import '../styles/admin.css'

const dosageForms = ['TABLET', 'CAPSULE', 'SYRUP', 'SUSPENSION', 'INJECTION', 'CREAM', 'OINTMENT', 'GEL', 'DROPS', 'LOTION', 'SPRAY', 'INHALER', 'POWDER']
const emptyForm = { categoryPublicId: '', sku: '', name: '', brand: '', manufacturer: '', dosageForm: '', strength: '', packSize: '', shortDescription: '', description: '', mrp: '', sellingPrice: '', active: true }
const apiError = (error, fallback) => error?.response?.data?.message || error?.response?.data?.detail || fallback

function ProductFormPage() {
  const { id } = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const viewOnly = pathname.includes('/view/')
  const [form, setForm] = useState(emptyForm)
  const [categories, setCategories] = useState([])
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const title = viewOnly ? 'Product Details' : id ? 'Edit Product' : 'Add New Product'

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        // CategoryService currently converts its request page to zero-based internally,
        // so the category API must receive 1 for its first page.
        const requests = [categoryApi.list({ page: 1, size: 200 })]
        if (id) requests.push(productApi.get(id))
        const [categoryResponse, productResponse] = await Promise.all(requests)
        if (!active) return
        setCategories((categoryResponse.data?.data?.content || []).filter((category) => category.active))
        if (productResponse) {
          const product = productResponse.data?.data
          setForm({ categoryPublicId: product.categoryPublicId || '', sku: product.sku || '', name: product.name || '', brand: product.brand || '', manufacturer: product.manufacturer || '', dosageForm: product.dosageForm || '', strength: product.strength || '', packSize: product.packSize || '', shortDescription: product.shortDescription || '', description: product.description || '', mrp: product.mrp ?? '', sellingPrice: product.sellingPrice ?? '', active: product.active ?? true })
          setImages(product.images || [])
        }
      } catch (requestError) { if (active) setError(apiError(requestError, 'Unable to load product data.')) }
      finally { if (active) setLoading(false) }
    }
    load()
    return () => { active = false }
  }, [id])

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => ({ ...current, [field]: undefined }))
  }

  const validate = () => {
    const errors = {}
    if (!form.categoryPublicId) errors.categoryPublicId = 'Category is required.'
    if (!id && !form.sku.trim()) errors.sku = 'SKU is required.'
    if (!form.name.trim()) errors.name = 'Product name is required.'
    if (!form.dosageForm) errors.dosageForm = 'Dosage form is required.'
    if (!form.shortDescription.trim()) errors.shortDescription = 'Short description is required.'
    if (!form.mrp || Number(form.mrp) <= 0) errors.mrp = 'MRP must be greater than zero.'
    if (!form.sellingPrice || Number(form.sellingPrice) <= 0) errors.sellingPrice = 'Selling price must be greater than zero.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    setSaving(true); setError('')
    const payload = { categoryPublicId: form.categoryPublicId, name: form.name.trim(), brand: form.brand.trim() || null, manufacturer: form.manufacturer.trim() || null, dosageForm: form.dosageForm, strength: form.strength.trim() || null, packSize: form.packSize.trim() || null, shortDescription: form.shortDescription.trim(), description: form.description.trim() || null, mrp: Number(form.mrp), sellingPrice: Number(form.sellingPrice), active: form.active }
    try {
      if (id) await productApi.update(id, payload)
      else await productApi.create({ ...payload, sku: form.sku.trim() })
      navigate('/admin/product-management')
    } catch (requestError) { setError(apiError(requestError, 'Unable to save the product.')) }
    finally { setSaving(false) }
  }

  const uploadImages = async (event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length || !id) return
    setUploading(true); setError('')
    try {
      const response = await productImageApi.upload(id, files, images.length ? -1 : 0)
      setImages((current) => [...current, ...(response.data?.data || [])])
      event.target.value = ''
    } catch (requestError) { setError(apiError(requestError, 'Unable to upload product images.')) }
    finally { setUploading(false) }
  }

  const removeImage = async (imageId) => {
    try { await productImageApi.delete(imageId); setImages((current) => current.filter((image) => image.publicId !== imageId)) }
    catch (requestError) { setError(apiError(requestError, 'Unable to delete product image.')) }
  }

  if (loading) return <div className='admin-page'><p>Loading product...</p></div>
  return <div className='admin-form-page'>
    <div className='page-header-row'><div><div className='page-breadcrumbs'><Link to='/admin/product-management'>Product Management</Link><span className='breadcrumb-separator'>›</span><span>{title}</span></div><h1>{title}</h1><p className='page-description'>Fields shown here correspond to the product save API.</p></div></div>
    {error && <div className='admin-error-box'>{error}</div>}
    <form className='product-form' onSubmit={submit}>
      <section className='form-card'><div className='section-heading'><span className='section-icon'>🧾</span><div><h2>Product Information</h2><p>Required product identity and classification.</p></div></div><div className='form-grid-two'>
        <label className='field-group'><span>Product Name *</span><input disabled={viewOnly} value={form.name} onChange={(event) => update('name', event.target.value)} />{fieldErrors.name && <div className='field-error'>{fieldErrors.name}</div>}</label>
        <label className='field-group'><span>SKU {!id && '*'}</span><input disabled={viewOnly || Boolean(id)} value={form.sku} onChange={(event) => update('sku', event.target.value)} />{id && <small>SKU cannot be changed by the backend update API.</small>}{fieldErrors.sku && <div className='field-error'>{fieldErrors.sku}</div>}</label>
        <label className='field-group'><span>Category *</span><select disabled={viewOnly} value={form.categoryPublicId} onChange={(event) => update('categoryPublicId', event.target.value)}><option value=''>Select category</option>{categories.map((category) => <option key={category.publicId} value={category.publicId}>{category.name}</option>)}</select>{fieldErrors.categoryPublicId && <div className='field-error'>{fieldErrors.categoryPublicId}</div>}</label>
        <label className='field-group'><span>Dosage Form *</span><select disabled={viewOnly} value={form.dosageForm} onChange={(event) => update('dosageForm', event.target.value)}><option value=''>Select dosage form</option>{dosageForms.map((value) => <option key={value} value={value}>{value}</option>)}</select>{fieldErrors.dosageForm && <div className='field-error'>{fieldErrors.dosageForm}</div>}</label>
        <label className='field-group'><span>Brand</span><input disabled={viewOnly} maxLength='100' value={form.brand} onChange={(event) => update('brand', event.target.value)} /></label>
        <label className='field-group'><span>Manufacturer</span><input disabled={viewOnly} maxLength='150' value={form.manufacturer} onChange={(event) => update('manufacturer', event.target.value)} /></label>
        <label className='field-group'><span>Strength</span><input disabled={viewOnly} maxLength='50' value={form.strength} onChange={(event) => update('strength', event.target.value)} /></label>
        <label className='field-group'><span>Pack Size</span><input disabled={viewOnly} maxLength='50' value={form.packSize} onChange={(event) => update('packSize', event.target.value)} /></label>
        <label className='field-group field-full'><span>Short Description *</span><textarea disabled={viewOnly} maxLength='255' rows={3} value={form.shortDescription} onChange={(event) => update('shortDescription', event.target.value)} />{fieldErrors.shortDescription && <div className='field-error'>{fieldErrors.shortDescription}</div>}</label>
        <label className='field-group field-full'><span>Description</span><textarea disabled={viewOnly} maxLength='500' rows={4} value={form.description} onChange={(event) => update('description', event.target.value)} /></label>
      </div></section>
      <section className='form-card'><div className='section-heading'><span className='section-icon'>💰</span><div><h2>Pricing and Status</h2><p>Values saved directly with the product.</p></div></div><div className='form-grid-two'>
        <label className='field-group'><span>MRP *</span><input disabled={viewOnly} type='number' min='0.01' step='0.01' value={form.mrp} onChange={(event) => update('mrp', event.target.value)} />{fieldErrors.mrp && <div className='field-error'>{fieldErrors.mrp}</div>}</label>
        <label className='field-group'><span>Selling Price *</span><input disabled={viewOnly} type='number' min='0.01' step='0.01' value={form.sellingPrice} onChange={(event) => update('sellingPrice', event.target.value)} />{fieldErrors.sellingPrice && <div className='field-error'>{fieldErrors.sellingPrice}</div>}</label>
        <label className='field-group toggle-group'><span>Active</span><input disabled={viewOnly} type='checkbox' checked={form.active} onChange={(event) => update('active', event.target.checked)} /></label>
      </div></section>
      {id && <section className='form-card'><div className='section-heading'><span className='section-icon'>🖼️</span><div><h2>Product Images</h2><p>Images use the dedicated backend image endpoint.</p></div></div>{!viewOnly && <label className='field-group'><span>Upload images</span><input type='file' accept='image/*' multiple disabled={uploading} onChange={uploadImages} /></label>}<div className='gallery-grid'>{images.map((image) => <div className='gallery-item' key={image.publicId}><img src={image.imageUrl} alt={image.fileName || form.name} className='thumbnail-preview' />{!viewOnly && <button type='button' className='gallery-remove' onClick={() => removeImage(image.publicId)}>×</button>}</div>)}</div></section>}
      <div className='sticky-actions'><button type='button' className='ghost-button' onClick={() => navigate('/admin/product-management')}>Back</button>{!viewOnly && <button type='submit' className='primary-button' disabled={saving}>{saving ? 'Saving...' : id ? 'Save Changes' : 'Create Product'}</button>}</div>
    </form>
  </div>
}

export default ProductFormPage
