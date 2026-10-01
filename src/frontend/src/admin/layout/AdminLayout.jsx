import React, { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { adminSidebarItems } from '../routes/adminRoutes'

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('admin_access_token')
    localStorage.removeItem('admin_user')
    sessionStorage.removeItem('admin_access_token')
    sessionStorage.removeItem('admin_user')
    navigate('/admin/login')
  }

  return (
    <div className='admin-workspace'>
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className='admin-brand'>
          <div className='brand-mark'>M</div>
          {!collapsed ? (
            <div>
              <strong>Medical Admin</strong>
              <small>Control Center</small>
            </div>
          ) : null}
        </div>

        <button className='sidebar-collapse' onClick={() => setCollapsed((current) => !current)}>
          {collapsed ? '→' : '←'}
        </button>

        <nav className='admin-nav'>
          {adminSidebarItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin/dashboard'}
              className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}
            >
              <span>{item.icon}</span>
              {!collapsed ? <span>{item.label}</span> : null}
            </NavLink>
          ))}
        </nav>

        <button className='logout-button' onClick={handleLogout}>Logout</button>
      </aside>

      <main className='admin-main-panel'>
        <header className='admin-topbar'>
          <div className='topbar-search'>
            <span>🔎</span>
            <input type='text' placeholder='Search dashboard' />
          </div>

          <div className='topbar-actions'>
            <button className='icon-pill'>🔔</button>
            <div className='admin-profile-pill'>
              <span className='profile-avatar'>A</span>
              <span>Admin</span>
            </div>
          </div>
        </header>

        <section className='admin-content'>
          <Outlet />
        </section>
      </main>
    </div>
  )
}

export default AdminLayout
