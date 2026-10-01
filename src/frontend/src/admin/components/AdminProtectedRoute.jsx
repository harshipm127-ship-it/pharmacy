import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getAdminProfile } from '../services/adminService'
import { getAuthToken } from '../../api/apiClient'

const ADMIN_TOKEN_KEY = 'admin_access_token'
const ADMIN_USER_KEY = 'admin_user'
// Temporary local-development switch. Set this back to false before deployment.
const BYPASS_ADMIN_AUTH = true

function clearAdminSession() {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
  localStorage.removeItem(ADMIN_USER_KEY)
  sessionStorage.removeItem(ADMIN_TOKEN_KEY)
  sessionStorage.removeItem(ADMIN_USER_KEY)
}

function AdminProtectedRoute({ children }) {
  const location = useLocation()
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [sessionExpired, setSessionExpired] = useState(false)

  useEffect(() => {
    if (BYPASS_ADMIN_AUTH) return undefined

    const token = getAuthToken('/admin/me')

    if (!token) {
      setAuthorized(false)
      setChecking(false)
      return
    }

    let isMounted = true

    getAdminProfile()
      .then(() => {
        if (isMounted) {
          setAuthorized(true)
        }
      })
      .catch(() => {
        if (isMounted) {
          clearAdminSession()
          setAuthorized(false)
          setSessionExpired(true)
        }
      })
      .finally(() => {
        if (isMounted) {
          setChecking(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (BYPASS_ADMIN_AUTH) return undefined

    const handleStorage = (event) => {
      if (event.key === ADMIN_TOKEN_KEY && !event.newValue) {
        clearAdminSession()
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login?sessionExpired=1'
        }
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  if (BYPASS_ADMIN_AUTH) {
    return children
  }

  if (checking) {
    return (
      <div className='admin-auth-shell'>
        <div className='admin-auth-card'>Checking admin session…</div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <Navigate
        to='/admin/login'
        replace
        state={{ from: location.pathname, sessionExpired }}
      />
    )
  }

  return children
}

export default AdminProtectedRoute
