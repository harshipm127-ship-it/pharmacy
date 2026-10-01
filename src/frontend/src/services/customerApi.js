import apiClient from '../api/apiClient'
import { headerMenuData } from '../data/headerMenuConfig'

const publicCategoryTree = Object.entries(headerMenuData)
  .filter(([, menu]) => Array.isArray(menu.children))
  .map(([slug, menu]) => ({
    id: slug,
    name: slug[0].toUpperCase() + slug.slice(1),
    slug,
    children: menu.children,
  }))

const publicProductFallback = [
  { id: 1, name: 'Vitamin C Tablets', brand: 'Zest Labs', price: 299, discount: 18, rating: 4.8, stock: 'In stock' },
  { id: 2, name: 'Protein Powder', brand: 'NutriMax', price: 799, discount: 12, rating: 4.7, stock: 'In stock' },
  { id: 3, name: 'BP Monitor', brand: 'PulseCare', price: 1499, discount: 10, rating: 4.6, stock: 'Limited stock' },
  { id: 4, name: 'Glucometer', brand: 'SugarSafe', price: 1199, discount: 15, rating: 4.9, stock: 'In stock' },
]

const getImageUrl = (path) => {
  if (!path) {
    return ''
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/${path}`
}

const unwrapResponse = (response) => response?.data?.data ?? response?.data ?? response

const normalizeAddress = (address = {}) => {
  const addressType = String(address.addressType ?? address.address_type ?? 'Home')
  const mappedType = addressType.toLowerCase() === 'work' ? 'Work' : addressType.toLowerCase() === 'other' ? 'Other' : 'Home'

  return {
    id: address.id ?? address.publicId ?? address.public_id,
    publicId: address.publicId,
    full_name: address.recipientName ?? address.full_name ?? '',
    mobile: address.phoneNumber ?? address.mobile ?? '',
    alternate_mobile: address.alternatePhoneNumber ?? address.alternate_mobile ?? '',
    address_line_1: address.addressLine1 ?? address.address_line_1 ?? '',
    address_line_2: address.addressLine2 ?? address.address_line_2 ?? '',
    landmark: address.landmark ?? '',
    area: address.area ?? '',
    city: address.city ?? '',
    state: address.state ?? '',
    pincode: address.postalCode ?? address.pincode ?? '',
    country: address.country ?? 'India',
    address_type: mappedType,
    is_default: Boolean(address.isDefault ?? address.is_default ?? false),
    latitude: address.latitude ?? null,
    longitude: address.longitude ?? null,
  }
}

const normalizePayloadForBackendAddress = (payload = {}) => {
  const addressType = String(payload.address_type ?? payload.addressType ?? 'Home')
  const backendAddressType = addressType.toUpperCase() === 'WORK' ? 'WORK' : addressType.toUpperCase() === 'OTHER' ? 'OTHER' : 'HOME'

  return {
    addressType: backendAddressType,
    recipientName: payload.full_name ?? payload.recipientName ?? '',
    phoneNumber: payload.mobile ?? payload.phoneNumber ?? '',
    addressLine1: payload.address_line_1 ?? payload.addressLine1 ?? '',
    addressLine2: payload.address_line_2 ?? payload.addressLine2 ?? '',
    landmark: payload.landmark ?? '',
    city: payload.city ?? '',
    state: payload.state ?? '',
    postalCode: payload.pincode ?? payload.postalCode ?? '',
    country: payload.country ?? 'India',
    latitude: payload.latitude ?? 0,
    longitude: payload.longitude ?? 0,
    isDefault: Boolean(payload.is_default ?? payload.isDefault ?? false),
  }
}

export const normalizeCartItem = (item = {}) => ({
  id: item.publicId ?? item.id,
  product_id: item.productPublicId ?? item.productId ?? item.product_id,
  name: item.productName ?? item.name ?? 'Medicine',
  brand: item.brand ?? item.brandName ?? 'Trusted Brand',
  category: item.category ?? item.categoryName ?? 'General',
  description: item.description ?? 'Healthcare essentials for daily use.',
  price: Number(item.sellingPrice ?? item.price ?? 0),
  originalPrice: Number(item.mrp ?? item.originalPrice ?? item.sellingPrice ?? item.price ?? 0),
  discount: Number(item.discount ?? 0),
  stock: Number(item.stock ?? 55),
  image: item.image ?? item.imageUrl ?? item.image_url ?? '',
  quantity: Number(item.quantity ?? 1),
  deliveryDate: item.deliveryDate ?? 'Tomorrow',
})

const customerApi = {
  banners: {
    home: () => apiClient.get('/banners/public/home').then((response) => response.data || []),
    offers: () => apiClient.get('/banners/public/offers').then((response) => response.data || []),
  },

  categories: {
    list: () => Promise.resolve(publicCategoryTree),
    homepage: () => Promise.resolve(publicCategoryTree),
    tree: () => Promise.resolve(publicCategoryTree),
    getBySlug: (slug) => apiClient.get(`/categories/slug/${encodeURIComponent(slug)}`).then((response) => response.data),
  },

  brands: {
    list: (params = {}) => apiClient.get('/brands', { params }).then((response) => response.data || []),
  },

  products: {
    list: (params = {}) => apiClient.get('/products', { params }).then((response) => response.data || []),
    get: (id) => apiClient.get(`/products/${id}`).then((response) => response.data),
  },

  cart: {
    add: (product_id, quantity = 1) => apiClient.post('/customer/cart/items', {
      productPublicId: product_id,
      quantity,
    }).then((response) => unwrapResponse(response)),
    list: () => apiClient.get('/customer/cart').then((response) => {
      const payload = unwrapResponse(response)
      const items = Array.isArray(payload?.items) ? payload.items : Array.isArray(payload) ? payload : []
      return items.map(normalizeCartItem)
    }),
    update: (item_id, quantity) => apiClient.put(`/customer/cart/items/${item_id}`, { quantity }).then((response) => unwrapResponse(response)),
    remove: (item_id) => apiClient.delete(`/customer/cart/items/${item_id}`).then((response) => unwrapResponse(response)),
    clear: () => apiClient.delete('/customer/cart').then((response) => unwrapResponse(response)),
  },

  coupons: {
    validate: ({ code, user_id = null, order_amount, product_ids = [], delivery_charge = 0 }) => apiClient
      .post('/coupons/validate', { code, user_id, order_amount, product_ids, delivery_charge })
      .then((response) => response.data),
    apply: ({ code, user_id = null, order_amount, product_ids = [], delivery_charge = 0 }) => apiClient
      .post('/coupons/apply', { code, user_id, order_amount, product_ids, delivery_charge })
      .then((response) => response.data),
  },

  checkout: {
    createOrder: (payload) => apiClient.post('/checkout', payload).then((response) => response.data),
  },

  orders: {
    list: () => apiClient.get('/orders/mine').then((response) => response.data || []),
    get: (id) => apiClient.get(`/orders/${id}`).then((response) => response.data),
  },

  addresses: {
    list: () => apiClient.get('/customer/addresses').then((response) => {
      const payload = unwrapResponse(response)
      const items = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : []
      return items.map(normalizeAddress)
    }),
    create: (payload) => apiClient.post('/customer/addresses', normalizePayloadForBackendAddress(payload)).then((response) => {
      const data = unwrapResponse(response)
      return normalizeAddress(data)
    }),
    update: (id, payload) => apiClient.put(`/customer/addresses/${id}`, normalizePayloadForBackendAddress(payload)).then((response) => {
      const data = unwrapResponse(response)
      return normalizeAddress(data)
    }),
    remove: (id) => apiClient.delete(`/customer/addresses/${id}`).then((response) => unwrapResponse(response)),
  },

  delivery: {
    validatePincode: (pincode) => apiClient.get(`/pincodes/${encodeURIComponent(pincode)}`).then((response) => response.data),
  },

  users: {
    profile: async () => {
      const response = await apiClient.get('/customer/profile')
      return unwrapResponse(response)
    },

    updateProfile: async (payload) => {
      const response = await apiClient.put('/customer/profile', payload)
      return unwrapResponse(response)
    },
  },
}

export { getImageUrl }
export default customerApi
