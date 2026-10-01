import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { adminLogin, getAdminProfile } from '../services/adminService'
import '../styles/admin.css'

const ADMIN_TOKEN_KEY = 'admin_access_token'
const ADMIN_USER_KEY = 'admin_user'
const SESSION_EXPIRED_MESSAGE = 'Your session has expired. Please log in again.'

function clearAdminSession() {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
  localStorage.removeItem(ADMIN_USER_KEY)
  sessionStorage.removeItem(ADMIN_TOKEN_KEY)
  sessionStorage.removeItem(ADMIN_USER_KEY)
}

function AdminLogin() {
  const location = useLocation()
  const navigate = useNavigate()
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const identifierValid = useMemo(() => Boolean(form.identifier.trim()), [form.identifier])

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
  }

  const fromPath = location.state?.from || '/admin/dashboard'
  const sessionExpired = location.state?.sessionExpired || new URLSearchParams(location.search).has('sessionExpired')

  useEffect(() => {
    if (sessionExpired) {
      setError(SESSION_EXPIRED_MESSAGE)
      clearAdminSession()
      return
    }

    const token = localStorage.getItem(ADMIN_TOKEN_KEY) || sessionStorage.getItem(ADMIN_TOKEN_KEY)

    if (!token) {
      return
    }

    let isMounted = true

    getAdminProfile()
      .then(() => {
        if (isMounted) {
          navigate(fromPath, { replace: true })
        }
      })
      .catch(() => {
        clearAdminSession()
      })

    return () => {
      isMounted = false
    }
  }, [fromPath, navigate, sessionExpired])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!identifierValid || !form.password.trim()) {
      setError('Enter an email or phone number and password to continue.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await adminLogin({
        identifier: form.identifier.trim(),
        password: form.password,
      })

      const apiPayload = response?.data?.data || response?.data || {}
      const token = apiPayload.accessToken || apiPayload.access_token
      const admin = {
        name: apiPayload.fullName || apiPayload.full_name || 'Admin',
        publicId: apiPayload.publicId || apiPayload.public_id,
        role: apiPayload.role,
        phoneNumber: apiPayload.phoneNumber || apiPayload.phone_number,
      }

      if (!token) {
        throw new Error('Admin authentication failed.')
      }

      localStorage.setItem(ADMIN_TOKEN_KEY, token)
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(admin))

      if (rememberMe) {
        localStorage.setItem(ADMIN_TOKEN_KEY, token)
      } else {
        sessionStorage.setItem(ADMIN_TOKEN_KEY, token)
      }

      navigate(fromPath, { replace: true })
    } catch (submitError) {
      const message = submitError?.response?.data?.message
        || submitError?.response?.data?.detail
        || 'Unable to sign in. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='admin-auth-shell'>
      <div className='admin-auth-card'>
        <div className='admin-auth-header'>
          <span className='admin-badge'>Admin Access</span>
          <h1>Welcome back</h1>
          <p>Sign in to manage products, orders, inventory, and customers.</p>
        </div>

        <form className='admin-auth-form' onSubmit={handleSubmit}>
          <label>
            <span>Identifier</span>
            <input
              type='text'
              name='identifier'
              value={form.identifier}
              onChange={handleChange}
              placeholder='Email or phone number'
            />
          </label>

          <label>
            <span>Password</span>
            <div className='password-field'>
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={form.password}
                onChange={handleChange}
                placeholder='Enter password'
              />
              <button type='button' className='ghost-button' onClick={() => setShowPassword((current) => !current)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <div className='admin-auth-options'>
            <label className='checkbox-row'>
              <input type='checkbox' checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
              <span>Remember me</span>
            </label>
            <button type='button' className='text-button'>Forgot Password?</button>
          </div>

          {error ? <div className='admin-error-box'>{error}</div> : null}

          <button type='submit' className='primary-button' disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
