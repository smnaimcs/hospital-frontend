// src/pages/nurse/PatientArrival.jsx
import React, { useState, useEffect } from 'react';
import staffService from '../../services/staffService';

function NursePatientArrival() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTodayAppointments();
  }, []);

  const fetchTodayAppointments = async () => {
    try {
      setLoading(true);
      // This endpoint would need to be implemented in the backend
      // For now, we'll use a placeholder or you can filter from all appointments
      const response = await fetch(`http://localhost:5000/api/appointments?date=${new Date().toISOString().split('T')[0]}`);
      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch (error) {
      setError('Failed to fetch appointments');
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateArrival = async (appointmentId, status) => {
    try {
      await staffService.updatePatientArrival(appointmentId, status);
      alert('Arrival status updated successfully');
      fetchTodayAppointments();
    } catch (error) {
      alert('Failed to update arrival status');
      console.error('Error updating arrival:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      scheduled: 'status-pending',
      arrived: 'status-confirmed',
      in_progress: 'status-in-progress',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    
    return <span className={`status-badge ${statusColors[status] || ''}`}>{status}</span>;
  };

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Patient Arrival Tracking</h1>
        <p className="subtitle">Manage patient arrival status for today's appointments</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="arrival-tracking">
        {appointments.length === 0 ? (
          <div className="empty-state">
            <h3>No appointments scheduled for today</h3>
            <p>There are no appointments to track for today.</p>
          </div>
        ) : (
          <div className="appointments-list">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-header">
                  <div>
                    <h3>{appointment.patient?.user?.first_name} {appointment.patient?.user?.last_name}</h3>
                    <p className="appointment-meta">
                      Appointment: {formatDate(appointment.appointment_date)}
                      {appointment.doctor && ` • Dr. ${appointment.doctor.user?.first_name}`}
                    </p>
                  </div>
                  {getStatusBadge(appointment.status)}
                </div>
                
                <div className="appointment-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <label>Patient ID:</label>
                      <span>{appointment.patient_id}</span>
                    </div>
                    <div className="detail-item">
                      <label>Reason:</label>
                      <span>{appointment.reason}</span>
                    </div>
                  </div>
                  
                  {appointment.symptoms && (
                    <div className="detail-item">
                      <label>Symptoms:</label>
                      <span>{appointment.symptoms}</span>
                    </div>
                  )}
                </div>

                <div className="arrival-actions">
                  {appointment.status === 'scheduled' && (
                    <button 
                      onClick={() => handleUpdateArrival(appointment.id, 'arrived')}
                      className="btn-primary"
                    >
                      Mark as Arrived
                    </button>
                  )}
                  
                  {appointment.status === 'arrived' && (
                    <>
                      <span className="arrival-timestamp">
                        Arrived at: {new Date().toLocaleTimeString()}
                      </span>
                      <button 
                        onClick={() => handleUpdateArrival(appointment.id, 'in_progress')}
                        className="btn-secondary"
                      >
                        Move to Consultation
                      </button>
                    </>
                  )}
                  
                  {appointment.status === 'in_progress' && (
                    <span className="status-badge status-in-progress">
                      Currently in consultation
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Arrival Summary */}
      <div className="arrival-summary">
        <h3>Today's Arrival Summary</h3>
        <div className="summary-stats">
          <div className="summary-item">
            <span>Total Appointments:</span>
            <span>{appointments.length}</span>
          </div>
          <div className="summary-item">
            <span>Arrived:</span>
            <span>{appointments.filter(a => a.status === 'arrived' || a.status === 'in_progress' || a.status === 'completed').length}</span>
          </div>
          <div className="summary-item">
            <span>Pending:</span>
            <span>{appointments.filter(a => a.status === 'scheduled').length}</span>
          </div>
          <div className="summary-item">
            <span>No-show:</span>
            <span>{appointments.filter(a => a.status === 'cancelled').length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NursePatientArrival;