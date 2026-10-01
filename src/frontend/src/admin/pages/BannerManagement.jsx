import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bannerApi } from '../services/adminService'
import '../styles/admin.css'

const emptyForm = {
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

function BannerManagement() {
  const navigate = useNavigate()
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [search, setSearch] = useState('')
  const [pageFilter, setPageFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('priority')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')

  const loadBanners = async () => {
    setLoading(true)
    try {
      const response = await bannerApi.list()
      setBanners(response.data || [])
    } catch {
      setBanners([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadBanners() }, [])

  const filteredBanners = useMemo(() => {
    const query = search.toLowerCase()
    return banners.filter((banner) => {
      const matchesSearch = !query || banner.title?.toLowerCase().includes(query) || banner.display_page?.toLowerCase().includes(query)
      const matchesPage = !pageFilter || banner.display_page === pageFilter
      const matchesStatus = !statusFilter || banner.status === statusFilter
      return matchesSearch && matchesPage && matchesStatus
    }).sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'start_date') return new Date(a.start_date) - new Date(b.start_date)
      if (sortBy === 'end_date') return new Date(a.end_date) - new Date(b.end_date)
      return b.priority - a.priority
    })
  }, [banners, pageFilter, search, sortBy, statusFilter])

  const resetForm = () => {
    setForm(emptyForm)
    setError('')
  }

  const openAdd = () => {
    resetForm()
    navigate('/admin/banner-management/add')
  }

  const openEdit = (banner) => {
    navigate(`/admin/banner-management/edit/${banner.id}`)
  }

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await bannerApi.upload(formData)
      const uploadedPath = response.data?.image_path
      setForm((current) => ({ ...current, image_path: uploadedPath }))
      setPreviewUrl(`http://localhost:8000/${uploadedPath}`)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const submitBanner = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.title.trim() || !form.display_page || !form.banner_type || !form.start_date || !form.end_date || !form.image_path) {
      setError('Please complete all required fields and upload a banner image.')
      return
    }

    try {
      if (form.id) {
        await bannerApi.update(form.id, form)
      } else {
        await bannerApi.create(form)
      }
      resetForm()
      loadBanners()
    } catch (err) {
      setError(err?.response?.data?.detail || 'Unable to save banner')
    }
  }

  const toggleStatus = async (banner) => {
    try {
      await bannerApi.update(banner.id, { status: banner.status === 'active' ? 'inactive' : 'active' })
      loadBanners()
    } catch {
      setError('Unable to change banner status')
    }
  }

  const deleteBanner = async (banner) => {
    if (!window.confirm(`Delete ${banner.title}?`)) return
    try {
      await bannerApi.remove(banner.id)
      loadBanners()
    } catch {
      setError('Unable to delete banner')
    }
  }

  return (
    <div className='admin-module-page'>
      <div className='admin-welcome'>
        <div>
          <h1>Banner Management</h1>
          <p>Manage promotional banners for the storefront with scheduling, priority, and status controls.</p>
        </div>
      </div>

      <div className='toolbar-card'>
        <div className='toolbar-controls'>
          <label className='field-group'>
            <span>Search Banner</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder='Search title' />
          </label>
          <label className='field-group'>
            <span>Filter by Page</span>
            <select value={pageFilter} onChange={(event) => setPageFilter(event.target.value)}>
              <option value=''>All Pages</option>
              <option value='home'>Home</option>
              <option value='beauty'>Beauty</option>
              <option value='wellness'>Wellness</option>
              <option value='medicine'>Medicine</option>
            </select>
          </label>
          <label className='field-group'>
            <span>Filter by Status</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value=''>All Status</option>
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
            </select>
          </label>
          <label className='field-group'>
            <span>Sort By</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value='priority'>Priority</option>
              <option value='title'>Title</option>
              <option value='start_date'>Start Date</option>
              <option value='end_date'>End Date</option>
            </select>
          </label>
        </div>
        <button className='primary-button' onClick={openAdd}>+ Add Banner</button>
      </div>

      {error ? <div className='admin-error-box'>{error}</div> : null}

      <div className='table-card'>
        {loading ? <p>Loading banners...</p> : (
          <div className='table-wrapper'>
            <table className='data-table'>
              <thead>
                <tr>
                  <th>Banner Image</th>
                  <th>Banner Title</th>
                  <th>Display Page</th>
                  <th>Banner Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBanners.map((banner) => (
                  <tr key={banner.id}>
                    <td><img src={banner.image_path ? `http://localhost:8000/${banner.image_path}` : ''} alt={banner.title} className='banner-thumb' /></td>
                    <td>{banner.title}</td>
                    <td>{banner.display_page}</td>
                    <td>{banner.banner_type}</td>
                    <td>{banner.start_date}</td>
                    <td>{banner.end_date}</td>
                    <td>{banner.priority}</td>
                    <td>
                      <label className='switch-row'>
                        <input type='checkbox' checked={banner.status === 'active'} onChange={() => toggleStatus(banner)} />
                        <span>{banner.status}</span>
                      </label>
                    </td>
                    <td>
                      <div className='action-buttons'>
                        <button className='ghost-button' onClick={() => openEdit(banner)}>Edit</button>
                        <button className='ghost-button danger' onClick={() => deleteBanner(banner)}>Delete</button>
                      </div>
                    </td>
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

export default BannerManagement
