// src/pages/doctor/Schedule.jsx
import React, { useState, useEffect } from 'react';
import doctorService from '../../services/doctorService';
import medicalService from '../../services/medicalService';
import DiagnosisModal from '../../components/doctor/DiagnosisModal';
import PrescriptionModal from '../../components/doctor/PrescriptionModal';
import VitalSignsModal from '../../components/doctor/VitalSignsModal';

function DoctorSchedule() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    date: ''
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [activeModal, setActiveModal] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [filters]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await doctorService.getAppointments(filters);
      setAppointments(response.appointments || []);
    } catch (error) {
      setError('Failed to fetch appointments');
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      await doctorService.updateAppointmentStatus(appointmentId, status);
      alert('Appointment status updated successfully');
      fetchAppointments();
    } catch (error) {
      alert('Failed to update appointment status');
      console.error('Error updating appointment status:', error);
    }
  };

  const handleReschedule = async (appointmentId, newDate) => {
    try {
      await doctorService.rescheduleAppointment(appointmentId, newDate);
      alert('Appointment rescheduled successfully');
      setActiveModal('');
      fetchAppointments();
    } catch (error) {
      alert('Failed to reschedule appointment');
      console.error('Error rescheduling appointment:', error);
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
        <h1>Appointment Schedule</h1>
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
          <p>You don't have any appointments scheduled.</p>
        </div>
      ) : (
        <div className="appointments-list">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-header">
                <div>
                  <h3>Appointment with {appointment.patient.user.first_name} {appointment.patient.user.last_name}</h3>
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
                {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                  <>
                    <button 
                      onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                      className="btn-success"
                    >
                      Mark Complete
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setActiveModal('reschedule');
                      }}
                      className="btn-secondary"
                    >
                      Reschedule
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                      className="btn-danger"
                    >
                      Cancel
                    </button>
                  </>
                )}
                <button 
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setActiveModal('diagnosis');
                  }}
                  className="btn-primary"
                >
                  Add Diagnosis
                </button>
                <button 
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setActiveModal('prescription');
                  }}
                  className="btn-primary"
                >
                  Add Prescription
                </button>
                <button 
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setActiveModal('vital-signs');
                  }}
                  className="btn-secondary"
                >
                  Record Vitals
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {activeModal === 'reschedule' && selectedAppointment && (
        <RescheduleModal
          appointment={selectedAppointment}
          onReschedule={handleReschedule}
          onClose={() => setActiveModal('')}
        />
      )}

      {/* Diagnosis Modal */}
      {activeModal === 'diagnosis' && selectedAppointment && (
        <DiagnosisModal
          appointment={selectedAppointment}
          onClose={() => setActiveModal('')}
          onSuccess={() => {
            setActiveModal('');
            fetchAppointments();
          }}
        />
      )}

      {/* Prescription Modal */}
      {activeModal === 'prescription' && selectedAppointment && (
        <PrescriptionModal
          appointment={selectedAppointment}
          onClose={() => setActiveModal('')}
          onSuccess={() => {
            setActiveModal('');
            fetchAppointments();
          }}
        />
      )}

      {/* Vital Signs Modal */}
      {activeModal === 'vital-signs' && selectedAppointment && (
        <VitalSignsModal
          appointment={selectedAppointment}
          onClose={() => setActiveModal('')}
          onSuccess={() => {
            setActiveModal('');
            fetchAppointments();
          }}
        />
      )}
    </div>
  );
}

// Reschedule Modal Component
function RescheduleModal({ appointment, onReschedule, onClose }) {
  const [newDate, setNewDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newDate) {
      alert('Please select a new date and time');
      return;
    }

    setLoading(true);
    await onReschedule(appointment.id, newDate);
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Reschedule Appointment</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Appointment Date & Time:</label>
            <input
              type="datetime-local"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Rescheduling...' : 'Reschedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DoctorSchedule;