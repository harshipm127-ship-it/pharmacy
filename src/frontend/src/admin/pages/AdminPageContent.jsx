import React from 'react'
import ModulePlaceholderPage from './ModulePlaceholderPage'

const placeholderDefinitions = {
  '/admin/banner-management': {
    title: 'Banner Management',
    description: 'This module is under development.',
    features: ['Add Banner', 'Edit Banner', 'Delete Banner', 'Activate / Deactivate Banner'],
  },
  '/admin/category-management': {
    title: 'Category Management',
    description: 'Category operations are being prepared for the admin panel.',
    features: ['Create Category', 'Edit Category', 'Archive Category', 'Sort Categories'],
  },
  '/admin/brand-management': {
    title: 'Brand Management',
    description: 'Brand administration is under development.',
    features: ['Add Brand', 'Update Brand', 'Remove Brand', 'Track Brand Inventory'],
  },
  '/admin/product-management': {
    title: 'Product Management',
    description: 'Product operations are being prepared for release.',
    features: ['Add Product', 'Edit Product', 'Delete Product', 'Publish / Draft Product'],
  },
  '/admin/inventory-management': {
    title: 'Inventory Management',
    description: 'Inventory controls will be added in the next phase.',
    features: ['Stock Update', 'Low Stock Alerts', 'Product Availability', 'Warehouse Tracking'],
  },
  '/admin/orders': {
    title: 'Orders',
    description: 'Order management is planned for the admin workspace.',
    features: ['View Orders', 'Update Status', 'Track Delivery', 'Print Invoice'],
  },
  '/admin/payments': {
    title: 'Payments',
    description: 'Payment management is under active development.',
    features: ['Payment Overview', 'Refunds', 'Settlement Reports', 'Gateway Monitoring'],
  },
  '/admin/delivery-management': {
    title: 'Delivery Management',
    description: 'Delivery operations are now available for the admin panel.',
    features: ['Assign Rider', 'Track Deliveries', 'Update ETA', 'Log Exceptions'],
  },
  '/admin/users': {
    title: 'Users',
    description: 'Customer and admin user management is being structured.',
    features: ['View Users', 'Manage Roles', 'Deactivate Accounts', 'Search Customer Profiles'],
  },
  '/admin/coupons': {
    title: 'Coupons',
    description: 'Coupon configuration will be available soon.',
    features: ['Create Coupon', 'Apply Conditions', 'Expiry Rules', 'Usage Analytics'],
  },
  '/admin/offers': {
    title: 'Offers',
    description: 'Offers and promotional campaigns are being prepared.',
    features: ['Create Offer', 'Update Offer', 'Schedule Campaign', 'Track Performance'],
  },
  '/admin/prescriptions': {
    title: 'Prescription Verification',
    description: 'Prescription approval workflow is being prepared for the admin team.',
    features: ['Review Prescription', 'Approve / Reject', 'Attach Notes', 'Notify Customer'],
  },
  '/admin/reports': {
    title: 'Reports',
    description: 'Reports and analytics views will be added in a later phase.',
    features: ['Sales Reports', 'Performance Summary', 'Inventory Insights', 'Revenue Trends'],
  },
  '/admin/settings': {
    title: 'Settings',
    description: 'Store settings will appear here once the admin configuration module is built.',
    features: ['Store Profile', 'Preferences', 'Tax Settings', 'Notification Settings'],
  },
}

function AdminPageContent({ routeName }) {
  const config = placeholderDefinitions[routeName] || {
    title: 'Admin Module',
    description: 'This module is under development.',
    features: ['Feature 1', 'Feature 2'],
  }

  return <ModulePlaceholderPage {...config} />
}

export default AdminPageContent
