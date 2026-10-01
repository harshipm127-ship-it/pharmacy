import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLogin from '../pages/AdminLogin'
import AdminDashboard from '../pages/AdminDashboard'
import BannerManagement from '../pages/BannerManagement'
import CategoryManagement from '../pages/CategoryManagement'
import BrandManagement from '../pages/BrandManagement'
import ProductManagement from '../pages/ProductManagement'
import InventoryManagement from '../pages/InventoryManagement'
import InventoryBatchFormPage from '../pages/InventoryBatchFormPage'
import InventoryBatchDetailsPage from '../pages/InventoryBatchDetailsPage'
import InventoryFormPage from '../pages/InventoryFormPage'
import InventoryRecordsPage from '../pages/InventoryRecordsPage'
import DepartmentManagement from '../pages/DepartmentManagement'
import StoreManagement from '../pages/StoreManagement'
import StoreFormPage from '../pages/StoreFormPage'
import CategoryFormPage from '../pages/CategoryFormPage'
import OrdersManagement from '../pages/OrdersManagement'
import PaymentsManagement from '../pages/PaymentsManagement'
import DeliveryManagement from '../pages/DeliveryManagement'
import PrescriptionsManagement from '../pages/PrescriptionsManagement'
import SettingsManagement from '../pages/SettingsManagement'
import AdminLayout from '../layout/AdminLayout'
import AdminProtectedRoute from '../components/AdminProtectedRoute'
import AdminPageContent from '../pages/AdminPageContent'
import CouponsList from '../coupons/CouponsList'
import CouponForm from '../coupons/CouponForm'
import CouponDetails from '../coupons/CouponDetails'
import CouponsAnalytics from '../coupons/CouponsAnalytics'
import ProductFormPage from '../pages/ProductFormPage'
import AdminActionPage from '../pages/AdminActionPage'

function AdminRouter() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='login' replace />} />
      <Route path='login' element={<AdminLogin />} />

      <Route
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<Navigate to='dashboard' replace />} />
        <Route path='dashboard' element={<AdminDashboard />} />
        <Route path='banner-management' element={<BannerManagement />} />
        <Route path='department-management' element={<DepartmentManagement />} />
        <Route path='category-management' element={<CategoryManagement />} />
        <Route path='category-management/add' element={<CategoryFormPage />} />
        <Route path='category-management/edit/:id' element={<CategoryFormPage />} />
        <Route path='brand-management' element={<BrandManagement />} />
        <Route path='product-management' element={<ProductManagement />} />
        <Route path='product-management/add' element={<ProductFormPage />} />
        <Route path='product-management/edit/:id' element={<ProductFormPage />} />
        <Route path='product-management/view/:id' element={<ProductFormPage />} />
        <Route path='inventory-management' element={<InventoryManagement />} />
        <Route path='inventory-management/inventory/create' element={<InventoryFormPage />} />
        <Route path='inventory-management/records' element={<InventoryRecordsPage />} />
        <Route path='inventory-management/batches/create' element={<InventoryBatchFormPage />} />
        <Route path='inventory-management/batches/:id' element={<InventoryBatchDetailsPage />} />
        <Route path='inventory-management/batches/:id/edit' element={<InventoryBatchFormPage />} />
        <Route path='store-management' element={<StoreManagement />} />
        <Route path='store-management/add' element={<StoreFormPage />} />
        <Route path='store-management/edit/:id' element={<StoreFormPage />} />
        <Route path='orders' element={<OrdersManagement />} />
        <Route path='payments' element={<PaymentsManagement />} />
        <Route path='delivery-management' element={<DeliveryManagement />} />
        <Route path=':entity/:action/:id?' element={<AdminActionPage />} />
        <Route path='prescriptions' element={<PrescriptionsManagement />} />
        <Route path='users' element={<AdminPageContent routeName='/admin/users' />} />
        <Route path='coupons'>
          <Route index element={<CouponsList />} />
          <Route path='create' element={<CouponForm />} />
          <Route path='analytics' element={<CouponsAnalytics />} />
          <Route path=':id' element={<CouponDetails />} />
          <Route path=':id/edit' element={<CouponForm />} />
        </Route>
        <Route path='offers' element={<AdminPageContent routeName='/admin/offers' />} />
        <Route path='reports' element={<AdminPageContent routeName='/admin/reports' />} />
        <Route path='settings' element={<SettingsManagement />} />
        <Route path='*' element={<Navigate to='dashboard' replace />} />
      </Route>
    </Routes>
  )
}

export default AdminRouter
