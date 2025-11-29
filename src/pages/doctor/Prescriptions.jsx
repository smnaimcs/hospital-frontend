// src/pages/doctor/Prescriptions.jsx
import React, { useState, useEffect } from 'react';
import doctorService from '../../services/doctorService';
import medicalService from '../../services/medicalService';

function DoctorPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    patient_id: '',
    status: ''
  });

  useEffect(() => {
    fetchAppointments();
    fetchPrescriptions();
  }, [filters]);

  const fetchAppointments = async () => {
    try {
      const response = await doctorService.getAppointments({ status: 'completed' });
      setAppointments(response.appointments || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      // Since we don't have a direct endpoint for doctor's prescriptions,
      // we'll filter from appointments or create a mock data structure
      const appointmentsResponse = await doctorService.getAppointments();
      const allAppointments = appointmentsResponse.appointments || [];
      
      // Extract prescriptions from appointments (this would ideally come from a dedicated endpoint)
      const allPrescriptions = [];
      allAppointments.forEach(appointment => {
        if (appointment.prescriptions) {
          appointment.prescriptions.forEach(prescription => {
            allPrescriptions.push({
              ...prescription,
              patient_name: `${appointment.patient.user.first_name} ${appointment.patient.user.last_name}`,
              appointment_date: appointment.appointment_date
            });
          });
        }
      });
      
      setPrescriptions(allPrescriptions);
    } catch (error) {
      setError('Failed to fetch prescriptions');
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPrescription = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAddModal(true);
  };

  const handlePrescriptionSuccess = () => {
    setShowAddModal(false);
    setSelectedAppointment(null);
    fetchPrescriptions();
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

  const getDispensedStatus = (isDispensed) => {
    return isDispensed ? 
      <span className="status-badge status-completed">Dispensed</span> :
      <span className="status-badge status-pending">Pending</span>;
  };

  if (loading) {
    return <div className="loading">Loading prescriptions...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Prescriptions Management</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          Add New Prescription
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Recent Appointments for Quick Prescription */}
      <div className="section">
        <h2>Recent Completed Appointments</h2>
        <div className="appointments-grid">
          {appointments.slice(0, 5).map((appointment) => (
            <div key={appointment.id} className="appointment-card compact">
              <div className="appointment-header">
                <h4>{appointment.patient.user.first_name} {appointment.patient.user.last_name}</h4>
                <span className="appointment-date">
                  {formatDate(appointment.appointment_date)}
                </span>
              </div>
              <div className="appointment-details">
                <p><strong>Reason:</strong> {appointment.reason}</p>
                {appointment.symptoms && <p><strong>Symptoms:</strong> {appointment.symptoms}</p>}
              </div>
              <div className="appointment-actions">
                <button 
                  onClick={() => handleAddPrescription(appointment)}
                  className="btn-primary"
                >
                  Add Prescription
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="section">
        <h2>All Prescriptions</h2>
        {prescriptions.length === 0 ? (
          <div className="empty-state">
            <h3>No prescriptions found</h3>
            <p>Prescriptions you create will appear here.</p>
          </div>
        ) : (
          <div className="prescriptions-list">
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="prescription-card">
                <div className="prescription-header">
                  <div>
                    <h3>{prescription.medicine_name}</h3>
                    <p className="patient-name">For: {prescription.patient_name}</p>
                  </div>
                  {getDispensedStatus(prescription.is_dispensed)}
                </div>
                
                <div className="prescription-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <label>Dosage:</label>
                      <span>{prescription.dosage}</span>
                    </div>
                    <div className="detail-item">
                      <label>Frequency:</label>
                      <span>{prescription.frequency}</span>
                    </div>
                  </div>
                  
                  <div className="detail-row">
                    <div className="detail-item">
                      <label>Duration:</label>
                      <span>{prescription.duration}</span>
                    </div>
                    <div className="detail-item">
                      <label>Prescribed:</label>
                      <span>{formatDate(prescription.created_at)}</span>
                    </div>
                  </div>

                  {prescription.instructions && (
                    <div className="detail-item">
                      <label>Instructions:</label>
                      <span>{prescription.instructions}</span>
                    </div>
                  )}

                  {prescription.dispensed_at && (
                    <div className="detail-item">
                      <label>Dispensed:</label>
                      <span>{formatDate(prescription.dispensed_at)}</span>
                    </div>
                  )}
                </div>

                <div className="prescription-actions">
                  {!prescription.is_dispensed && (
                    <button className="btn-success">
                      Mark as Dispensed
                    </button>
                  )}
                  <button className="btn-secondary">
                    Print
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Prescription Modal */}
      {showAddModal && (
        <PrescriptionModal
          appointment={selectedAppointment}
          appointments={appointments}
          onClose={() => {
            setShowAddModal(false);
            setSelectedAppointment(null);
          }}
          onSuccess={handlePrescriptionSuccess}
        />
      )}
    </div>
  );
}

// Enhanced Prescription Modal for standalone use
function PrescriptionModal({ appointment, appointments, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    appointment_id: appointment?.id || '',
    medicine_name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
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
    
    if (!formData.medicine_name || !formData.dosage || !formData.appointment_id) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await doctorService.addPrescription(formData);
      alert('Prescription added successfully');
      onSuccess();
    } catch (error) {
      alert('Failed to add prescription');
      console.error('Error adding prescription:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Add New Prescription</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="prescription-form">
          <div className="form-group">
            <label>Appointment *</label>
            <select
              name="appointment_id"
              value={formData.appointment_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Appointment</option>
              {appointments.map((apt) => (
                <option key={apt.id} value={apt.id}>
                  {apt.patient.user.first_name} {apt.patient.user.last_name} - {new Date(apt.appointment_date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Medicine Name *</label>
            <input
              type="text"
              name="medicine_name"
              value={formData.medicine_name}
              onChange={handleChange}
              placeholder="Enter medicine name..."
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Dosage *</label>
              <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                placeholder="e.g., 10mg"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Frequency</label>
              <input
                type="text"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                placeholder="e.g., Once daily"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 30 days"
            />
          </div>

          <div className="form-group">
            <label>Instructions</label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="Special instructions for the patient..."
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Adding...' : 'Add Prescription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DoctorPrescriptions;