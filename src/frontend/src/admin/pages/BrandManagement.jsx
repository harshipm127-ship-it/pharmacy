import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { brandApi } from '../services/adminService'
import '../styles/admin.css'

const emptyForm = {
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

function BrandManagement() {
  const navigate = useNavigate()
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [featuredFilter, setFeaturedFilter] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(8)

  const loadBrands = async () => {
    setLoading(true)
    try {
      const response = await brandApi.list({ search, status: statusFilter, featured: featuredFilter, sort_by: sortBy, skip: (page - 1) * pageSize, limit: pageSize })
      setBrands(response.data || [])
    } catch {
      setBrands([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadBrands() }, [page, search, statusFilter, featuredFilter, sortBy])

  const openAdd = () => {
    navigate('/admin/brand-management/add')
  }

  const openEdit = (brand) => {
    navigate(`/admin/brand-management/edit/${brand.id}`)
  }

  const openView = (brand) => {
    navigate(`/admin/brand-management/view/${brand.id}`)
  }

  const archiveBrand = async (brand) => {
    if (!window.confirm(`Archive ${brand.name}?`)) return
    try {
      await brandApi.archive(brand.id)
      setSuccess('Brand archived')
      loadBrands()
    } catch {
      setError('Unable to archive brand')
    }
  }

  const toggleFeatured = async (brand) => {
    try {
      await brandApi.toggleFeatured(brand.id, !brand.featured)
      loadBrands()
    } catch {
      setError('Unable to update featured status')
    }
  }

  const toggleActive = async (brand) => {
    try {
      await brandApi.toggleActive(brand.id, !brand.is_active)
      loadBrands()
    } catch {
      setError('Unable to update status')
    }
  }

  const pagedBrands = useMemo(() => brands, [brands])

  return (
    <div className='admin-module-page'>
      <div className='admin-welcome'>
        <div>
          <h1>Brand Management</h1>
          <p>Manage all brands, manufacturers, logos, visibility, and associated products.</p>
        </div>
      </div>

      <div className='toolbar-card'>
        <div className='toolbar-controls'>
          <label className='field-group'>
            <span>Search Brand</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder='Search by name or manufacturer' />
          </label>
          <label className='field-group'>
            <span>Filter by Status</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value=''>All</option>
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
            </select>
          </label>
          <label className='field-group'>
            <span>Filter by Featured</span>
            <select value={featuredFilter} onChange={(event) => setFeaturedFilter(event.target.value)}>
              <option value=''>All</option>
              <option value='featured'>Featured</option>
              <option value='standard'>Standard</option>
            </select>
          </label>
          <label className='field-group'>
            <span>Sort By</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value='name'>Brand Name</option>
              <option value='created_at'>Created Date</option>
              <option value='product_count'>Product Count</option>
            </select>
          </label>
        </div>
        <button className='primary-button' onClick={openAdd}>+ Add Brand</button>
      </div>

      {error ? <div className='admin-error-box'>{error}</div> : null}
      {success ? <div className='admin-success-box'>{success}</div> : null}

      <div className='table-card'>
        {loading ? <p>Loading brands...</p> : pagedBrands.length === 0 ? <p>No brands found.</p> : (
          <div className='table-wrapper'>
            <table className='data-table'>
              <thead>
                <tr>
                  <th>Brand Logo</th>
                  <th>Brand Name</th>
                  <th>Manufacturer</th>
                  <th>Country</th>
                  <th>No. of Products</th>
                  <th>Featured</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedBrands.map((brand) => (
                  <tr key={brand.id}>
                    <td>{brand.logo_path ? <img src={`http://localhost:8000/${brand.logo_path}`} alt={brand.name} className='banner-thumb' /> : <span>—</span>}</td>
                    <td>{brand.name}</td>
                    <td>{brand.manufacturer || '—'}</td>
                    <td>{brand.country || '—'}</td>
                    <td>{brand.product_count || 0}</td>
                    <td><button className='ghost-button' onClick={() => toggleFeatured(brand)}>{brand.featured ? 'Featured' : 'Standard'}</button></td>
                    <td><button className='ghost-button' onClick={() => toggleActive(brand)}>{brand.is_active ? 'Active' : 'Inactive'}</button></td>
                    <td>{brand.created_at ? new Date(brand.created_at).toLocaleDateString() : '—'}</td>
                    <td><div className='action-buttons'><button className='ghost-button' onClick={() => openView(brand)}>View</button><button className='ghost-button' onClick={() => openEdit(brand)}>Edit</button><button className='ghost-button' onClick={() => toggleFeatured(brand)}>Feature</button><button className='ghost-button' onClick={() => archiveBrand(brand)}>Archive</button></div></td>
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
        <button className='ghost-button' onClick={() => setPage((value) => value + 1)}>Next</button>
      </div>


    </div>
  )
}

export default BrandManagement
