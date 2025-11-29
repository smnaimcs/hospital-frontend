// src/components/doctor/PrescriptionModal.jsx
import React, { useState } from 'react';
import doctorService from '../../services/doctorService';

function PrescriptionModal({ appointment, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
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
    
    if (!formData.medicine_name || !formData.dosage) {
      alert('Please fill in medicine name and dosage');
      return;
    }

    try {
      setLoading(true);
      const prescriptionData = {
        appointment_id: appointment.id,
        ...formData
      };
      
      await doctorService.addPrescription(prescriptionData);
      alert('Prescription added successfully');
      setFormData({
        medicine_name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      });
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
          <h2>Add Prescription</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>
        
        <div className="patient-info">
          <h4>Patient: {appointment.patient.user.first_name} {appointment.patient.user.last_name}</h4>
        </div>

        <form onSubmit={handleSubmit} className="prescription-form">
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

          <div className="form-row">
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

export default PrescriptionModal;