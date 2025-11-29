// src/components/doctor/VitalSignsModal.jsx
import React, { useState } from 'react';
import medicalService from '../../services/medicalService';

function VitalSignsModal({ appointment, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    heart_rate: '',
    respiratory_rate: '',
    temperature: '',
    oxygen_saturation: '',
    weight: '',
    height: '',
    blood_sugar: '',
    notes: ''
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
    
    if (!formData.blood_pressure_systolic || !formData.blood_pressure_diastolic) {
      alert('Please enter blood pressure readings');
      return;
    }

    try {
      setLoading(true);
      const vitalData = {
        patient_id: appointment.patient.id,
        ...formData
      };
      
      await medicalService.recordVitalSigns(vitalData);
      alert('Vital signs recorded successfully');
      onSuccess();
    } catch (error) {
      alert('Failed to record vital signs');
      console.error('Error recording vital signs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal large-modal">
        <div className="modal-header">
          <h2>Record Vital Signs</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>
        
        <div className="patient-info">
          <h4>Patient: {appointment.patient.user.first_name} {appointment.patient.user.last_name}</h4>
        </div>

        <form onSubmit={handleSubmit} className="vital-signs-form">
          <div className="form-row">
            <div className="form-group">
              <label>Blood Pressure (Systolic) *</label>
              <input
                type="number"
                name="blood_pressure_systolic"
                value={formData.blood_pressure_systolic}
                onChange={handleChange}
                placeholder="120"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Blood Pressure (Diastolic) *</label>
              <input
                type="number"
                name="blood_pressure_diastolic"
                value={formData.blood_pressure_diastolic}
                onChange={handleChange}
                placeholder="80"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Heart Rate (bpm)</label>
              <input
                type="number"
                name="heart_rate"
                value={formData.heart_rate}
                onChange={handleChange}
                placeholder="72"
              />
            </div>
            
            <div className="form-group">
              <label>Respiratory Rate</label>
              <input
                type="number"
                name="respiratory_rate"
                value={formData.respiratory_rate}
                onChange={handleChange}
                placeholder="16"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Temperature (°F)</label>
              <input
                type="number"
                step="0.1"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                placeholder="98.6"
              />
            </div>
            
            <div className="form-group">
              <label>Oxygen Saturation (%)</label>
              <input
                type="number"
                step="0.1"
                name="oxygen_saturation"
                value={formData.oxygen_saturation}
                onChange={handleChange}
                placeholder="98"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="70"
              />
            </div>
            
            <div className="form-group">
              <label>Height (cm)</label>
              <input
                type="number"
                step="0.1"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="175"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Blood Sugar (mg/dL)</label>
            <input
              type="number"
              step="0.1"
              name="blood_sugar"
              value={formData.blood_sugar}
              onChange={handleChange}
              placeholder="95"
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

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Recording...' : 'Record Vital Signs'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VitalSignsModal;