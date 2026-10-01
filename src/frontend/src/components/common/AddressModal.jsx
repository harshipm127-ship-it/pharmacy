import React, { useEffect, useState, useContext } from 'react'
import customerApi from '../../services/customerApi'
import { AuthContext } from '../../context/AuthContext'
import './AddressModal.css'

export default function AddressModal({ isOpen, onClose, onSelect }) {
  const auth = useContext(AuthContext)
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    full_name: '',
    mobile: '',
    alternate_mobile: '',
    address_line_1: '',
    address_line_2: '',
    landmark: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    address_type: 'Home',
    is_default: false,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [detecting, setDetecting] = useState(false)
  const [detectError, setDetectError] = useState('')
  const [pinCode, setPinCode] = useState('')
  const [pinError, setPinError] = useState('')
  const [pinLoading, setPinLoading] = useState(false)

  const isPinValid = /^[0-9]{6}$/.test(pinCode)

  useEffect(() => {
    if (!isOpen) return
    loadAddresses()
  }, [isOpen, auth?.isAuthenticated])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) {
      setShowForm(false)
      setForm({
        full_name: '',
        mobile: '',
        alternate_mobile: '',
        address_line_1: '',
        address_line_2: '',
        landmark: '',
        area: '',
        city: '',
        state: '',
        pincode: '',
        address_type: 'Home',
        is_default: false,
      })
      setError('')
      setDetectError('')
      setPinError('')
      setPinCode('')
    }
  }, [isOpen])

  const loadAddresses = async () => {
    setLoading(true)
    try {
      if (auth?.isAuthenticated) {
        const resp = await customerApi.addresses.list()
        setAddresses(Array.isArray(resp) ? resp : [])
      } else {
        const raw = localStorage.getItem('guest_addresses')
        const list = raw ? JSON.parse(raw) : []
        setAddresses(Array.isArray(list) ? list : [])
      }
    } catch (err) {
      setAddresses([])
    } finally {
      setLoading(false)
    }
  }

  const openAdd = () => {
    setForm({
      full_name: '',
      mobile: '',
      alternate_mobile: '',
      address_line_1: '',
      address_line_2: '',
      landmark: '',
      area: '',
      city: '',
      state: '',
      pincode: '',
      address_type: 'Home',
      is_default: false,
    })
    setShowForm(true)
    setError('')
  }

  const handleDetectLocation = () => {
    setDetectError('')
    if (!('geolocation' in navigator)) {
      setDetectError('Location detection is not supported on this browser. Please enter your PIN Code or add an address manually.')
      return
    }

    setDetecting(true)
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords
      try {
        // use Nominatim reverse geocoding
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&addressdetails=1`
        const resp = await fetch(url, { headers: { 'Accept': 'application/json' } })
        if (!resp.ok) throw new Error('Unable to reverse geocode location')
        const data = await resp.json()
        const addr = data.address || {}
        // build a best-effort form
        const detected = {
          full_name: '',
          mobile: '',
          alternate_mobile: '',
          address_line_1: [addr.house_number, addr.road].filter(Boolean).join(' ').trim() || addr.pedestrian || addr.footway || addr.building || '',
          address_line_2: addr.neighbourhood || addr.suburb || addr.village || addr.hamlet || '',
          landmark: addr.landmark || addr.attraction || '',
          area: addr.suburb || addr.neighbourhood || addr.city_district || addr.county || '',
          city: addr.city || addr.town || addr.village || addr.municipality || '',
          state: addr.state || '',
          pincode: addr.postcode || '',
          address_type: 'Home',
          is_default: false,
        }

        if (auth?.isAuthenticated) {
          // ask user whether to use temporarily or save
          const useTemp = window.confirm('Use this location temporarily?\n\nPress OK to use temporarily for this order. Press Cancel to edit and save this address to your account.')
          if (useTemp) {
            // set selected but do not save
            try {
              localStorage.setItem('selected_delivery_address', JSON.stringify(detected))
              window.dispatchEvent(new CustomEvent('delivery-address-changed', { detail: detected }))
            } catch (e) {}
            if (onSelect) onSelect(detected)
            onClose()
          } else {
            // open form prefilled for save
            setForm((f) => ({ ...f, ...detected }))
            setShowForm(true)
          }
        } else {
          // guest: persist to guest storage and select
          try {
            const raw = localStorage.getItem('guest_addresses')
            const list = raw ? JSON.parse(raw) : []
            const id = Date.now()
            const created = { ...detected, id }
            list.unshift(created)
            localStorage.setItem('guest_addresses', JSON.stringify(list))
            localStorage.setItem('selected_delivery_address', JSON.stringify(created))
            window.dispatchEvent(new CustomEvent('delivery-address-changed', { detail: created }))
            if (onSelect) onSelect(created)
            onClose()
          } catch (e) {
            setDetectError('Failed to save detected address. Please try again.')
          }
        }
      } catch (err) {
        setDetectError('Unable to determine address from your location. Please try entering PIN code or add address manually.')
      } finally {
        setDetecting(false)
      }
    }, (err) => {
      setDetecting(false)
      if (err.code === 1) {
        setDetectError('Location permission was denied. You can enter PIN code or add an address manually.')
      } else if (err.code === 2) {
        setDetectError('Position unavailable. Try again or enter PIN code manually.')
      } else if (err.code === 3) {
        setDetectError('Location request timed out. Retry or enter PIN code manually.')
      } else {
        setDetectError('Unable to detect location. Please try again.')
      }
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 })
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.full_name || !form.mobile || !form.address_line_1 || !form.area || !form.city || !form.state || !form.pincode) {
      setError('Please fill required fields')
      return
    }
    setSaving(true)
    try {
      let created = null
      if (form.id) {
        // update existing
        if (auth?.isAuthenticated) {
          created = await customerApi.addresses.update(form.id, form)
        } else {
          const raw = localStorage.getItem('guest_addresses')
          const list = raw ? JSON.parse(raw) : []
          const idx = list.findIndex((a) => a.id === form.id)
          if (idx !== -1) list[idx] = { ...list[idx], ...form }
          created = list[idx] || form
          localStorage.setItem('guest_addresses', JSON.stringify(list))
          const sel = JSON.parse(localStorage.getItem('selected_delivery_address') || 'null')
          if (sel && sel.id === created.id) {
            localStorage.setItem('selected_delivery_address', JSON.stringify(created))
            window.dispatchEvent(new CustomEvent('delivery-address-changed', { detail: created }))
          }
        }
      } else {
        if (auth?.isAuthenticated) {
          created = await customerApi.addresses.create(form)
        } else {
          const raw = localStorage.getItem('guest_addresses')
          const list = raw ? JSON.parse(raw) : []
          const id = Date.now()
          created = { ...form, id }
          list.unshift(created)
          localStorage.setItem('guest_addresses', JSON.stringify(list))
          // also set as selected delivery address
          localStorage.setItem('selected_delivery_address', JSON.stringify(created))
          window.dispatchEvent(new CustomEvent('delivery-address-changed', { detail: created }))
        }
      }
      await loadAddresses()
      setShowForm(false)
      if (onSelect) onSelect(created)
      onClose()
    } catch (err) {
      setError(err?.response?.data?.detail || 'Unable to save address')
    } finally {
      setSaving(false)
    }
  }

  const handleDeliverHere = (address) => {
    // persist selection for guests
    try {
      if (!auth?.isAuthenticated) {
        localStorage.setItem('selected_delivery_address', JSON.stringify(address))
      } else {
        // for logged in users, also persist selected in localStorage for client-side display
        localStorage.setItem('selected_delivery_address', JSON.stringify(address))
      }
      window.dispatchEvent(new CustomEvent('delivery-address-changed', { detail: address }))
    } catch (e) {
      // ignore
    }
    if (onSelect) onSelect(address)
    onClose()
  }

  const handleDelete = async (id) => {
    try {
      if (auth?.isAuthenticated) {
        await customerApi.addresses.remove(id)
      } else {
        const raw = localStorage.getItem('guest_addresses')
        const list = raw ? JSON.parse(raw) : []
        const filtered = list.filter((a) => a.id !== id)
        localStorage.setItem('guest_addresses', JSON.stringify(filtered))
        const sel = JSON.parse(localStorage.getItem('selected_delivery_address') || 'null')
        if (sel && sel.id === id) {
          localStorage.removeItem('selected_delivery_address')
          window.dispatchEvent(new CustomEvent('delivery-address-changed', { detail: null }))
        }
      }
      await loadAddresses()
    } catch {
      // ignore
    }
  }

  const handlePinChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 6)
    setPinCode(digits)
    setPinError('')
  }

  const handleApplyPin = async () => {
    if (!isPinValid) {
      setPinError('Please enter a valid 6-digit PIN Code.')
      return
    }

    setPinError('')
    setPinLoading(true)
    try {
      const result = await customerApi.delivery.validatePincode(pinCode)
      if (!result?.available) {
        setPinError(result?.message || 'Sorry! We currently do not deliver to this PIN Code. Please try another PIN Code.')
        return
      }

      const selected = {
        full_name: '',
        mobile: '',
        alternate_mobile: '',
        address_line_1: '',
        address_line_2: '',
        landmark: '',
        area: '',
        city: result.city || '',
        state: result.state || '',
        country: result.country || '',
        pincode: result.pincode,
        address_type: 'Home',
        is_default: false,
      }

      try {
        localStorage.setItem('selected_delivery_address', JSON.stringify(selected))
      } catch (e) {
        // ignore local storage failures
      }

      window.dispatchEvent(new CustomEvent('delivery-address-changed', { detail: selected }))
      if (onSelect) onSelect(selected)
      onClose()
    } catch (err) {
      setPinError(err?.response?.data?.detail || 'Unable to verify this PIN Code. Please try again.')
    } finally {
      setPinLoading(false)
    }
  }

  const renderPinEntry = () => (
    <div className='pin-section'>
      <div className='pin-row'>
        <input
          placeholder='Enter PIN Code'
          value={pinCode}
          onChange={handlePinChange}
          inputMode='numeric'
          maxLength={6}
        />
        <button
          type='button'
          className='primary-btn pin-apply-btn'
          onClick={handleApplyPin}
          disabled={!isPinValid || pinLoading}
        >
          {pinLoading ? (
            <><span className='spinner' /> Checking delivery availability...</>
          ) : 'Apply'}
        </button>
      </div>
      {pinError && (
        <div className='pin-error'>
          <span>{pinError}</span>
          {isPinValid && !pinLoading && (
            <button type='button' className='ghost-btn' onClick={handleApplyPin}>Retry</button>
          )}
        </div>
      )}
    </div>
  )

  if (!isOpen) return null

  return (
    <div className='address-modal-overlay' onMouseDown={(e) => { if (e.target.classList.contains('address-modal-overlay')) onClose() }}>
      <div className='address-modal' role='dialog' aria-modal='true'>
        <button className='modal-close' onClick={onClose} aria-label='Close'>✕</button>
        {!showForm ? (
          <div className='address-panel'>
            <div className='address-panel-header'>
              <h2>Where do you want the delivery?</h2>
            </div>

            {loading ? (
              <div className='loading-state'>Loading addresses…</div>
            ) : (
              <>
                <div className='address-options'>
                  <div className='pin-entry-block'>
                    <span className='pin-icon'>📍</span>
                    <div>
                      <label>Enter PIN Code</label>
                      {renderPinEntry()}
                    </div>
                  </div>
                  <div className='detect-block'>
                    <span className='detect-icon'>📌</span>
                    <div>
                      <label>Detect My Location</label>
                      <p className='hint-text'>Use your device location to fill the address automatically.</p>
                      <button type='button' className='ghost-btn detect-action' onClick={handleDetectLocation} disabled={detecting || pinLoading}>
                        {detecting ? 'Detecting…' : 'Detect My Location'}
                      </button>
                    </div>
                  </div>
                </div>

                {detectError && (
                  <div className='detect-error'>
                    <div>{detectError}</div>
                    <div>
                      <button className='ghost-btn' type='button' onClick={() => { setDetectError(''); handleDetectLocation() }}>Retry</button>
                    </div>
                  </div>
                )}

                {addresses.length === 0 ? (
                  <div className='address-empty-state'>
                    <p className='empty-title'>You don't have any address saved!</p>
                    <div className='add-card' onClick={openAdd}>
                      <div className='plus'>+</div>
                      <div className='add-card-copy'>
                        <strong>Add New Address</strong>
                        <span>Save a delivery address for faster checkout.</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='addresses-list'>
                    {addresses.map((addr) => (
                      <div className='address-card' key={addr.id}>
                        <div className='address-card-top'>
                          <div className={`badge ${addr.is_default ? 'badge-default' : ''}`}>{addr.address_type}</div>
                          {addr.is_default && <span className='default-tag'>Default</span>}
                        </div>
                        <div className='address-card-body'>
                          <div className='name-mobile'>
                            <strong>{addr.full_name}</strong>
                            <span>{addr.mobile}</span>
                          </div>
                          <div className='address-line'>
                            {addr.address_line_1}{addr.address_line_2 ? `, ${addr.address_line_2}` : ''}
                          </div>
                          <div className='address-line'>{addr.area}, {addr.city} - {addr.pincode}</div>
                          <div className='address-line'>{addr.state}</div>
                        </div>
                        <div className='address-actions'>
                          <button className='primary-btn' onClick={() => handleDeliverHere(addr)}>Deliver Here</button>
                          <button className='ghost-btn' onClick={() => { setShowForm(true); setForm({ ...addr }) }}>Edit</button>
                          <button className='ghost-btn' onClick={() => handleDelete(addr.id)}>Delete</button>
                        </div>
                      </div>
                    ))}

                    <div className='add-new-row'>
                      <button className='add-link' onClick={openAdd}>+ Add New Address</button>
                    </div>
                  </div>
                )}
                </>
              )}
            </div>
          ) : (
          <form className='address-form' onSubmit={handleSave}>
            <div className='address-panel-header'>
              <h2>Add Delivery Address</h2>
            </div>
            {error && <div className='form-error'>{error}</div>}
            <div className='form-grid'>
              <label>
                Full Name *
                <input name='full_name' value={form.full_name} onChange={handleChange} required />
              </label>
              <label>
                Mobile Number *
                <input name='mobile' value={form.mobile} onChange={handleChange} required />
              </label>
              <label>
                Alternate Mobile
                <input name='alternate_mobile' value={form.alternate_mobile} onChange={handleChange} />
              </label>
              <label>
                House / Flat No. *
                <input name='address_line_1' value={form.address_line_1} onChange={handleChange} required />
              </label>
              <label>
                Street / Area *
                <input name='area' value={form.area} onChange={handleChange} required />
              </label>
              <label>
                Landmark
                <input name='landmark' value={form.landmark} onChange={handleChange} />
              </label>
              <label>
                City *
                <input name='city' value={form.city} onChange={handleChange} required />
              </label>
              <label>
                State *
                <input name='state' value={form.state} onChange={handleChange} required />
              </label>
              <label>
                Pincode *
                <input name='pincode' value={form.pincode} onChange={handleChange} required />
              </label>
              <label>
                Address Type
                <select name='address_type' value={form.address_type} onChange={handleChange}>
                  <option>Home</option>
                  <option>Work</option>
                  <option>Other</option>
                </select>
              </label>
              <label className='checkbox-row'>
                <input type='checkbox' name='is_default' checked={form.is_default} onChange={handleChange} /> Save as Default
              </label>
            </div>
            <div className='form-actions'>
              <button type='button' className='ghost-btn' onClick={() => setShowForm(false)}>Cancel</button>
              <button type='submit' className='primary-btn' disabled={saving}>{saving ? 'Saving…' : 'Save Address'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
