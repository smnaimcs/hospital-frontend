// src/pages/admin/Appointments.jsx
import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    date: '',
    page: 1,
    per_page: 20
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [filters]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAppointments(filters);
      setAppointments(response.appointments || []);
    } catch (error) {
      setError('Failed to fetch appointments');
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowEditModal(true);
  };

  const handleUpdateAppointment = async (appointmentData) => {
    try {
      await adminService.updateAppointment(selectedAppointment.id, appointmentData);
      alert('Appointment updated successfully');
      setShowEditModal(false);
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (error) {
      alert('Failed to update appointment');
      console.error('Error updating appointment:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      page: 1
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
      rescheduled: 'status-pending'
    };
    
    return <span className={`status-badge ${statusColors[status] || ''}`}>{status}</span>;
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

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Appointment Management</h1>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Status:</label>
          <select 
            name="status" 
            value={filters.status} 
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="filter-select"
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {appointments.length === 0 ? (
        <div className="empty-state">
          <h3>No appointments found</h3>
          <p>No appointments match your current filters.</p>
        </div>
      ) : (
        <div className="appointments-list">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-header">
                <div>
                  <h3>
                    {appointment.patient.user.first_name} {appointment.patient.user.last_name} 
                    <span className="appointment-with"> with </span>
                    Dr. {appointment.doctor.user.first_name} {appointment.doctor.user.last_name}
                  </h3>
                  <p className="appointment-date">{formatDate(appointment.appointment_date)}</p>
                </div>
                {getStatusBadge(appointment.status)}
              </div>
              
              <div className="appointment-details">
                <div className="detail-row">
                  <div className="detail-item">
                    <label>Patient:</label>
                    <span>{appointment.patient.user.first_name} {appointment.patient.user.last_name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Doctor:</label>
                    <span>Dr. {appointment.doctor.user.first_name} {appointment.doctor.user.last_name}</span>
                  </div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-item">
                    <label>Specialization:</label>
                    <span>{appointment.doctor.specialization}</span>
                  </div>
                  <div className="detail-item">
                    <label>Duration:</label>
                    <span>{appointment.duration} minutes</span>
                  </div>
                </div>

                <div className="detail-item">
                  <label>Reason:</label>
                  <span>{appointment.reason}</span>
                </div>

                {appointment.symptoms && (
                  <div className="detail-item">
                    <label>Symptoms:</label>
                    <span>{appointment.symptoms}</span>
                  </div>
                )}

                <div className="detail-row">
                  <div className="detail-item">
                    <label>Created:</label>
                    <span>{formatDate(appointment.created_at)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Last Updated:</label>
                    <span>{formatDate(appointment.updated_at)}</span>
                  </div>
                </div>
              </div>

              <div className="appointment-actions">
                <button 
                  onClick={() => handleEditAppointment(appointment)}
                  className="btn-primary"
                >
                  Edit Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Appointment Modal */}
      {showEditModal && selectedAppointment && (
        <EditAppointmentModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAppointment(null);
          }}
          onSave={handleUpdateAppointment}
        />
      )}
    </div>
  );
}

// Edit Appointment Modal Component
function EditAppointmentModal({ appointment, onClose, onSave }) {
  const [formData, setFormData] = useState({
    status: appointment.status,
    appointment_date: appointment.appointment_date.split('T')[0] + 'T' + appointment.appointment_date.split('T')[1].substring(0, 5),
    duration: appointment.duration
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
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Edit Appointment</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>

        <div className="appointment-info">
          <h4>Appointment Details</h4>
          <p><strong>Patient:</strong> {appointment.patient.user.first_name} {appointment.patient.user.last_name}</p>
          <p><strong>Doctor:</strong> Dr. {appointment.doctor.user.first_name} {appointment.doctor.user.last_name}</p>
          <p><strong>Reason:</strong> {appointment.reason}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="form-group">
            <label>Appointment Date & Time *</label>
            <input
              type="datetime-local"
              name="appointment_date"
              value={formData.appointment_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Duration (minutes) *</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="15"
              max="120"
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Updating...' : 'Update Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminAppointments;