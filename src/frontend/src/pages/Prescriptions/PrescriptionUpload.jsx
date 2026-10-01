import React, { useState } from 'react'
import apiClient from '../../api/apiClient'

function PrescriptionUpload() {
  const [file, setFile] = useState(null)
  const [doctorName, setDoctorName] = useState('')
  const [orderId, setOrderId] = useState('')
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!file) {
      setMessage('Please choose a prescription file to upload.')
      return
    }

    setUploading(true)
    setMessage('Uploading prescription...')

    const formData = new FormData()
    formData.append('file', file)
    if (doctorName) formData.append('doctor_name', doctorName)
    if (orderId) formData.append('order_id', orderId)

    try {
      const response = await apiClient.post('/prescriptions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setMessage(`Prescription uploaded successfully. ID: ${response.data.id}`)
      setFile(null)
      setDoctorName('')
      setOrderId('')
    } catch (error) {
      setMessage(error?.response?.data?.detail || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <section>
      <h1>Upload Prescription</h1>
      <p>Attach a prescription to support orders that require validation. You may optionally link it to an existing order.</p>
      <form onSubmit={handleSubmit} className='form-card'>
        <label className='field-group'>
          <span>Prescription File</span>
          <input type='file' accept='.jpg,.jpeg,.png,.webp,.pdf' onChange={(event) => setFile(event.target.files[0])} />
        </label>
        <label className='field-group'>
          <span>Doctor Name</span>
          <input type='text' value={doctorName} onChange={(event) => setDoctorName(event.target.value)} />
        </label>
        <label className='field-group'>
          <span>Order ID (optional)</span>
          <input type='number' value={orderId} onChange={(event) => setOrderId(event.target.value)} />
        </label>
        <button type='submit' className='primary-button' disabled={uploading}>{uploading ? 'Uploading...' : 'Upload Prescription'}</button>
      </form>
      {message && <div style={{ marginTop: '1rem' }}>{message}</div>}
    </section>
  )
}

export default PrescriptionUpload
