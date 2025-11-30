// src/pages/admin/Users.jsx
import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    page: 1,
    per_page: 20
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUsers(filters);
      setUsers(response.users || []);
    } catch (error) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleUpdateUser = async (userData) => {
    try {
      await adminService.updateUser(selectedUser.id, userData);
      alert('User updated successfully');
      setShowEditModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      alert('Failed to update user');
      console.error('Error updating user:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await adminService.deleteUser(selectedUser.id);
      alert('User deactivated successfully');
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      alert('Failed to deactivate user');
      console.error('Error deleting user:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      page: 1
    });
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      admin: 'role-admin',
      doctor: 'role-doctor',
      patient: 'role-patient',
      staff: 'role-staff'
    };
    
    return <span className={`role-badge ${roleColors[role] || ''}`}>{role}</span>;
  };

  const getStatusBadge = (isActive) => {
    return isActive ? 
      <span className="status-badge status-active">Active</span> :
      <span className="status-badge status-inactive">Inactive</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>User Management</h1>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Filter by Role:</label>
          <select 
            name="role" 
            value={filters.role} 
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Roles</option>
            <option value="PATIENT">Patient</option>
            <option value="DOCTOR">Doctor</option>
            <option value="STAFF">Staff</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {users.length === 0 ? (
        <div className="empty-state">
          <h3>No users found</h3>
          <p>No users match your current filters.</p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <strong>{user.first_name} {user.last_name}</strong>
                      {user.date_of_birth && (
                        <span className="user-age">
                          {new Date().getFullYear() - new Date(user.date_of_birth).getFullYear()} years
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>{user.phone || 'N/A'}</td>
                  <td>{getStatusBadge(user.is_active)}</td>
                  <td>{formatDate(user.created_at)}</td>
                  <td>
                    <div className="table-actions">
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="btn-edit"
                        title="Edit User"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      {user.role !== 'admin' && (
                        <button 
                          onClick={() => handleDeleteUser(user)}
                          className="btn-delete"
                          title="Deactivate User"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSave={handleUpdateUser}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <DeleteConfirmationModal
          user={selectedUser}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedUser(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}

// Edit User Modal Component
function EditUserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone || '',
    address: user.address || '',
    is_active: user.is_active
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Edit User</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              Active User
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Updating...' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete Confirmation Modal Component
function DeleteConfirmationModal({ user, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Deactivate User</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>

        <div className="confirmation-content">
          <div className="warning-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h3>Are you sure?</h3>
          <p>
            You are about to deactivate {user.first_name} {user.last_name}. 
            This action cannot be undone.
          </p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button 
            onClick={handleConfirm} 
            disabled={loading}
            className="btn-danger"
          >
            {loading ? 'Deactivating...' : 'Yes, Deactivate'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;