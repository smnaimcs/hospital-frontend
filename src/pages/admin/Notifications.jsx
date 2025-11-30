// src/pages/admin/Notifications.jsx
import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('send');
  const [showSendModal, setShowSendModal] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await adminService.getNotifications();
      setNotifications(response.notifications || []);
    } catch (error) {
      setError('Failed to fetch notifications');
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await adminService.getUsers();
      setUsers(response.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSendNotification = async (notificationData) => {
    try {
      await adminService.sendNotification(notificationData);
      alert('Notification sent successfully');
      setShowSendModal(false);
      fetchNotifications();
    } catch (error) {
      alert('Failed to send notification');
      console.error('Error sending notification:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationTypeBadge = (type) => {
    const typeColors = {
      appointment: 'status-confirmed',
      payment: 'status-completed',
      billing: 'status-pending',
      test_report: 'status-confirmed',
      admin: 'role-admin',
      system: 'role-admin'
    };
    
    return <span className={`status-badge ${typeColors[type] || ''}`}>{type}</span>;
  };

  if (loading) {
    return <div className="loading">Loading notifications...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Notifications</h1>
        <button 
          onClick={() => setShowSendModal(true)}
          className="btn-primary"
        >
          Send Notification
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'send' ? 'active' : ''}`}
          onClick={() => setActiveTab('send')}
        >
          Send Notification
        </button>
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Notification History
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="tab-content">
        {activeTab === 'send' ? (
          <div className="send-notification">
            <div className="info-card">
              <h3>Send System Notifications</h3>
              <p>
                Use this section to send important notifications to patients, doctors, or staff members. 
                Notifications will appear in their dashboard and can be used for announcements, reminders, or alerts.
              </p>
            </div>

            <div className="notification-stats">
              <div className="stat-item">
                <h4>Total Users</h4>
                <p>{users.length}</p>
              </div>
              <div className="stat-item">
                <h4>Recent Notifications</h4>
                <p>{notifications.length}</p>
              </div>
            </div>

            <div className="quick-templates">
              <h4>Quick Templates</h4>
              <div className="templates-grid">
                <div className="template-card">
                  <h5>System Maintenance</h5>
                  <p>Notify users about scheduled system maintenance</p>
                  <button 
                    onClick={() => setShowSendModal(true)}
                    className="btn-secondary"
                  >
                    Use Template
                  </button>
                </div>
                <div className="template-card">
                  <h5>Payment Reminder</h5>
                  <p>Send payment due reminders to patients</p>
                  <button 
                    onClick={() => setShowSendModal(true)}
                    className="btn-secondary"
                  >
                    Use Template
                  </button>
                </div>
                <div className="template-card">
                  <h5>Appointment Update</h5>
                  <p>Notify about appointment system changes</p>
                  <button 
                    onClick={() => setShowSendModal(true)}
                    className="btn-secondary"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="notification-history">
            <h2>Notification History</h2>
            {notifications.length === 0 ? (
              <div className="empty-state">
                <h3>No notifications found</h3>
                <p>No notifications have been sent yet.</p>
              </div>
            ) : (
              <div className="notifications-list">
                {notifications.map((notification) => (
                  <div key={notification.id} className="notification-card">
                    <div className="notification-header">
                      <div>
                        <h3>{notification.title}</h3>
                        <p className="notification-receiver">
                          To: User #{notification.receiver_id}
                          {notification.sender && (
                            <span className="notification-sender">
                              From: {notification.sender.first_name} {notification.sender.last_name}
                            </span>
                          )}
                        </p>
                      </div>
                      {getNotificationTypeBadge(notification.notification_type)}
                    </div>
                    
                    <div className="notification-body">
                      <p>{notification.message}</p>
                    </div>

                    <div className="notification-footer">
                      <span className="notification-date">
                        {formatDate(notification.created_at)}
                      </span>
                      <span className={`read-status ${notification.is_read ? 'read' : 'unread'}`}>
                        {notification.is_read ? 'Read' : 'Unread'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Send Notification Modal */}
      {showSendModal && (
        <SendNotificationModal
          users={users}
          onClose={() => setShowSendModal(false)}
          onSend={handleSendNotification}
        />
      )}
    </div>
  );
}

// Send Notification Modal Component
function SendNotificationModal({ users, onClose, onSend }) {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    receiver_id: '',
    notification_type: 'admin'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    await onSend(formData);
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal large-modal">
        <div className="modal-header">
          <h2>Send Notification</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="notification-form">
          <div className="form-group">
            <label>Notification Type</label>
            <select
              name="notification_type"
              value={formData.notification_type}
              onChange={handleChange}
            >
              <option value="admin">Admin Notification</option>
              <option value="system">System Update</option>
              <option value="appointment">Appointment</option>
              <option value="billing">Billing</option>
              <option value="payment">Payment</option>
              <option value="test_report">Test Report</option>
            </select>
          </div>

          <div className="form-group">
            <label>Receiver (Optional)</label>
            <select
              name="receiver_id"
              value={formData.receiver_id}
              onChange={handleChange}
            >
              <option value="">All Users (Broadcast)</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} ({user.role})
                </option>
              ))}
            </select>
            <small>Leave empty to send to all users</small>
          </div>

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter notification title..."
              required
            />
          </div>

          <div className="form-group">
            <label>Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter notification message..."
              rows="6"
              required
            />
          </div>

          <div className="notification-preview">
            <h4>Preview</h4>
            <div className="preview-card">
              <div className="preview-header">
                <strong>{formData.title || 'Notification Title'}</strong>
              </div>
              <div className="preview-body">
                <p>{formData.message || 'Notification message will appear here...'}</p>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Sending...' : 'Send Notification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminNotifications;