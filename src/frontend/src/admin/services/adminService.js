// import apiClient from '../../api/apiClient'

// export const adminLogin = (payload) => apiClient.post('/admin/login', payload)
// export const getAdminProfile = () => apiClient.get('/admin/me')
// export const getDashboardSummary = () => apiClient.get('/admin/dashboard/summary')

// export const bannerApi = {
//   list: (params = {}) => apiClient.get('/banners', { params }),
//   create: (payload) => apiClient.post('/banners', payload),
//   update: (id, payload) => apiClient.put(`/banners/${id}`, payload),
//   remove: (id) => apiClient.delete(`/banners/${id}`),
//   upload: (formData) => apiClient.post('/banners/upload', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   }),
// }

// export const categoryApi = {
//   list: (params = {}) => apiClient.get('/categories', { params }),
//   get: (id) => apiClient.get(`/categories/${id}`),
//   create: (payload) => apiClient.post('/categories', payload),
//   update: (id, payload) => apiClient.put(`/categories/${id}`, payload),
//   archive: (id) => apiClient.delete(`/categories/${id}`),
//   restore: (id) => apiClient.post(`/categories/${id}/restore`),
//   toggleActive: (id, isActive) => apiClient.patch(`/categories/${id}/toggle-active`, { is_active: isActive }),
//   upload: (formData) => apiClient.post('/categories/upload', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   }),
//   parents: () => apiClient.get('/categories/parents'),
//   tree: () => apiClient.get('/categories/tree'),
//   reorder: (payload) => apiClient.post('/categories/reorder', payload),
// }

// export const brandApi = {
//   list: (params = {}) => apiClient.get('/brands', { params }),
//   get: (id) => apiClient.get(`/brands/${id}`),
//   create: (payload) => apiClient.post('/brands', payload),
//   update: (id, payload) => apiClient.put(`/brands/${id}`, payload),
//   archive: (id) => apiClient.delete(`/brands/${id}`),
//   restore: (id) => apiClient.post(`/brands/${id}/restore`),
//   toggleActive: (id, isActive) => apiClient.patch(`/brands/${id}/toggle-active`, { is_active: isActive }),
//   toggleFeatured: (id, isFeatured) => apiClient.patch(`/brands/${id}/toggle-featured`, { featured: isFeatured }),
//   upload: (formData) => apiClient.post('/brands/upload', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   }),
//   products: (id) => apiClient.get(`/brands/${id}/products`),
// }

// export const productApi = {

//     list: (params = {}) =>
//         apiClient.get('/admin/products', { params }),

//     get: (publicId) =>
//         apiClient.get(`/admin/products/${publicId}`),

//     create: (payload) =>
//         apiClient.post('/admin/products', payload),

//     update: (publicId, payload) =>
//         apiClient.put(`/admin/products/${publicId}`, payload),

//     archive: (publicId) =>
//         apiClient.delete(`/admin/products/${publicId}`),

// }

// export const productImageApi = {

//     upload: (productPublicId, formData) =>
//         apiClient.post(
//             `/admin/products/${productPublicId}/images`,
//             formData,
//             {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             }
//         ),

//     delete: (imagePublicId) =>
//         apiClient.delete(
//             `/admin/products/images/${imagePublicId}`
//         ),

//     setPrimary: (imagePublicId) =>
//         apiClient.patch(
//             `/admin/products/images/${imagePublicId}/primary`
//         ),
// }

// export const inventoryBatchApi = {

//     list: (params = {}) =>
//         apiClient.get('/admin/inventory-batches', { params }),

//     get: (publicId) =>
//         apiClient.get(`/admin/inventory-batches/${publicId}`),

//     create: (payload) =>
//         apiClient.post('/admin/inventory-batches', payload),

//     update: (publicId, payload) =>
//         apiClient.put(
//             `/admin/inventory-batches/${publicId}`,
//             payload
//         ),

//     delete: (publicId) =>
//         apiClient.delete(
//             `/admin/inventory-batches/${publicId}`
//         ),

//     restore: (publicId) =>
//         apiClient.patch(
//             `/admin/inventory-batches/${publicId}/restore`
//         ),
// }
// export const inventoryApi = {
//   list: (params = {}) => apiClient.get('/inventory', { params }),
//   get: (id) => apiClient.get(`/inventory/${id}`),
//   updateStock: (id, payload) => apiClient.patch(`/inventory/${id}/stock`, payload),
//   transfer: (payload) => apiClient.post('/inventory/transfer', payload),
//   history: (id) => apiClient.get(`/inventory/history/${id}`),
//   lowStock: () => apiClient.get('/inventory/low-stock'),
//   expired: () => apiClient.get('/inventory/expired'),
//   warehouses: () => apiClient.get('/inventory/warehouses'),
//   createWarehouse: (payload) => apiClient.post('/inventory/warehouses', payload),
// }

// export const ordersApi = {
//   list: (params = {}) => apiClient.get('/orders', { params }),
//   getAdmin: (id) => apiClient.get(`/orders/admin/${id}`),
//   updateStatus: (id, payload) => apiClient.patch(`/orders/admin/${id}/status`, payload),
//   cancel: (id, payload) => apiClient.post(`/orders/admin/${id}/cancel`, payload),
//   refund: (id, payload) => apiClient.post(`/orders/admin/${id}/refund`, payload),
//   invoice: (id, payload) => apiClient.post(`/orders/admin/${id}/invoice`, payload),
// }

// export const prescriptionsApi = {
//   list: (params = {}) => apiClient.get('/admin/prescriptions', { params }),
//   approve: (id, payload) => apiClient.post(`/admin/prescriptions/${id}/approve`, payload),
//   reject: (id, payload) => apiClient.post(`/admin/prescriptions/${id}/reject`, payload),
// }

// export const paymentApi = {
//   list: (params = {}) => apiClient.get('/admin/payments', { params }),
//   get: (id) => apiClient.get(`/admin/payments/${id}`),
//   refund: (payload) => apiClient.post('/admin/payments/refund', payload),
//   approveRefund: (id) => apiClient.post(`/admin/payments/refund/${id}/approve`),
//   rejectRefund: (id) => apiClient.post(`/admin/payments/refund/${id}/reject`),
//   downloadReceipt: (id) => apiClient.get(`/admin/payments/${id}/receipt`, { responseType: 'blob' }),
//   settlements: () => apiClient.get('/admin/payments/settlements'),
//   gateways: () => apiClient.get('/admin/payments/gateway-status'),
// }

// export const deliveryApi = {
//   list: (params = {}) => apiClient.get('/admin/deliveries', { params }),
//   get: (id) => apiClient.get(`/admin/deliveries/${id}`),
//   assign: (id, payload) => apiClient.post(`/admin/deliveries/${id}/assign`, payload),
//   updateStatus: (id, payload) => apiClient.patch(`/admin/deliveries/${id}/status`, payload),
//   updateTracking: (id, payload) => apiClient.patch(`/admin/deliveries/${id}/tracking`, payload),
//   updateEta: (id, payload) => apiClient.patch(`/admin/deliveries/${id}/eta`, payload),
//   cancel: (id, payload) => apiClient.post(`/admin/deliveries/${id}/cancel`, payload),
//   addException: (id, payload) => apiClient.post(`/admin/deliveries/${id}/exceptions`, payload),
//   export: () => apiClient.get('/admin/deliveries/export', { responseType: 'blob' }),
// }

// export const couponApi = {
//   list: (params = {}) => apiClient.get('/admin/coupons', { params }),
//   get: (id) => apiClient.get(`/admin/coupons/${id}`),
//   create: (payload) => apiClient.post('/admin/coupons', payload),
//   update: (id, payload) => apiClient.put(`/admin/coupons/${id}`, payload),
//   duplicate: (id) => apiClient.post(`/admin/coupons/${id}/duplicate`),
//   activate: (id) => apiClient.post(`/admin/coupons/${id}/activate`),
//   deactivate: (id) => apiClient.post(`/admin/coupons/${id}/deactivate`),
//   delete: (id) => apiClient.delete(`/admin/coupons/${id}`),
//   analytics: () => apiClient.get('/admin/coupons/analytics'),
//   redemptions: (id) => apiClient.get(`/admin/coupons/${id}/redemptions`),
// }

// export const settingsApi = {
//   get: () => apiClient.get('/admin/settings'),
//   update: (payload) => apiClient.put('/admin/settings', payload),
// }


import apiClient from '../../api/apiClient'

// ============================================================
// ADMIN AUTHENTICATION
// Temporarily unused until Spring Security is implemented.
// ============================================================

export const adminLogin = (payload) =>
    apiClient.post('/admin/login', payload)

export const getAdminProfile = () =>
    apiClient.get('/admin/me')

export const getDashboardSummary = () =>
    apiClient.get('/admin/dashboard/summary')


// ============================================================
// BANNERS
// Future module
// ============================================================

export const bannerApi = {
    list: (params = {}) =>
        apiClient.get('/banners', { params }),

    create: (payload) =>
        apiClient.post('/banners', payload),

    update: (id, payload) =>
        apiClient.put(`/banners/${id}`, payload),

    remove: (id) =>
        apiClient.delete(`/banners/${id}`),

    upload: (formData) =>
        apiClient.post('/banners/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }),
}


// ============================================================
// CATEGORY
// ============================================================
export const categoryApi = {
  list: (params = {}) => apiClient.get('/admin/categories', { params }),
  get: (publicId) => apiClient.get(`/admin/categories/${publicId}`),
  create: (payload) => apiClient.post('/admin/categories', payload),
  update: (publicId, payload) =>
    apiClient.put(`/admin/categories/${publicId}`, payload),
  archive: (publicId) =>
    apiClient.delete(`/admin/categories/${publicId}`),
  restore: (publicId) =>
    apiClient.patch(`/admin/categories/${publicId}/restore`),
}

// ============================================================
// BRAND
// Future module
// ============================================================

export const brandApi = {
    list: (params = {}) =>
        apiClient.get('/brands', { params }),

    get: (id) =>
        apiClient.get(`/brands/${id}`),

    create: (payload) =>
        apiClient.post('/brands', payload),

    update: (id, payload) =>
        apiClient.put(`/brands/${id}`, payload),

    archive: (id) =>
        apiClient.delete(`/brands/${id}`),

    restore: (id) =>
        apiClient.post(`/brands/${id}/restore`),

    toggleActive: (id, isActive) =>
        apiClient.patch(`/brands/${id}/toggle-active`, {
            is_active: isActive,
        }),

    toggleFeatured: (id, isFeatured) =>
        apiClient.patch(`/brands/${id}/toggle-featured`, {
            featured: isFeatured,
        }),

    upload: (formData) =>
        apiClient.post('/brands/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }),

    products: (id) =>
        apiClient.get(`/brands/${id}/products`),
}


// ============================================================
// PRODUCT
// ============================================================

export const productApi = {

    list: (params = {}) =>
        apiClient.get('/admin/products', { params }),

    get: (publicId) =>
        apiClient.get(`/admin/products/${publicId}`),

    create: (payload) =>
        apiClient.post('/admin/products', payload),

    update: (publicId, payload) =>
        apiClient.put(`/admin/products/${publicId}`, payload),

    archive: (publicId) =>
        apiClient.delete(`/admin/products/${publicId}`),

    restore: (publicId) =>
        apiClient.patch(`/admin/products/${publicId}/restore`),
}

export const departmentApi = {
    list: (params = {}) => apiClient.get('/admin/departments', { params }),
    get: (publicId) => apiClient.get(`/admin/departments/${publicId}`),
    create: (payload) => apiClient.post('/admin/departments', payload),
    archive: (publicId) => apiClient.delete(`/admin/departments/${publicId}`),
    restore: (publicId) => apiClient.patch(`/admin/departments/${publicId}/restore`),
}


// ============================================================
// PRODUCT IMAGES
// ============================================================

export const productImageApi = {

    upload: (productPublicId, files, primaryImageIndex = -1) => {

        const formData = new FormData()

        files.forEach((file) => {
            formData.append('files', file)
        })

        formData.append(
            'primaryImageIndex',
            primaryImageIndex
        )

        return apiClient.post(
            `/admin/products/${productPublicId}/images`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
    },

    delete: (imagePublicId) =>
        apiClient.delete(
            `/admin/products/images/${imagePublicId}`
        ),

    setPrimary: (imagePublicId) =>
        apiClient.put(
            `/admin/products/images/${imagePublicId}/primary`
        ),
}


// ============================================================
// INVENTORY
// Existing Inventory entity
// Product + Store junction
// ============================================================

export const inventoryApi = {

    list: (params = {}) =>
        apiClient.get('/admin/inventory', { params }),

    get: (id) =>
        apiClient.get(`/admin/inventory/${id}`),

    create: (payload) =>
        apiClient.post('/admin/inventory', payload),

    delete: (publicId) =>
        apiClient.delete(`/admin/inventory/${publicId}`),

    restore: (publicId) =>
        apiClient.patch(`/admin/inventory/${publicId}/restore`),

    updateStock: (id, payload) =>
        apiClient.patch(`/inventory/${id}/stock`, payload),

    transfer: (payload) =>
        apiClient.post('/inventory/transfer', payload),

    history: (id) =>
        apiClient.get(`/inventory/history/${id}`),

    lowStock: () =>
        apiClient.get('/inventory/low-stock'),

    expired: () =>
        apiClient.get('/inventory/expired'),

    warehouses: () =>
        apiClient.get('/inventory/warehouses'),

    createWarehouse: (payload) =>
        apiClient.post('/inventory/warehouses', payload),
}


// ============================================================
// INVENTORY BATCH
// ============================================================

export const inventoryBatchApi = {

    list: (params = {}) =>
        apiClient.get('/admin/inventory-batches', {
            params,
        }),

    get: (publicId) =>
        apiClient.get(
            `/admin/inventory-batches/${publicId}`
        ),

    create: (payload) =>
        apiClient.post(
            '/admin/inventory-batches',
            payload
        ),

    update: (publicId, payload) =>
        apiClient.put(
            `/admin/inventory-batches/${publicId}`,
            payload
        ),

    delete: (publicId) =>
        apiClient.delete(
            `/admin/inventory-batches/${publicId}`
        ),

    restore: (publicId) =>
        apiClient.patch(
            `/admin/inventory-batches/${publicId}/restore`
        ),
}


// ============================================================
// ORDERS
// Future module
// ============================================================

export const ordersApi = {
    list: (params = {}) =>
        apiClient.get('/orders', { params }),

    getAdmin: (id) =>
        apiClient.get(`/orders/admin/${id}`),

    updateStatus: (id, payload) =>
        apiClient.patch(`/orders/admin/${id}/status`, payload),

    cancel: (id, payload) =>
        apiClient.post(`/orders/admin/${id}/cancel`, payload),

    refund: (id, payload) =>
        apiClient.post(`/orders/admin/${id}/refund`, payload),

    invoice: (id, payload) =>
        apiClient.post(`/orders/admin/${id}/invoice`, payload),
}


// ============================================================
// PRESCRIPTIONS
// Future module
// ============================================================

export const prescriptionsApi = {
    list: (params = {}) =>
        apiClient.get('/admin/prescriptions', { params }),

    approve: (id, payload) =>
        apiClient.post(
            `/admin/prescriptions/${id}/approve`,
            payload
        ),

    reject: (id, payload) =>
        apiClient.post(
            `/admin/prescriptions/${id}/reject`,
            payload
        ),
}


// ============================================================
// PAYMENTS
// Future module
// ============================================================

export const paymentApi = {
    list: (params = {}) =>
        apiClient.get('/admin/payments', { params }),

    get: (id) =>
        apiClient.get(`/admin/payments/${id}`),

    refund: (payload) =>
        apiClient.post('/admin/payments/refund', payload),

    approveRefund: (id) =>
        apiClient.post(
            `/admin/payments/refund/${id}/approve`
        ),

    rejectRefund: (id) =>
        apiClient.post(
            `/admin/payments/refund/${id}/reject`
        ),

    downloadReceipt: (id) =>
        apiClient.get(
            `/admin/payments/${id}/receipt`,
            {
                responseType: 'blob',
            }
        ),

    settlements: () =>
        apiClient.get('/admin/payments/settlements'),

    gateways: () =>
        apiClient.get('/admin/payments/gateway-status'),
}


// ============================================================
// DELIVERY
// Future module
// ============================================================

export const deliveryApi = {
    list: (params = {}) =>
        apiClient.get('/admin/deliveries', { params }),

    get: (id) =>
        apiClient.get(`/admin/deliveries/${id}`),

    assign: (id, payload) =>
        apiClient.post(
            `/admin/deliveries/${id}/assign`,
            payload
        ),

    updateStatus: (id, payload) =>
        apiClient.patch(
            `/admin/deliveries/${id}/status`,
            payload
        ),

    updateTracking: (id, payload) =>
        apiClient.patch(
            `/admin/deliveries/${id}/tracking`,
            payload
        ),

    updateEta: (id, payload) =>
        apiClient.patch(
            `/admin/deliveries/${id}/eta`,
            payload
        ),

    cancel: (id, payload) =>
        apiClient.post(
            `/admin/deliveries/${id}/cancel`,
            payload
        ),

    addException: (id, payload) =>
        apiClient.post(
            `/admin/deliveries/${id}/exceptions`,
            payload
        ),

    export: () =>
        apiClient.get(
            '/admin/deliveries/export',
            {
                responseType: 'blob',
            }
        ),
}


// ============================================================
// COUPONS
// Future module
// ============================================================

export const couponApi = {
    list: (params = {}) =>
        apiClient.get('/admin/coupons', { params }),

    get: (id) =>
        apiClient.get(`/admin/coupons/${id}`),

    create: (payload) =>
        apiClient.post('/admin/coupons', payload),

    update: (id, payload) =>
        apiClient.put(`/admin/coupons/${id}`, payload),

    duplicate: (id) =>
        apiClient.post(
            `/admin/coupons/${id}/duplicate`
        ),

    activate: (id) =>
        apiClient.post(
            `/admin/coupons/${id}/activate`
        ),

    deactivate: (id) =>
        apiClient.post(
            `/admin/coupons/${id}/deactivate`
        ),

    delete: (id) =>
        apiClient.delete(`/admin/coupons/${id}`),

    analytics: () =>
        apiClient.get('/admin/coupons/analytics'),

    redemptions: (id) =>
        apiClient.get(
            `/admin/coupons/${id}/redemptions`
        ),
}


// ============================================================
// SETTINGS
// Future module
// ============================================================

export const settingsApi = {

    get: () =>
        apiClient.get('/admin/settings'),

    update: (payload) =>
        apiClient.put('/admin/settings', payload),
}

export const storeApi = {
    list: (params = {}) =>
        apiClient.get('/admin/stores', { params }),
    get: (publicId) => apiClient.get(`/admin/stores/${publicId}`),
    create: (payload) => apiClient.post('/admin/stores', payload),
    update: (publicId, payload) => apiClient.put(`/admin/stores/${publicId}`, payload),
    archive: (publicId) => apiClient.delete(`/admin/stores/${publicId}`),
    restore: (publicId) => apiClient.put(`/admin/stores/${publicId}/restore`),
}
