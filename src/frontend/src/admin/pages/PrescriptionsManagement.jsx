/**
 * @typedef {Object} PrescriptionRead
 * @property {number} id
 * @property {number} user_id
 * @property {number|null} order_id
 * @property {string} image_url
 * @property {string|null} doctor_name
 * @property {string} status
 * @property {string|null} admin_notes
 * @property {string|null} reviewed_by
 * @property {string|null} reviewed_at
 * @property {string|null} uploaded_date
 */

import React, { useEffect, useState } from 'react'
import { prescriptionsApi } from '../services/adminService'
import '../styles/admin.css'

function PrescriptionsManagement() {
  const [prescriptions, setPrescriptions] = useState(/** @type {PrescriptionRead[]} */ ([]))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selected, setSelected] = useState(null)
  const [notes, setNotes] = useState({})

  const getErrorMessage = (err) => {
    const detail = err?.response?.data?.detail
    if (Array.isArray(detail)) {
      return detail.map((item) => {
        if (item?.msg) {
          const path = Array.isArray(item.loc) ? item.loc.join('.') : item.loc
          return `${path}: ${item.msg}`
        }
        return JSON.stringify(item)
      }).join(' | ')
    }
    if (typeof detail === 'object' && detail !== null) {
      return JSON.stringify(detail)
    }
    return detail || err?.message || 'Unable to load prescriptions'
  }

  const validatePrescriptionList = (data) => {
    if (!Array.isArray(data)) {
      return 'Prescription response is not an array.'
    }

    for (const item of data) {
      if (!item || typeof item !== 'object') {
        return 'Prescription response contains invalid items.'
      }
      if (typeof item.id !== 'number' || !Number.isInteger(item.id)) {
        return 'Prescription response contains an invalid or missing integer id.'
      }
    }

    return null
  }

  const loadPrescriptions = async () => {
    setLoading(true)
    try {
      const response = await prescriptionsApi.list({ skip: 0, limit: 50 })
      const data = /** @type {PrescriptionRead[]} */ (response.data || [])
      const validationError = validatePrescriptionList(data)
      if (validationError) {
        throw new Error(validationError)
      }
      setPrescriptions(data)
      setError('')
    } catch (err) {
      setError(getErrorMessage(err))
      setPrescriptions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPrescriptions()
  }, [])

  const approve = async (prescription) => {
    const id = prescription?.id
    if (typeof id !== 'number' || !Number.isInteger(id)) {
      setError('Invalid prescription ID. Cannot approve.')
      return
    }

    try {
      await prescriptionsApi.approve(prescription.id, { admin_notes: notes[prescription.id] || 'Approved by admin' })
      setSuccess('Prescription approved')
      setError('')
      loadPrescriptions()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const reject = async (prescription) => {
    const id = prescription?.id
    if (typeof id !== 'number' || !Number.isInteger(id)) {
      setError('Invalid prescription ID. Cannot reject.')
      return
    }

    try {
      await prescriptionsApi.reject(id, { admin_notes: notes[prescription.id] || 'Rejected by admin' })
      setSuccess('Prescription rejected')
      setError('')
      loadPrescriptions()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className='admin-module-page'>
      <div className='admin-welcome'>
        <div>
          <h1>Prescription Verification</h1>
          <p>Review incoming prescriptions, approve or reject them, and attach admin notes.</p>
        </div>
      </div>

      {error && <div className='admin-error-box'>{error}</div>}
      {success && <div className='admin-success-box'>{success}</div>}

      <div className='table-card'>
        {loading ? (
          <p>Loading prescriptions...</p>
        ) : prescriptions.length === 0 ? (
          <p>No prescriptions found.</p>
        ) : (
          <div className='table-wrapper'>
            <table className='data-table'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Status</th>
                  <th>Order ID</th>
                  <th>Uploaded</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((prescription) => (
                  <tr key={prescription.id}>
                    <td>#{prescription.id}</td>
                    <td>{prescription.user_id}</td>
                    <td>{prescription.status}</td>
                    <td>{prescription.order_id ?? '—'}</td>
                    <td>{prescription.uploaded_date ? new Date(prescription.uploaded_date).toLocaleString() : '—'}</td>
                    <td>
                      <label>
                        <textarea
                          value={notes[prescription.id] || ''}
                          onChange={(event) => setNotes((current) => ({ ...current, [prescription.id]: event.target.value }))}
                          placeholder='Add admin notes...'
                          rows={2}
                        />
                      </label>
                      <div className='admin-action-row'>
                        <button className='ghost-button' onClick={() => approve(prescription)}>Approve</button>
                        <button className='ghost-button' onClick={() => reject(prescription)}>Reject</button>
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

export default PrescriptionsManagement
