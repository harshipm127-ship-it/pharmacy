import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export function shouldRedirectToLogin(status, requestUrl, currentPathname) {
  if ((status !== 401 && status !== 403) || !requestUrl?.includes('/admin')) {
    return false
  }

  if (requestUrl.includes('/admin/login')) {
    return false
  }

  const pathname = currentPathname || (typeof window !== 'undefined' ? window.location.pathname : '/')
  return pathname.startsWith('/admin')
}

const stripBearerPrefix = (value) => {
  if (typeof value !== 'string') return ''
  return value.replace(/^Bearer\s+/i, '').trim()
}

export function getAuthToken(requestUrl, storage = typeof window !== 'undefined' ? window.localStorage : undefined) {
  const isAdminRequest = requestUrl?.includes('/admin')
  const isAdminContext = typeof window !== 'undefined' && window.location?.pathname?.startsWith('/admin')

  const adminTokenCandidates = [
    storage?.getItem('admin_access_token'),
    storage?.getItem('ACCESS_TOKEN'),
    storage?.getItem('access_token'),
    storage?.getItem('auth_token'),
    sessionStorage?.getItem('admin_access_token'),
    sessionStorage?.getItem('ACCESS_TOKEN'),
    sessionStorage?.getItem('access_token'),
    sessionStorage?.getItem('auth_token'),
  ]

  const customerTokenCandidates = [
    storage?.getItem('ACCESS_TOKEN'),
    storage?.getItem('access_token'),
    storage?.getItem('admin_access_token'),
    storage?.getItem('auth_token'),
    sessionStorage?.getItem('ACCESS_TOKEN'),
    sessionStorage?.getItem('access_token'),
    sessionStorage?.getItem('admin_access_token'),
    sessionStorage?.getItem('auth_token'),
  ]

  const candidates = isAdminRequest || isAdminContext ? adminTokenCandidates : customerTokenCandidates
  const foundToken = candidates.find((candidate) => typeof candidate === 'string' && candidate.trim()) || ''
  return stripBearerPrefix(foundToken)
}

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken(config.url)

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const url = error?.config?.url || ''

    if (shouldRedirectToLogin(status, url)) {
      localStorage.removeItem('admin_access_token')
      localStorage.removeItem('admin_user')
      sessionStorage.removeItem('admin_access_token')
      sessionStorage.removeItem('admin_user')

      window.location.href = '/admin/login?sessionExpired=1'
    }

    return Promise.reject(error)
  }
)

export default apiClient
