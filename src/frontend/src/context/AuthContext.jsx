import React, { createContext, useCallback, useEffect, useState } from 'react'

const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN'
const LEGACY_TOKEN_KEY = 'auth_token'
const ACCESS_TOKEN_ALT_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'REFRESH_TOKEN'
const REFRESH_TOKEN_ALT_KEY = 'refresh_token'
const CUSTOMER_KEY = 'customer_auth'

const normalizeToken = (value) => {
  if (typeof value !== 'string') return ''
  return value.replace(/^Bearer\s+/i, '').trim()
}

const normalizeAuthPayload = (authResponse) => {
  if (!authResponse || typeof authResponse !== 'object') {
    return { token: normalizeToken(typeof authResponse === 'string' ? authResponse : ''), refreshToken: '' }
  }

  const nested = authResponse?.data && typeof authResponse.data === 'object' ? authResponse.data : authResponse

  return {
    token: normalizeToken(nested?.accessToken || nested?.access_token || nested?.token || ''),
    refreshToken: normalizeToken(nested?.refreshToken || nested?.refresh_token || ''),
    profile: nested,
  }
}

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!(
    localStorage.getItem(ACCESS_TOKEN_KEY)
    || localStorage.getItem(ACCESS_TOKEN_ALT_KEY)
    || localStorage.getItem(LEGACY_TOKEN_KEY)
  ))
  const [showLogin, setShowLogin] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)

  useEffect(() => {
    if (showLogin) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [showLogin])

  const login = useCallback((authResponse) => {
    const normalized = normalizeAuthPayload(authResponse)
    const token = normalized.token
    const refreshToken = normalized.refreshToken

    if (!token) return false

    const payload = normalized.profile && typeof normalized.profile === 'object' ? normalized.profile : authResponse

    localStorage.setItem(ACCESS_TOKEN_KEY, token)
    localStorage.setItem(ACCESS_TOKEN_ALT_KEY, token)
    localStorage.setItem(LEGACY_TOKEN_KEY, token)
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(payload))

    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
      localStorage.setItem(REFRESH_TOKEN_ALT_KEY, refreshToken)
    }

    sessionStorage.setItem(ACCESS_TOKEN_KEY, token)
    sessionStorage.setItem(ACCESS_TOKEN_ALT_KEY, token)
    sessionStorage.setItem(LEGACY_TOKEN_KEY, token)

    if (refreshToken) {
      sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
      sessionStorage.setItem(REFRESH_TOKEN_ALT_KEY, refreshToken)
    }

    setIsAuthenticated(true)
    setShowLogin(false)
    if (pendingAction && typeof pendingAction === 'function') {
      try {
        pendingAction()
      } catch (e) {
        // ignore
      }
      setPendingAction(null)
    }
    return true
  }, [pendingAction])

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(ACCESS_TOKEN_ALT_KEY)
    localStorage.removeItem(LEGACY_TOKEN_KEY)
    localStorage.removeItem(CUSTOMER_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_ALT_KEY)

    sessionStorage.removeItem(ACCESS_TOKEN_KEY)
    sessionStorage.removeItem(ACCESS_TOKEN_ALT_KEY)
    sessionStorage.removeItem(LEGACY_TOKEN_KEY)
    sessionStorage.removeItem(REFRESH_TOKEN_KEY)
    sessionStorage.removeItem(REFRESH_TOKEN_ALT_KEY)

    setIsAuthenticated(false)
  }, [])

  const requireAuth = useCallback((action, meta) => {
    if (isAuthenticated) {
      try {
        action()
      } catch (e) {
        // ignore
      }
      return true
    }

    setPendingAction(() => action)
    setShowLogin(true)
    return false
  }, [isAuthenticated])

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, customer: JSON.parse(localStorage.getItem(CUSTOMER_KEY) || 'null'), showLogin, setShowLogin, requireAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
