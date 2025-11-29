// src/components/doctor/DiagnosisModal.jsx
import React, { useState } from 'react';
import doctorService from '../../services/doctorService';

function DiagnosisModal({ appointment, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    diagnosis: '',
    symptoms: '',
    treatment_plan: '',
    notes: '',
    follow_up_required: false,
    follow_up_date: ''
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
    
    if (!formData.diagnosis) {
      alert('Please enter a diagnosis');
      return;
    }

    try {
      setLoading(true);
      const diagnosisData = {
        appointment_id: appointment.id,
        ...formData
      };
      
      await doctorService.addDiagnosis(diagnosisData);
      alert('Diagnosis added successfully');
      onSuccess();
    } catch (error) {
      alert('Failed to add diagnosis');
      console.error('Error adding diagnosis:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal large-modal">
        <div className="modal-header">
          <h2>Add Diagnosis</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>
        
        <div className="patient-info">
          <h4>Patient: {appointment.patient.user.first_name} {appointment.patient.user.last_name}</h4>
          <p><strong>Appointment Reason:</strong> {appointment.reason}</p>
          {appointment.symptoms && <p><strong>Symptoms:</strong> {appointment.symptoms}</p>}
        </div>

        <form onSubmit={handleSubmit} className="diagnosis-form">
          <div className="form-group">
            <label>Diagnosis *</label>
            <textarea
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              placeholder="Enter the diagnosis..."
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>Symptoms</label>
            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              placeholder="Describe the symptoms observed..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Treatment Plan</label>
            <textarea
              name="treatment_plan"
              value={formData.treatment_plan}
              onChange={handleChange}
              placeholder="Describe the treatment plan..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes..."
              rows="2"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="follow_up_required"
                  checked={formData.follow_up_required}
                  onChange={handleChange}
                />
                Follow-up Required
              </label>
            </div>
            
            {formData.follow_up_required && (
              <div className="form-group">
                <label>Follow-up Date</label>
                <input
                  type="datetime-local"
                  name="follow_up_date"
                  value={formData.follow_up_date}
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Adding...' : 'Add Diagnosis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DiagnosisModal;