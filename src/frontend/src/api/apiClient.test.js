import { describe, expect, it } from 'vitest'
import { getAuthToken, shouldRedirectToLogin } from './apiClient'
import { normalizeCartItem } from '../services/customerApi'
import { resolveCartItems } from '../pages/Cart/Cart'

describe('getAuthToken', () => {
  it('prefers the admin token for admin requests when both are available', () => {
    const storage = {
      getItem: (key) => ({
        admin_access_token: 'admin-token',
        ACCESS_TOKEN: 'customer-token',
      })[key] || null,
    }

    expect(getAuthToken('/admin/me', storage)).toBe('admin-token')
  })

  it('uses the customer token for non-admin requests', () => {
    const storage = {
      getItem: (key) => ({
        admin_access_token: 'admin-token',
        ACCESS_TOKEN: 'customer-token',
      })[key] || null,
    }

    expect(getAuthToken('/products', storage)).toBe('customer-token')
  })
})

describe('shouldRedirectToLogin', () => {
  it('does not redirect for the admin login endpoint', () => {
    expect(shouldRedirectToLogin(401, '/admin/login')).toBe(false)
  })

  it('redirects for protected admin routes after auth failure', () => {
    expect(shouldRedirectToLogin(401, '/admin/dashboard', '/admin/dashboard')).toBe(true)
  })

  it('does not redirect for non-admin endpoints', () => {
    expect(shouldRedirectToLogin(401, '/products')).toBe(false)
  })
})

describe('resolveCartItems', () => {
  it('shows an empty cart for authenticated users when the backend cart fails', () => {
    expect(resolveCartItems({
      isAuthenticated: true,
      backendItems: [{ id: 'db-item' }],
      localItems: [{ id: 'local-item' }],
      hasBackendError: true,
    })).toEqual([])
  })

  it('keeps local cart data for unauthenticated users', () => {
    expect(resolveCartItems({
      isAuthenticated: false,
      backendItems: [],
      localItems: [{ id: 'local-item' }],
      hasBackendError: true,
    })).toEqual([{ id: 'local-item' }])
  })
})

describe('normalizeCartItem', () => {
  it('maps backend cart item fields to the UI fields', () => {
    const item = {
      publicId: 'item-1',
      productPublicId: 'prod-1',
      productName: 'Vitamin C Tablets',
      sellingPrice: 42,
      quantity: 2,
    }

    expect(normalizeCartItem(item)).toMatchObject({
      id: 'item-1',
      product_id: 'prod-1',
      name: 'Vitamin C Tablets',
      price: 42,
      quantity: 2,
    })
  })
})
