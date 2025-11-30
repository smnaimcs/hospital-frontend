// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboardStats();
      setStats(response);
    } catch (error) {
      setError('Failed to fetch dashboard stats');
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon patients">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.total_patients || 0}</h3>
            <p>Total Patients</p>
          </div>
          <Link to="/admin/users?role=PATIENT" className="stat-link">View All</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon doctors">
            <i className="fas fa-user-md"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.total_doctors || 0}</h3>
            <p>Total Doctors</p>
          </div>
          <Link to="/admin/users?role=DOCTOR" className="stat-link">View All</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon staff">
            <i className="fas fa-user-nurse"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.total_staff || 0}</h3>
            <p>Total Staff</p>
          </div>
          <Link to="/admin/users?role=STAFF" className="stat-link">View All</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon appointments">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.pending_appointments || 0}</h3>
            <p>Pending Appointments</p>
          </div>
          <Link to="/admin/appointments?status=pending" className="stat-link">View All</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-content">
            <h3>${stats.total_revenue || 0}</h3>
            <p>Total Revenue</p>
          </div>
          <Link to="/admin/reports" className="stat-link">View Reports</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon today">
            <i className="fas fa-calendar-day"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.today_appointments || 0}</h3>
            <p>Today's Appointments</p>
          </div>
          <Link to="/admin/appointments" className="stat-link">View Schedule</Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/admin/users" className="action-card">
            <i className="fas fa-user-plus"></i>
            <span>Manage Users</span>
          </Link>
          <Link to="/admin/appointments" className="action-card">
            <i className="fas fa-calendar-alt"></i>
            <span>Manage Appointments</span>
          </Link>
          <Link to="/admin/inventory" className="action-card">
            <i className="fas fa-pills"></i>
            <span>Manage Inventory</span>
          </Link>
          <Link to="/admin/billing" className="action-card">
            <i className="fas fa-file-invoice-dollar"></i>
            <span>Manage Billing</span>
          </Link>
          <Link to="/admin/notifications" className="action-card">
            <i className="fas fa-bell"></i>
            <span>Send Notifications</span>
          </Link>
          <Link to="/admin/reports" className="action-card">
            <i className="fas fa-chart-bar"></i>
            <span>View Reports</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;