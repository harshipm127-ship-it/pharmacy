import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { categoryApi, productApi } from '../services/adminService'
import '../styles/admin.css'

function ProductManagement() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [direction, setDirection] = useState('asc')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const pageSize = 10

  const load = async () => {
    setLoading(true); setError('')
    try {
      const [productResponse, categoryResponse] = await Promise.all([
        productApi.list({ page, size: pageSize, search: search || undefined, sortBy, direction }),
        categoryApi.list({ page: 1, size: 200 }),
      ])
      const productPage = productResponse.data?.data
      setProducts(productPage?.products || [])
      setTotalPages(productPage?.totalPages || 0)
      setTotalElements(productPage?.totalElements || 0)
      setCategories(categoryResponse.data?.data?.content || [])
    } catch (requestError) {
      setProducts([]); setTotalPages(0); setTotalElements(0)
      setError(requestError?.response?.data?.message || 'Unable to load products.')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [page, search, sortBy, direction])
  const changeSearch = (event) => { setSearch(event.target.value); setPage(0) }
  const archive = async (product) => {
    if (!window.confirm(`Deactivate ${product.name}?`)) return
    try { await productApi.archive(product.publicId); setSuccess('Product deactivated.'); load() }
    catch (requestError) { setError(requestError?.response?.data?.message || 'Unable to deactivate product.') }
  }
  const restore = async (product) => {
    try { await productApi.restore(product.publicId); setSuccess('Product restored.'); load() }
    catch (requestError) { setError(requestError?.response?.data?.message || 'Unable to restore product.') }
  }

  return <div className='admin-module-page'>
    <div className='admin-welcome'><div><h1>Product Management</h1><p>Manage products, categories, pricing, active status, and product images.</p></div></div>
    <div className='toolbar-card'><div className='toolbar-controls'>
      <label className='field-group'><span>Search Product</span><input value={search} onChange={changeSearch} placeholder='Search by name or SKU' /></label>
      <label className='field-group'><span>Sort by</span><select value={sortBy} onChange={(event) => { setSortBy(event.target.value); setPage(0) }}><option value='name'>Name</option><option value='sku'>SKU</option><option value='mrp'>MRP</option><option value='sellingPrice'>Selling price</option></select></label>
      <label className='field-group'><span>Direction</span><select value={direction} onChange={(event) => { setDirection(event.target.value); setPage(0) }}><option value='asc'>Ascending</option><option value='desc'>Descending</option></select></label>
    </div><button className='primary-button' onClick={() => navigate('/admin/product-management/add')}>Add Product</button></div>
    {error && <div className='admin-error-box'>{error}</div>}{success && <div className='admin-success-box'>{success}</div>}
    <div className='table-card'>{loading ? <p>Loading products...</p> : products.length === 0 ? <p>No products found.</p> : <div className='table-wrapper'><table className='data-table'><thead><tr><th>Image</th><th>Name</th><th>SKU</th><th>Category</th><th>Dosage Form</th><th>Brand</th><th>MRP</th><th>Selling Price</th><th>Status</th><th>Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product.publicId}><td>{product.primaryImageUrl ? <img src={product.primaryImageUrl} alt={product.name} className='banner-thumb' /> : '—'}</td><td>{product.name}</td><td>{product.sku}</td><td>{product.categoryName || '—'}</td><td>{product.dosageForm || '—'}</td><td>{product.brand || '—'}</td><td>{product.mrp == null ? '—' : `₹${Number(product.mrp).toFixed(2)}`}</td><td>{product.sellingPrice == null ? '—' : `₹${Number(product.sellingPrice).toFixed(2)}`}</td><td><span className={product.active ? 'status-badge in-stock' : 'status-badge expired'}>{product.active ? 'Active' : 'Inactive'}</span></td><td><div className='action-buttons'><button className='ghost-button' onClick={() => navigate(`/admin/product-management/view/${product.publicId}`)}>View</button><button className='ghost-button' onClick={() => navigate(`/admin/product-management/edit/${product.publicId}`)}>Edit</button>{product.active ? <button className='ghost-button' onClick={() => archive(product)}>Deactivate</button> : <button className='ghost-button' onClick={() => restore(product)}>Restore</button>}</div></td></tr>)}</tbody></table></div>}</div>
    <div className='pagination-row'><button className='ghost-button' disabled={page === 0 || loading} onClick={() => setPage((current) => current - 1)}>Previous</button><span>Page {totalPages ? page + 1 : 0} of {totalPages} ({totalElements} products)</span><button className='ghost-button' disabled={loading || !totalPages || page >= totalPages - 1} onClick={() => setPage((current) => current + 1)}>Next</button></div>
  </div>
}

export default ProductManagement
