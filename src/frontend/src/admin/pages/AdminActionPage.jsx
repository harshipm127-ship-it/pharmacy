import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  bannerApi,
  categoryApi,
  brandApi,
  inventoryApi,
  ordersApi,
  paymentApi,
  deliveryApi,
  productApi,
} from '../services/adminService'
import '../styles/admin.css'

const emptyBannerForm = {
  title: '',
  subtitle: '',
  display_page: 'home',
  banner_type: 'promo',
  image_path: '',
  start_date: '',
  end_date: '',
  priority: 0,
  status: 'active',
}

const emptyCategoryForm = {
  name: '',
  slug: '',
  description: '',
  parent_id: '',
  image_path: '',
  banner_image_path: '',
  display_order: 0,
  is_active: true,
  show_in_header: false,
  show_on_homepage: false,
  featured: false,
  allow_products: true,
  seo_title: '',
  seo_description: '',
  color: '',
}

const emptyBrandForm = {
  name: '',
  manufacturer: '',
  description: '',
  logo_path: '',
  banner_path: '',
  website: '',
  country: '',
  support_email: '',
  support_phone: '',
  is_active: true,
  featured: false,
  show_on_homepage: false,
  seo_title: '',
  seo_description: '',
}

const emptyWarehouseForm = {
  name: '',
  address: '',
  location: '',
  manager: '',
  phone: '',
  is_active: true,
}

const emptyAdjustmentForm = {
  type: 'add',
  quantity: '',
  reason: 'stock_adjustment',
  notes: '',
}

const defaultDeliveriesForm = {
  delivery_partner: '',
  rider_name: '',
  rider_phone: '',
  rider_vehicle: '',
  delivery_type: '',
  shipping_date: '',
  estimated_delivery_date: '',
  delivery_charges: '',
}

const defaultTrackingForm = {
  tracking_number: '',
  current_location: '',
  distance_remaining: '',
  eta: '',
}

const defaultEtaForm = {
  estimated_delivery_date: '',
  eta: '',
  delay_reason: '',
  remarks: '',
}

const defaultExceptionForm = {
  exception_type: '',
  description: '',
  resolution: '',
}

const deliveryStatuses = ['pending', 'assigned', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'delivery_failed', 'cancelled', 'returned']
const deliveryTypes = ['standard', 'express', 'same_day', 'next_day']
const orderStatuses = ['pending', 'confirmed', 'packed', 'ready_for_shipment', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded']
const paymentStatuses = ['pending', 'completed', 'failed', 'refunded', 'partial_refund']
const paymentMethods = ['card', 'upi', 'netbanking', 'wallet', 'cod']

const actionTitle = {
  add: 'Add',
  edit: 'Edit',
  view: 'View',
  update: 'Update',
  refund: 'Refund',
  assign: 'Assign',
  tracking: 'Update Tracking',
  eta: 'Update ETA',
  exception: 'Record Exception',
  'add-warehouse': 'Add Warehouse',
  adjust: 'Update Stock',
  transfer: 'Transfer Stock',
  history: 'Inventory History',
}

const entityTitle = {
  'banner-management': 'Banner Management',
  'category-management': 'Category Management',
  'brand-management': 'Brand Management',
  'product-management': 'Product Management',
  'inventory-management': 'Inventory Management',
  orders: 'Orders',
  payments: 'Payments',
  'delivery-management': 'Delivery Management',
}

const emptyInventoryState = {
  name: '',
  address: '',
  location: '',
  manager: '',
  phone: '',
  is_active: true,
}

const getBreadcrumb = (entity, action, id) => {
  const baseLabel = entityTitle[entity] || 'Admin'
  const actionLabel = actionTitle[action] || action
  return [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: baseLabel, to: `/admin/${entity}` },
    { label: id ? `${actionLabel} ${id}` : `${actionLabel}` },
  ]
}

function AdminActionPage() {
  const { entity, action, id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const [bannerForm, setBannerForm] = useState(emptyBannerForm)
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm)
  const [brandForm, setBrandForm] = useState(emptyBrandForm)
  const [warehouseForm, setWarehouseForm] = useState(emptyWarehouseForm)
  const [adjustmentForm, setAdjustmentForm] = useState(emptyAdjustmentForm)
  const [transferForm, setTransferForm] = useState({ to_inventory_id: '', quantity: '', reason: 'transfer' })
  const [deliveryForm, setDeliveryForm] = useState(defaultDeliveriesForm)
  const [trackingForm, setTrackingForm] = useState(defaultTrackingForm)
  const [etaForm, setEtaForm] = useState(defaultEtaForm)
  const [exceptionForm, setExceptionForm] = useState(defaultExceptionForm)
  const [historyItems, setHistoryItems] = useState([])
  const [inventoryItem, setInventoryItem] = useState(null)
  const [inventoryItems, setInventoryItems] = useState([])
  const [order, setOrder] = useState(null)
  const [payment, setPayment] = useState(null)
  const [delivery, setDelivery] = useState(null)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [parents, setParents] = useState([])
  const [fieldErrors, setFieldErrors] = useState({})

  const title = `${actionTitle[action] || 'Edit'} ${entityTitle[entity] || ''}`

  const pageLabel = `${actionTitle[action] || ''} ${entityTitle[entity] || ''}`

  const loadBanner = async () => {
    if (action !== 'edit') return
    const response = await bannerApi.list({})
    const item = response.data?.find((banner) => String(banner.id) === String(id))
    if (!item) throw new Error('Banner not found')
    setBannerForm({
      title: item.title || '',
      subtitle: item.subtitle || '',
      display_page: item.display_page || 'home',
      banner_type: item.banner_type || 'promo',
      image_path: item.image_path || '',
      start_date: item.start_date || '',
      end_date: item.end_date || '',
      priority: item.priority || 0,
      status: item.status || 'active',
    })
  }

  const loadCategory = async () => {
    const [parentResponse] = await Promise.all([categoryApi.parents()])
    setParents(parentResponse.data || [])
    if (action !== 'edit') return
    const response = await categoryApi.get(id)
    const item = response.data
    setCategoryForm({
      name: item.name || '',
      slug: item.slug || '',
      description: item.description || '',
      parent_id: item.parent_id || '',
      image_path: item.image_path || '',
      banner_image_path: item.banner_image_path || '',
      display_order: item.display_order || 0,
      is_active: item.is_active !== false,
      show_in_header: Boolean(item.show_in_header),
      show_on_homepage: Boolean(item.show_on_homepage),
      featured: Boolean(item.featured),
      allow_products: item.allow_products !== false,
      seo_title: item.seo_title || '',
      seo_description: item.seo_description || '',
      color: item.color || '',
    })
  }

  const loadBrand = async () => {
    if (action !== 'edit') return
    const response = await brandApi.get(id)
    const item = response.data
    setBrandForm({
      name: item.name || '',
      manufacturer: item.manufacturer || '',
      description: item.description || '',
      logo_path: item.logo_path || '',
      banner_path: item.banner_path || '',
      website: item.website || '',
      country: item.country || '',
      support_email: item.support_email || '',
      support_phone: item.support_phone || '',
      is_active: item.is_active !== false,
      featured: Boolean(item.featured),
      show_on_homepage: Boolean(item.show_on_homepage),
      seo_title: item.seo_title || '',
      seo_description: item.seo_description || '',
    })
  }

  const loadInventoryItem = async () => {
    if (!['adjust', 'transfer', 'history'].includes(action)) return
    const response = await inventoryApi.get(id)
    setInventoryItem(response.data)
    if (action === 'transfer') {
      const listResponse = await inventoryApi.list({ limit: 200 })
      setInventoryItems(listResponse.data || [])
      setTransferForm({ ...transferForm, to_inventory_id: '', quantity: '', reason: 'transfer' })
    }
    if (action === 'history') {
      const historyResponse = await inventoryApi.history(id)
      setHistoryItems(historyResponse.data || [])
    }
  }

  const loadOrder = async () => {
    if (!['view', 'update'].includes(action) || entity !== 'orders') return
    const response = await ordersApi.getAdmin(id)
    setOrder(response.data)
    setOrderStatusForm({
      order_status: response.data.order_status || '',
      delivery_status: response.data.delivery_status || '',
      delivery_partner: response.data.delivery_partner || '',
      tracking_number: response.data.tracking_number || '',
      delivery_notes: response.data.delivery_notes || '',
      payment_status: response.data.payment_status || '',
    })
  }

  const loadPayment = async () => {
    if (!['view', 'refund'].includes(action) || entity !== 'payments') return
    const response = await paymentApi.get(id)
    setPayment(response.data)
    setRefundForm({
      refund_amount: response.data.amount || '',
      refund_reason: '',
      refund_notes: '',
    })
  }

  const loadDelivery = async () => {
    if (entity !== 'delivery-management') return
    if (!['view', 'assign', 'tracking', 'eta', 'exception'].includes(action)) return
    const response = await deliveryApi.get(id)
    setDelivery(response.data)
    if (action === 'assign') {
      setDeliveryForm({
        delivery_partner: response.data.delivery_partner || '',
        rider_name: response.data.rider_name || '',
        rider_phone: response.data.rider_phone || '',
        rider_vehicle: response.data.rider_vehicle || '',
        delivery_type: response.data.delivery_type || '',
        shipping_date: response.data.shipping_date ? response.data.shipping_date.slice(0, 16) : '',
        estimated_delivery_date: response.data.estimated_delivery_date ? response.data.estimated_delivery_date.slice(0, 16) : '',
        delivery_charges: response.data.delivery_charges || '',
      })
    }
    if (action === 'tracking') {
      setTrackingForm({
        tracking_number: response.data.tracking_number || '',
        current_location: response.data.current_location || '',
        distance_remaining: response.data.distance_remaining || '',
        eta: response.data.eta || '',
      })
    }
    if (action === 'eta') {
      setEtaForm({
        estimated_delivery_date: response.data.estimated_delivery_date ? response.data.estimated_delivery_date.slice(0, 16) : '',
        eta: response.data.eta || '',
        delay_reason: response.data.delay_reason || '',
        remarks: '',
      })
    }
  }

  const loadProduct = async () => {
    if (entity !== 'product-management' || action !== 'view') return
    const response = await productApi.get(id)
    setInventoryItem(response.data)
  }

  const loadBrandView = async () => {
    if (entity !== 'brand-management' || action !== 'view') return
    const response = await brandApi.get(id)
    setInventoryItem(response.data)
  }

  const loadCommonOptions = async () => {
    const requests = []
    if (['banner-management', 'category-management', 'brand-management'].includes(entity)) {
      requests.push(categoryApi.parents())
      requests.push(categoryApi.list({ limit: 200 }))
      requests.push(brandApi.list({ limit: 200 }))
      requests.push(inventoryApi.warehouses())
    }
    if (entity === 'inventory-management') {
      requests.push(inventoryApi.warehouses())
    }
    if (requests.length === 0) return
    const results = await Promise.all(requests)
    if (results[0]?.data) setParents(results[0].data)
    if (results[1]?.data) setCategories(results[1].data)
    if (results[2]?.data) setBrands(results[2].data)
    if (results[3]?.data) setWarehouses(results[3].data)
  }

  useEffect(() => {
    let active = true
    const loader = async () => {
      setIsLoading(true)
      setError('')
      setSuccess('')
      setFieldErrors({})

      const tasks = [
        loadCommonOptions(),
        loadBanner(),
        loadCategory(),
        loadBrand(),
        loadInventoryItem(),
        loadOrder(),
        loadPayment(),
        loadDelivery(),
        loadProduct(),
        loadBrandView(),
      ]

      try {
        const results = await Promise.allSettled(tasks)
        const rejected = results.find((r) => r.status === 'rejected')
        if (rejected) {
          // surface the first failure but allow the page to render with available data
          const err = rejected.reason
          // suppress authentication-related errors (401) so the UI doesn't show raw auth messages
          const status = err?.response?.status || err?.status
          const detail = err?.response?.data?.detail || err?.message
          if (status === 401 || (typeof detail === 'string' && detail.toLowerCase().includes('authentication'))) {
            // don't set the banner for auth failures; let the protected route handle redirects
          } else {
            const message = typeof detail === 'string' ? detail : JSON.stringify(detail)
            if (active) setError(message || 'Some data failed to load.')
          }
        }
      } catch (err) {
          const d = err?.response?.data?.detail || err?.message
          const msg = typeof d === 'string' ? d : JSON.stringify(d)
          if (active) setError(msg || 'Unable to load page data.')
        } finally {
        if (active) setIsLoading(false)
      }
    }
    loader()
    return () => { active = false }
  }, [entity, action, id])

  const handleInput = (setter) => (field, value) => {
    setter((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => ({ ...current, [field]: undefined }))
  }

  const uploadFile = async (event, apiUpload, field, formState, setter) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size must be 2 MB or less')
      return
    }
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      setError('Only JPG, PNG, and WEBP images are allowed')
      return
    }
    try {
      setIsSaving(true)
      const formData = new FormData()
      formData.append('file', file)
      const response = await apiUpload(formData)
      const path = response.data?.image_path
      setter((current) => ({ ...current, [field]: path }))
      if (field === 'image_path' || field === 'logo_path' || field === 'banner_path') setError('')
    } catch {
      setError('Image upload failed')
    } finally {
      setIsSaving(false)
    }
  }

  const validateSimple = (form, requiredFields) => {
    const errors = {}
    requiredFields.forEach(({ field, message }) => {
      if (!form[field] || String(form[field]).trim() === '') {
        errors[field] = message
      }
    })
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setIsSaving(true)

    try {
      if (entity === 'banner-management' && ['add', 'edit'].includes(action)) {
        if (!validateSimple(bannerForm, [
          { field: 'title', message: 'Banner title is required.' },
          { field: 'display_page', message: 'Display page is required.' },
          { field: 'banner_type', message: 'Banner type is required.' },
          { field: 'start_date', message: 'Start date is required.' },
          { field: 'end_date', message: 'End date is required.' },
          { field: 'image_path', message: 'Banner image is required.' },
        ])) {
          return
        }
        if (action === 'edit') await bannerApi.update(id, bannerForm)
        else await bannerApi.create(bannerForm)
        setSuccess(`Banner ${action === 'edit' ? 'updated' : 'created'} successfully.`)
        navigate('/admin/banner-management')
        return
      }

      if (entity === 'category-management' && ['add', 'edit'].includes(action)) {
        if (!validateSimple(categoryForm, [{ field: 'name', message: 'Category name is required.' }])) return
        const payload = {
          ...categoryForm,
          parent_id: categoryForm.parent_id ? Number(categoryForm.parent_id) : null,
          slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        }
        if (action === 'edit') await categoryApi.update(id, payload)
        else await categoryApi.create(payload)
        setSuccess(`Category ${action === 'edit' ? 'updated' : 'created'} successfully.`)
        navigate('/admin/category-management')
        return
      }

      if (entity === 'brand-management' && ['add', 'edit'].includes(action)) {
        if (!validateSimple(brandForm, [{ field: 'name', message: 'Brand name is required.' }])) return
        const payload = {
          ...brandForm,
          name: brandForm.name.trim(),
          manufacturer: brandForm.manufacturer.trim(),
        }
        if (action === 'edit') await brandApi.update(id, payload)
        else await brandApi.create(payload)
        setSuccess(`Brand ${action === 'edit' ? 'updated' : 'created'} successfully.`)
        navigate('/admin/brand-management')
        return
      }

      if (entity === 'inventory-management' && action === 'add-warehouse') {
        if (!validateSimple(warehouseForm, [{ field: 'name', message: 'Warehouse name is required.' }])) return
        await inventoryApi.createWarehouse(warehouseForm)
        setSuccess('Warehouse created successfully.')
        navigate('/admin/inventory-management')
        return
      }

      if (entity === 'inventory-management' && action === 'adjust') {
        if (!validateSimple(adjustmentForm, [{ field: 'quantity', message: 'Quantity is required.' }])) return
        const quantity = Number(adjustmentForm.quantity)
        if (!quantity || quantity <= 0) {
          setError('Please enter a valid quantity.')
          return
        }
        const delta = adjustmentForm.type === 'remove' ? -quantity : quantity
        await inventoryApi.updateStock(id, {
          change_quantity: delta,
          reason: adjustmentForm.reason,
          notes: adjustmentForm.notes,
          updated_by: 'admin',
        })
        setSuccess('Stock updated successfully.')
        navigate('/admin/inventory-management')
        return
      }

      if (entity === 'inventory-management' && action === 'transfer') {
        if (!validateSimple(transferForm, [{ field: 'to_inventory_id', message: 'Target inventory is required.' }, { field: 'quantity', message: 'Quantity is required.' }])) return
        const quantity = Number(transferForm.quantity)
        if (!quantity || quantity <= 0) {
          setError('Please enter a valid transfer quantity.')
          return
        }
        await inventoryApi.transfer({
          from_inventory_id: Number(id),
          to_inventory_id: Number(transferForm.to_inventory_id),
          quantity,
          reason: transferForm.reason,
          updated_by: 'admin',
        })
        setSuccess('Stock transfer completed successfully.')
        navigate('/admin/inventory-management')
        return
      }

      if (entity === 'orders' && action === 'update') {
        if (!order) return
        await ordersApi.updateStatus(order.id, {
          order_status: order.order_status,
          delivery_status: order.delivery_status,
          delivery_partner: order.delivery_partner,
          tracking_number: order.tracking_number,
          delivery_notes: order.delivery_notes,
          payment_status: order.payment_status,
        })
        setSuccess('Order updated successfully.')
        navigate('/admin/orders')
        return
      }

      if (entity === 'payments' && action === 'refund') {
        if (!validateSimple(payment, [{ field: 'amount', message: 'Payment amount unavailable.' }])) return
        if (!validateSimple(refundForm, [{ field: 'refund_amount', message: 'Refund amount is required.' }])) return
        const amount = Number(refundForm.refund_amount)
        if (!amount || amount <= 0) {
          setError('Enter a valid refund amount.')
          return
        }
        await paymentApi.refund({
          payment_id: payment.id,
          order_id: payment.order_id,
          refund_amount: amount,
          refund_reason: refundForm.refund_reason,
          notes: refundForm.refund_notes,
        })
        setSuccess('Refund request submitted successfully.')
        navigate('/admin/payments')
        return
      }

      if (entity === 'delivery-management' && action === 'assign') {
        if (!validateSimple(deliveryForm, [{ field: 'delivery_partner', message: 'Delivery partner is required.' }])) return
        await deliveryApi.assign(id, deliveryForm)
        setSuccess('Delivery assignment updated successfully.')
        navigate('/admin/delivery-management')
        return
      }

      if (entity === 'delivery-management' && action === 'tracking') {
        if (!validateSimple(trackingForm, [{ field: 'tracking_number', message: 'Tracking number is required.' }])) return
        await deliveryApi.updateTracking(id, trackingForm)
        setSuccess('Tracking updated successfully.')
        navigate('/admin/delivery-management')
        return
      }

      if (entity === 'delivery-management' && action === 'eta') {
        if (!validateSimple(etaForm, [{ field: 'estimated_delivery_date', message: 'Estimated delivery date is required.' }])) return
        await deliveryApi.updateEta(id, etaForm)
        setSuccess('ETA updated successfully.')
        navigate('/admin/delivery-management')
        return
      }

      if (entity === 'delivery-management' && action === 'exception') {
        if (!validateSimple(exceptionForm, [{ field: 'exception_type', message: 'Exception type is required.' }, { field: 'description', message: 'Description is required.' }])) return
        await deliveryApi.addException(id, exceptionForm)
        setSuccess('Delivery exception recorded successfully.')
        navigate('/admin/delivery-management')
        return
      }
    } catch (err) {
      const d = err?.response?.data?.detail || err?.message
      const msg = typeof d === 'string' ? d : JSON.stringify(d)
      setError(msg || 'Unable to save changes.')
    } finally {
      setIsSaving(false)
    }
  }

  const renderBreadcrumbs = () => {
    const crumbs = getBreadcrumb(entity, action, id)
    return (
      <div className='page-breadcrumbs'>
        {crumbs.map((crumb, index) => (
          <React.Fragment key={crumb.label}>
            {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span>{crumb.label}</span>}
            {index < crumbs.length - 1 ? <span className='breadcrumb-separator'>›</span> : null}
          </React.Fragment>
        ))}
      </div>
    )
  }

  const renderActionHeader = () => (
    <div className='page-header-row'>
      <div>
        {renderBreadcrumbs()}
        <h1>{pageLabel}</h1>
        <p className='page-description'>Complete this action on a dedicated page without popup dialogs.</p>
      </div>
    </div>
  )

  const renderBannerForm = () => (
    <form className='admin-form-page-form' onSubmit={handleSubmit}>
      <section className='form-card'>
        <div className='section-heading'>
          <div>
            <h2>Banner Details</h2>
            <p>Configure title, schedule, display location and status for the banner.</p>
          </div>
        </div>
        <div className='form-grid-two'>
          <label className='field-group'><span>Banner Title *</span><input value={bannerForm.title} onChange={(event) => setBannerForm({ ...bannerForm, title: event.target.value })} /></label>
          <label className='field-group'><span>Subtitle</span><input value={bannerForm.subtitle} onChange={(event) => setBannerForm({ ...bannerForm, subtitle: event.target.value })} /></label>
          <label className='field-group'><span>Display Page *</span><select value={bannerForm.display_page} onChange={(event) => setBannerForm({ ...bannerForm, display_page: event.target.value })}><option value='home'>Home</option><option value='beauty'>Beauty</option><option value='wellness'>Wellness</option><option value='medicine'>Medicine</option></select></label>
          <label className='field-group'><span>Banner Type *</span><select value={bannerForm.banner_type} onChange={(event) => setBannerForm({ ...bannerForm, banner_type: event.target.value })}><option value='promo'>Promo</option><option value='hero'>Hero</option><option value='offer'>Offer</option></select></label>
          <label className='field-group'><span>Start Date *</span><input type='date' value={bannerForm.start_date} onChange={(event) => setBannerForm({ ...bannerForm, start_date: event.target.value })} /></label>
          <label className='field-group'><span>End Date *</span><input type='date' value={bannerForm.end_date} onChange={(event) => setBannerForm({ ...bannerForm, end_date: event.target.value })} /></label>
          <label className='field-group'><span>Priority</span><input type='number' value={bannerForm.priority} onChange={(event) => setBannerForm({ ...bannerForm, priority: Number(event.target.value) })} /></label>
          <label className='field-group'><span>Status</span><select value={bannerForm.status} onChange={(event) => setBannerForm({ ...bannerForm, status: event.target.value })}><option value='active'>Active</option><option value='inactive'>Inactive</option></select></label>
        </div>
      </section>
      <section className='form-card'>
        <div className='section-heading'>
          <div>
            <h2>Banner Media</h2>
            <p>Upload the banner asset and preview the selected image.</p>
          </div>
        </div>
        <div className='form-grid-two'>
          <label className='field-group upload-field'><span>Banner Image *</span><input type='file' accept='image/*' onChange={(event) => uploadFile(event, bannerApi.upload, 'image_path', bannerForm, setBannerForm)} /></label>
          {bannerForm.image_path ? <div className='field-group'><span>Preview</span><img src={`http://localhost:8000/${bannerForm.image_path}`} alt='Banner preview' className='banner-preview' /></div> : null}
        </div>
      </section>
      <div className='sticky-action-bar'>
        <button type='button' className='ghost-button' onClick={() => navigate('/admin/banner-management')}>Cancel</button>
        <button type='submit' className='primary-button' disabled={isSaving}>{isSaving ? 'Saving...' : action === 'edit' ? 'Update Banner' : 'Create Banner'}</button>
      </div>
    </form>
  )

  const renderCategoryForm = () => (
    <form className='admin-form-page-form' onSubmit={handleSubmit}>
      <section className='form-card'>
        <div className='section-heading'>
          <span className='section-icon'>🗂️</span>
          <div>
            <h2>Category Details</h2>
            <p>Define category name, parent relationships, images, and visibility settings.</p>
          </div>
        </div>
        <div className='form-grid-two'>
          <label className='field-group'><span>Category Name *</span><input value={categoryForm.name} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} /></label>
          <label className='field-group'><span>Slug</span><input value={categoryForm.slug} onChange={(event) => setCategoryForm({ ...categoryForm, slug: event.target.value })} /></label>
          <label className='field-group'><span>Parent Category</span><select value={categoryForm.parent_id} onChange={(event) => setCategoryForm({ ...categoryForm, parent_id: event.target.value })}><option value=''>Root</option>{parents.map((parent) => <option key={parent.id} value={parent.id}>{parent.name}</option>)}</select></label>
          <label className='field-group'><span>Display Order</span><input type='number' value={categoryForm.display_order} onChange={(event) => setCategoryForm({ ...categoryForm, display_order: Number(event.target.value) })} /></label>
          <label className='field-group'><span>Color</span><input value={categoryForm.color} onChange={(event) => setCategoryForm({ ...categoryForm, color: event.target.value })} /></label>
          <label className='field-group'><span>SEO Title</span><input value={categoryForm.seo_title} onChange={(event) => setCategoryForm({ ...categoryForm, seo_title: event.target.value })} /></label>
          <label className='field-group'><span>SEO Description</span><input value={categoryForm.seo_description} onChange={(event) => setCategoryForm({ ...categoryForm, seo_description: event.target.value })} /></label>
          <label className='field-group field-full'><span>Description</span><textarea value={categoryForm.description} onChange={(event) => setCategoryForm({ ...categoryForm, description: event.target.value })} rows={4} /></label>
        </div>
      </section>
      <section className='form-card'>
        <div className='section-heading'>
          <span className='section-icon'>📤</span>
          <div>
            <h2>Images</h2>
            <p>Upload category thumbnail and banner assets.</p>
          </div>
        </div>
        <div className='form-grid-two'>
          <label className='field-group upload-field'><span>Category Image</span><input type='file' accept='image/*' onChange={(event) => uploadFile(event, categoryApi.upload, 'image_path', categoryForm, setCategoryForm)} /></label>
          <label className='field-group upload-field'><span>Banner Image</span><input type='file' accept='image/*' onChange={(event) => uploadFile(event, categoryApi.upload, 'banner_image_path', categoryForm, setCategoryForm)} /></label>
          {categoryForm.image_path ? <div className='field-group'><span>Image Preview</span><img src={`http://localhost:8000/${categoryForm.image_path}`} alt='Category preview' className='banner-preview' /></div> : null}
          {categoryForm.banner_image_path ? <div className='field-group'><span>Banner Preview</span><img src={`http://localhost:8000/${categoryForm.banner_image_path}`} alt='Banner preview' className='banner-preview' /></div> : null}
        </div>
      </section>
      <section className='form-card'>
        <div className='section-heading'>
          <span className='section-icon'>⚙️</span>
          <div>
            <h2>Visibility & Settings</h2>
            <p>Control category availability and homepage placement.</p>
          </div>
        </div>
        <div className='form-grid-two'>
          <label className='field-group toggle-group'><span>Active</span><input type='checkbox' checked={categoryForm.is_active} onChange={(event) => setCategoryForm({ ...categoryForm, is_active: event.target.checked })} /></label>
          <label className='field-group toggle-group'><span>Show in Header</span><input type='checkbox' checked={categoryForm.show_in_header} onChange={(event) => setCategoryForm({ ...categoryForm, show_in_header: event.target.checked })} /></label>
          <label className='field-group toggle-group'><span>Show on Homepage</span><input type='checkbox' checked={categoryForm.show_on_homepage} onChange={(event) => setCategoryForm({ ...categoryForm, show_on_homepage: event.target.checked })} /></label>
          <label className='field-group toggle-group'><span>Featured</span><input type='checkbox' checked={categoryForm.featured} onChange={(event) => setCategoryForm({ ...categoryForm, featured: event.target.checked })} /></label>
          <label className='field-group toggle-group'><span>Allow Products</span><input type='checkbox' checked={categoryForm.allow_products} onChange={(event) => setCategoryForm({ ...categoryForm, allow_products: event.target.checked })} /></label>
        </div>
      </section>
      <div className='sticky-action-bar'>
        <button type='button' className='ghost-button' onClick={() => navigate('/admin/category-management')}>Cancel</button>
        <button type='submit' className='primary-button' disabled={isSaving}>{isSaving ? 'Saving...' : action === 'edit' ? 'Update Category' : 'Create Category'}</button>
      </div>
    </form>
  )

  const renderBrandForm = () => (
    <form className='admin-form-page-form' onSubmit={handleSubmit}>
      <section className='form-card'>
        <div className='section-heading'>
          <span className='section-icon'>🏷️</span>
          <div>
            <h2>Brand Profile</h2>
            <p>Manage brand details, descriptions, website links, and customer support contacts.</p>
          </div>
        </div>
        <div className='form-grid-two'>
          <label className='field-group'><span>Brand Name *</span><input value={brandForm.name} onChange={(event) => setBrandForm({ ...brandForm, name: event.target.value })} /></label>
          <label className='field-group'><span>Manufacturer</span><input value={brandForm.manufacturer} onChange={(event) => setBrandForm({ ...brandForm, manufacturer: event.target.value })} /></label>
          <label className='field-group'><span>Country</span><input value={brandForm.country} onChange={(event) => setBrandForm({ ...brandForm, country: event.target.value })} /></label>
          <label className='field-group'><span>Website</span><input value={brandForm.website} onChange={(event) => setBrandForm({ ...brandForm, website: event.target.value })} /></label>
          <label className='field-group'><span>Support Email</span><input type='email' value={brandForm.support_email} onChange={(event) => setBrandForm({ ...brandForm, support_email: event.target.value })} /></label>
          <label className='field-group'><span>Support Phone</span><input value={brandForm.support_phone} onChange={(event) => setBrandForm({ ...brandForm, support_phone: event.target.value })} /></label>
          <label className='field-group field-full'><span>Description</span><textarea value={brandForm.description} onChange={(event) => setBrandForm({ ...brandForm, description: event.target.value })} rows={4} /></label>
        </div>
      </section>
      <section className='form-card'>
        <div className='section-heading'>
          <span className='section-icon'>📤</span>
          <div>
            <h2>Brand Media</h2>
            <p>Upload the brand logo and banner for storefront display.</p>
          </div>
        </div>
        <div className='form-grid-two'>
          <label className='field-group upload-field'><span>Brand Logo</span><input type='file' accept='image/*' onChange={(event) => uploadFile(event, brandApi.upload, 'logo_path', brandForm, setBrandForm)} /></label>
          <label className='field-group upload-field'><span>Brand Banner</span><input type='file' accept='image/*' onChange={(event) => uploadFile(event, brandApi.upload, 'banner_path', brandForm, setBrandForm)} /></label>
          {brandForm.logo_path ? <div className='field-group'><span>Logo Preview</span><img src={`http://localhost:8000/${brandForm.logo_path}`} alt='Logo preview' className='banner-preview' /></div> : null}
          {brandForm.banner_path ? <div className='field-group'><span>Banner Preview</span><img src={`http://localhost:8000/${brandForm.banner_path}`} alt='Banner preview' className='banner-preview' /></div> : null}
        </div>
      </section>
      <section className='form-card'>
        <div className='section-heading'>
          <span className='section-icon'>⚙️</span>
          <div>
            <h2>Visibility</h2>
            <p>Control brand availability and feature placement.</p>
          </div>
        </div>
        <div className='form-grid-two'>
          <label className='field-group toggle-group'><span>Active</span><input type='checkbox' checked={brandForm.is_active} onChange={(event) => setBrandForm({ ...brandForm, is_active: event.target.checked })} /></label>
          <label className='field-group toggle-group'><span>Featured</span><input type='checkbox' checked={brandForm.featured} onChange={(event) => setBrandForm({ ...brandForm, featured: event.target.checked })} /></label>
          <label className='field-group toggle-group'><span>Show on Homepage</span><input type='checkbox' checked={brandForm.show_on_homepage} onChange={(event) => setBrandForm({ ...brandForm, show_on_homepage: event.target.checked })} /></label>
        </div>
      </section>
      <section className='form-card'>
        <div className='section-heading'>
          <span className='section-icon'>🔎</span>
          <div>
            <h2>Search Engine</h2>
            <p>Manage the brand SEO title and description.</p>
          </div>
        </div>
        <div className='form-grid-two'>
          <label className='field-group'><span>SEO Title</span><input value={brandForm.seo_title} onChange={(event) => setBrandForm({ ...brandForm, seo_title: event.target.value })} /></label>
          <label className='field-group'><span>SEO Description</span><input value={brandForm.seo_description} onChange={(event) => setBrandForm({ ...brandForm, seo_description: event.target.value })} /></label>
        </div>
      </section>
      <div className='sticky-action-bar'>
        <button type='button' className='ghost-button' onClick={() => navigate('/admin/brand-management')}>Cancel</button>
        <button type='submit' className='primary-button' disabled={isSaving}>{isSaving ? 'Saving...' : action === 'edit' ? 'Update Brand' : 'Create Brand'}</button>
      </div>
    </form>
  )

  const renderInventoryWarehouseForm = () => (
    <form className='admin-form-page-form' onSubmit={handleSubmit}>
      <section className='form-card'>
        <div className='section-heading'>
          <span className='section-icon'>📦</span>
          <div>
            <h2>Warehouse Details</h2>
            <p>Create a new warehouse record for stock management.</p>
          </div>
        </div>
        <div className='form-grid-two'>
          <label className='field-group'><span>Warehouse Name *</span><input value={warehouseForm.name} onChange={(event) => setWarehouseForm({ ...warehouseForm, name: event.target.value })} /></label>
          <label className='field-group'><span>Location</span><input value={warehouseForm.location} onChange={(event) => setWarehouseForm({ ...warehouseForm, location: event.target.value })} /></label>
          <label className='field-group'><span>Manager</span><input value={warehouseForm.manager} onChange={(event) => setWarehouseForm({ ...warehouseForm, manager: event.target.value })} /></label>
          <label className='field-group'><span>Phone</span><input value={warehouseForm.phone} onChange={(event) => setWarehouseForm({ ...warehouseForm, phone: event.target.value })} /></label>
          <label className='field-group field-full'><span>Address</span><textarea value={warehouseForm.address} onChange={(event) => setWarehouseForm({ ...warehouseForm, address: event.target.value })} rows={3} /></label>
          <label className='field-group toggle-group'><span>Active</span><input type='checkbox' checked={warehouseForm.is_active} onChange={(event) => setWarehouseForm({ ...warehouseForm, is_active: event.target.checked })} /></label>
        </div>
      </section>
      <div className='sticky-action-bar'>
        <button type='button' className='ghost-button' onClick={() => navigate('/admin/inventory-management')}>Cancel</button>
        <button type='submit' className='primary-button' disabled={isSaving}>{isSaving ? 'Saving...' : 'Create Warehouse'}</button>
      </div>
    </form>
  )

  const renderInventoryAdjustmentForm = () => (
    <form className='admin-form-page-form' onSubmit={handleSubmit}>
      <section className='form-card'>
        <div className='section-heading'>
          <span className='section-icon'>🔧</span>
          <div>
            <h2>Stock Adjustment</h2>
            <p>Update quantity for the selected inventory item.</p>
          </div>
        </div>
        <div className='form-grid-two'>
          <label className='field-group'><span>Inventory Item</span><input value={inventoryItem?.product?.name || inventoryItem?.name || ''} disabled /></label>
          <label className='field-group'><span>Current Stock</span><input value={String(inventoryItem?.current_stock ?? '')} disabled /></label>
          <label className='field-group'><span>Action</span><select value={adjustmentForm.type} onChange={(event) => setAdjustmentForm({ ...adjustmentForm, type: event.target.value })}><option value='add'>Add Stock</option><option value='remove'>Remove Stock</option></select></label>
          <label className='field-group'><span>Quantity *</span><input type='number' min='1' value={adjustmentForm.quantity} onChange={(event) => setAdjustmentForm({ ...adjustmentForm, quantity: event.target.value })} /></label>
          <label className='field-group'><span>Reason</span><input value={adjustmentForm.reason} onChange={(event) => setAdjustmentForm({ ...adjustmentForm, reason: event.target.value })} /></label>
          <label className='field-group field-full'><span>Notes</span><textarea value={adjustmentForm.notes} onChange={(event) => setAdjustmentForm({ ...adjustmentForm, notes: event.target.value })} rows={3} /></label>
        </div>
      </section>
      <div className='sticky-action-bar'>
        <button type='button' className='ghost-button' onClick={() => navigate('/admin/inventory-management')}>Cancel</button>
        <button type='submit' className='primary-button' disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Stock Update'}</button>
      </div>
    </form>
  )

  const renderInventoryTransferForm = () => (
    <form className='admin-form-page-form' onSubmit={handleSubmit}>
      <section className='form-card'>
        <div className='section-heading'>
          <span className='section-icon'>🔁</span>
          <div>
            <h2>Transfer Stock</h2>
            <p>Move stock from one inventory record to another.</p>
          </div>
        </div>
        <div className='form-grid-two'>
          <label className='field-group'><span>From Inventory</span><input value={inventoryItem?.product?.name || inventoryItem?.name || ''} disabled /></label>
          <label className='field-group'><span>Target Inventory *</span><select value={transferForm.to_inventory_id} onChange={(event) => setTransferForm({ ...transferForm, to_inventory_id: event.target.value })}><option value=''>Select target</option>{inventoryItems.filter((item) => String(item.id) !== String(id)).map((item) => (<option key={item.id} value={item.id}>{item.product?.name || item.name} ({item.warehouse?.name || 'Warehouse'})</option>))}</select></label>
          <label className='field-group'><span>Quantity *</span><input type='number' min='1' value={transferForm.quantity} onChange={(event) => setTransferForm({ ...transferForm, quantity: event.target.value })} /></label>
          <label className='field-group'><span>Reason</span><input value={transferForm.reason} onChange={(event) => setTransferForm({ ...transferForm, reason: event.target.value })} /></label>
        </div>
      </section>
      <div className='sticky-action-bar'>
        <button type='button' className='ghost-button' onClick={() => navigate('/admin/inventory-management')}>Cancel</button>
        <button type='submit' className='primary-button' disabled={isSaving}>{isSaving ? 'Saving...' : 'Transfer Stock'}</button>
      </div>
    </form>
  )

  const renderInventoryHistory = () => (
    <div className='form-card'>
      <div className='section-heading'>
        <span className='section-icon'>📜</span>
        <div>
          <h2>Inventory History</h2>
          <p>Review stock history for this inventory item.</p>
        </div>
      </div>
      <div className='table-wrapper'>
        <table className='data-table'>
          <thead>
            <tr><th>Date</th><th>Previous</th><th>Updated</th><th>Change</th><th>Reason</th><th>Updated By</th></tr>
          </thead>
          <tbody>
            {historyItems.length === 0 ? <tr><td colSpan='6'>No history available.</td></tr> : historyItems.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.updated_at ? new Date(entry.updated_at).toLocaleString() : '—'}</td>
                <td>{entry.previous_stock}</td>
                <td>{entry.new_stock}</td>
                <td>{entry.change_quantity}</td>
                <td>{entry.reason || '—'}</td>
                <td>{entry.updated_by || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='sticky-action-bar'>
        <button type='button' className='ghost-button' onClick={() => navigate('/admin/inventory-management')}>Back to Inventory</button>
      </div>
    </div>
  )

  const [orderStatusForm, setOrderStatusForm] = useState({
    order_status: '',
    delivery_status: '',
    delivery_partner: '',
    tracking_number: '',
    delivery_notes: '',
    payment_status: '',
  })

  const [refundForm, setRefundForm] = useState({
    refund_amount: '',
    refund_reason: '',
    refund_notes: '',
  })

  useEffect(() => {
    if (order) {
      setOrderStatusForm({
        order_status: order.order_status || '',
        delivery_status: order.delivery_status || '',
        delivery_partner: order.delivery_partner || '',
        tracking_number: order.tracking_number || '',
        delivery_notes: order.delivery_notes || '',
        payment_status: order.payment_status || '',
      })
    }
  }, [order])

  useEffect(() => {
    if (payment) {
      setRefundForm({
        refund_amount: payment.amount || '',
        refund_reason: '',
        refund_notes: '',
      })
    }
  }, [payment])

  const renderOrderView = () => (
    <div>
      <section className='form-card'>
        <div className='section-heading'>
          <span className='section-icon'>🧾</span>
          <div>
            <h2>Order Details</h2>
            <p>Review the full order record and status information.</p>
          </div>
        </div>
        <div className='form-grid-two'>
          <label className='field-group'><span>Order ID</span><input value={order?.id ? `#${order.id}` : ''} disabled /></label>
          <label className='field-group'><span>Customer</span><input value={order?.user?.name || ''} disabled /></label>
          <label className='field-group'><span>Phone</span><input value={order?.user?.phone || ''} disabled /></label>
          <label className='field-group'><span>Order Date</span><input value={order?.order_date ? new Date(order.order_date).toLocaleString() : ''} disabled /></label>
          <label className='field-group'><span>Items</span><input value={order?.order_items?.length ?? 0} disabled /></label>
          <label className='field-group'><span>Total Amount</span><input value={order?.total_amount ?? ''} disabled /></label>
          <label className='field-group'><span>Payment Method</span><input value={order?.payment_method || ''} disabled /></label>
          <label className='field-group'><span>Payment Status</span><input value={order?.payment_status || ''} disabled /></label>
          <label className='field-group'><span>Order Status</span><input value={order?.order_status || ''} disabled /></label>
          <label className='field-group'><span>Delivery Status</span><input value={order?.delivery_status || ''} disabled /></label>
        </div>
      </section>
      <section className='form-card'>
        <div className='section-heading'>
          <span className='section-icon'>📍</span>
          <div>
            <h2>Delivery & Billing</h2>
            <p>Shipping, tracking, and billing details for this order.</p>
          </div>
        </div>
        <div className='form-grid-two'>
          <label className='field-group'><span>Delivery Partner</span><input value={order?.delivery_partner || ''} disabled /></label>
          <label className='field-group'><span>Tracking Number</span><input value={order?.tracking_number || ''} disabled /></label>
          <label className='field-group'><span>Address</span><textarea value={order?.address?.house || ''} disabled rows={3} /></label>
        </div>
      </section>
      <div className='sticky-action-bar'>
        <button type='button' className='ghost-button' onClick={() => navigate('/admin/orders')}>Back to Orders</button>
      </div>
    </div>
  )

  const renderOrderUpdate = () => (
    <form className='admin-form-page-form' onSubmit={handleSubmit}>
      <section className='form-card'>
        <div className='section-heading'>
          <span className='section-icon'>🔄</span>
          <div>
            <h2>Update Order Status</h2>
            <p>Change order status, delivery progress, and payment status.</p>
          </div>
        </div>
        <div className='form-grid-two'>
          <label className='field-group'><span>Order Status</span><select value={orderStatusForm.order_status} onChange={(event) => setOrderStatusForm({ ...orderStatusForm, order_status: event.target.value })}>{orderStatuses.map((status) => <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>)}</select></label>
          <label className='field-group'><span>Payment Status</span><select value={orderStatusForm.payment_status} onChange={(event) => setOrderStatusForm({ ...orderStatusForm, payment_status: event.target.value })}>{paymentStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
          <label className='field-group'><span>Delivery Status</span><select value={orderStatusForm.delivery_status} onChange={(event) => setOrderStatusForm({ ...orderStatusForm, delivery_status: event.target.value })}>{deliveryStatuses.map((status) => <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>)}</select></label>
          <label className='field-group'><span>Delivery Partner</span><input value={orderStatusForm.delivery_partner} onChange={(event) => setOrderStatusForm({ ...orderStatusForm, delivery_partner: event.target.value })} /></label>
          <label className='field-group'><span>Tracking Number</span><input value={orderStatusForm.tracking_number} onChange={(event) => setOrderStatusForm({ ...orderStatusForm, tracking_number: event.target.value })} /></label>
          <label className='field-group field-full'><span>Delivery Notes</span><textarea value={orderStatusForm.delivery_notes} onChange={(event) => setOrderStatusForm({ ...orderStatusForm, delivery_notes: event.target.value })} rows={3} /></label>
        </div>
      </section>
      <div className='sticky-action-bar'>
        <button type='button' className='ghost-button' onClick={() => navigate('/admin/orders')}>Cancel</button>
        <button type='submit' className='primary-button' disabled={isSaving}>{isSaving ? 'Saving...' : 'Update Order'}</button>
      </div>
    </form>
  )

  const renderPaymentView = () => (
    <div>
      <section className='form-card'>
        <div className='section-heading'>
          <span className='section-icon'>💳</span>
          <div>
            <h2>Payment Details</h2>
            <p>Review payment transaction and order association.</p>
          </div>
        </div>
        <div className='form-grid-two'>
          <label className='field-group'><span>Payment ID</span><input value={payment?.id ? `#${payment.id}` : ''} disabled /></label>
          <label className='field-group'><span>Order ID</span><input value={payment?.order_id ? `#${payment.order_id}` : ''} disabled /></label>
          <label className='field-group'><span>Customer</span><input value={payment?.customer?.name || ''} disabled /></label>
          <label className='field-group'><span>Transaction ID</span><input value={payment?.transaction_id || ''} disabled /></label>
          <label className='field-group'><span>Amount</span><input value={payment?.amount || ''} disabled /></label>
          <label className='field-group'><span>Status</span><input value={payment?.payment_status || ''} disabled /></label>
          <label className='field-group'><span>Refund Status</span><input value={payment?.refund_status || ''} disabled /></label>
          <label className='field-group'><span>Gateway</span><input value={payment?.gateway || ''} disabled /></label>
          <label className='field-group'><span>Payment Date</span><input value={payment?.payment_date ? new Date(payment.payment_date).toLocaleString() : ''} disabled /></label>
        </div>
      </section>
      <div className='sticky-action-bar'>
        <button type='button' className='ghost-button' onClick={() => navigate('/admin/payments')}>Back to Payments</button>
      </div>
    </div>
  )

  const renderPaymentRefund = () => (
    <form className='admin-form-page-form' onSubmit={handleSubmit}>
      <section className='form-card'>
        <div className='section-heading'>
          <span className='section-icon'>💵</span>
          <div>
            <h2>Refund Payment</h2>
            <p>Process a refund request for this payment record.</p>
          </div>
        </div>
        <div className='form-grid-two'>
          <label className='field-group'><span>Payment ID</span><input value={payment?.id ? `#${payment.id}` : ''} disabled /></label>
          <label className='field-group'><span>Original Amount</span><input value={payment?.amount || ''} disabled /></label>
          <label className='field-group'><span>Refund Amount *</span><input type='number' min='0' value={refundForm.refund_amount} onChange={(event) => setRefundForm({ ...refundForm, refund_amount: event.target.value })} /></label>
          <label className='field-group field-full'><span>Refund Reason</span><textarea value={refundForm.refund_reason} onChange={(event) => setRefundForm({ ...refundForm, refund_reason: event.target.value })} rows={3} /></label>
          <label className='field-group field-full'><span>Notes</span><textarea value={refundForm.refund_notes} onChange={(event) => setRefundForm({ ...refundForm, refund_notes: event.target.value })} rows={3} /></label>
        </div>
      </section>
      <div className='sticky-action-bar'>
        <button type='button' className='ghost-button' onClick={() => navigate('/admin/payments')}>Cancel</button>
        <button type='submit' className='primary-button' disabled={isSaving}>{isSaving ? 'Saving...' : 'Submit Refund'}</button>
      </div>
    </form>
  )

  const renderDeliveryView = () => (
    <div>
      <section className='form-card'>
        <div className='section-heading'>
          <span className='section-icon'>🚚</span>
          <div>
            <h2>Delivery Details</h2>
            <p>Review the delivery record and shipment metadata.</p>
          </div>
        </div>
        <div className='form-grid-two'>
          <label className='field-group'><span>Delivery ID</span><input value={delivery?.id ? `#${delivery.id}` : ''} disabled /></label>
          <label className='field-group'><span>Order ID</span><input value={delivery?.order_id ? `#${delivery.order_id}` : ''} disabled /></label>
          <label className='field-group'><span>Delivery Partner</span><input value={delivery?.delivery_partner || ''} disabled /></label>
          <label className='field-group'><span>Tracking Number</span><input value={delivery?.tracking_number || ''} disabled /></label>
          <label className='field-group'><span>Rider</span><input value={delivery?.rider_name || ''} disabled /></label>
          <label className='field-group'><span>Status</span><input value={delivery?.delivery_status || ''} disabled /></label>
          <label className='field-group'><span>ETA</span><input value={delivery?.eta || ''} disabled /></label>
          <label className='field-group field-full'><span>Delivery Address</span><textarea value={delivery?.delivery_address || ''} disabled rows={3} /></label>
        </div>
      </section>
      <div className='sticky-action-bar'>
        <button type='button' className='ghost-button' onClick={() => navigate('/admin/delivery-management')}>Back to Delivery</button>
      </div>
    </div>
  )

  const renderDeliveryAssign = () => (
    <form className='admin-form-page-form' onSubmit={handleSubmit}>
      <section className='form-card'>
        <div className='section-heading'>
          <span className='section-icon'>👷</span>
          <div>
            <h2>Assign Rider</h2>
            <p>Update partner and rider details for this delivery.</p>
          </div>
        </div>
        <div className='form-grid-two'>
          <label className='field-group'><span>Delivery Partner *</span><input value={deliveryForm.delivery_partner} onChange={(event) => setDeliveryForm({ ...deliveryForm, delivery_partner: event.target.value })} /></label>
          <label className='field-group'><span>Rider Name</span><input value={deliveryForm.rider_name} onChange={(event) => setDeliveryForm({ ...deliveryForm, rider_name: event.target.value })} /></label>
          <label className='field-group'><span>Rider Phone</span><input value={deliveryForm.rider_phone} onChange={(event) => setDeliveryForm({ ...deliveryForm, rider_phone: event.target.value })} /></label>
          <label className='field-group'><span>Rider Vehicle</span><input value={deliveryForm.rider_vehicle} onChange={(event) => setDeliveryForm({ ...deliveryForm, rider_vehicle: event.target.value })} /></label>
          <label className='field-group'><span>Delivery Type</span><select value={deliveryForm.delivery_type} onChange={(event) => setDeliveryForm({ ...deliveryForm, delivery_type: event.target.value })}><option value=''>Select</option>{deliveryTypes.map((type) => <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>)}</select></label>
          <label className='field-group'><span>Shipping Date</span><input type='datetime-local' value={deliveryForm.shipping_date} onChange={(event) => setDeliveryForm({ ...deliveryForm, shipping_date: event.target.value })} /></label>
          <label className='field-group'><span>Estimated Delivery Date</span><input type='datetime-local' value={deliveryForm.estimated_delivery_date} onChange={(event) => setDeliveryForm({ ...deliveryForm, estimated_delivery_date: event.target.value })} /></label>
          <label className='field-group'><span>Delivery Charges</span><input type='number' value={deliveryForm.delivery_charges} onChange={(event) => setDeliveryForm({ ...deliveryForm, delivery_charges: event.target.value })} /></label>
        </div>
      </section>
      <div className='sticky-action-bar'>
        <button type='button' className='ghost-button' onClick={() => navigate('/admin/delivery-management')}>Cancel</button>
        <button type='submit' className='primary-button' disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Assignment'}</button>
      </div>
    </form>
  )

  const renderDeliveryTracking = () => (
    <form className='admin-form-page-form' onSubmit={handleSubmit}>
      <section className='form-card'>
        <div className='section-heading'>
          <span className='section-icon'>📍</span>
          <div>
            <h2>Update Tracking</h2>
            <p>Record tracking, current location, and ETA for the delivery.</p>
          </div>
        </div>
        <div className='form-grid-two'>
          <label className='field-group'><span>Tracking Number *</span><input value={trackingForm.tracking_number} onChange={(event) => setTrackingForm({ ...trackingForm, tracking_number: event.target.value })} /></label>
          <label className='field-group'><span>Current Location</span><input value={trackingForm.current_location} onChange={(event) => setTrackingForm({ ...trackingForm, current_location: event.target.value })} /></label>
          <label className='field-group'><span>Distance Remaining</span><input value={trackingForm.distance_remaining} onChange={(event) => setTrackingForm({ ...trackingForm, distance_remaining: event.target.value })} /></label>
          <label className='field-group'><span>ETA</span><input value={trackingForm.eta} onChange={(event) => setTrackingForm({ ...trackingForm, eta: event.target.value })} /></label>
        </div>
      </section>
      <div className='sticky-action-bar'>
        <button type='button' className='ghost-button' onClick={() => navigate('/admin/delivery-management')}>Cancel</button>
        <button type='submit' className='primary-button' disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Tracking'}</button>
      </div>
    </form>
  )

  const renderDeliveryEta = () => (
    <form className='admin-form-page-form' onSubmit={handleSubmit}>
      <section className='form-card'>
        <div className='section-heading'>
          <span className='section-icon'>⏱️</span>
          <div>
            <h2>Update ETA</h2>
            <p>Adjust the estimated delivery date, ETA, and delay details.</p>
          </div>
        </div>
        <div className='form-grid-two'>
          <label className='field-group'><span>Estimated Delivery Date *</span><input type='datetime-local' value={etaForm.estimated_delivery_date} onChange={(event) => setEtaForm({ ...etaForm, estimated_delivery_date: event.target.value })} /></label>
          <label className='field-group'><span>ETA</span><input value={etaForm.eta} onChange={(event) => setEtaForm({ ...etaForm, eta: event.target.value })} /></label>
          <label className='field-group'><span>Delay Reason</span><input value={etaForm.delay_reason} onChange={(event) => setEtaForm({ ...etaForm, delay_reason: event.target.value })} /></label>
          <label className='field-group field-full'><span>Remarks</span><textarea value={etaForm.remarks} onChange={(event) => setEtaForm({ ...etaForm, remarks: event.target.value })} rows={3} /></label>
        </div>
      </section>
      <div className='sticky-action-bar'>
        <button type='button' className='ghost-button' onClick={() => navigate('/admin/delivery-management')}>Cancel</button>
        <button type='submit' className='primary-button' disabled={isSaving}>{isSaving ? 'Saving...' : 'Save ETA'}</button>
      </div>
    </form>
  )

  const renderDeliveryException = () => (
    <form className='admin-form-page-form' onSubmit={handleSubmit}>
      <section className='form-card'>
        <div className='section-heading'>
          <span className='section-icon'>⚠️</span>
          <div>
            <h2>Record Delivery Exception</h2>
            <p>Log an exception and next steps for delivery recovery.</p>
          </div>
        </div>
        <div className='form-grid-two'>
          <label className='field-group'><span>Exception Type *</span><input value={exceptionForm.exception_type} onChange={(event) => setExceptionForm({ ...exceptionForm, exception_type: event.target.value })} /></label>
          <label className='field-group field-full'><span>Description *</span><textarea value={exceptionForm.description} onChange={(event) => setExceptionForm({ ...exceptionForm, description: event.target.value })} rows={3} /></label>
          <label className='field-group field-full'><span>Resolution</span><textarea value={exceptionForm.resolution} onChange={(event) => setExceptionForm({ ...exceptionForm, resolution: event.target.value })} rows={3} /></label>
        </div>
      </section>
      <div className='sticky-action-bar'>
        <button type='button' className='ghost-button' onClick={() => navigate('/admin/delivery-management')}>Cancel</button>
        <button type='submit' className='primary-button' disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Exception'}</button>
      </div>
    </form>
  )

  const renderProductView = () => (
    <div>
      <section className='form-card'>
        <div className='section-heading'>
          <span className='section-icon'>🧾</span>
          <div>
            <h2>Product Details</h2>
            <p>View the chosen product record without a popup overlay.</p>
          </div>
        </div>
        <div className='form-grid-two'>
          <label className='field-group'><span>Name</span><input value={inventoryItem?.name || inventoryItem?.product?.name || ''} disabled /></label>
          <label className='field-group'><span>SKU</span><input value={inventoryItem?.sku || ''} disabled /></label>
          <label className='field-group'><span>Category</span><input value={inventoryItem?.category?.name || ''} disabled /></label>
          <label className='field-group'><span>Brand</span><input value={inventoryItem?.brand?.name || ''} disabled /></label>
          <label className='field-group'><span>Manufacturer</span><input value={inventoryItem?.manufacturer || ''} disabled /></label>
          <label className='field-group'><span>Price</span><input value={inventoryItem?.selling_price || ''} disabled /></label>
          <label className='field-group'><span>Stock</span><input value={inventoryItem?.stock || ''} disabled /></label>
          <label className='field-group field-full'><span>Description</span><textarea value={inventoryItem?.description || ''} disabled rows={4} /></label>
        </div>
      </section>
      <div className='sticky-action-bar'>
        <button type='button' className='ghost-button' onClick={() => navigate('/admin/product-management')}>Back to Products</button>
      </div>
    </div>
  )

  const renderBrandView = () => (
    <div>
      <section className='form-card'>
        <div className='section-heading'>
          <span className='section-icon'>🏷️</span>
          <div>
            <h2>Brand Details</h2>
            <p>Review brand metadata without a modal dialog.</p>
          </div>
        </div>
        <div className='form-grid-two'>
          <label className='field-group'><span>Brand Name</span><input value={inventoryItem?.name || ''} disabled /></label>
          <label className='field-group'><span>Manufacturer</span><input value={inventoryItem?.manufacturer || ''} disabled /></label>
          <label className='field-group'><span>Country</span><input value={inventoryItem?.country || ''} disabled /></label>
          <label className='field-group'><span>Website</span><input value={inventoryItem?.website || ''} disabled /></label>
          <label className='field-group'><span>Support Email</span><input value={inventoryItem?.support_email || ''} disabled /></label>
          <label className='field-group'><span>Support Phone</span><input value={inventoryItem?.support_phone || ''} disabled /></label>
          <label className='field-group field-full'><span>Description</span><textarea value={inventoryItem?.description || ''} disabled rows={4} /></label>
        </div>
      </section>
      <div className='sticky-action-bar'>
        <button type='button' className='ghost-button' onClick={() => navigate('/admin/brand-management')}>Back to Brands</button>
      </div>
    </div>
  )

  const renderCurrentPage = () => {
    if (isLoading) return <div className='admin-loading-box'>Loading page…</div>

    if (entity === 'banner-management' && ['add', 'edit'].includes(action)) return renderBannerForm()
    if (entity === 'category-management' && ['add', 'edit'].includes(action)) return renderCategoryForm()
    if (entity === 'brand-management' && ['add', 'edit'].includes(action)) return renderBrandForm()
    if (entity === 'brand-management' && action === 'view') return renderBrandView()
    if (entity === 'product-management' && action === 'view') return renderProductView()
    if (entity === 'inventory-management' && action === 'add-warehouse') return renderInventoryWarehouseForm()
    if (entity === 'inventory-management' && action === 'adjust') return renderInventoryAdjustmentForm()
    if (entity === 'inventory-management' && action === 'transfer') return renderInventoryTransferForm()
    if (entity === 'inventory-management' && action === 'history') return renderInventoryHistory()
    if (entity === 'orders' && action === 'view') return renderOrderView()
    if (entity === 'orders' && action === 'update') return renderOrderUpdate()
    if (entity === 'payments' && action === 'view') return renderPaymentView()
    if (entity === 'payments' && action === 'refund') return renderPaymentRefund()
    if (entity === 'delivery-management' && action === 'view') return renderDeliveryView()
    if (entity === 'delivery-management' && action === 'assign') return renderDeliveryAssign()
    if (entity === 'delivery-management' && action === 'tracking') return renderDeliveryTracking()
    if (entity === 'delivery-management' && action === 'eta') return renderDeliveryEta()
    if (entity === 'delivery-management' && action === 'exception') return renderDeliveryException()

    return <div className='admin-error-box'>This action is not supported yet.</div>
  }

  return (
    <div className='admin-form-page'>
      {renderActionHeader()}
      {success && <div className='admin-success-box'>{success}</div>}
      {error && action !== 'add' && <div className='admin-error-box'>{error}</div>}
      {renderCurrentPage()}
    </div>
  )
}

export default AdminActionPage
