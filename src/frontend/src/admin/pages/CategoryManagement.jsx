import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { categoryApi } from '../services/adminService'
import '../styles/admin.css'

const emptyForm = {
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

function CategoryManagement() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [parentFilter, setParentFilter] = useState('')
  const [featuredFilter, setFeaturedFilter] = useState('')
  const [sortBy, setSortBy] = useState('display_order')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadCategories = async () => {
    setLoading(true)
    try {
      const response = await categoryApi.list({ page: 1, size: 100, search: search || undefined, sortBy: 'name', ascending: true })
      setCategories(response.data?.data?.content || [])
    } catch {
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCategories() }, [])

  const filteredCategories = useMemo(() => {
    const list = [...categories]
    list.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'created_at') return new Date(a.created_at) - new Date(b.created_at)
      return a.display_order - b.display_order
    })
    return list
  }, [categories, sortBy])

  const openAdd = () => {
    navigate('/admin/category-management/add')
  }

  const openEdit = (category) => {
    navigate(`/admin/category-management/edit/${category.publicId}`)
  }

  const archiveCategory = async (category) => {
    if (!window.confirm(`Archive ${category.name}?`)) return
    try {
      await categoryApi.archive(category.publicId)
      setSuccess('Category archived')
      loadCategories()
    } catch {
      setError('Unable to archive category')
    }
  }

  return (
    <div className='admin-module-page'>
      <div className='admin-welcome'>
        <div>
          <h1>Category Management</h1>
          <p>Manage all product categories, subcategories, display order, visibility, and homepage navigation.</p>
        </div>
      </div>

      <div className='toolbar-card'>
        <div className='toolbar-controls'>
          <label className='field-group'>
            <span>Search Category</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder='Search name or slug' />
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
            <span>Filter by Parent Category</span>
            <select value={parentFilter} onChange={(event) => setParentFilter(event.target.value)}>
              <option value=''>All</option>
              <option disabled>Parent filtering is not available yet</option>
            </select>
          </label>
          <label className='field-group'>
            <span>Sort By</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value='display_order'>Display Order</option>
              <option value='name'>Name</option>
              <option value='created_at'>Created Date</option>
            </select>
          </label>
        </div>
        <button className='primary-button' onClick={openAdd}>Add Category</button>
      </div>

      {error ? <div className='admin-error-box'>{error}</div> : null}
      {success ? <div className='admin-success-box'>{success}</div> : null}

      <div className='table-card'>
        {loading ? <p>Loading categories...</p> : (
          <div className='table-wrapper'>
            <table className='data-table'>
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.publicId}>
                    <td>{category.name}</td>
                    <td>{category.departmentName || '—'}</td>
                    <td>{category.active ? 'Active' : 'Inactive'}</td>
                    <td><div className='action-buttons'><button className='ghost-button' onClick={() => openEdit(category)}>Edit</button>{category.active ? <button className='ghost-button' onClick={() => archiveCategory(category)}>Deactivate</button> : <button className='ghost-button' onClick={async () => { try { await categoryApi.restore(category.publicId); setSuccess('Category restored'); loadCategories() } catch { setError('Unable to restore category') } }}>Restore</button>}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}

export default CategoryManagement
