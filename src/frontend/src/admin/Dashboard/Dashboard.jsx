import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome to the Medical E-Commerce Admin Panel</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Products</h3>
          <p className="stat-number">0</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Orders</h3>
          <p className="stat-number">0</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Users</h3>
          <p className="stat-number">0</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Revenue</h3>
          <p className="stat-number">$0</p>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <h2>Quick Links</h2>
          <ul>
            <li><a href="#/admin/products">Manage Products</a></li>
            <li><a href="#/admin/categories">Manage Categories</a></li>
            <li><a href="#/admin/brands">Manage Brands</a></li>
            <li><a href="#/admin/orders">View Orders</a></li>
            <li><a href="#/admin/inventory">Manage Inventory</a></li>
            <li><a href="#/admin/customers">View Customers</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
