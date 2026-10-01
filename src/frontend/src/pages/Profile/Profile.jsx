import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import customerApi from '../../services/customerApi'
import './Profile.css'

const emptyProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  addressType: 'HOME',
  addressLine1: '',
  addressLine2: '',
  landmark: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India'
}

function Profile() {
  const { customer, isAuthenticated, login } =
    useContext(AuthContext)

  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState(emptyProfile)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [isEditing, setIsEditing] = useState(false)

  /*
   * Load profile from backend.
   */
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await customerApi.users.profile()

        console.log('PROFILE DATA:', data)

        setProfile(data)

        const address = data?.address || {}

        setFormData({
          firstName: data?.firstName || '',
          lastName: data?.lastName || '',
          email: data?.email || '',
          phoneNumber: data?.phoneNumber || '',

          addressType:
            address?.addressType || 'HOME',

          addressLine1:
            address?.addressLine1 || '',

          addressLine2:
            address?.addressLine2 || '',

          landmark:
            address?.landmark || '',

          city:
            address?.city || '',

          state:
            address?.state || '',

          postalCode:
            address?.postalCode || '',

          country:
            address?.country || 'India'
        })
      } catch (err) {
        console.error(
          'Failed to load customer profile:',
          err
        )

        setError(
          err?.response?.data?.message ||
          'Unable to load profile details.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [isAuthenticated])

  /*
   * Full name for display.
   */
  const fullName =
    `${profile?.firstName || ''} ${
      profile?.lastName || ''
    }`.trim() ||
    customer?.fullName ||
    'Customer'

  /*
   * Initials for the avatar badge.
   * Display-only, does not affect any saved data.
   */
  const initials = (() => {
    const first = profile?.firstName?.charAt(0) || fullName.charAt(0) || ''
    const last = profile?.lastName?.charAt(0) || ''
    const combined = `${first}${last}`.trim().toUpperCase()
    return combined || 'C'
  })()

  /*
   * Handle input changes.
   */
  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value
    }))
  }

  /*
   * Save profile.
   *
   * Phone number is intentionally NOT sent.
   * It is the OTP-authenticated phone number.
   */
  const handleSave = async (event) => {
    event.preventDefault()

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),

        addressType: formData.addressType,

        addressLine1:
          formData.addressLine1.trim(),

        addressLine2:
          formData.addressLine2.trim(),

        landmark:
          formData.landmark.trim(),

        city:
          formData.city.trim(),

        state:
          formData.state.trim(),

        postalCode:
          formData.postalCode.trim(),

        country:
          formData.country.trim()
      }

      console.log(
        'UPDATE PROFILE REQUEST:',
        payload
      )

      /*
       * customerApi already unwraps:
       *
       * response.data.data
       */
      const updated =
        await customerApi.users.updateProfile(
          payload
        )

      console.log(
        'UPDATED PROFILE:',
        updated
      )

      setProfile(updated)

      /*
       * Synchronize basic customer information
       * in AuthContext.
       */
      if (login) {
        login({
          ...(customer || {}),

          fullName:
            `${updated?.firstName || ''} ${
              updated?.lastName || ''
            }`.trim(),

          phoneNumber:
            updated?.phoneNumber ||
            customer?.phoneNumber,

          email:
            updated?.email || ''
        })
      }

      /*
       * Rebuild form from the updated backend
       * response.
       */
      const address =
        updated?.address || {}

      setFormData({
        firstName:
          updated?.firstName || '',

        lastName:
          updated?.lastName || '',

        email:
          updated?.email || '',

        phoneNumber:
          updated?.phoneNumber || '',

        addressType:
          address?.addressType || 'HOME',

        addressLine1:
          address?.addressLine1 || '',

        addressLine2:
          address?.addressLine2 || '',

        landmark:
          address?.landmark || '',

        city:
          address?.city || '',

        state:
          address?.state || '',

        postalCode:
          address?.postalCode || '',

        country:
          address?.country || 'India'
      })

      setIsEditing(false)
      setSuccess(
        'Profile updated successfully.'
      )
    } catch (err) {
      console.error(
        'Profile update failed:',
        err
      )

      setError(
        err?.response?.data?.message ||
        'Profile update failed. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  /*
   * Cancel editing.
   * Restore values from the backend profile.
   */
  const handleCancel = () => {
    const address =
      profile?.address || {}

    setFormData({
      firstName:
        profile?.firstName || '',

      lastName:
        profile?.lastName || '',

      email:
        profile?.email || '',

      phoneNumber:
        profile?.phoneNumber || '',

      addressType:
        address?.addressType || 'HOME',

      addressLine1:
        address?.addressLine1 || '',

      addressLine2:
        address?.addressLine2 || '',

      landmark:
        address?.landmark || '',

      city:
        address?.city || '',

      state:
        address?.state || '',

      postalCode:
        address?.postalCode || '',

      country:
        address?.country || 'India'
    })

    setError('')
    setSuccess('')
    setIsEditing(false)
  }

  /*
   * Authentication guard.
   */
  if (!isAuthenticated) {
    return (
      <section className="profile-page">
        <div className="profile-empty">
          <div className="profile-empty-badge">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
              <path d="M4 20c1.6-3.6 4.8-5.5 8-5.5S18.4 16.4 20 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>

          <h1>Your Profile</h1>

          <p>
            Please log in to view your profile.
          </p>

          <Link
            to="/login"
            className="primary-btn"
          >
            Login
          </Link>
        </div>
      </section>
    )
  }

  /*
   * Loading state.
   */
  if (loading) {
    return (
      <section className="profile-page">
        <div className="profile-loading">
          <span className="loading-spinner" aria-hidden="true" />
          Loading profile details...
        </div>
      </section>
    )
  }

  const address =
    profile?.address || null

  /*
   * VIEW MODE
   */
  return (
    <section className="profile-page">

      {/* Header */}
      <div className="profile-header">

        <div className="profile-avatar" aria-hidden="true">
          <span>{initials}</span>
        </div>

        <div className="profile-header-text">
          <h1>{fullName}</h1>

          <p>
            Manage your personal information
            and delivery address.
          </p>
        </div>

        {!isEditing && (
          <button
            className="primary-btn"
            type="button"
            onClick={() => {
              setError('')
              setSuccess('')
              setIsEditing(true)
            }}
          >
            Edit Profile
          </button>
        )}

      </div>

      {/* Error */}
      {error && (
        <div className="profile-message error">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="profile-message success">
          {success}
        </div>
      )}

      {!isEditing ? (

        <>
          {/* Personal Information */}
          <section className="profile-card">

            <div className="card-header">
              <div>
                <h2>
                  Personal Information
                </h2>

                <p>
                  Your account information.
                </p>
              </div>
            </div>

            <div className="profile-grid">

              <div className="profile-item">
                <span>First Name</span>
                <strong>
                  {profile?.firstName || '—'}
                </strong>
              </div>

              <div className="profile-item">
                <span>Last Name</span>
                <strong>
                  {profile?.lastName || '—'}
                </strong>
              </div>

              <div className="profile-item">
                <span>Email</span>
                <strong>
                  {profile?.email || '—'}
                </strong>
              </div>

              <div className="profile-item">
                <span>Phone Number</span>
                <strong>
                  {profile?.phoneNumber || '—'}
                </strong>
              </div>

              <div className="profile-item">
                <span>Status</span>
                <strong className="status-active">
                  {profile?.status || 'ACTIVE'}
                </strong>
              </div>

            </div>

          </section>

          {/* Default Address */}
          <section className="profile-card">

            <div className="card-header">

              <div>
                <h2>
                  Default Delivery Address
                </h2>

                <p>
                  Your current address used
                  for deliveries.
                </p>
              </div>

              {address?.default && (
                <span className="default-badge">
                  DEFAULT
                </span>
              )}

            </div>

            {address ? (

              <div className="address-card">

                <div className="address-title">

                  <span className="address-type">
                    {address.addressType ||
                      'HOME'}
                  </span>

                  <h3>
                    {address.recipientName ||
                      fullName}
                  </h3>

                </div>

                <div className="address-body">

                  <p>
                    {address.addressLine1 ||
                      '—'}

                    {address.addressLine2 &&
                      `, ${address.addressLine2}`}
                  </p>

                  {address.landmark && (
                    <p>
                      <span>
                        Landmark:
                      </span>{' '}
                      {address.landmark}
                    </p>
                  )}

                  <p>
                    {address.city || '—'},
                    {' '}
                    {address.state || '—'}
                    {' - '}
                    {address.postalCode || '—'}
                  </p>

                  <p>
                    {address.country || '—'}
                  </p>

                  <p>
                    <span>
                      Phone:
                    </span>{' '}
                    {address.phoneNumber ||
                      profile?.phoneNumber ||
                      '—'}
                  </p>

                </div>

              </div>

            ) : (

              <div className="no-address">
                <p>
                  No delivery address
                  has been added.
                </p>

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() =>
                    setIsEditing(true)
                  }
                >
                  Add Address
                </button>
              </div>

            )}

          </section>

          {/* Prescription */}
          <div className="profile-footer">

            <Link
              to="/prescriptions"
              className="primary-btn"
            >
              Upload Prescription
            </Link>

          </div>

        </>

      ) : (

        /*
         * EDIT MODE
         */
        <form
          className="profile-card profile-form"
          onSubmit={handleSave}
        >

          <div className="card-header">

            <div>
              <h2>
                Edit Profile
              </h2>

              <p>
                Update your personal
                information and address.
              </p>
            </div>

          </div>

          {/* Personal Information */}
          <div className="form-section">

            <h3>
              Personal Information
            </h3>

            <div className="form-grid">

              <label>
                First Name *
                <input
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Last Name *
                <input
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Email *
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Phone Number
                <input
                  type="text"
                  value={formData.phoneNumber}
                  disabled
                />

                <small>
                  Your phone number is verified
                  through OTP and cannot be changed
                  from the profile.
                </small>
              </label>

            </div>

          </div>

          {/* Address */}
          <div className="form-section">

            <h3>
              Delivery Address
            </h3>

            <div className="form-grid">

              <label>
                Address Type *
                <select
                  name="addressType"
                  value={formData.addressType}
                  onChange={handleChange}
                  required
                >
                  <option value="HOME">
                    Home
                  </option>

                  <option value="WORK">
                    Work
                  </option>

                  <option value="OTHER">
                    Other
                  </option>
                </select>
              </label>

              <label>
                Recipient Name
                <input
                  type="text"
                  value={fullName}
                  disabled
                />
              </label>

              <label className="full-width">
                Address Line 1 *
                <input
                  name="addressLine1"
                  type="text"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="full-width">
                Address Line 2
                <input
                  name="addressLine2"
                  type="text"
                  value={formData.addressLine2}
                  onChange={handleChange}
                />
              </label>

              <label>
                Landmark
                <input
                  name="landmark"
                  type="text"
                  value={formData.landmark}
                  onChange={handleChange}
                />
              </label>

              <label>
                City *
                <input
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                State *
                <input
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Postal Code *
                <input
                  name="postalCode"
                  type="text"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Country *
                <input
                  name="country"
                  type="text"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </label>

            </div>

          </div>

          {/* Actions */}
          <div className="form-actions">

            <button
              className="secondary-btn"
              type="button"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              className="primary-btn"
              type="submit"
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : 'Save Changes'}
            </button>

          </div>

        </form>
      )}

    </section>
  )
}

export default Profile