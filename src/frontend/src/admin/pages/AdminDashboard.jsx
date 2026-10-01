import React, { useEffect, useMemo, useState } from 'react'
import { getDashboardSummary } from '../services/adminService'
import '../styles/admin.css'

const defaultStats = [
  { title: 'Total Products', key: 'total_products', tone: 'blue' },
  { title: 'Total Categories', key: 'total_categories', tone: 'green' },
  { title: 'Total Brands', key: 'total_brands', tone: 'purple' },
  { title: 'Total Orders', key: 'total_orders', tone: 'orange' },
  { title: 'Pending Orders', key: 'pending_orders', tone: 'red' },
  { title: 'Completed Orders', key: 'completed_orders', tone: 'teal' },
  { title: 'Total Customers', key: 'total_customers', tone: 'blue' },
  { title: 'Revenue', key: 'revenue', tone: 'green' },
  { title: 'Out of Stock Products', key: 'out_of_stock_products', tone: 'red' },
  { title: 'Low Stock Products', key: 'low_stock_products', tone: 'orange' },
]

const chartCards = [
  { label: 'Monthly Sales', value: '12.4k' },
  { label: 'Orders by Status', value: 'Pending 64' },
  { label: 'Revenue', value: '$8.8k' },
  { label: 'Top Selling Categories', value: 'Vitamin C' },
]

function AdminDashboard() {
  const [summary, setSummary] = useState({})
  const [loading, setLoading] = useState(true)
  const adminUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('admin_user') || sessionStorage.getItem('admin_user') || '{}')
    } catch {
      return {}
    }
  }, [])

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await getDashboardSummary()
        setSummary(response.data)
      } catch (error) {
        setSummary({})
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [])

  const stats = defaultStats.map((stat) => {
    const value = summary[stat.key]
    const formattedValue = typeof value === 'number' && stat.key === 'revenue'
      ? `$${value.toLocaleString()}`
      : value ?? '0'

    return {
      ...stat,
      value: formattedValue,
    }
  })

  return (
    <div className='admin-dashboard-page'>
      <div className='admin-welcome'>
        <div>
          <h1>Admin Dashboard</h1>
          <p>Overview of your medical commerce operations.</p>
        </div>
      </div>

      <div className='stats-grid'>
        {stats.map((stat) => (
          <div className={`stat-card ${stat.tone}`} key={stat.title}>
            <span>{stat.title}</span>
            <strong>{loading ? '...' : stat.value}</strong>
          </div>
        ))}
      </div>

      <div className='charts-grid'>
        {chartCards.map((chart) => (
          <div className='chart-card' key={chart.label}>
            <h3>{chart.label}</h3>
            <div className='chart-placeholder'>
              <div className='chart-bar large' />
              <div className='chart-bar medium' />
              <div className='chart-bar small' />
            </div>
            <p>{chart.value}</p>
          </div>
        ))}
      </div>

      <div className='admin-profile-inline'>
        <span>{adminUser?.name || 'Admin'}</span>
      </div>
    </div>
  )
}

export default AdminDashboard
