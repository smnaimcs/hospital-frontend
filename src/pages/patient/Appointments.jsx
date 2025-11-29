// src/pages/patient/Appointments.jsx
import React, { useState, useEffect } from 'react';
import patientService from '../../services/patientService';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, [filters]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await patientService.getAppointments(filters);
      setAppointments(response.appointments || []);
    } catch (error) {
      setError('Failed to fetch appointments');
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await patientService.cancelAppointment(appointmentId);
      alert('Appointment cancelled successfully');
      fetchAppointments(); // Refresh the list
    } catch (error) {
      alert('Failed to cancel appointment');
      console.error('Error cancelling appointment:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    
    return <span className={`status-badge ${statusColors[status] || ''}`}>{status}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Appointments</h1>
        <div className="filters">
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
      </div>

      {error && <div className="error-message">{error}</div>}

      {appointments.length === 0 ? (
        <div className="empty-state">
          <h3>No appointments found</h3>
          <p>You don't have any appointments scheduled.</p>
        </div>
      ) : (
        <div className="appointments-list">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-header">
                <h3>Appointment with Dr. {appointment.doctor.user.first_name} {appointment.doctor.user.last_name}</h3>
                {getStatusBadge(appointment.status)}
              </div>
              
              <div className="appointment-details">
                <div className="detail-row">
                  <div className="detail-item">
                    <label>Date:</label>
                    <span>{formatDate(appointment.appointment_date)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Duration:</label>
                    <span>{appointment.duration} minutes</span>
                  </div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-item">
                    <label>Doctor:</label>
                    <span>Dr. {appointment.doctor.user.first_name} {appointment.doctor.user.last_name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Specialization:</label>
                    <span>{appointment.doctor.specialization}</span>
                  </div>
                </div>

                {appointment.reason && (
                  <div className="detail-item">
                    <label>Reason:</label>
                    <span>{appointment.reason}</span>
                  </div>
                )}

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
                {appointment.status === 'pending' || appointment.status === 'confirmed' ? (
                  <button 
                    onClick={() => handleCancelAppointment(appointment.id)}
                    className="btn-danger"
                  >
                    Cancel Appointment
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Appointments;